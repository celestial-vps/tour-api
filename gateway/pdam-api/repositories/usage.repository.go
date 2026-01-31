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

type UsageRecordRepository struct {
}

func (c *UsageRecordRepository) Save(ctx context.Context, tx *sql.Tx, usageRecord models.UsageRecord) (models.UsageRecord, error) {
	SQL := `
		INSERT INTO usageRecords (
			created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at,
			oid, meter_oid, meter, billing_month, start_reading, end_reading, consumption_m3
		) VALUES (
			$1, $2, $3, $4, $5, $6,
			$7, $8, $9, $10, $11, $12, $13
		)
	`

	_, err := tx.ExecContext(ctx, SQL,
		usageRecord.TransactionRecord.CreatedBy,
		usageRecord.TransactionRecord.CreatedAt,
		usageRecord.TransactionRecord.LastModifiedBy,
		usageRecord.TransactionRecord.UpdatedAt,
		usageRecord.TransactionRecord.DeletedBy,
		usageRecord.TransactionRecord.DeletedAt,
		usageRecord.Oid,
		usageRecord.MeterOid,
		usageRecord.Meter,
		usageRecord.BillingMonth,
		usageRecord.StartReading,
		usageRecord.EndReading,
		usageRecord.ConsumptionM3,
	)

	if err != nil {
		return usageRecord, err
	}
	return usageRecord, nil
}

// Update implements IUsageRecordRepository.
func (c *UsageRecordRepository) Update(ctx context.Context, tx *sql.Tx, usageRecord models.UsageRecord) models.UsageRecord {
	SQL := `
		UPDATE usageRecords SET  
			last_modified_by = $1, 
			updated_at = $2,
			meter_oid = $3,
			meter = $4,
			billing_month = $5,
			start_reading = $6,
			end_reading = $7,
			consumption_m3 = $8
		WHERE oid = $10
	`

	_, err := tx.ExecContext(ctx, SQL,
		usageRecord.TransactionRecord.LastModifiedBy,
		usageRecord.TransactionRecord.UpdatedAt,
		usageRecord.MeterOid,
		usageRecord.Meter,
		usageRecord.BillingMonth,
		usageRecord.StartReading,
		usageRecord.EndReading,
		usageRecord.ConsumptionM3,
		usageRecord.Oid,
	)

	common.PanicIfError(err)
	return usageRecord
}

func (c *UsageRecordRepository) Deleted(ctx context.Context, tx *sql.Tx, oid string) error {
	SQL := `DELETE FROM usageRecords WHERE oid = $1`
	_, err := tx.ExecContext(ctx, SQL, oid)
	return err
}

func (c *UsageRecordRepository) FindAll(ctx context.Context, tx *sql.Tx) ([]models.UsageRecordDomain, error) {
	SQL := `SELECT oid, meter_oid, meter, billing_month, start_reading, end_reading, consumption_m3, 
                   image_oid, created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at 
            FROM usageRecords`

	rows, err := tx.QueryContext(ctx, SQL)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var usageRecords []models.UsageRecordDomain

	for rows.Next() {
		var usageRecord models.UsageRecordDomain
		var imageOidStr *string
		var createdByStr, lastModifiedByStr string
		var deletedByStr *string
		var createdAt time.Time
		var updatedAt, deletedAt *time.Time

		err := rows.Scan(
			&usageRecord.Oid,
			&usageRecord.MeterOid,
			&usageRecord.Meter,
			&usageRecord.BillingMonth,
			&usageRecord.StartReading,
			&usageRecord.EndReading,
			&usageRecord.ConsumptionM3,
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
		usageRecord.CreatedBy = createdBy
		usageRecord.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, err
		}
		usageRecord.LastModifiedBy = lastModifiedBy
		usageRecord.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, err
			}
			usageRecord.DeletedBy = &deletedBy
		} else {
			usageRecord.DeletedBy = nil
		}

		usageRecord.DeletedAt = deletedAt

		usageRecords = append(usageRecords, usageRecord)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return usageRecords, nil
}

func (c *UsageRecordRepository) FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterUsageRecordDto) ([]models.UsageRecordDomain, error) {
	baseSQL := `
		SELECT oid, meter_oid, meter, billing_month, start_reading, end_reading, consumption_m3, image_oid, 
		       created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM usageRecords
	`

	var queryParams []interface{}
	var whereConditions []string

	// Build WHERE clause dynamically
	if condition.MeterOid != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("meter_oid ILIKE $%d", len(queryParams)+1))
		queryParams = append(queryParams, "%"+condition.MeterOid+"%")
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

	var usageRecords []models.UsageRecordDomain

	for rows.Next() {
		var usageRecord models.UsageRecordDomain

		// Temp vars for nullable strings and UUIDs from DB
		var createdByStr, lastModifiedByStr string
		var deletedByStr *string
		var createdAt time.Time
		var updatedAt, deletedAt *time.Time

		err := rows.Scan(
			&usageRecord.Oid,
			&usageRecord.MeterOid,
			&usageRecord.Meter,
			&usageRecord.BillingMonth,
			&usageRecord.StartReading,
			&usageRecord.EndReading,
			&usageRecord.ConsumptionM3,
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
		usageRecord.CreatedBy = createdBy
		usageRecord.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		usageRecord.LastModifiedBy = lastModifiedBy
		usageRecord.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
			}
			usageRecord.DeletedBy = &deletedBy
		} else {
			usageRecord.DeletedBy = nil
		}
		usageRecord.DeletedAt = deletedAt

		usageRecords = append(usageRecords, usageRecord)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return usageRecords, nil
}

