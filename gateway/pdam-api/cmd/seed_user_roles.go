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
		log.Fatal("❌ Gagal cek user_roles:", err)
	}

	if count > 0 {
		fmt.Println("ℹ️  Seeder user_roles dilewati (sudah ada data).")
		return
	}

	now := time.Now()
	adminID := uuid.New() // Ubah ini jika kamu punya user admin spesifik

	roles := []struct {
		RoleName   string
		TargetType string
		IsAdmin    bool
		Read       bool
		Write      bool
		Create     bool
		Delete     bool
		Navigate   bool
	}{
		{"Admin", "system", true, true, true, true, true, true},
		{"Editor", "system", false, true, true, true, false, true},
		{"Viewer", "system", false, true, false, false, false, true},
		{"Contributor", "system", false, true, true, true, false, true},
		{"Guest", "system", false, true, false, false, false, false},
	}

	tx, err := db.Begin()
	if err != nil {
		log.Fatal("❌ Gagal mulai transaksi:", err)
	}

	stmt, err := tx.Prepare(`
		INSERT INTO user_roles (
			oid, role_name, target_type, is_administrative,
			read_state, write_state, create_state, delete_state, navigate_state,
			created_by, created_at, last_modified_by
		) VALUES (
			$1, $2, $3, $4,
			$5, $6, $7, $8, $9,
			$10, $11, $12
		)
	`)
	if err != nil {
		log.Fatal("❌ Gagal persiapkan statement:", err)
	}
	defer stmt.Close()

	for _, role := range roles {
		_, err := stmt.Exec(
			uuid.New(), role.RoleName, role.TargetType, role.IsAdmin,
			role.Read, role.Write, role.Create, role.Delete, role.Navigate,
			adminID, now, adminID,
		)
		if err != nil {
			tx.Rollback()
			log.Fatalf("❌ Gagal insert role '%s': %v", role.RoleName, err)
		}
	}

	if err := tx.Commit(); err != nil {
		log.Fatal("❌ Gagal commit transaksi:", err)
	}

	fmt.Println("✅ user_roles seeded dengan 5 data.")
}
