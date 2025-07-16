package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/controllers"
)

func AuthRouter(authController controllers.IAuthController, group *gin.RouterGroup) *gin.RouterGroup {
	group.POST("/login", authController.Login)
	group.POST("/register", authController.Register)
	return group
}
