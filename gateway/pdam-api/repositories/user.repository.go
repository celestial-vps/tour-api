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

type UserRepository struct {
}

func (u *UserRepository) Save(ctx context.Context, tx *sql.Tx, user models.User) models.User {
	SQL := `INSERT INTO users (
		created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at,
		oid, email, password, android_token, expired_time, is_active, activated_at, role_oid
	) VALUES (
		$1, $2, $3, $4, $5, $6,
		$7, $8, $9, $10, $11, $12, $13, $14 
	)`
	_, err := tx.ExecContext(ctx, SQL,
		user.CreatedBy, user.CreatedAt, user.LastModifiedBy, user.UpdatedAt,
		user.DeletedBy, user.DeletedAt, user.Oid, user.Email,
		user.Password, user.AndroidToken,
		user.ExpiredTime, user.IsActive, user.ActivatedAt, user.RoleOid)
	common.PanicIfError(err)
	return user
}

func (u *UserRepository) Update(ctx context.Context, tx *sql.Tx, user models.User) models.User {
	SQL := `UPDATE users SET  
		last_modified_by = $1, updated_at = $2,
		  email = $4, password = $5, android_token = $8,
		expired_time = $9, is_active = $10, activated_at = $11, role_oid = $12
		WHERE oid = $13`
	_, err := tx.ExecContext(ctx, SQL,
		user.LastModifiedBy, user.UpdatedAt,
		user.Email, user.Password, user.AndroidToken,
		user.ExpiredTime, user.IsActive, user.ActivatedAt, user.RoleOid, user.Oid)
	common.PanicIfError(err)
	return user
}

// Deleted implements IUserRepository.
func (u *UserRepository) Deleted(ctx context.Context, tx *sql.Tx, oid string) {
	SQL := `delete from users where oid = ?`
	_, err := tx.ExecContext(ctx, SQL, oid)
	common.PanicIfError(err)
}

func (u *UserRepository) FindAll(ctx context.Context, tx *sql.Tx) []models.User {
	SQL := `SELECT oid, email, password,  android_token,
		expired_time, is_active, activated_at, role_oid,
		created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM users`
	rows, err := tx.QueryContext(ctx, SQL)
	common.PanicIfError(err)
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		user := models.User{}
		err := ploto.Scan(rows, &user)
		common.PanicIfError(err)
		users = append(users, user)
	}
	return users
}

func (u *UserRepository) FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterUserDto) ([]models.UserJoinUserRole, error) {
	SQL := `SELECT u.oid, u.email, u.password,  u.android_token, u.expired_time, u.is_active,
	 		u.activated_at, u.role_oid,  u.created_by, u.created_at, u.last_modified_by, u.updated_at, u.deleted_by, u.deleted_at,
			ur.role_name, ur.target_type, ur.is_administrative, ur.read_state, ur.write_state, ur.create_state, ur.delete_state, ur.navigate_state 
		FROM users u 
		LEFT JOIN user_roles ur ON u.role_oid = ur.oid`

	var queryParams []interface{}
	var whereConditions []string

	if condition.Email != "" {
		whereConditions = append(whereConditions, "u.email ILIKE ?")
		queryParams = append(queryParams, fmt.Sprintf("%%%s%%", condition.Email))
	}

	if len(whereConditions) > 0 {
		SQL += " WHERE " + strings.Join(whereConditions, " AND ")
	}

	rows, err := tx.QueryContext(ctx, SQL, queryParams...)
	common.PanicIfError(err)
	defer rows.Close()

	var users []models.UserJoinUserRole
	for rows.Next() {
		var user models.UserJoinUserRole
		err := ploto.Scan(rows, &user)
		common.PanicIfError(err)
		users = append(users, user)
	}
	return users, err
}

