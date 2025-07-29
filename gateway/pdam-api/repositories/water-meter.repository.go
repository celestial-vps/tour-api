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

type WaterMeterRepository struct {
}

func (c *WaterMeterRepository) Save(ctx context.Context, tx *sql.Tx, waterMeter models.WaterMeter) (models.WaterMeter, error) {
	SQL := `
		INSERT INTO water_meters (
			created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at,
			oid, serial_number, customer_oid, installed_at, replaced_at, status
		) VALUES (
			$1, $2, $3, $4, $5, $6,
			$7, $8, $9, $10, $11, $12
		)
	`

	_, err := tx.ExecContext(ctx, SQL,
		waterMeter.TransactionRecord.CreatedBy,
		waterMeter.TransactionRecord.CreatedAt,
		waterMeter.TransactionRecord.LastModifiedBy,
		waterMeter.TransactionRecord.UpdatedAt,
		waterMeter.TransactionRecord.DeletedBy,
		waterMeter.TransactionRecord.DeletedAt,
		waterMeter.Oid,
		waterMeter.SerialNumber,
		waterMeter.CustomerOid,
		waterMeter.InstalledAt,
		waterMeter.ReplacedAt,
		waterMeter.Status,
	)

	if err != nil {
		return waterMeter, err
	}
	return waterMeter, nil
}

// Update implements IWaterMeterRepository.
func (c *WaterMeterRepository) Update(ctx context.Context, tx *sql.Tx, waterMeter models.WaterMeter) models.WaterMeter {
	SQL := `
		UPDATE water_meters SET  
			last_modified_by = $1, 
			updated_at = $2,
			serial_number = $3,
			customer_oid = $4,
			installed_at = $5,
			replaced_at = $6,
			status = $7			
		WHERE oid = $10
	`

	_, err := tx.ExecContext(ctx, SQL,
		waterMeter.TransactionRecord.LastModifiedBy,
		waterMeter.TransactionRecord.UpdatedAt,
		waterMeter.SerialNumber,
		waterMeter.CustomerOid,
		waterMeter.InstalledAt,
		waterMeter.ReplacedAt,
		waterMeter.Status,
		waterMeter.Oid,
	)

	common.PanicIfError(err)
	return waterMeter
}

func (c *WaterMeterRepository) Deleted(ctx context.Context, tx *sql.Tx, oid string) error {
	SQL := `DELETE FROM water_meters WHERE oid = $1`
	_, err := tx.ExecContext(ctx, SQL, oid)
	return err
}

func (c *WaterMeterRepository) FindAll(ctx context.Context, tx *sql.Tx) ([]models.WaterMeterDomain, error) {
	SQL := `SELECT oid, serial_number, customer_oid, installed_at, replaced_at, status, 
                   created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at 
            FROM water_meters`

	rows, err := tx.QueryContext(ctx, SQL)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var waterMeters []models.WaterMeterDomain

	for rows.Next() {
		var waterMeter models.WaterMeterDomain
		var imageOidStr *string
		var createdByStr, lastModifiedByStr string
		var deletedByStr *string
		var createdAt time.Time
		var updatedAt, deletedAt *time.Time

		err := rows.Scan(
			&waterMeter.Oid,
			&waterMeter.SerialNumber,
			&waterMeter.CustomerOid,
			&waterMeter.InstalledAt,
			&waterMeter.ReplacedAt,
			&waterMeter.Status,
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
		waterMeter.CreatedBy = createdBy
		waterMeter.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, err
		}
		waterMeter.LastModifiedBy = lastModifiedBy
		waterMeter.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, err
			}
			waterMeter.DeletedBy = &deletedBy
		} else {
			waterMeter.DeletedBy = nil
		}

		waterMeter.DeletedAt = deletedAt

		waterMeters = append(waterMeters, waterMeter)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return waterMeters, nil
}

func (c *WaterMeterRepository) FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterWaterMeterDto) ([]models.WaterMeterDomain, error) {
	baseSQL := `
		SELECT oid, serial_number, customer_oid, installed_at, replaced_at, status, 
		       created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM water_meters
	`

	var queryParams []interface{}
	var whereConditions []string

	// Build WHERE clause dynamically
	if condition.SerialNumber != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("serial_number ILIKE $%d", len(queryParams)+1))
		queryParams = append(queryParams, "%"+condition.SerialNumber+"%")
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

	var waterMeters []models.WaterMeterDomain

	for rows.Next() {
		var waterMeter models.WaterMeterDomain

		// Temp vars for nullable strings and UUIDs from DB
		var createdByStr, lastModifiedByStr string
		var deletedByStr *string
		var createdAt time.Time
		var updatedAt, deletedAt *time.Time

		err := rows.Scan(
			&waterMeter.Oid,
			&waterMeter.SerialNumber,
			&waterMeter.CustomerOid,
			&waterMeter.InstalledAt,
			&waterMeter.ReplacedAt,
			&waterMeter.Status,
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
		waterMeter.CreatedBy = createdBy
		waterMeter.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		waterMeter.LastModifiedBy = lastModifiedBy
		waterMeter.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
			}
			waterMeter.DeletedBy = &deletedBy
		} else {
			waterMeter.DeletedBy = nil
		}
		waterMeter.DeletedAt = deletedAt

		waterMeters = append(waterMeters, waterMeter)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return waterMeters, nil
}

