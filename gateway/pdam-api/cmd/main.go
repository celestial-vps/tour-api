package cmd

// import (
// 	"database/sql"
// 	"log"

// 	_ "github.com/lib/pq"
// )

// func main() {
// 	connStr := "postgres://postgres:telogic@localhost:5432/pdamdb?sslmode=disable"

// 	db, err := sql.Open("postgres", connStr)
// 	if err != nil {
// 		log.Fatal("Gagal connect ke DB:", err)
// 	}
// 	defer db.Close()

// 	SeedUserRoles(db)
// }
