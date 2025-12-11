package config

import (
	"context"
	"log"
	"time"

	"os"

	"github.com/Kamva/mgm/v3"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB() {
	// Load .env
	err := godotenv.Load()
	if err != nil {
		log.Println(".env file not found, using system environment")
	}

	mongoURI := os.Getenv("MONGO_URI")
	dbName := os.Getenv("DB_NAME")

	err = mgm.SetDefaultConfig(nil, dbName, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("MongoDB init failed:", err)
	}

	// Ping DB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = mgm.DefaultClient().Ping(ctx, nil)
	if err != nil {
		log.Fatal("MongoDB connection failed:", err)
	}

	log.Println("MongoDB connected")
}
