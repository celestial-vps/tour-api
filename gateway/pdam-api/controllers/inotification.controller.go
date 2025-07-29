package controllers

import (
	"github.com/gin-gonic/gin"
)

type INotificationController interface {
	SendAllNotification(ctx *gin.Context)
	SingleNotification(ctx *gin.Context)
}
