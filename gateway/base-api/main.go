package main

import (
	"base-api/config"
	"base-api/routes"
)

func main() {
	config.ConnectDB()
	r := routes.SetupRouter()
	r.Run(":8080") // listen on port 8080
}
