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

type CustomerRepository struct {
}

func (c *CustomerRepository) Save(ctx context.Context, tx *sql.Tx, customer models.Customer) (models.Customer, error) {
	SQL := `
		INSERT INTO customers (
			created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at,
			oid, first_name, middle_name, last_name, email, phone_number, address
		) VALUES (
			$1, $2, $3, $4, $5, $6,
			$7, $8, $9, $10, $11, $12, $13
		)
	`

	_, err := tx.ExecContext(ctx, SQL,
		customer.TransactionRecord.CreatedBy,
		customer.TransactionRecord.CreatedAt,
		customer.TransactionRecord.LastModifiedBy,
		customer.TransactionRecord.UpdatedAt,
		customer.TransactionRecord.DeletedBy,
		customer.TransactionRecord.DeletedAt,
		customer.Oid,
		customer.Name.FirstName,
		customer.Name.MiddleName,
		customer.Name.LastName,
		customer.Email,
		customer.PhoneNumber,
		customer.Address,
	)

	if err != nil {
		return customer, err
	}
	return customer, nil
}

// Update implements ICustomerRepository.
func (c *CustomerRepository) Update(ctx context.Context, tx *sql.Tx, customer models.Customer) models.Customer {
	SQL := `
		UPDATE customers SET  
			last_modified_by = $1, 
			updated_at = $2,
			first_name = $3,
			middle_name = $4,
			last_name = $5,
			email = $6,
			phone_number = $7,
			address = $8 
		WHERE oid = $9
	`

	_, err := tx.ExecContext(ctx, SQL,
		customer.TransactionRecord.LastModifiedBy,
		customer.TransactionRecord.UpdatedAt,
		customer.Name.FirstName,
		customer.Name.MiddleName,
		customer.Name.LastName,
		customer.Email,
		customer.PhoneNumber,
		customer.Address,
		// customer.ImageOid,
		customer.Oid,
	)

	common.PanicIfError(err)
	return customer
}

func (c *CustomerRepository) Deleted(ctx context.Context, tx *sql.Tx, oid string) error {
	SQL := `DELETE FROM customers WHERE oid = $1`
	_, err := tx.ExecContext(ctx, SQL, oid)
	return err
}

func (c *CustomerRepository) FindAll(ctx context.Context, tx *sql.Tx) ([]models.CustomerDomain, error) {
	SQL := `SELECT oid, first_name, middle_name, last_name, email, phone_number, address, 
                   created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at 
            FROM customers`

	rows, err := tx.QueryContext(ctx, SQL)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var customers []models.CustomerDomain

	for rows.Next() {
		var customer models.CustomerDomain
		var createdByStr, lastModifiedByStr string
		var deletedByStr *string
		var createdAt time.Time
		var updatedAt, deletedAt *time.Time

		err := rows.Scan(
			&customer.Oid,
			&customer.FirstName,
			&customer.MiddleName,
			&customer.LastName,
			&customer.Email,
			&customer.PhoneNumber,
			&customer.Address,
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
		customer.CreatedBy = createdBy
		customer.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, err
		}
		customer.LastModifiedBy = lastModifiedBy
		customer.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, err
			}
			customer.DeletedBy = &deletedBy
		} else {
			customer.DeletedBy = nil
		}

		customer.DeletedAt = deletedAt

		customers = append(customers, customer)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return customers, nil
}

func (c *CustomerRepository) FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterCustomerDto) ([]models.CustomerDomain, error) {
	baseSQL := `
		SELECT oid, first_name, middle_name, last_name, email, phone_number, address, 
		       created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM customers
	`

	var queryParams []interface{}
	var whereConditions []string

	// Build WHERE clause dynamically
	if condition.Search != "" {
		whereConditions = append(whereConditions, fmt.Sprintf("first_name ILIKE $%d", len(queryParams)+1))
		queryParams = append(queryParams, "%"+condition.Search+"%")
	}
	// if condition.LastName != "" {
	// 	whereConditions = append(whereConditions, fmt.Sprintf("last_name ILIKE $%d", len(queryParams)+1))
	// 	queryParams = append(queryParams, "%"+condition.LastName+"%")
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

	var customers []models.CustomerDomain

	for rows.Next() {
		var customer models.CustomerDomain

		// Temp vars for nullable strings and UUIDs from DB
		var middleName, lastName *string
		var createdByStr, lastModifiedByStr string
		var deletedByStr *string
		var createdAt time.Time
		var updatedAt, deletedAt *time.Time

		err := rows.Scan(
			&customer.Oid,
			&customer.FirstName,
			&middleName,
			&lastName,
			&customer.Email,
			&customer.PhoneNumber,
			&customer.Address,
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

		customer.MiddleName = middleName
		customer.LastName = lastName

		createdBy, err := uuid.Parse(createdByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for CreatedBy: %w", err)
		}
		customer.CreatedBy = createdBy
		customer.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		customer.LastModifiedBy = lastModifiedBy
		customer.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
			}
			customer.DeletedBy = &deletedBy
		} else {
			customer.DeletedBy = nil
		}
		customer.DeletedAt = deletedAt

		customers = append(customers, customer)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return customers, nil
}

