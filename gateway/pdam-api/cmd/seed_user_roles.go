package cmd

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
)

func SeedUserRoles(db *sql.DB) {
	var count int
	err := db.QueryRow(`SELECT COUNT(*) FROM user_roles WHERE role_name = 'Admin'`).Scan(&count)
	if err != nil {
		log.Fatal("Gagal cek user_roles:", err)
	}

	if count > 0 {
		fmt.Println("ℹ️  Seeder user_roles dilewati (sudah ada data).")
		return
	}

	id := uuid.New()
	adminID := uuid.New() // Ganti dengan ID admin jika sudah ada user
	now := time.Now()

	_, err = db.Exec(`
		INSERT INTO user_roles (
			oid, role_name, target_type, is_administrative,
			read_state, write_state, create_state, delete_state, navigate_state,
			created_by, created_at, last_modified_by
		) VALUES (
			$1, $2, $3, $4,
			$5, $6, $7, $8, $9,
			$10, $11, $12
		)
	`, id, "Admin", "system", true,
		true, true, true, true, true,
		adminID, now, adminID)

	if err != nil {
		log.Fatal("Gagal insert user_roles:", err)
	}

	fmt.Println("✅ user_roles seeded.")
}
