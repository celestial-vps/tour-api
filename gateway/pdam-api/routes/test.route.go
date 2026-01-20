package routes

import "github.com/gin-gonic/gin"

func TestRouter(group *gin.RouterGroup) {
	group.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "hello world"})
	})
}