func (c *CustomerRepository) FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterCustomerDto) (int64, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`SELECT count(oid) FROM customers`)

	var whereClauses []string

	if condition.Search != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("first_name ILIKE $%d", len(args)+1))
		args = append(args, "%"+condition.Search+"%")
	}
	// if condition.LastName != "" {
	// 	whereClauses = append(whereClauses, fmt.Sprintf("last_name ILIKE $%d", len(args)+1))
	// 	args = append(args, "%"+condition.LastName+"%")
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

func (c *CustomerRepository) AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterCustomerDto) ([]models.CustomerDomain, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`
		SELECT oid, first_name, middle_name, last_name, email, phone_number, address, 
		        created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM customers
	`)

	var whereClauses []string

	if condition.Search != "" {
		whereClauses = append(whereClauses, fmt.Sprintf("first_name ILIKE $%d", len(args)+1))
		args = append(args, "%"+condition.Search+"%")
	}

	// if condition.LastName != "" {
	// 	whereClauses = append(whereClauses, fmt.Sprintf("last_name ILIKE $%d", len(args)+1))
	// 	args = append(args, "%"+condition.LastName+"%")
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

	var customers []models.CustomerDomain
	for rows.Next() {
		var (
			customer          models.CustomerDomain
			middleName        *string
			lastName          *string
			createdByStr      string
			createdAt         time.Time
			lastModifiedByStr string
			updatedAt         *time.Time
			deletedByStr      *string
			deletedAt         *time.Time
		)

		err := rows.Scan(
			&customer.Oid,
			&customer.FirstName,
			&middleName,
			&lastName,
			&customer.Email,
			&customer.PhoneNumber,
			&customer.Address,
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

		customer.MiddleName = middleName
		customer.LastName = lastName

		createdBy, err := uuid.Parse(createdByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for CreatedBy: %w", err)
		}
		customer.CreatedBy = createdBy
		customer.CreatedAt = createdAt

		lastModifiedBy, err := uuid.Parse(lastModifiedByStr)
		if err != nil {
			return nil, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		customer.LastModifiedBy = lastModifiedBy
		customer.UpdatedAt = updatedAt

		if deletedByStr != nil {
			deletedBy, err := uuid.Parse(*deletedByStr)
			if err != nil {
				return nil, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
			}
			customer.DeletedBy = &deletedBy
		} else {
			customer.DeletedBy = nil
		}

		customer.DeletedAt = deletedAt

		customers = append(customers, customer)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return customers, nil
}

func (c *CustomerRepository) FindById(ctx context.Context, tx *sql.Tx, oid string) (models.Customer, error) {
	SQL := `SELECT oid, first_name, middle_name, last_name, email, phone_number, address,
			created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
			FROM customers WHERE oid = $1`

	row := tx.QueryRowContext(ctx, SQL, oid)

	customer := models.Customer{}

	// Scan ke variabel pointer dulu (nullable)
	var middleName, lastName *string
	var createdByStr, lastModifiedByStr *string
	var deletedByStr *string
	var createdAt time.Time
	var updatedAt *time.Time
	var deletedAt *time.Time

	err := row.Scan(
		&customer.Oid,
		&customer.Name.FirstName,
		&middleName,
		&lastName,
		&customer.Email,
		&customer.PhoneNumber,
		&customer.Address,
		&createdByStr,
		&createdAt,
		&lastModifiedByStr,
		&updatedAt,
		&deletedByStr,
		&deletedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return customer, errors.New("customer is not found")
		}
		return customer, fmt.Errorf("error scanning customer: %w", err)
	}

	// Assign nullable string fields
	customer.Name.MiddleName = middleName
	customer.Name.LastName = lastName

	// Convert string UUID ke uuid.UUID
	createdBy, err := uuid.Parse(*createdByStr)
	if err != nil {
		return customer, fmt.Errorf("invalid UUID for CreatedBy: %w", err)
	}
	customer.TransactionRecord.CreatedBy = createdBy
	customer.TransactionRecord.CreatedAt = createdAt

	if lastModifiedByStr != nil {
		lastModifiedBy, err := uuid.Parse(*lastModifiedByStr)
		if err != nil {
			return customer, fmt.Errorf("invalid UUID for LastModifiedBy: %w", err)
		}
		customer.TransactionRecord.LastModifiedBy = lastModifiedBy
	}

	customer.TransactionRecord.UpdatedAt = updatedAt

	if deletedByStr != nil {
		deletedBy, err := uuid.Parse(*deletedByStr)
		if err != nil {
			return customer, fmt.Errorf("invalid UUID for DeletedBy: %w", err)
		}
		customer.TransactionRecord.DeletedBy = &deletedBy
	}

	customer.TransactionRecord.DeletedAt = deletedAt

	return customer, nil
}

func NewCustomerRepository() ICustomerRepository {
	return &CustomerRepository{}
}
