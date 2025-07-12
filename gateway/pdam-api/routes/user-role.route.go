package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/controllers"
)

func UserRoleRouter(userRoleController controllers.IUserRoleController, group *gin.RouterGroup) *gin.RouterGroup {
	group.POST("/create", userRoleController.Create)
	group.PUT("/:oid", userRoleController.Update)
	group.GET("/", userRoleController.FindAll)
	group.POST("/q", userRoleController.Find)
	group.GET("/:oid", userRoleController.FindById)
	group.DELETE("/delete/:oid", userRoleController.Deleted)
	return group
}
