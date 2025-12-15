package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/kamva/mgm/v3"
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
	_, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// err = mgm.Conn().Ping(ctx, nil)

	_, client, _, err := mgm.DefaultConfigs()
	if err != nil {
		log.Fatal("MongoDB connection failed:", err)
	}
	client.Database("another_db")
	log.Println("MongoDB connected")
}
