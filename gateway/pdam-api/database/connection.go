package database

import (
	"database/sql"
	"os"

	_ "github.com/lib/pq"
)

func GetConnection() (db *sql.DB) {
	dbDriver := os.Getenv("DRIVER")
	dbUser := os.Getenv("DBUSER")
	dbPass := os.Getenv("DBPASS")
	dbName := os.Getenv("DBNAME")
	db, err := sql.Open(dbDriver, dbUser+":"+dbPass+"@/"+dbName+"?parseTime=true")
	if err != nil {
		panic(err.Error())
	}
	return db
}
