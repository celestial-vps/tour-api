package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/controllers"
	"github.com/pdam-api/go-pdam-api/middleware"
)

func PaymentRouter(paymentController controllers.IPaymentController, group *gin.RouterGroup) *gin.RouterGroup {
	group.POST("/create", middleware.RoleGuard("Admin"), paymentController.Create)
	group.PUT("/:oid", middleware.RoleGuard("Admin"), paymentController.Update)
	group.GET("/", middleware.RoleGuard("Admin"), paymentController.FindAll)
	group.POST("/q", middleware.RoleGuard("Admin"), paymentController.Find)
	group.GET("/:oid", middleware.RoleGuard("Admin"), paymentController.FindById)
	group.DELETE("/delete/:oid", middleware.RoleGuard("Admin"), paymentController.Deleted)
	return group
}
