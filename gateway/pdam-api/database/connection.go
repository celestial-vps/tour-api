package database

import (
	"database/sql"
	"fmt"
	"net/url"
	"os"

	_ "github.com/lib/pq"
)

func GetConnection() *sql.DB {
	dbUser := os.Getenv("DBUSER")
	dbPass := os.Getenv("DBPASS")
	dbHost := os.Getenv("DBHOST")
	dbPort := os.Getenv("DBPORT")
	dbName := os.Getenv("DBNAME")
	dbDriver := os.Getenv("DRIVER")

	passwordEscaped := url.QueryEscape(dbPass)

	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		dbUser,
		passwordEscaped,
		dbHost,
		dbPort,
		dbName,
	)

	db, err := sql.Open(dbDriver, connStr)
	if err != nil {
		panic(err)
	}
	return db
}
