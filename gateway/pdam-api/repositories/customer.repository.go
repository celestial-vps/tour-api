package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"github.com/feiin/ploto"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/models"
)

type CustomerRepository struct {
}

// Save implements ICustomerRepository.
func (c *CustomerRepository) Save(ctx context.Context, tx *sql.Tx, customer models.Customer) models.Customer {
	SQL := `insert into customers(description,  createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt,
		oid, firstName, middleName, lastName, email, phoneNumber, address, imageOid) 
		values (?,?,?,?,?,?,?,
		?,?,?,?,?,?,?,?)`
	_, err := tx.ExecContext(ctx, SQL, customer.TransactionRecord.Description, customer.TransactionRecord.CreatedBy, customer.TransactionRecord.CreatedAt,
		customer.TransactionRecord.LastModifiedBy, customer.TransactionRecord.UpdatedAt, customer.TransactionRecord.DeletedBy, customer.TransactionRecord.DeletedAt,
		customer.Oid, customer.Name.FirstName, customer.Name.MiddleName, customer.Name.LastName,
		customer.Email, customer.PhoneNumber, customer.Address, customer.ImageOid)
	common.PanicIfError(err)
	return customer
}

// Update implements ICustomerRepository.
func (c *CustomerRepository) Update(ctx context.Context, tx *sql.Tx, customer models.Customer) models.Customer {
	SQL := `update customers set description = ?, lastModifiedBy = ?, updatedAt = ?,
	firstName = ?,middleName = ?,lastName = ?,email = ?,
	phoneNumber = ?,address = ?,imageOid = ? where oid = ?`
	_, err := tx.ExecContext(ctx, SQL, customer.TransactionRecord.Description, customer.TransactionRecord.LastModifiedBy, customer.TransactionRecord.UpdatedAt,
		customer.Name.FirstName, customer.Name.MiddleName, customer.Name.LastName,
		customer.Email, customer.PhoneNumber, customer.Address, customer.ImageOid, customer.Oid)
	common.PanicIfError(err)

	return customer
}

// Deleted implements ICustomerRepository.
func (c *CustomerRepository) Deleted(ctx context.Context, tx *sql.Tx, oid string) {
	SQL := `delete from customers where oid = ?`
	_, err := tx.ExecContext(ctx, SQL, oid)
	common.PanicIfError(err)
}

// FindAll implements ICustomerRepository.
func (c *CustomerRepository) FindAll(ctx context.Context, tx *sql.Tx) []models.CustomerDomain {
	SQL := `select oid, firstName, middleName, lastName, email, phoneNumber, address, imageOid, description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt from customers `
	rows, err := tx.QueryContext(ctx, SQL)
	common.PanicIfError(err)
	defer rows.Close()

	var customers []models.CustomerDomain
	for rows.Next() {
		customer := models.CustomerDomain{}
		err := ploto.Scan(rows, &customer)
		common.PanicIfError(err)
		customers = append(customers, customer)
	}
	return customers
}

// FindByCriteriaPage implements ICustomerRepository.
func (c *CustomerRepository) FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterCustomerDto) ([]models.CustomerDomain, error) {
	SQL := `SELECT oid, firstName, middleName, lastName, email, phoneNumber, address, imageOid, description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt
			 FROM customers`
	var queryParams []interface{}

	// Construct WHERE clause based on filter conditions
	var whereConditions []string
	if condition.FirstName != "" {
		whereConditions = append(whereConditions, "firstName LIKE ?")
		queryParams = append(queryParams, fmt.Sprintf("%%%s%%", condition.FirstName))
	}
	if condition.LastName != "" {
		whereConditions = append(whereConditions, "lastName LIKE ?")
		queryParams = append(queryParams, fmt.Sprintf("%%%s%%", condition.LastName))
	}

	// Add WHERE clause if there are conditions
	if len(whereConditions) > 0 {
		SQL += " WHERE " + fmt.Sprintf("%s", whereConditions[0])
		for _, condition := range whereConditions[1:] {
			SQL += " AND " + condition
		}
	}

	rows, err := tx.QueryContext(ctx, SQL, queryParams...)
	common.PanicIfError(err)
	defer rows.Close()

	var customers []models.CustomerDomain
	for rows.Next() {
		customer := models.CustomerDomain{}
		err := ploto.Scan(rows, &customer)
		common.PanicIfError(err)
		customers = append(customers, customer)
	}

	return customers, err
}

