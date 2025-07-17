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

type PaymentRepository struct {
}

func (c *PaymentRepository) Save(ctx context.Context, tx *sql.Tx, payment models.Payment) (models.Payment, error) {
	SQL := `
		INSERT INTO payments (
			created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at,
			oid, bill_oid, payment_date, max_volume, price_per_m3, effective_rom, effective_to
		) VALUES (
			$1, $2, $3, $4, $5, $6,
			$7, $8, $9, $10, $11, $12, $13
		)
	`

	_, err := tx.ExecContext(ctx, SQL,
		payment.TransactionRecord.CreatedBy,
		payment.TransactionRecord.CreatedAt,
		payment.TransactionRecord.LastModifiedBy,
		payment.TransactionRecord.UpdatedAt,
		payment.TransactionRecord.DeletedBy,
		payment.TransactionRecord.DeletedAt,
		payment.Oid,
		payment.BillOid,
		payment.PaymentDate,
		payment.AmountPaid,
		payment.PaymentMethod,
	)

	if err != nil {
		return payment, err
	}
	return payment, nil
}

// Update implements IPaymentRepository.
func (c *PaymentRepository) Update(ctx context.Context, tx *sql.Tx, payment models.Payment) models.Payment {
	SQL := `
		UPDATE payments SET  
			last_modified_by = $1, 
			updated_at = $2,
			bill_oid = $3,
			payment_date = $4,
			max_volume = $5,
			price_per_m3 = $6,
			effective_rom = $7,
			effective_to = $8
		WHERE oid = $10
	`

	_, err := tx.ExecContext(ctx, SQL,
		payment.TransactionRecord.LastModifiedBy,
		payment.TransactionRecord.UpdatedAt,
		payment.BillOid,
		payment.PaymentDate,
		payment.AmountPaid,
		payment.PaymentMethod,
		payment.Oid,
	)

	common.PanicIfError(err)
	return payment
}

func (c *PaymentRepository) Deleted(ctx context.Context, tx *sql.Tx, oid string) error {
	SQL := `DELETE FROM payments WHERE oid = $1`
	_, err := tx.ExecContext(ctx, SQL, oid)
	return err
}

func (c *PaymentRepository) FindAll(ctx context.Context, tx *sql.Tx) ([]models.PaymentDomain, error) {
	SQL := `SELECT oid, bill_oid, payment_date, max_volume, price_per_m3, effective_rom, effective_to, 
                   image_oid, created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at 
            FROM payments`

	rows, err := tx.QueryContext(ctx, SQL)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var payments []models.PaymentDomain

	for rows.Next() {
		var payment models.PaymentDomain
		var imageOidStr *string
		var createdByStr, lastModifiedByStr string
		var deletedByStr *string
		var createdAt time.Time
		var updatedAt, deletedAt *time.Time

		err := rows.Scan(
			&payment.Oid,
			&payment.BillOid,
			&payment.PaymentDate,
			&payment.AmountPaid,
			&payment.PaymentMethod,
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
		payment.CreatedBy = createdBy
		payment.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, err
		}
		payment.LastModifiedBy = lastModifiedBy
		payment.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, err
			}
			payment.DeletedBy = &deletedBy
		} else {
			payment.DeletedBy = nil
		}

		payment.DeletedAt = deletedAt

		payments = append(payments, payment)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return payments, nil
}

func (c *PaymentRepository) FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterPaymentDto) ([]models.PaymentDomain, error) {
	baseSQL := `
		SELECT oid, bill_oid, payment_date, max_volume, price_per_m3, effective_rom, effective_to, image_oid, 
		       created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM payments
	`

	var queryParams []interface{}
	var whereConditions []string

	// Build WHERE clause dynamically
	if condition.BillOid != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("bill_oid ILIKE $%d", len(queryParams)+1))
		queryParams = append(queryParams, "%"+condition.BillOid+"%")
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

	var payments []models.PaymentDomain

	for rows.Next() {
		var payment models.PaymentDomain

		// Temp vars for nullable strings and UUIDs from DB
		var createdByStr, lastModifiedByStr string
		var deletedByStr *string
		var createdAt time.Time
		var updatedAt, deletedAt *time.Time

		err := rows.Scan(
			&payment.Oid,
			&payment.BillOid,
			&payment.PaymentDate,
			&payment.AmountPaid,
			&payment.PaymentMethod,
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
		payment.CreatedBy = createdBy
		payment.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		payment.LastModifiedBy = lastModifiedBy
		payment.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
			}
			payment.DeletedBy = &deletedBy
		} else {
			payment.DeletedBy = nil
		}
		payment.DeletedAt = deletedAt

		payments = append(payments, payment)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return payments, nil
}

