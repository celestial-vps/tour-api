package main

// import (
// 	"database/sql"
// 	"log"

// 	_ "github.com/lib/pq"

// )

// func main() {
// 	db, err := sql.Open("postgres", "postgres://postgres:telogic@localhost:5432/pdamdb?sslmode=disable")
// 	if err != nil {
// 		log.Fatal("DB connection failed:", err)
// 	}
// 	defer db.Close()

// 	// Jalankan semua seeder
// 	seeders.SeedUserRoles(db)
// 	// seeders.SeedUsers(db) // kalau ada
// }
