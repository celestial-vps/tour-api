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

type UserRoleRepository struct {
}

// Save implements IUserRoleRepository.
func (u *UserRoleRepository) Save(ctx context.Context, tx *sql.Tx, userRole models.UserRole) models.UserRole {
	SQL := `insert into user_roles(description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt,
				oid, roleName, targetType, isAdministrative, readState, writeState, createState, deleteState, navigateState)
				values (?,?,?,?,?,?,?,
				?,?,?,?,?,?,?,?,?)`
	_, err := tx.ExecContext(ctx, SQL, userRole.TransactionRecord.Description, userRole.TransactionRecord.CreatedBy, userRole.TransactionRecord.CreatedAt,
		userRole.TransactionRecord.LastModifiedBy, userRole.TransactionRecord.UpdatedAt, userRole.TransactionRecord.DeletedBy, userRole.TransactionRecord.DeletedAt,
		userRole.Oid, userRole.RoleName, userRole.TargetType, userRole.IsAdministrative,
		userRole.ReadState, userRole.WriteState, userRole.CreateState, userRole.DeleteState, userRole.NavigateState)
	common.PanicIfError(err)
	return userRole
}

// Update implements IUserRoleRepository.
func (u *UserRoleRepository) Update(ctx context.Context, tx *sql.Tx, userRole models.UserRoleDomain) models.UserRoleDomain {
	SQL := `update user_roles set description = ?, lastModifiedBy = ?, updatedAt = ?,
				roleName = ?,targetType = ?,isAdministrative = ?, readState = ?,
				writeState = ?,createState = ?,deleteState = ?,navigateState = ?  where oid = ?`
	_, err := tx.ExecContext(ctx, SQL, userRole.Description, userRole.LastModifiedBy, userRole.UpdatedAt,
		userRole.RoleName, userRole.TargetType, userRole.IsAdministrative,
		userRole.ReadState, userRole.WriteState, userRole.CreateState, userRole.DeleteState, userRole.NavigateState, userRole.Oid)
	common.PanicIfError(err)

	return userRole
}

// Deleted implements IUserRoleRepository.
func (u *UserRoleRepository) Deleted(ctx context.Context, tx *sql.Tx, oid string) {
	SQL := `delete from user_roles where oid = ?`
	_, err := tx.ExecContext(ctx, SQL, oid)
	common.PanicIfError(err)
}

// FindAll implements IUserRoleRepository.
func (u *UserRoleRepository) FindAll(ctx context.Context, tx *sql.Tx) []models.UserRoleDomain {
	SQL := `select oid, roleName, targetType, isAdministrative, readState, writeState, createState, deleteState, navigateState, description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt
				from user_roles `
	rows, err := tx.QueryContext(ctx, SQL)
	common.PanicIfError(err)
	defer rows.Close()

	var userRoles []models.UserRoleDomain
	for rows.Next() {
		userRole := models.UserRoleDomain{}
		err := ploto.Scan(rows, &userRole)
		common.PanicIfError(err)
		userRoles = append(userRoles, userRole)
	}
	return userRoles
}

// FindByCriteriaPage implements IUserRoleRepository.
func (u *UserRoleRepository) FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterUserRoleDto) ([]models.UserRoleDomain, error) {
	SQL := `SELECT oid, roleName, targetType, isAdministrative, readState, writeState, createState, deleteState, navigateState, description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt FROM user_roles`
	var queryParams []interface{}

	// Construct WHERE clause based on filter conditions
	var whereConditions []string
	if condition.RoleName != "" {
		whereConditions = append(whereConditions, "roleName LIKE ?")
		queryParams = append(queryParams, fmt.Sprintf("%%%s%%", condition.RoleName))
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

	var userRoles []models.UserRoleDomain
	for rows.Next() {
		userRole := models.UserRoleDomain{}
		err := ploto.Scan(rows, &userRole)
		common.PanicIfError(err)
		userRoles = append(userRoles, userRole)
	}
	return userRoles, err
}

// FindCountByCriteria implements IUserRoleRepository.
func (u *UserRoleRepository) FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterUserRoleDto) (int64, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	// Start building the SQL query
	queryBuilder.WriteString(`SELECT  count(oid) FROM user_roles`)

	// Add WHERE clause if necessary
	var whereClauses []string
	if condition.RoleName != "" {
		whereClauses = append(whereClauses, "roleName LIKE ?")
		args = append(args, "%"+condition.RoleName+"%")
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

// AdvanceFlter implements IUserRoleRepository.
func (u *UserRoleRepository) AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterUserRoleDto) ([]models.UserRoleDomain, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	// Start building the SQL query
	queryBuilder.WriteString(`SELECT oid, roleName, targetType, isAdministrative, readState, writeState, createState, deleteState, navigateState, description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt FROM user_roles`)

	// Add WHERE clause if necessary
	var whereClauses []string
	if condition.RoleName != "" {
		whereClauses = append(whereClauses, "roleName LIKE ?")
		args = append(args, "%"+condition.RoleName+"%")
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
	var userRoles []models.UserRoleDomain
	for rows.Next() {
		userRole := models.UserRoleDomain{}
		err := ploto.Scan(rows, &userRole)
		common.PanicIfError(err)
		userRoles = append(userRoles, userRole)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return userRoles, nil
}

// FindById implements IUserRoleRepository.
func (u *UserRoleRepository) FindById(ctx context.Context, tx *sql.Tx, oid string) (models.UserRoleDomain, error) {
	SQL := `select oid, roleName, targetType, isAdministrative, readState, writeState, createState, deleteState, navigateState, description, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt
				from user_roles where oid = ?`
	rows, err := tx.QueryContext(ctx, SQL, oid)
	common.PanicIfError(err)
	defer rows.Close()

	userRole := models.UserRoleDomain{}
	if rows.Next() {
		err := ploto.Scan(rows, &userRole)
		common.PanicIfError(err)
		return userRole, nil
	} else {
		return userRole, errors.New("User Role is not found")
	}
}

func NewUserRoleRepository() IUserRoleRepository {
	return &UserRoleRepository{}
}
