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

// Save implements IUserRepository.
func (u *UserRepository) Save(ctx context.Context, tx *sql.Tx, user models.User) models.User {
	SQL := `insert into users(, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt,
				oid, name, email, password, birthday, memberNumber, androidToken, expiredTime, isActive, activatedAt, roleOid)
			 	values (?,?,?,?,?,?,
				?,?,?,?,?,?,?,?,?,?,?)`
	_, err := tx.ExecContext(ctx, SQL, user.CreatedBy, user.CreatedAt,
		user.LastModifiedBy, user.UpdatedAt, user.DeletedBy, user.DeletedAt,
		user.Oid, user.Name, user.Email, user.Password, user.Birthday, user.MemberNumber,
		user.AndroidToken, user.ExpiredTime, user.IsActive, user.ActivatedAt, user.RoleOid)
	common.PanicIfError(err)
	return user
}

// Update implements IUserRepository.
func (u *UserRepository) Update(ctx context.Context, tx *sql.Tx, user models.User) models.User {
	SQL := `update users set  lastModifiedBy = ?, updatedAt = ?,
				name = ?,email = ?,password = ?,birthday=?, memberNumber = ?,androidToken = ? ,
				expiredTime = ?,isActive = ?,activatedAt = ?,roleOid = ?
				where oid = ?`
	_, err := tx.ExecContext(ctx, SQL, user.LastModifiedBy, user.UpdatedAt,
		user.Name, user.Email, user.Password, user.Birthday, user.MemberNumber, user.AndroidToken,
		user.ExpiredTime, user.IsActive, user.ActivatedAt, user.RoleOid,
		user.Oid)
	common.PanicIfError(err)

	return user
}

// Deleted implements IUserRepository.
func (u *UserRepository) Deleted(ctx context.Context, tx *sql.Tx, oid string) {
	SQL := `delete from users where oid = ?`
	_, err := tx.ExecContext(ctx, SQL, oid)
	common.PanicIfError(err)
}

