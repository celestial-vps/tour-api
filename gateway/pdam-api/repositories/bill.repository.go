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

type BillRepository struct {
}

func (c *BillRepository) Save(ctx context.Context, tx *sql.Tx, bill models.Bill) (models.Bill, error) {
	SQL := `
		INSERT INTO bills (
			created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at,
			oid, usage_oid, billing_date, total_amount, status
		) VALUES (
			$1, $2, $3, $4, $5, $6,
			$7, $8, $9, $10, $11
		)
	`

	_, err := tx.ExecContext(ctx, SQL,
		bill.TransactionRecord.CreatedBy,
		bill.TransactionRecord.CreatedAt,
		bill.TransactionRecord.LastModifiedBy,
		bill.TransactionRecord.UpdatedAt,
		bill.TransactionRecord.DeletedBy,
		bill.TransactionRecord.DeletedAt,
		bill.Oid,
		bill.UsageOid,
		bill.BillingDate,
		bill.TotalAmount,
		bill.Status,
	)

	if err != nil {
		return bill, err
	}
	return bill, nil
}

// Update implements IBillRepository.
func (c *BillRepository) Update(ctx context.Context, tx *sql.Tx, bill models.Bill) models.Bill {
	SQL := `
		UPDATE bills SET  
			last_modified_by = $1, 
			updated_at = $2,
			usage_oid = $3,
			billing_date = $4,
			total_amount = $5,
			status = $6
		WHERE oid = $10
	`

	_, err := tx.ExecContext(ctx, SQL,
		bill.TransactionRecord.LastModifiedBy,
		bill.TransactionRecord.UpdatedAt,
		bill.UsageOid,
		bill.BillingDate,
		bill.TotalAmount,
		bill.Status,
		bill.Oid,
	)

	common.PanicIfError(err)
	return bill
}

func (c *BillRepository) Deleted(ctx context.Context, tx *sql.Tx, oid string) error {
	SQL := `DELETE FROM bills WHERE oid = $1`
	_, err := tx.ExecContext(ctx, SQL, oid)
	return err
}

func (c *BillRepository) FindAll(ctx context.Context, tx *sql.Tx) ([]models.BillDomain, error) {
	SQL := `SELECT oid, usage_oid, billing_date, total_amount, status,
                    created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at 
            FROM bills`

	rows, err := tx.QueryContext(ctx, SQL)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bills []models.BillDomain

	for rows.Next() {
		var bill models.BillDomain
		var createdByStr, lastModifiedByStr string
		var deletedByStr *string
		var createdAt time.Time
		var updatedAt, deletedAt *time.Time

		err := rows.Scan(
			&bill.Oid,
			&bill.UsageOid,
			&bill.BillingDate,
			&bill.TotalAmount,
			&bill.Status,
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
		bill.CreatedBy = createdBy
		bill.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, err
		}
		bill.LastModifiedBy = lastModifiedBy
		bill.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, err
			}
			bill.DeletedBy = &deletedBy
		} else {
			bill.DeletedBy = nil
		}

		bill.DeletedAt = deletedAt

		bills = append(bills, bill)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return bills, nil
}

func (c *BillRepository) FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterBillDto) ([]models.BillDomain, error) {
	baseSQL := `
		SELECT oid, usage_oid, billing_date, total_amount, status, effective_rom, effective_to, image_oid, 
		       created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM bills
	`

	var queryParams []interface{}
	var whereConditions []string

	// Build WHERE clause dynamically
	// if condition.UsageOid != "" {
	// 	whereConditions = append(whereConditions, fmt.Sprintf("usage_oid ILIKE $%d", len(queryParams)+1))
	// 	queryParams = append(queryParams, "%"+condition.UsageOid+"%")
	// }

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

	var bills []models.BillDomain

	for rows.Next() {
		var bill models.BillDomain

		// Temp vars for nullable strings and UUIDs from DB
		var createdByStr, lastModifiedByStr string
		var deletedByStr *string
		var createdAt time.Time
		var updatedAt, deletedAt *time.Time

		err := rows.Scan(
			&bill.Oid,
			&bill.UsageOid,
			&bill.BillingDate,
			&bill.TotalAmount,
			&bill.Status,
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
		bill.CreatedBy = createdBy
		bill.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		bill.LastModifiedBy = lastModifiedBy
		bill.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
			}
			bill.DeletedBy = &deletedBy
		} else {
			bill.DeletedBy = nil
		}
		bill.DeletedAt = deletedAt

		bills = append(bills, bill)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return bills, nil
}

