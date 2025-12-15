package routes

import (
	"shipping-api/controllers"

	"github.com/gin-gonic/gin"
)

func AuthRouter(authController controllers.IAuthController, group *gin.RouterGroup) *gin.RouterGroup {
	group.POST("/login", authController.Login)
	group.POST("/register", authController.Register)
	// group.POST("/refresh-token", middleware.Guard(), authController.RefreshToken)
	// group.POST("/register", middleware.Guard(), authController.RefreshToken)

	return group
}
