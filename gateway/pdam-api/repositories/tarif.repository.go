package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/models"
)

type TarifRepository struct {
}

func (c *TarifRepository) Save(ctx context.Context, tx *sql.Tx, tarif models.Tarif) (models.Tarif, error) {
	SQL := `
		INSERT INTO tarifs (
			created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at,
			oid, customer_type, min_volume, max_volume, price_per_m3, effective_rom, effective_to
		) VALUES (
			$1, $2, $3, $4, $5, $6,
			$7, $8, $9, $10, $11, $12, $13
		)
	`

	_, err := tx.ExecContext(ctx, SQL,
		tarif.TransactionRecord.CreatedBy,
		tarif.TransactionRecord.CreatedAt,
		tarif.TransactionRecord.LastModifiedBy,
		tarif.TransactionRecord.UpdatedAt,
		tarif.TransactionRecord.DeletedBy,
		tarif.TransactionRecord.DeletedAt,
		tarif.Oid,
		tarif.CustomerType,
		tarif.MinVolume,
		tarif.MaxVolume,
		tarif.PricePerM3,
		tarif.EffectiveFrom,
		tarif.EffectiveTo,
	)

	if err != nil {
		return tarif, err
	}
	return tarif, nil
}

// Update implements ITarifRepository.
func (c *TarifRepository) Update(ctx context.Context, tx *sql.Tx, tarif models.Tarif) models.Tarif {
	SQL := `
		UPDATE tarifs SET  
			last_modified_by = $1, 
			updated_at = $2,
			customer_type = $3,
			min_volume = $4,
			max_volume = $5,
			price_per_m3 = $6,
			effective_rom = $7,
			effective_to = $8
		WHERE oid = $10
	`

	_, err := tx.ExecContext(ctx, SQL,
		tarif.TransactionRecord.LastModifiedBy,
		tarif.TransactionRecord.UpdatedAt,
		tarif.CustomerType,
		tarif.MinVolume,
		tarif.MaxVolume,
		tarif.PricePerM3,
		tarif.EffectiveFrom,
		tarif.EffectiveTo,
		tarif.Oid,
	)

	common.PanicIfError(err)
	return tarif
}

func (c *TarifRepository) Deleted(ctx context.Context, tx *sql.Tx, oid string) error {
	SQL := `DELETE FROM tarifs WHERE oid = $1`
	_, err := tx.ExecContext(ctx, SQL, oid)
	return err
}

func (c *TarifRepository) FindAll(ctx context.Context, tx *sql.Tx) ([]models.TarifDomain, error) {
	SQL := `SELECT oid, customer_type, min_volume, max_volume, price_per_m3, effective_rom, effective_to, 
                   image_oid, created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at 
            FROM tarifs`

	rows, err := tx.QueryContext(ctx, SQL)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tarifs []models.TarifDomain

	for rows.Next() {
		var tarif models.TarifDomain
		var imageOidStr *string
		var createdByStr, lastModifiedByStr string
		var deletedByStr *string
		var createdAt time.Time
		var updatedAt, deletedAt *time.Time

		err := rows.Scan(
			&tarif.Oid,
			&tarif.CustomerType,
			&tarif.MinVolume,
			&tarif.MaxVolume,
			&tarif.PricePerM3,
			&tarif.EffectiveFrom,
			&tarif.EffectiveTo,
			&imageOidStr,
			&createdByStr,
			&createdAt,
			&lastModifiedByStr,
			&updatedAt,
			&deletedByStr,
			&deletedAt,
		)
		if err != nil {
			return nil, err
		}

		createdBy, err := uuid.Parse(createdByStr)
		if err != nil {
			return nil, err
		}
		tarif.CreatedBy = createdBy
		tarif.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, err
		}
		tarif.LastModifiedBy = lastModifiedBy
		tarif.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, err
			}
			tarif.DeletedBy = &deletedBy
		} else {
			tarif.DeletedBy = nil
		}

		tarif.DeletedAt = deletedAt

		tarifs = append(tarifs, tarif)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tarifs, nil
}

func (c *TarifRepository) FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterTarifDto) ([]models.TarifDomain, error) {
	baseSQL := `
		SELECT oid, customer_type, min_volume, max_volume, price_per_m3, effective_rom, effective_to, image_oid, 
		       created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM tarifs
	`

	var queryParams []interface{}
	var whereConditions []string

	// Build WHERE clause dynamically
	if condition.CustomerType != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("customer_type ILIKE $%d", len(queryParams)+1))
		queryParams = append(queryParams, "%"+condition.CustomerType+"%")
	}

	if len(whereConditions) > 0 {
		baseSQL += " WHERE " + strings.Join(whereConditions, " AND ")
	}

	// Pagination: OFFSET and LIMIT
	offset := (page - 1) * pageSize
	baseSQL += fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d OFFSET $%d", len(queryParams)+1, len(queryParams)+2)
	queryParams = append(queryParams, pageSize, offset)

	rows, err := tx.QueryContext(ctx, baseSQL, queryParams...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tarifs []models.TarifDomain

	for rows.Next() {
		var tarif models.TarifDomain

		// Temp vars for nullable strings and UUIDs from DB
		var createdByStr, lastModifiedByStr string
		var deletedByStr *string
		var createdAt time.Time
		var updatedAt, deletedAt *time.Time

		err := rows.Scan(
			&tarif.Oid,
			&tarif.CustomerType,
			&tarif.MinVolume,
			&tarif.MaxVolume,
			&tarif.PricePerM3,
			&tarif.EffectiveFrom,
			&tarif.EffectiveTo,
			&createdByStr,
			&createdAt,
			&lastModifiedByStr,
			&updatedAt,
			&deletedByStr,
			&deletedAt,
		)
		if err != nil {
			return nil, err
		}

		createdBy, err := uuid.Parse(createdByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for CreatedBy: %w", err)
		}
		tarif.CreatedBy = createdBy
		tarif.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		tarif.LastModifiedBy = lastModifiedBy
		tarif.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
			}
			tarif.DeletedBy = &deletedBy
		} else {
			tarif.DeletedBy = nil
		}
		tarif.DeletedAt = deletedAt

		tarifs = append(tarifs, tarif)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tarifs, nil
}

