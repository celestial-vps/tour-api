package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/controllers"
)

func UserRouter(userController controllers.IUserController, group *gin.RouterGroup) *gin.RouterGroup {
	group.POST("/create", userController.Create)
	group.PUT("/:oid", userController.Update)
	group.GET("/", userController.FindAll)
	group.POST("/q", userController.Find)
	group.GET("/:oid", userController.FindById)
	group.DELETE("/delete/:oid", userController.Deleted)
	return group
}
