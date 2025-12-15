package misc

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnvVariables() {
	env := os.Getenv("GO_ENV")
	if env == "" {
		env = "dev" // default
	}

	envFile := fmt.Sprintf(".env.%s", env)

	err := godotenv.Load(envFile)
	if err != nil {
		log.Fatalf("Error loading %s file", envFile)
	}
	fmt.Printf("Loaded environment: %s\n", env)
}