func (c *BillRepository) FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterBillDto) (int64, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`SELECT count(oid) FROM bills`)

	var whereClauses []string

	// if condition.UsageOid != "" {
	// 	whereClauses = append(whereClauses, fmt.Sprintf("usage_oid ILIKE $%d", len(args)+1))
	// 	args = append(args, "%"+condition.UsageOid+"%")
	// }

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

func (c *BillRepository) AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterBillDto) ([]models.BillDomain, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`
		SELECT oid, usage_oid, billing_date, total_amount, status,  
		        created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM bills
	`)

	var whereClauses []string

	// if condition.UsageOid != "" {
	// 	whereClauses = append(whereClauses, fmt.Sprintf("usage_oid ILIKE $%d", len(args)+1))
	// 	args = append(args, "%"+condition.UsageOid+"%")
	// }

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

	var bills []models.BillDomain
	for rows.Next() {
		var (
			bill              models.BillDomain
			createdByStr      string
			createdAt         time.Time
			lastModifiedByStr string
			updatedAt         *time.Time
			deletedByStr      *string
			deletedAt         *time.Time
		)

		err := rows.Scan(
			&bill.Oid,
			&bill.UsageOid,
			&bill.BillingDate,
			&bill.TotalAmount,
			&bill.Status,
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
		bill.CreatedBy = createdBy
		bill.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		bill.LastModifiedBy = lastModifiedBy
		bill.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
			}
			bill.DeletedBy = &deletedBy
		} else {
			bill.DeletedBy = nil
		}

		bill.DeletedAt = deletedAt

		bills = append(bills, bill)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return bills, nil
}

func (c *BillRepository) FindById(ctx context.Context, tx *sql.Tx, oid string) (models.Bill, error) {
	SQL := `SELECT oid, usage_oid, billing_date, total_amount, status, image_oid,
			created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
			FROM bills WHERE oid = $1`

	row := tx.QueryRowContext(ctx, SQL, oid)

	bill := models.Bill{}

	// Scan ke variabel pointer dulu (nullable)
	var createdByStr, lastModifiedByStr *string
	var deletedByStr *string
	var createdAt time.Time
	var updatedAt *time.Time
	var deletedAt *time.Time

	err := row.Scan(
		&bill.Oid,
		&bill.UsageOid,
		&bill.BillingDate,
		&bill.TotalAmount,
		&bill.Status,
		&createdByStr,
		&createdAt,
		&lastModifiedByStr,
		&updatedAt,
		&deletedByStr,
		&deletedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return bill, errors.New("bill is not found")
		}
		return bill, fmt.Errorf("error scanning bill: %w", err)
	}

	// Convert string UUID ke uuid.UUID
	createdBy, err := uuid.Parse(*createdByStr)
	if err != nil {
		return bill, fmt.Errorf("invalid UUID for CreatedBy: %w", err)
	}
	bill.TransactionRecord.CreatedBy = createdBy
	bill.TransactionRecord.CreatedAt = createdAt

	if lastModifiedByStr != nil {
		lastModifiedBy, err := uuid.Parse(*lastModifiedByStr)
		if err != nil {
			return bill, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		bill.TransactionRecord.LastModifiedBy = lastModifiedBy
	}

	bill.TransactionRecord.UpdatedAt = updatedAt

	if deletedByStr != nil {
		deletedBy, err := uuid.Parse(*deletedByStr)
		if err != nil {
			return bill, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
		}
		bill.TransactionRecord.DeletedBy = &deletedBy
	}

	bill.TransactionRecord.DeletedAt = deletedAt

	return bill, nil
}

func NewBillRepository() IBillRepository {
	return &BillRepository{}
}