func (c *UsageRecordRepository) FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterUsageRecordDto) (int64, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`SELECT count(oid) FROM usageRecords`)

	var whereClauses []string

	if condition.MeterOid != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("meter_oid ILIKE $%d", len(args)+1))
		args = append(args, "%"+condition.MeterOid+"%")
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

func (c *UsageRecordRepository) AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterUsageRecordDto) ([]models.UsageRecordDomain, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`
		SELECT oid, meter_oid, meter, billing_month, start_reading, end_reading, consumption_m3, 
		       image_oid, created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM usageRecords
	`)

	var whereClauses []string

	if condition.MeterOid != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("meter_oid ILIKE $%d", len(args)+1))
		args = append(args, "%"+condition.MeterOid+"%")
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

	var usageRecords []models.UsageRecordDomain
	for rows.Next() {
		var (
			usageRecord       models.UsageRecordDomain
			createdByStr      string
			createdAt         time.Time
			lastModifiedByStr string
			updatedAt         *time.Time
			deletedByStr      *string
			deletedAt         *time.Time
		)

		err := rows.Scan(
			&usageRecord.Oid,
			&usageRecord.MeterOid,
			&usageRecord.Meter,
			&usageRecord.BillingMonth,
			&usageRecord.StartReading,
			&usageRecord.EndReading,
			&usageRecord.ConsumptionM3,
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
		usageRecord.CreatedBy = createdBy
		usageRecord.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		usageRecord.LastModifiedBy = lastModifiedBy
		usageRecord.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
			}
			usageRecord.DeletedBy = &deletedBy
		} else {
			usageRecord.DeletedBy = nil
		}

		usageRecord.DeletedAt = deletedAt

		usageRecords = append(usageRecords, usageRecord)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return usageRecords, nil
}

func (c *UsageRecordRepository) FindById(ctx context.Context, tx *sql.Tx, oid string) (models.UsageRecord, error) {
	SQL := `SELECT oid, meter_oid, meter, billing_month, start_reading, end_reading, consumption_m3, image_oid,
			created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
			FROM usageRecords WHERE oid = $1`

	row := tx.QueryRowContext(ctx, SQL, oid)

	usageRecord := models.UsageRecord{}

	// Scan ke variabel pointer dulu (nullable)
	var createdByStr, lastModifiedByStr *string
	var deletedByStr *string
	var createdAt time.Time
	var updatedAt *time.Time
	var deletedAt *time.Time

	err := row.Scan(
		&usageRecord.Oid,
		&usageRecord.MeterOid,
		&usageRecord.Meter,
		&usageRecord.BillingMonth,
		&usageRecord.StartReading,
		&usageRecord.EndReading,
		&usageRecord.ConsumptionM3,
		&createdByStr,
		&createdAt,
		&lastModifiedByStr,
		&updatedAt,
		&deletedByStr,
		&deletedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return usageRecord, errors.New("usageRecord is not found")
		}
		return usageRecord, fmt.Errorf("error scanning usageRecord: %w", err)
	}

	// Convert string UUID ke uuid.UUID
	createdBy, err := uuid.Parse(*createdByStr)
	if err != nil {
		return usageRecord, fmt.Errorf("invalid UUID for CreatedBy: %w", err)
	}
	usageRecord.TransactionRecord.CreatedBy = createdBy
	usageRecord.TransactionRecord.CreatedAt = createdAt

	if lastModifiedByStr != nil {
		lastModifiedBy, err := uuid.Parse(*lastModifiedByStr)
		if err != nil {
			return usageRecord, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		usageRecord.TransactionRecord.LastModifiedBy = lastModifiedBy
	}

	usageRecord.TransactionRecord.UpdatedAt = updatedAt

	if deletedByStr != nil {
		deletedBy, err := uuid.Parse(*deletedByStr)
		if err != nil {
			return usageRecord, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
		}
		usageRecord.TransactionRecord.DeletedBy = &deletedBy
	}

	usageRecord.TransactionRecord.DeletedAt = deletedAt

	return usageRecord, nil
}

func NewUsageRecordRepository() IUsageRecordRepository {
	return &UsageRecordRepository{}
}
