package repositories

import (
	"context"

	"shipping-api/dtos"
	"shipping-api/models"

	"gorm.io/gorm"
)

type IBankRepository interface {
	// Create / Save
	Save(ctx context.Context, DB *gorm.DB, bank models.Bank) (models.Bank, error)

	// Update
	Update(ctx context.Context, DB *gorm.DB, bank models.Bank) (models.Bank, error)

	// Soft delete / Delete
	Deleted(ctx context.Context, DB *gorm.DB, oid string) error

	// Find all
	FindAll(ctx context.Context, DB *gorm.DB) ([]models.Bank, error)

	// Find with paging
	FindByCriteriaPage(ctx context.Context, DB *gorm.DB, page int, pageSize int, condition dtos.FilterBankDto) ([]models.Bank, error)

	// Count with criteria
	FindCountByCriteria(ctx context.Context, DB *gorm.DB, condition dtos.FilterBankDto) (int64, error)

	// Advanced filter
	AdvanceFlter(ctx context.Context, DB *gorm.DB, condition dtos.FilterBankDto) ([]models.Bank, error)

	// Find by id
	FindById(ctx context.Context, DB *gorm.DB, oid string) (models.Bank, error)

	// Get last bank code
	FindGetLastData(ctx context.Context, DB *gorm.DB) (string, error)
}