func (c *TarifRepository) FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterTarifDto) (int64, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`SELECT count(oid) FROM tarifs`)

	var whereClauses []string

	if condition.CustomerType != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("customer_type ILIKE $%d", len(args)+1))
		args = append(args, "%"+condition.CustomerType+"%")
	}

	if len(whereClauses) > 0 {
		queryBuilder.WriteString(" WHERE ")
		queryBuilder.WriteString(strings.Join(whereClauses, " AND "))
	}

	SQL := queryBuilder.String()

	var count int64
	err := tx.QueryRowContext(ctx, SQL, args...).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("error executing query: %w", err)
	}

	return count, nil
}

func (c *TarifRepository) AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterTarifDto) ([]models.TarifDomain, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`
		SELECT oid, customer_type, min_volume, max_volume, price_per_m3, effective_rom, effective_to, 
		       image_oid, created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM tarifs
	`)

	var whereClauses []string

	if condition.CustomerType != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("customer_type ILIKE $%d", len(args)+1))
		args = append(args, "%"+condition.CustomerType+"%")
	}

	if len(whereClauses) > 0 {
		queryBuilder.WriteString(" WHERE ")
		queryBuilder.WriteString(strings.Join(whereClauses, " AND "))
	}

	SQL := queryBuilder.String()

	rows, err := tx.QueryContext(ctx, SQL, args...)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %w", err)
	}
	defer rows.Close()

	var tarifs []models.TarifDomain
	for rows.Next() {
		var (
			tarif             models.TarifDomain
			createdByStr      string
			createdAt         time.Time
			lastModifiedByStr string
			updatedAt         *time.Time
			deletedByStr      *string
			deletedAt         *time.Time
		)

		err := rows.Scan(
			&tarif.Oid,
			&tarif.CustomerType,
			&tarif.MinVolume,
			&tarif.MaxVolume,
			&tarif.PricePerM3,
			&tarif.EffectiveFrom,
			&tarif.EffectiveTo,
			&createdByStr,
			&createdAt,
			&lastModifiedByStr,
			&updatedAt,
			&deletedByStr,
			&deletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}

		createdBy, err := uuid.Parse(createdByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for CreatedBy: %w", err)
		}
		tarif.CreatedBy = createdBy
		tarif.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		tarif.LastModifiedBy = lastModifiedBy
		tarif.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
			}
			tarif.DeletedBy = &deletedBy
		} else {
			tarif.DeletedBy = nil
		}

		tarif.DeletedAt = deletedAt

		tarifs = append(tarifs, tarif)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return tarifs, nil
}

func (c *TarifRepository) FindById(ctx context.Context, tx *sql.Tx, oid string) (models.Tarif, error) {
	SQL := `SELECT oid, customer_type, min_volume, max_volume, price_per_m3, effective_rom, effective_to, image_oid,
			created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
			FROM tarifs WHERE oid = $1`

	row := tx.QueryRowContext(ctx, SQL, oid)

	tarif := models.Tarif{}

	// Scan ke variabel pointer dulu (nullable)
	var createdByStr, lastModifiedByStr *string
	var deletedByStr *string
	var createdAt time.Time
	var updatedAt *time.Time
	var deletedAt *time.Time

	err := row.Scan(
		&tarif.Oid,
		&tarif.CustomerType,
		&tarif.MinVolume,
		&tarif.MaxVolume,
		&tarif.PricePerM3,
		&tarif.EffectiveFrom,
		&tarif.EffectiveTo,
		&createdByStr,
		&createdAt,
		&lastModifiedByStr,
		&updatedAt,
		&deletedByStr,
		&deletedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return tarif, errors.New("tarif is not found")
		}
		return tarif, fmt.Errorf("error scanning tarif: %w", err)
	}

	// Convert string UUID ke uuid.UUID
	createdBy, err := uuid.Parse(*createdByStr)
	if err != nil {
		return tarif, fmt.Errorf("invalid UUID for CreatedBy: %w", err)
	}
	tarif.TransactionRecord.CreatedBy = createdBy
	tarif.TransactionRecord.CreatedAt = createdAt

	if lastModifiedByStr != nil {
		lastModifiedBy, err := uuid.Parse(*lastModifiedByStr)
		if err != nil {
			return tarif, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		tarif.TransactionRecord.LastModifiedBy = lastModifiedBy
	}

	tarif.TransactionRecord.UpdatedAt = updatedAt

	if deletedByStr != nil {
		deletedBy, err := uuid.Parse(*deletedByStr)
		if err != nil {
			return tarif, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
		}
		tarif.TransactionRecord.DeletedBy = &deletedBy
	}

	tarif.TransactionRecord.DeletedAt = deletedAt

	return tarif, nil
}

func NewTarifRepository() ITarifRepository {
	return &TarifRepository{}
}
