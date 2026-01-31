package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/controllers"
	"github.com/pdam-api/go-pdam-api/middleware"
)

func NotificationRouter(tarifController controllers.INotificationController, group *gin.RouterGroup) *gin.RouterGroup {
	group.POST("/send-notification", middleware.RoleGuard("Admin"), tarifController.SendAllNotification)
	group.POST("/send-notification/:oid", middleware.RoleGuard("Admin"), tarifController.SingleNotification)
	return group
}
