package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/controllers"
	"github.com/pdam-api/go-pdam-api/middleware"
)

func WaterMeterRouter(waterMeterController controllers.IWaterMeterController, group *gin.RouterGroup) *gin.RouterGroup {
	group.POST("/create", middleware.RoleGuard("Admin"), waterMeterController.Create)
	group.PUT("/:oid", middleware.RoleGuard("Admin"), waterMeterController.Update)
	group.GET("/", middleware.RoleGuard("Admin"), waterMeterController.FindAll)
	group.POST("/q", middleware.RoleGuard("Admin"), waterMeterController.Find)
	group.GET("/:oid", middleware.RoleGuard("Admin"), waterMeterController.FindById)
	group.DELETE("/delete/:oid", middleware.RoleGuard("Admin"), waterMeterController.Deleted)
	return group
}