func (c *WaterMeterRepository) FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterWaterMeterDto) (int64, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`SELECT count(oid) FROM water_meters`)

	var whereClauses []string

	if condition.SerialNumber != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("serial_number ILIKE $%d", len(args)+1))
		args = append(args, "%"+condition.SerialNumber+"%")
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

func (c *WaterMeterRepository) AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterWaterMeterDto) ([]models.WaterMeterDomain, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`
		SELECT oid, serial_number, customer_oid, installed_at, replaced_at, status, 
		    created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM water_meters
	`)

	var whereClauses []string

	if condition.SerialNumber != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("serial_number ILIKE $%d", len(args)+1))
		args = append(args, "%"+condition.SerialNumber+"%")
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

	var waterMeters []models.WaterMeterDomain
	for rows.Next() {
		var (
			waterMeter        models.WaterMeterDomain
			createdByStr      string
			createdAt         time.Time
			lastModifiedByStr string
			updatedAt         *time.Time
			deletedByStr      *string
			deletedAt         *time.Time
		)

		err := rows.Scan(
			&waterMeter.Oid,
			&waterMeter.SerialNumber,
			&waterMeter.CustomerOid,
			&waterMeter.InstalledAt,
			&waterMeter.ReplacedAt,
			&waterMeter.Status,
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
		waterMeter.CreatedBy = createdBy
		waterMeter.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		waterMeter.LastModifiedBy = lastModifiedBy
		waterMeter.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
			}
			waterMeter.DeletedBy = &deletedBy
		} else {
			waterMeter.DeletedBy = nil
		}

		waterMeter.DeletedAt = deletedAt

		waterMeters = append(waterMeters, waterMeter)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return waterMeters, nil
}

func (c *WaterMeterRepository) FindById(ctx context.Context, tx *sql.Tx, oid string) (models.WaterMeter, error) {
	SQL := `SELECT oid, serial_number, customer_oid, installed_at, replaced_at, status, 
			created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
			FROM water_meters WHERE oid = $1`

	row := tx.QueryRowContext(ctx, SQL, oid)

	waterMeter := models.WaterMeter{}

	// Scan ke variabel pointer dulu (nullable)
	var createdByStr, lastModifiedByStr *string
	var deletedByStr *string
	var createdAt time.Time
	var updatedAt *time.Time
	var deletedAt *time.Time

	err := row.Scan(
		&waterMeter.Oid,
		&waterMeter.SerialNumber,
		&waterMeter.CustomerOid,
		&waterMeter.InstalledAt,
		&waterMeter.ReplacedAt,
		&waterMeter.Status,
		&createdByStr,
		&createdAt,
		&lastModifiedByStr,
		&updatedAt,
		&deletedByStr,
		&deletedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return waterMeter, errors.New("waterMeter is not found")
		}
		return waterMeter, fmt.Errorf("error scanning waterMeter: %w", err)
	}

	// Convert string UUID ke uuid.UUID
	createdBy, err := uuid.Parse(*createdByStr)
	if err != nil {
		return waterMeter, fmt.Errorf("invalid UUID for CreatedBy: %w", err)
	}
	waterMeter.TransactionRecord.CreatedBy = createdBy
	waterMeter.TransactionRecord.CreatedAt = createdAt

	if lastModifiedByStr != nil {
		lastModifiedBy, err := uuid.Parse(*lastModifiedByStr)
		if err != nil {
			return waterMeter, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		waterMeter.TransactionRecord.LastModifiedBy = lastModifiedBy
	}

	waterMeter.TransactionRecord.UpdatedAt = updatedAt

	if deletedByStr != nil {
		deletedBy, err := uuid.Parse(*deletedByStr)
		if err != nil {
			return waterMeter, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
		}
		waterMeter.TransactionRecord.DeletedBy = &deletedBy
	}

	waterMeter.TransactionRecord.DeletedAt = deletedAt

	return waterMeter, nil
}

func NewWaterMeterRepository() IWaterMeterRepository {
	return &WaterMeterRepository{}
}
