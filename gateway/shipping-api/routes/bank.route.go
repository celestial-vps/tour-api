package routes

import (
	"shipping-api/controllers"
	"shipping-api/middleware"

	"github.com/gin-gonic/gin"
)

func BankRouter(bankController controllers.IBankController, group *gin.RouterGroup) *gin.RouterGroup {
	group.POST("/create", middleware.RoleGuard("Admin"), bankController.Create)
	group.PUT("/:oid", middleware.RoleGuard("Admin"), bankController.Update)
	group.GET("/", middleware.RoleGuard("Admin"), bankController.FindAll)
	group.GET("/bank-redis", middleware.RoleGuard("Admin"), bankController.FindRedis)
	group.POST("/q", middleware.RoleGuard("Admin"), bankController.Find)
	group.GET("/:oid", middleware.RoleGuard("Admin"), bankController.FindById)
	group.DELETE("/delete/:oid", middleware.RoleGuard("Admin"), bankController.Deleted)
	return group
}
