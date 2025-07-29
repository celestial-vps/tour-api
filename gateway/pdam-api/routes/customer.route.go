package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/controllers"
	"github.com/pdam-api/go-pdam-api/middleware"
)

func CustomerRouter(customerController controllers.ICustomerController, group *gin.RouterGroup) *gin.RouterGroup {
	// r.GET("/admin",  func(c *gin.Context) {
	//     c.JSON(http.StatusOK, gin.H{"message": "Welcome Admin"})
	// })

	group.POST("/create", middleware.RoleGuard("Admin"), customerController.Create)
	group.PUT("/:oid", middleware.RoleGuard("Admin"), customerController.Update)
	group.GET("/", middleware.RoleGuard("Admin"), customerController.FindAll)
	group.POST("/q", middleware.RoleGuard("Admin"), customerController.Find)
	group.POST("/q/advance-filter", middleware.RoleGuard("Admin"), customerController.FindAdvance)
	group.GET("/:oid", middleware.RoleGuard("Admin"), customerController.FindById)
	group.DELETE("/delete/:oid", middleware.RoleGuard("Admin"), customerController.Deleted)
	return group
}
