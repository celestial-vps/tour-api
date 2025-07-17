package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/controllers"
	"github.com/pdam-api/go-pdam-api/middleware"
)

func TarifRouter(tarifController controllers.ITarifController, group *gin.RouterGroup) *gin.RouterGroup {
	group.POST("/create", middleware.RoleGuard("Admin"), tarifController.Create)
	group.PUT("/:oid", middleware.RoleGuard("Admin"), tarifController.Update)
	group.GET("/", middleware.RoleGuard("Admin"), tarifController.FindAll)
	group.POST("/q", middleware.RoleGuard("Admin"), tarifController.Find)
	group.GET("/:oid", middleware.RoleGuard("Admin"), tarifController.FindById)
	group.DELETE("/delete/:oid", middleware.RoleGuard("Admin"), tarifController.Deleted)
	return group
}
