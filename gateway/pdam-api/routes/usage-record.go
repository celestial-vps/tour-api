package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/controllers"
	"github.com/pdam-api/go-pdam-api/middleware"
)

func UsageRecordRouter(usageRecordController controllers.IUsageRecordController, group *gin.RouterGroup) *gin.RouterGroup {
	group.POST("/create", middleware.RoleGuard("Admin"), usageRecordController.Create)
	group.PUT("/:oid", middleware.RoleGuard("Admin"), usageRecordController.Update)
	group.GET("/", middleware.RoleGuard("Admin"), usageRecordController.FindAll)
	group.POST("/q", middleware.RoleGuard("Admin"), usageRecordController.Find)
	group.GET("/:oid", middleware.RoleGuard("Admin"), usageRecordController.FindById)
	group.DELETE("/delete/:oid", middleware.RoleGuard("Admin"), usageRecordController.Deleted)
	return group
}
