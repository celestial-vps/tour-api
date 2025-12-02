package repositories

import (
	"context"

	"shipping-api/common"
	"shipping-api/dtos"
	"shipping-api/models"
	"gorm.io/gorm"
)

type UserRoleRepository struct {
}

func NewUserRoleRepository() IUserRoleRepository {
	return &UserRoleRepository{}
}

func (repository *UserRoleRepository) Save(ctx context.Context, DB *gorm.DB, userRole models.UserRole) models.UserRole {

	result := DB.Create(&userRole)
	if result.Error != nil {
		common.PanicIfError(result.Error)
	}

	return userRole
}
func (repository *UserRoleRepository) Update(ctx context.Context, DB *gorm.DB, userRole models.UserRole) models.UserRole {

	err := DB.WithContext(ctx).Save(userRole).Error
	if err != nil {
		common.PanicIfError(err)
	}
	return userRole
}

func (repository *UserRoleRepository) Deleted(ctx context.Context, DB *gorm.DB, oid string) {
	result := DB.WithContext(ctx).Unscoped().Delete(&models.UserRole{}, "oid = ?", oid) // hard delete
	if result.Error != nil {
		common.PanicIfError(result.Error)
	}
	if result.RowsAffected == 0 {
		common.PanicIfError(result.Error)
	}
}

func (repository *UserRoleRepository) FindAll(ctx context.Context, DB *gorm.DB) []models.UserRole {
	// sqlDB, err := DB.DB()
	// if err != nil {
	// 	common.PanicIfError(err)
	// }
	// sqlDB.SetMaxOpenConns(100) // Adjust the number as needed
	// sqlDB.SetMaxIdleConns(10)  // Adjust the number as needed
	// sqlDB.SetConnMaxLifetime(0)

	var userRoles []models.UserRole
	result := DB.Find(&userRoles)
	if result.Error != nil {
		common.PanicIfError(result.Error)
	}
	return userRoles
}

// FindCountByCriteria implements IUserRoleRepository.
func (repository *UserRoleRepository) FindCountByCriteria(ctx context.Context, DB *gorm.DB, condition dtos.FilterUserRoleDto) (int64, error) {
	var count int64
	// Initialize the query
	query := DB.WithContext(ctx).Model(&models.UserRole{})
	// Build the condition based on the filter values

	if condition.RoleName != "" {
		query = query.Or("roleName LIKE ?", "%"+condition.RoleName+"%")
	}

	// Count total customers matching the condition
	err := query.Count(&count).Error
	if err != nil {
		return 0, err
	}

	return count, nil
}

// AdvanceFlter implements IUserRoleRepository.
func (repository *UserRoleRepository) AdvanceFlter(ctx context.Context, DB *gorm.DB, condition dtos.FilterUserRoleDto) ([]models.UserRole, error) {
	var userRoles []models.UserRole

	// Initialize the query
	query := DB.WithContext(ctx).Model(&models.UserRole{})
	// Build the condition based on the filter values

	if condition.RoleName != "" {
		query = query.Or("roleName LIKE ?", "%"+condition.RoleName+"%")
	}

	// Retrieve the paginated records
	err := query.Find(&userRoles).Error
	if err != nil {
		common.PanicIfError(err)
	}

	return userRoles, nil
}

// FindByCriteriaPage implements IUserRoleRepository.
func (repository *UserRoleRepository) FindByCriteriaPage(ctx context.Context, DB *gorm.DB, page int, pageSize int, condition dtos.FilterUserRoleDto) ([]models.UserRole, error) {
	var userRoles []models.UserRole

	// Initialize the query
	query := DB.WithContext(ctx).Model(&models.UserRole{})
	// Build the condition based on the filter values

	if condition.RoleName != "" {
		query = query.Or("roleName LIKE ?", "%"+condition.RoleName+"%")
	}

	// Retrieve the paginated records
	err := query.Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&userRoles).Error
	if err != nil {
		common.PanicIfError(err)
	}

	return userRoles, nil
}

// FindById implements IUserRoleRepository.
func (repository *UserRoleRepository) FindById(ctx context.Context, DB *gorm.DB, oid string) (models.UserRole, error) {
	var userRole models.UserRole
	// err := DB.Joins("users").WithContext(ctx).Where("users.roleOid  = ?", oid).First(&userRole).Error
	// err := DB.WithContext(ctx).
	// 	Joins("JOIN users ON users.roleOid  = user_roles.oid"). // Correctly join on the relationship
	// 	Where("user_roles.oid = ?", oid).Error
	// First(&userRole).Error

	err := DB.WithContext(ctx).
		Preload("Users"). // Preload users related to this role
		Where("user_roles.oid = ?", oid).
		First(&userRole).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			panic(common.NewNotFoundError(err.Error()))
		} else {
			common.PanicIfError(err)
		}
	}
	return userRole, err
}
