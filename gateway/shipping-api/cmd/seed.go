package main

import (
	"log"

	"shipping-api/database"
	"shipping-api/misc"
	"shipping-api/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Seed function to populate the database with initial data
func Seed(db *gorm.DB) {
	// Define some sample user roles
	roles := []models.UserRole{
		{
			Oid:              uuid.New(),
			RoleName:         "Admin",
			TargetType:       "System",
			IsAdministrative: true,
			ReadState:        true,
			WriteState:       true,
			CreateState:      true,
			DeleteState:      true,
			NavigateState:    true,
			// CreatedAt:        time.Now(),
			// UpdatedAt:        nil,
		},
		{
			Oid:              uuid.New(),
			RoleName:         "Editor",
			TargetType:       "System",
			IsAdministrative: false,
			ReadState:        true,
			WriteState:       true,
			CreateState:      true,
			DeleteState:      false,
			NavigateState:    true,
			// CreatedAt:        time.Now(),
			// UpdatedAt:        nil,
		},
		{
			Oid:              uuid.New(),
			RoleName:         "Viewer",
			TargetType:       "System",
			IsAdministrative: false,
			ReadState:        true,
			WriteState:       false,
			CreateState:      false,
			DeleteState:      false,
			NavigateState:    true,
			// CreatedAt:        time.Now(),
			// UpdatedAt:        nil,
		},
	}

	// Insert the roles into the database
	for _, role := range roles {
		result := db.Create(&role)
		if result.Error != nil {
			log.Fatalf("Error seeding user role data: %v", result.Error)
		}
	}

	log.Println("Seed data for UserRole inserted successfully")
}

func init() {
	misc.LoadEnvVariables()
	database.GetConnection()

}

func main() {
	db := database.DB
	Seed(db)
}
