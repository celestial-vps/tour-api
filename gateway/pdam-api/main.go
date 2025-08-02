package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/pdam-api/go-pdam-api/cmd"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/controllers"
	"github.com/pdam-api/go-pdam-api/database"
	"github.com/pdam-api/go-pdam-api/docs" // ✅ BENAR — sesuai dengan module kamu
	"github.com/pdam-api/go-pdam-api/middleware"
	"github.com/pdam-api/go-pdam-api/misc"
	"github.com/pdam-api/go-pdam-api/repositories"
	"github.com/pdam-api/go-pdam-api/routes"
	"github.com/pdam-api/go-pdam-api/services"
	swaggerFiles "github.com/swaggo/files"     // swagger embed files
	ginSwagger "github.com/swaggo/gin-swagger" // gin-swagger middleware
)

// func init() {
// 	misc.LoadEnvVariables()
// 	database.ConnectDatabase()

// }

func main() {
	misc.LoadEnvVariables()
	// database.InitRedis()
	// redisClient := database.GetRedisClient() // Fetch the Redis client

	docs.SwaggerInfo.Title = os.Getenv("Title")
	docs.SwaggerInfo.Description = os.Getenv("Description")
	docs.SwaggerInfo.Version = os.Getenv("DB_URL")
	docs.SwaggerInfo.Host = os.Getenv("Host")
	docs.SwaggerInfo.BasePath = os.Getenv("BasePath")
	docs.SwaggerInfo.Schemes = []string{"http"}

	DB := database.GetConnection()
	cmd.SeedUserRoles(DB)

	validate := validator.New()

	fcmClient, err := misc.InitFirebaseMessagingClient()
	if err != nil {
		log.Fatalf("Failed to initialize Firebase Messaging client: %v", err)
	}
	// tokens := []string{"fiq_tLk5aYe7yPjdk-tUCR:APA91bGg5I6jDiRXxP7oNAA-vOOHbcjKxXmz2NNXo6kvAa5b1WG8fcQe8LRedOKU6SvvtGEYKu0kj3zI5aog3K8qn1XaRAcvhgqMwP7Q8dt5Gy6YfbEmY8Q"}
	// err = misc.SendFCMToDevices(context.Background(), fcmClient, tokens, "Test Title", "Test Body")
	// if err != nil {
	// 	log.Fatalf("Failed to send test notification: %v", err)
	// }

	userRepository := repositories.NewUserRepository()
	userService := services.NewUserService(userRepository, DB, validate)
	userController := controllers.NewUserController(userService)

	notificationService := services.NewNotificationService(userRepository, DB, validate, fcmClient)
	notificationController := controllers.NewNotificationController(notificationService)

	authController := controllers.NewAuthController(userService)

	userRoleRepository := repositories.NewUserRoleRepository()
	userRoleService := services.NewUserRoleService(userRoleRepository, DB, validate)
	userRoleController := controllers.NewUserRoleController(userRoleService)

	imageFileRepository := repositories.NewImageFileRepository()
	imageFileService := services.NewImageFileService(imageFileRepository, DB, validate)
	imageFileController := controllers.NewImageFileController(imageFileService)

	customerRepository := repositories.NewCustomerRepository()
	customerService := services.NewCustomerService(customerRepository, imageFileRepository, DB, validate)
	customerController := controllers.NewCustomerController(customerService)

	waterMeterRepository := repositories.NewWaterMeterRepository()
	waterMeterService := services.NewWaterMeterService(waterMeterRepository, imageFileRepository, DB, validate)
	waterMeterController := controllers.NewWaterMeterController(waterMeterService)

	tarifRepository := repositories.NewTarifRepository()
	tarifService := services.NewTarifService(tarifRepository, imageFileRepository, DB, validate)
	tarifController := controllers.NewTarifController(tarifService)

	usageRecordRepository := repositories.NewUsageRecordRepository()
	usageRecordService := services.NewUsageRecordService(usageRecordRepository, imageFileRepository, DB, validate)
	usageRecordController := controllers.NewUsageRecordController(usageRecordService)

	router := gin.Default()
	router.Use(middleware.InjectAuditContext())
	router.MaxMultipartMemory = 8 << 20 // maximum file 8 MiB
	router.Static("/public", "./public")
	makeRoutes(router)
	router.Use(gin.Logger())

	router.Use(gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {

		if common.NotFoundErrors(c, recovered) {
			return
		}

		if common.ValidationErrors(c, recovered) {
			return
		}

		common.InternalServerError(c, recovered)

	}))

	// router.SetTrustedProxies([]string{"192.168.0.200"})
	router.SetTrustedProxies([]string{"127.0.0.1", "192.168.0.200"}) // Replace with your proxy's IP address
	// userServiceRole := services.NewUserService(userRepository, DB, validate)
	v1 := router.Group("/api/v1")
	{
		// v1.Use(middleware.JWT())
		user := v1.Group("/user")
		routes.UserRouter(userController, user)

		customer := v1.Group("/customer")
		routes.CustomerRouter(customerController, customer)

		tarif := v1.Group("/tarif")
		routes.TarifRouter(tarifController, tarif)

		waterMeter := v1.Group("/water-meter")
		routes.WaterMeterRouter(waterMeterController, waterMeter)

		usageRecord := v1.Group("/usagee-record")
		routes.UsageRecordRouter(usageRecordController, usageRecord)

		userRole := v1.Group("/user-role")
		routes.UserRoleRouter(userRoleController, userRole)

		imageFile := v1.Group("/image-file")
		routes.ImageFileRouter(imageFileController, imageFile)

		notification := v1.Group("/notification")
		routes.NotificationRouter(notificationController, notification)
	}

	v2 := router.Group(docs.SwaggerInfo.BasePath)
	{
		auth := v2.Group("/auth")
		routes.AuthRouter(authController, auth)
	}
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3102" // default port
	}

	errPort := router.Run(":" + port)
	if errPort != nil {
		log.Fatalf("Failed to run server: %v", errPort)
	}

	// errPort := router.Run(":3102")

	common.PanicIfError(errPort)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func makeRoutes(r *gin.Engine) {
	cors := func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "*")
		c.Writer.Header().Set("Content-Type", "application/json")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
		}
		c.Next()
	}
	r.Use(cors)

}
