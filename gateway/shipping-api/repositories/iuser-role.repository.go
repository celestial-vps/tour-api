package repositories

import (
	"context"

	"shipping-api/dtos"
	"shipping-api/models"
	"gorm.io/gorm"
)

type IUserRoleRepository interface {
	Save(ctx context.Context, DB *gorm.DB, userRole models.UserRole) models.UserRole
	Update(ctx context.Context, DB *gorm.DB, userRole models.UserRole) models.UserRole
	Deleted(ctx context.Context, DB *gorm.DB, oid string)
	FindAll(ctx context.Context, DB *gorm.DB) []models.UserRole
	FindByCriteriaPage(ctx context.Context, DB *gorm.DB, page int, pageSize int, condition dtos.FilterUserRoleDto) ([]models.UserRole, error)
	FindCountByCriteria(ctx context.Context, DB *gorm.DB, condition dtos.FilterUserRoleDto) (int64, error)
	AdvanceFlter(ctx context.Context, DB *gorm.DB, condition dtos.FilterUserRoleDto) ([]models.UserRole, error)
	FindById(ctx context.Context, DB *gorm.DB, oid string) (models.UserRole, error)
}
