package controllers

import (
	"github.com/gin-gonic/gin"
)

type ICustomerController interface {
	Create(ctx *gin.Context)
	Update(ctx *gin.Context)
	Deleted(ctx *gin.Context)
	FindAll(ctx *gin.Context)
	Find(ctx *gin.Context)
	FindById(ctx *gin.Context)
}
