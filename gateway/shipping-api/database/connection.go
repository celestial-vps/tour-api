package database

import (
	"log"
	"os"

	"shipping-api/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConfigureConnectionPool(DB *gorm.DB) {
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("Error retrieving sql.DB from GORM: %v", err)
	}

	// Configure connection pooling
	sqlDB.SetMaxOpenConns(100)  // Adjust based on your needs
	sqlDB.SetMaxIdleConns(10)   // Adjust based on your needs
	sqlDB.SetConnMaxLifetime(0) // 0 means no limit; set a non-zero value if needed
}

// DENGAN LOG
// func GetConnection() {
// 	dsn := os.Getenv("DB_URL")
// 	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
// 		Logger: logger.New(
// 			log.New(os.Stdout, "\r\n", log.LstdFlags), // log ke console
// 			logger.Config{
// 				SlowThreshold:             time.Second,   // log query lebih dari 1 detik
// 				LogLevel:                  logger.Info,   // tampilkan semua query
// 				IgnoreRecordNotFoundError: true,
// 				Colorful:                  true,
// 			},
// 		),
// 	})
// 	if err != nil {
// 		log.Fatalf("failed to connect database: %v", err)
// 	}
// 	DB = db
// }

func GetConnection() {
	dsn := os.Getenv("DB_URL")
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger:                 logger.Default.LogMode(logger.Info),
		SkipDefaultTransaction: true,
		PrepareStmt:            true,
	})

	if err != nil {
		panic(err)
	}

	// Assign the initialized DB to the global variable
	DB = database

	// Configure global connection pool settings
	ConfigureConnectionPool(DB)

	database.AutoMigrate(
		&models.User{},
		&models.UserRole{},
		&models.Bank{},
	)
}