func (c *PaymentRepository) FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterPaymentDto) (int64, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`SELECT count(oid) FROM payments`)

	var whereClauses []string

	if condition.BillOid != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("bill_oid ILIKE $%d", len(args)+1))
		args = append(args, "%"+condition.BillOid+"%")
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

func (c *PaymentRepository) AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterPaymentDto) ([]models.PaymentDomain, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`
		SELECT oid, bill_oid, payment_date, max_volume, price_per_m3, effective_rom, effective_to, 
		       image_oid, created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM payments
	`)

	var whereClauses []string

	if condition.BillOid != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("bill_oid ILIKE $%d", len(args)+1))
		args = append(args, "%"+condition.BillOid+"%")
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

	var payments []models.PaymentDomain
	for rows.Next() {
		var (
			payment           models.PaymentDomain
			createdByStr      string
			createdAt         time.Time
			lastModifiedByStr string
			updatedAt         *time.Time
			deletedByStr      *string
			deletedAt         *time.Time
		)

		err := rows.Scan(
			&payment.Oid,
			&payment.BillOid,
			&payment.PaymentDate,
			&payment.AmountPaid,
			&payment.PaymentMethod,
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
		payment.CreatedBy = createdBy
		payment.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		payment.LastModifiedBy = lastModifiedBy
		payment.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
			}
			payment.DeletedBy = &deletedBy
		} else {
			payment.DeletedBy = nil
		}

		payment.DeletedAt = deletedAt

		payments = append(payments, payment)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return payments, nil
}

func (c *PaymentRepository) FindById(ctx context.Context, tx *sql.Tx, oid string) (models.Payment, error) {
	SQL := `SELECT oid, bill_oid, payment_date, max_volume, price_per_m3, effective_rom, effective_to, image_oid,
			created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
			FROM payments WHERE oid = $1`

	row := tx.QueryRowContext(ctx, SQL, oid)

	payment := models.Payment{}

	// Scan ke variabel pointer dulu (nullable)
	var createdByStr, lastModifiedByStr *string
	var deletedByStr *string
	var createdAt time.Time
	var updatedAt *time.Time
	var deletedAt *time.Time

	err := row.Scan(
		&payment.Oid,
		&payment.BillOid,
		&payment.PaymentDate,
		&payment.AmountPaid,
		&payment.PaymentMethod,
		&createdByStr,
		&createdAt,
		&lastModifiedByStr,
		&updatedAt,
		&deletedByStr,
		&deletedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return payment, errors.New("payment is not found")
		}
		return payment, fmt.Errorf("error scanning payment: %w", err)
	}

	// Convert string UUID ke uuid.UUID
	createdBy, err := uuid.Parse(*createdByStr)
	if err != nil {
		return payment, fmt.Errorf("invalid UUID for CreatedBy: %w", err)
	}
	payment.TransactionRecord.CreatedBy = createdBy
	payment.TransactionRecord.CreatedAt = createdAt

	if lastModifiedByStr != nil {
		lastModifiedBy, err := uuid.Parse(*lastModifiedByStr)
		if err != nil {
			return payment, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		payment.TransactionRecord.LastModifiedBy = lastModifiedBy
	}

	payment.TransactionRecord.UpdatedAt = updatedAt

	if deletedByStr != nil {
		deletedBy, err := uuid.Parse(*deletedByStr)
		if err != nil {
			return payment, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
		}
		payment.TransactionRecord.DeletedBy = &deletedBy
	}

	payment.TransactionRecord.DeletedAt = deletedAt

	return payment, nil
}

func NewPaymentRepository() IPaymentRepository {
	return &PaymentRepository{}
}