// FindCountByCriteria implements ICustomerRepository.
func (c *CustomerRepository) FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterCustomerDto) (int64, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	// Start building the SQL query
	queryBuilder.WriteString(`SELECT  count(oid) FROM customers`)

	// Add WHERE clause if necessary
	var whereClauses []string
	if condition.FirstName != "" {
		whereClauses = append(whereClauses, "firstName LIKE ?")
		args = append(args, "%"+condition.FirstName+"%")
	}
	if condition.LastName != "" {
		whereClauses = append(whereClauses, "lastName LIKE ?")
		args = append(args, "%"+condition.LastName+"%")
	}

	if len(whereClauses) > 0 {
		queryBuilder.WriteString(" WHERE ")
		queryBuilder.WriteString(strings.Join(whereClauses, " AND "))
	}

	SQL := queryBuilder.String()

	// Execute the query and get the count
	var count int64
	err := tx.QueryRowContext(ctx, SQL, args...).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("error executing query: %w", err)
	}

	return count, nil
}

// AdvanceFlter implements ICustomerRepository.
func (c *CustomerRepository) AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterCustomerDto) ([]models.CustomerDomain, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	// Start building the SQL query
	queryBuilder.WriteString(`SELECT oid, firstName, middleName, lastName, email, phoneNumber, address, imageOid, description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt
			 FROM customers`)

	// Add WHERE clause if necessary
	var whereClauses []string
	if condition.FirstName != "" {
		whereClauses = append(whereClauses, "firstName LIKE ?")
		args = append(args, "%"+condition.FirstName+"%")
	}
	if condition.LastName != "" {
		whereClauses = append(whereClauses, "lastName LIKE ?")
		args = append(args, "%"+condition.LastName+"%")
	}

	if len(whereClauses) > 0 {
		queryBuilder.WriteString(" WHERE ")
		queryBuilder.WriteString(strings.Join(whereClauses, " AND "))
	}

	SQL := queryBuilder.String()

	// Execute the query
	rows, err := tx.QueryContext(ctx, SQL, args...)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %w", err)
	}
	defer rows.Close()

	// Scan rows into models
	var customers []models.CustomerDomain
	for rows.Next() {
		customer := models.CustomerDomain{}
		err := ploto.Scan(rows, &customer)
		common.PanicIfError(err)
		customers = append(customers, customer)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return customers, nil
}

// FindById implements ICustomerRepository.
func (c *CustomerRepository) FindById(ctx context.Context, tx *sql.Tx, oid string) (models.Customer, error) {
	SQL := `SELECT oid, firstName, middleName, lastName, email, phoneNumber, address, imageOid, description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt
			FROM customers WHERE oid = ?`

	row := tx.QueryRowContext(ctx, SQL, oid)

	customer := models.Customer{}

	// Use ploto to scan the row directly into a temporary struct
	var middleName *string
	var lastName *string
	var description *string // Changed to *string to handle NULL values
	var createdBy *string
	var createdAt *string // Change to appropriate types if needed
	var lastModifiedBy *string
	var updatedAt *string // Change to appropriate types if needed
	var deletedBy *string
	var deletedAt *string // Change to appropriate types if needed

	err := row.Scan(
		&customer.Oid,
		&customer.Name.FirstName,
		&middleName,
		&lastName,
		&customer.Email,
		&customer.PhoneNumber,
		&customer.Address,
		&customer.ImageOid,
		&description,
		&createdBy,
		&createdAt,
		&lastModifiedBy,
		&updatedAt,
		&deletedBy,
		&deletedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return customer, errors.New("customer is not found")
		}
		return customer, fmt.Errorf("error scanning customer: %w", err)
	}

	// Set the optional fields in the Name struct
	customer.Name.MiddleName = middleName
	customer.Name.LastName = lastName

	return customer, nil
}

func NewCustomerRepository() ICustomerRepository {
	return &CustomerRepository{}
}
