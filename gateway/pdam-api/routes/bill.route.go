package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/controllers"
	"github.com/pdam-api/go-pdam-api/middleware"
)

func BillRouter(billController controllers.IBillController, group *gin.RouterGroup) *gin.RouterGroup {
	group.POST("/create", middleware.RoleGuard("Admin"), billController.Create)
	group.PUT("/:oid", middleware.RoleGuard("Admin"), billController.Update)
	group.GET("/", middleware.RoleGuard("Admin"), billController.FindAll)
	group.POST("/q", middleware.RoleGuard("Admin"), billController.Find)
	group.GET("/:oid", middleware.RoleGuard("Admin"), billController.FindById)
	group.DELETE("/delete/:oid", middleware.RoleGuard("Admin"), billController.Deleted)
	return group
}
