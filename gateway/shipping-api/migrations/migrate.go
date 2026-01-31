package main

import (
	"shipping-api/database"
	"shipping-api/models"
)

// func init() {
// 	misc.LoadEnvVariables()
// 	database.GetConnection()

// }

func main() {
	database.DB.AutoMigrate(&models.User{},
		&models.UserRole{})
}
