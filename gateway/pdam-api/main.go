package main

import (
	"os"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/controllers"
	"github.com/pdam-api/go-pdam-api/database"
	"github.com/pdam-api/go-pdam-api/misc"
	"github.com/pdam-api/go-pdam-api/repositories"
	"github.com/pdam-api/go-pdam-api/routes"
	"github.com/pdam-api/go-pdam-api/services"
	swaggerFiles "github.com/swaggo/files"     // swagger embed files
	ginSwagger "github.com/swaggo/gin-swagger" // gin-swagger middleware
	"github.com/swaggo/swag/example/override/docs"
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
	validate := validator.New()

	userRepository := repositories.NewUserRepository()
	userService := services.NewUserService(userRepository, DB, validate)
	userController := controllers.NewUserController(userService)
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

	router := gin.Default()
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

		userRole := v1.Group("/user-role")
		routes.UserRoleRouter(userRoleController, userRole)

		imageFile := v1.Group("/image-file")
		routes.ImageFileRouter(imageFileController, imageFile)
	}

	v2 := router.Group(docs.SwaggerInfo.BasePath)
	{
		auth := v2.Group("/auth")
		routes.AuthRouter(authController, auth)
	}
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	errPort := router.Run(":3000")

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
