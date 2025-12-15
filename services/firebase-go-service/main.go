package main

import (
	"firebase-go-service/config"
	"firebase-go-service/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDB()
	r := gin.Default()

	routes.AuthRoutes(r)

	r.Run(":8080") // http://localhost:8080
}
