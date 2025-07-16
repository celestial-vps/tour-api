package database

import (
	"database/sql"
	"os"

	_ "github.com/lib/pq"
)

// func GetConnection() (db *sql.DB) {
// 	dbDriver := os.Getenv("DRIVER")
// 	dbUser := os.Getenv("DBUSER")
// 	dbPass := os.Getenv("DBPASS")
// 	dbName := os.Getenv("DBNAME")
// 	db, err := sql.Open(dbDriver, dbUser+":"+dbPass+"@/"+dbName+"?parseTime=true")
// 	if err != nil {
// 		panic(err.Error())
// 	}
// 	return db
// }

func GetConnection() (db *sql.DB) {
	dbDriver := os.Getenv("DRIVER")
	dbUser := os.Getenv("DBUSER")
	dbPass := os.Getenv("DBPASS")
	dbName := os.Getenv("DBNAME")
	dbHost := os.Getenv("DBHOST")
	dbPort := os.Getenv("DBPORT")

	connStr := "postgres://" + dbUser + ":" + dbPass + "@" + dbHost + ":" + dbPort + "/" + dbName + "?sslmode=disable"

	db, err := sql.Open(dbDriver, connStr)
	if err != nil {
		panic(err.Error())
	}
	return db
}