// FindAll implements IUserRepository.
func (u *UserRepository) FindAll(ctx context.Context, tx *sql.Tx) []models.User {
	SQL := `select oid, name, email, password, birthday, memberNumber, androidToken, expiredTime, isActive, activatedAt, roleOid, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt from users `
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

// FindByCriteriaPage implements IUserRepository.
func (u *UserRepository) FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterUserDto) ([]models.UserJoinUserRole, error) {
	SQL := `SELECT u.oid, u.name, u.email, u.password, u.birthday, u.memberNumber, u.androidToken, u.expiredTime, u.isActive,
	 		u.activatedAt, u.roleOid,  u.createdBy, u.createdAt, u.lastModifiedBy, u.updatedAt, u.deletedBy, u.deletedAt,
			ur.roleName, ur.targetType, ur.isAdministrative, ur.readState, ur.writeState, ur.createState, ur.deleteState, ur.navigateState 
		FROM users u left join user_roles ur on u.roleOid = ur.oid`
	var queryParams []interface{}

	// Construct WHERE clause based on filter conditions
	var whereConditions []string
	if condition.Email != "" {
		whereConditions = append(whereConditions, "u.email LIKE ?")
		queryParams = append(queryParams, fmt.Sprintf("%%%s%%", condition.Email))
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

	var users []models.UserJoinUserRole
	for rows.Next() {
		user := models.UserJoinUserRole{}
		err := ploto.Scan(rows, &user)
		common.PanicIfError(err)
		users = append(users, user)
	}
	return users, err
}

// FindCountByCriteria implements IUserRepository.
func (u *UserRepository) FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterUserDto) (int64, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	// Start building the SQL query
	queryBuilder.WriteString(`SELECT count(oid) FROM users`)

	// Add WHERE clause if necessary
	var whereClauses []string
	if condition.Email != "" {
		whereClauses = append(whereClauses, "email LIKE ?")
		args = append(args, "%"+condition.Email+"%")
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

// AdvanceFlter implements IUserRepository.
func (u *UserRepository) AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterUserDto) ([]models.User, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	// Start building the SQL query
	queryBuilder.WriteString(`SELECT u.oid, u.name, u.email, u.password, u.birthday, u.memberNumber, u.androidToken, u.expiredTime, u.isActive,
	 		u.activatedAt, u.roleOid, u.createdBy, u.createdAt, u.lastModifiedBy, u.updatedAt, u.deletedBy, u.deletedAt,
			ur.roleName, ur.targetType, ur.isAdministrative, ur.readState, ur.writeState, ur.createState, ur.deleteState, ur.navigateState 
		FROM users u left join user_roles ur on u.roleOid = ur.oid`)

	// Add WHERE clause if necessary
	var whereClauses []string
	if condition.Email != "" {
		whereClauses = append(whereClauses, "email LIKE ?")
		args = append(args, "%"+condition.Email+"%")
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
	var users []models.User
	for rows.Next() {
		user := models.User{}
		err := ploto.Scan(rows, &user)
		common.PanicIfError(err)
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return users, nil
}

// FindById implements IUserRepository.
func (u *UserRepository) FindById(ctx context.Context, tx *sql.Tx, oid string) (models.UserJoinUserRole, error) {
	SQL := `SELECT u.oid, u.name, u.email, u.password, u.birthday, u.memberNumber, u.androidToken, u.expiredTime, u.isActive,
	 		u.activatedAt, u.roleOid, u.createdBy, u.createdAt, u.lastModifiedBy, u.updatedAt, u.deletedBy, u.deletedAt,
			ur.roleName, ur.targetType, ur.isAdministrative, ur.readState, ur.writeState, ur.createState, ur.deleteState, ur.navigateState 
		FROM users u left join user_roles ur on u.roleOid = ur.oid where u.oid = ?`
	rows, err := tx.QueryContext(ctx, SQL, oid)
	common.PanicIfError(err)
	defer rows.Close()

	user := models.UserJoinUserRole{}
	if rows.Next() {
		err := ploto.Scan(rows, &user)
		common.PanicIfError(err)
		return user, nil
	} else {
		return user, errors.New("User is not found")
	}
}

// FindById implements IUserRepository.
func (u *UserRepository) FindByMiniId(ctx context.Context, tx *sql.Tx, oid string) (models.User, error) {
	SQL := `SELECT oid, name, email, password, birthday, memberNumber, androidToken, expiredTime, isActive,
	 		activatedAt, roleOid, createdBy, createdAt, lastModifiedBy, updatedAt, deletedBy, deletedAt			
		FROM users  where u.oid = ?`
	rows, err := tx.QueryContext(ctx, SQL, oid)
	common.PanicIfError(err)
	defer rows.Close()

	user := models.User{}
	if rows.Next() {
		err := ploto.Scan(rows, &user)
		common.PanicIfError(err)
		return user, nil
	} else {
		return user, errors.New("User is not found")
	}
}

// FindUserRole implements IUserRepository.
func (u *UserRepository) FindUserRole(ctx context.Context, tx *sql.Tx, email string) (string, error) {
	var queryBuilder strings.Builder
	var whereClauses []string
	var args []interface{}

	// if filter, ok := criterias["criteria"]; ok {
	// 	if whereVal, ok := filter.(string); ok && whereVal != "" {
	// 		whereClause = whereVal
	// 	}
	// }
	queryBuilder.WriteString(`select u.oid, u.name, u.email, u.password, u.birthday, u.memberNumber, u.androidToken,
				u.expiredTime, u.isActive, u.activatedAt, u.roleOid,ur.roleName
				from users u left join user_roles ur on u.roleOid = ur.oid`)

	if email != "" {
		whereClauses = append(whereClauses, "email LIKE ?")
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
		user := models.UserJoinUserRole{}
		err := ploto.Scan(rows, &user)
		common.PanicIfError(err)
		users = append(users, user)
	}
	return users[0].RoleName, nil
}

func NewUserRepository() IUserRepository {
	return &UserRepository{}
}

// func (repository *UserRepository) FindCountByCriteria(ctx context.Context, tx *sql.Tx, criterias map[string]interface{}) int64 {
// 	whereClause := ""
// 	if filter, ok := criterias["criteria"]; ok {
// 		if whereVal, ok := filter.(string); ok && whereVal != "" {
// 			whereClause = whereVal
// 		}
// 	}
// 	SQL := `select  count(oid) from users ` + whereClause
// 	var count int64
// 	err := tx.QueryRowContext(ctx, SQL).Scan(&count)
// 	common.PanicIfError(err)
// 	return count
// }

// func (repository *UserRepository) FindByCriteria(ctx context.Context, tx *sql.Tx, criterias interface{}) ([]models.User, error) {
// 	var queryBuilder strings.Builder
// 	filterCondition, ok := criterias.(dtos.LoginDto)
// 	var args []interface{}

// 	if !ok {
// 		return nil, fmt.Errorf("invalid condition type: %T", criterias)
// 	}

// 	queryBuilder.WriteString(`select  deleted, userInserted, insertedDate, lastUserId, lastUpdate,
// 	 		oid,name, email, password, age, birthday, member_number, android_token,
// 	 		expired_time, is_active, activated_at, role_id, created_at, updated_at
// 	 		from user `)

// 	// Add WHERE clause if necessary
// 	var whereClauses []string
// 	if filterCondition.Email != "" {
// 		whereClauses = append(whereClauses, "emamil LIKE ?")
// 		args = append(args, "%"+filterCondition.Email+"%")
// 	}

// 	if len(whereClauses) > 0 {
// 		queryBuilder.WriteString(" WHERE ")
// 		queryBuilder.WriteString(strings.Join(whereClauses, " AND "))
// 	}
// 	SQL := queryBuilder.String()

// 	rows, err := tx.QueryContext(ctx, SQL, args...)
// 	common.PanicIfError(err)
// 	defer rows.Close()

// 	var users []models.User
// 	for rows.Next() {
// 		user := models.User{}
// 		err := ploto.Scan(rows, &user)
// 		common.PanicIfError(err)
// 		users = append(users, user)
// 	}
// 	return users, nil
// }

// // func (repository *UserRepository) FindRoleByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterUserRoleDto) []models.UserJoinUserRole {
// //
// // }

// func (repository *UserRepository) Find(ctx context.Context, tx *sql.Tx, criterias map[string]interface{}, page, pageSize int) []models.User {
// 	whereClause := ""
// 	if filter, ok := criterias["criteria"]; ok {
// 		if whereVal, ok := filter.(string); ok && whereVal != "" {
// 			whereClause = whereVal
// 		}
// 	}
// 	SQL := `select   deleted, userInserted, insertedDate, lastUserId, lastUpdate,
// 			oid,name, email, password, age, birthday, member_number, android_token,
// 			expired_time, is_active, activated_at, role_id, created_at, updated_at
// 			from user ` + whereClause
// 	rows, err := tx.QueryContext(ctx, SQL)
// 	common.PanicIfError(err)
// 	defer rows.Close()

// 	var users []models.User
// 	for rows.Next() {
// 		user := models.User{}
// 		err := ploto.Scan(rows, &user)
// 		common.PanicIfError(err)
// 		users = append(users, user)
// 	}
// 	return users
// }

// func (repository *UserRepository) FindById(ctx context.Context, tx *sql.Tx, oid string) (models.User, error) {

// }
