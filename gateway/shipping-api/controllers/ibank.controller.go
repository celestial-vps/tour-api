package controllers

import (
	"github.com/gin-gonic/gin"
)

type IBankController interface {
	Create(ctx *gin.Context)
	Update(ctx *gin.Context)
	Deleted(ctx *gin.Context)
	FindAll(ctx *gin.Context)
	FindRedis(ctx *gin.Context)
	Find(ctx *gin.Context)
	FindById(ctx *gin.Context)
}
