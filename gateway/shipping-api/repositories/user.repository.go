package repositories

import (
	"context"
	"errors"
	"fmt"

	"shipping-api/common"
	"shipping-api/dtos"
	"shipping-api/models"

	"gorm.io/gorm"
)

type UserRepository struct {
}

func NewUserRepository() IUserRepository {
	return &UserRepository{}
}

func (repository *UserRepository) Save(ctx context.Context, DB *gorm.DB, user models.User) models.User {

	result := DB.Create(&user)
	fmt.Println("Executed SQL:", result.Statement.SQL.String())
	if result.Error != nil {
		common.PanicIfError(result.Error)
	}

	return user
}
func (repository *UserRepository) Update(ctx context.Context, DB *gorm.DB, user models.User) models.User {

	err := DB.WithContext(ctx).Save(user).Error
	if err != nil {
		common.PanicIfError(err)
	}
	return user
}

func (repository *UserRepository) Deleted(ctx context.Context, DB *gorm.DB, oid string) {
	result := DB.WithContext(ctx).Unscoped().Delete(&models.User{}, "oid = ?", oid) // hard delete
	if result.Error != nil {
		common.PanicIfError(result.Error)
	}
	if result.RowsAffected == 0 {
		common.PanicIfError(result.Error)
	}
}

func (repository *UserRepository) FindAll(ctx context.Context, DB *gorm.DB) []models.User {
	// sqlDB, err := DB.DB()
	// if err != nil {
	// 	common.PanicIfError(err)
	// }
	// sqlDB.SetMaxOpenConns(100) // Adjust the number as needed
	// sqlDB.SetMaxIdleConns(10)  // Adjust the number as needed
	// sqlDB.SetConnMaxLifetime(0)

	var users []models.User
	result := DB.Joins("Role").Find(&users)
	if result.Error != nil {
		common.PanicIfError(result.Error)
	}
	return users
}

// FindCountByCriteria implements IUserRepository.
func (repository *UserRepository) FindCountByCriteria(ctx context.Context, DB *gorm.DB, condition dtos.FilterUserDto) (int64, error) {
	var count int64
	// Initialize the query
	query := DB.WithContext(ctx).Model(&models.User{})
	// Build the condition based on the filter values
	if condition.Email != "" {
		query = query.Where("email LIKE ?", "%"+condition.Email+"%")
	}

	// Count total customers matching the condition
	err := query.Count(&count).Error
	if err != nil {
		return 0, err
	}

	return count, nil
}

// AdvanceFlter implements IUserRepository.
func (repository *UserRepository) AdvanceFlter(ctx context.Context, DB *gorm.DB, condition dtos.FilterUserDto) ([]models.User, error) {
	var users []models.User

	// Initialize the query
	query := DB.WithContext(ctx).Model(&models.User{})
	// Build the condition based on the filter values
	if condition.Email != "" {
		query = query.Where("email LIKE ?", "%"+condition.Email+"%")
	}

	// Retrieve the paginated records
	err := query.Joins("Role").Find(&users).Error
	if err != nil {
		common.PanicIfError(err)
	}

	return users, nil
}

// FindByCriteriaPage implements IUserRepository.
func (repository *UserRepository) FindByCriteriaPage(ctx context.Context, DB *gorm.DB, page int, pageSize int, condition dtos.FilterUserDto) ([]models.User, error) {
	var users []models.User

	// Initialize the query
	query := DB.WithContext(ctx).Model(&models.User{})
	// Build the condition based on the filter values

	if condition.Email != "" {
		query = query.Or("email LIKE ?", "%"+condition.Email+"%")
	}

	// Retrieve the paginated records
	err := query.Joins("Role").Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&users).Error
	if err != nil {
		common.PanicIfError(err)
	}

	return users, nil
}

// FindById implements IUserRepository.
func (repository *UserRepository) FindById(ctx context.Context, DB *gorm.DB, oid string) (models.User, error) {
	var user models.User
	// err := DB.WithContext(ctx).Joins("Role").Where("users.oid = ?", oid).First(&user).Error
	err := DB.WithContext(ctx).
		Joins("Role").
		Where("users.oid = ?", oid). // Use the appropriate table name
		First(&user).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			panic(common.NewNotFoundError(err.Error()))
		} else {
			common.PanicIfError(err)
		}
	}
	return user, err
}

func (repository *UserRepository) FindUserRole(ctx context.Context, DB *gorm.DB, email string) (string, error) {
	var user models.User

	err := DB.Preload("Role").
		Where("email = ?", email).
		First(&user).Error

	// err := DB.Model(&user).
	// 	Joins("JOIN user_roles ON user_roles.id = users.role_id"). // Adjust the join condition as needed
	// 	Where("users.email = ?", email).
	// 	First(&user)
	// Scan(&struct {
	// 	models.User
	// 	Name string `gorm:"column:name"`
	// }{&models.User, &role.Name}).
	// .Error

	if err != nil {
		return "", errors.New("user is not found")
	}
	if user.Role == nil {
		return "", errors.New("role not found")
	}
	return user.Role.RoleName, nil
}

// func (repository *UserRepository) FindAll(ctx context.Context, DB *gorm.DB) []models.User {
// 	var users []models.User
// 	result := DB.Find(&users)
// 	if result.Error != nil {
// 		common.PanicIfError(result.Error)
// 	}
// 	return users
// }

// func (repository *UserRepository) Find(ctx context.Context, DB *gorm.DB, condition interface{}, page, pageSize int) ([]models.User, int64, error) {
// 	var users []models.User
// 	var count int64

// 	err := DB.WithContext(ctx).Model(&models.User{}).Where(condition).Count(&count).Error
// 	common.PanicIfError(err)
// 	if err != nil {
// 		return nil, 0, err
// 	}

// 	err = DB.WithContext(ctx).Where(condition).Offset((page - 1) * pageSize).Limit(pageSize).Find(&users).Error
// 	common.PanicIfError(err)
// 	if err != nil {
// 		return nil, 0, err
// 	}
// 	return users, count, nil
// }

// func (repository *UserRepository) FindByCriteria(ctx context.Context, DB *gorm.DB, email string) (*models.User, error) {
// 	var user models.User
// 	result := DB.Where("email = ?", email).First(&user)
// 	if result.Error != nil {
// 		return nil, result.Error
// 	}
// 	return &user, nil
// }

// func (repository *UserRepository) FindById(ctx context.Context, DB *gorm.DB, oid string) (models.User, error) {
// 	var user models.User
// 	err := DB.WithContext(ctx).Where("oid = ?", oid).First(&user).Error
// 	common.PanicIfError(err)
// 	return user, err
// }
