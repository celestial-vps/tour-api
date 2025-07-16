package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/controllers"
)

func ImageFileRouter(imageFileController controllers.IImageFileController, group *gin.RouterGroup) *gin.RouterGroup {

	// group.GET("/", imageFileController.Find)
	group.POST("/q", imageFileController.Find)
	group.GET("/:oid", imageFileController.FindById)
	group.POST("/upload", imageFileController.Create)
	group.PUT("/:oid", imageFileController.Update)
	group.DELETE("/delete/:oid", imageFileController.Deleted)

	return group
}
