package controllers

import (
	"github.com/gin-gonic/gin"
)

type IImageFileController interface {
	Create(ctx *gin.Context)
	Update(ctx *gin.Context)
	Deleted(ctx *gin.Context)
	FindById(ctx *gin.Context)
	Find(ctx *gin.Context)
}
