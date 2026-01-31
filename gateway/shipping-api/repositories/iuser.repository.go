package repositories

import (
	"context"

	"shipping-api/dtos"
	"shipping-api/models"
	"gorm.io/gorm"
)

type IUserRepository interface {
	Save(ctx context.Context, DB *gorm.DB, user models.User) models.User
	Update(ctx context.Context, DB *gorm.DB, user models.User) models.User
	Deleted(ctx context.Context, DB *gorm.DB, oid string)
	FindAll(ctx context.Context, DB *gorm.DB) []models.User
	FindByCriteriaPage(ctx context.Context, DB *gorm.DB, page int, pageSize int, condition dtos.FilterUserDto) ([]models.User, error)
	FindCountByCriteria(ctx context.Context, DB *gorm.DB, condition dtos.FilterUserDto) (int64, error)
	AdvanceFlter(ctx context.Context, DB *gorm.DB, condition dtos.FilterUserDto) ([]models.User, error)
	FindUserRole(ctx context.Context, DB *gorm.DB, email string) (string, error)
	FindById(ctx context.Context, DB *gorm.DB, oid string) (models.User, error)
}