func (u *UserRepository) FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterUserDto) (int64, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	queryBuilder.WriteString(`SELECT count(oid) FROM users`)

	var whereClauses []string
	if condition.Email != "" {
		whereClauses = append(whereClauses, "email ILIKE ?")
		args = append(args, "%"+condition.Email+"%")
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

func (u *UserRepository) AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterUserDto) ([]models.User, error) {
	var queryBuilder strings.Builder
	var args []interface{}
	var whereClauses []string

	queryBuilder.WriteString(`
		SELECT u.oid, u.email, u.password, u.android_token, u.expired_time, u.is_active,
		       u.activated_at, u.role_oid, u.created_by, u.created_at, u.last_modified_by,
		       u.updated_at, u.deleted_by, u.deleted_at,
		       ur.role_name, ur.target_type, ur.is_administrative, ur.read_state,
		       ur.write_state, ur.create_state, ur.delete_state, ur.navigate_state 
		FROM users u 
		LEFT JOIN user_roles ur ON u.role_oid = ur.oid
	`)

	if condition.Email != "" {
		args = append(args, "%"+condition.Email+"%")
		whereClauses = append(whereClauses, fmt.Sprintf("u.email ILIKE $%d", len(args)))
	}

	if len(whereClauses) > 0 {
		queryBuilder.WriteString(" WHERE ")
		queryBuilder.WriteString(strings.Join(whereClauses, " AND "))
	}

	sqlQuery := queryBuilder.String()

	rows, err := tx.QueryContext(ctx, sqlQuery, args...)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %w", err)
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		err := ploto.Scan(rows, &user)
		common.PanicIfError(err)
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return users, nil
}

func (u *UserRepository) FindById(ctx context.Context, tx *sql.Tx, oid string) (models.UserJoinUserRole, error) {
	SQL := `SELECT u.oid, u.name, u.email, u.password,  u.android_token, u.expired_time, u.is_active,
	 		u.activated_at, u.role_oid, u.created_by, u.created_at, u.last_modified_by, u.updated_at, u.deleted_by, u.deleted_at,
			ur.role_name, ur.target_type, ur.is_administrative, ur.read_state, ur.write_state, ur.create_state, ur.delete_state, ur.navigate_state 
		FROM users u 
		LEFT JOIN user_roles ur ON u.role_oid = ur.oid 
		WHERE u.oid = ?`

	rows, err := tx.QueryContext(ctx, SQL, oid)
	common.PanicIfError(err)
	defer rows.Close()

	var user models.UserJoinUserRole
	if rows.Next() {
		err := ploto.Scan(rows, &user)
		common.PanicIfError(err)
		return user, nil
	}
	return user, errors.New("User is not found")
}

func (u *UserRepository) FindByMiniId(ctx context.Context, tx *sql.Tx, oid string) (models.User, error) {
	SQL := `SELECT oid, email, password, android_token, expired_time, is_active,
	 		activated_at, role_oid, created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
		FROM users WHERE oid = ?`

	rows, err := tx.QueryContext(ctx, SQL, oid)
	common.PanicIfError(err)
	defer rows.Close()

	var user models.User
	if rows.Next() {
		err := ploto.Scan(rows, &user)
		common.PanicIfError(err)
		return user, nil
	}
	return user, errors.New("User is not found")
}

func (u *UserRepository) FindUserRole(ctx context.Context, tx *sql.Tx, email string) (string, error) {
	var queryBuilder strings.Builder
	var whereClauses []string
	var args []interface{}

	queryBuilder.WriteString(`SELECT u.oid, u.email, u.password, u.android_token,
				u.expired_time, u.is_active, u.activated_at, u.role_oid, ur.role_name
				FROM users u 
				LEFT JOIN user_roles ur ON u.role_oid = ur.oid`)

	if email != "" {
		whereClauses = append(whereClauses, "u.email ILIKE ?")
		args = append(args, "%"+email+"%")
	}
	if len(whereClauses) > 0 {
		queryBuilder.WriteString(" WHERE ")
		queryBuilder.WriteString(strings.Join(whereClauses, " AND "))
	}

	SQL := queryBuilder.String()
	rows, err := tx.QueryContext(ctx, SQL, args...)
	common.PanicIfError(err)
	defer rows.Close()

	var users []models.UserJoinUserRole
	for rows.Next() {
		var user models.UserJoinUserRole
		err := ploto.Scan(rows, &user)
		common.PanicIfError(err)
		users = append(users, user)
	}
	if len(users) == 0 {
		return "", errors.New("user not found")
	}
	return users[0].RoleName, nil
}

func NewUserRepository() IUserRepository {
	return &UserRepository{}
}
