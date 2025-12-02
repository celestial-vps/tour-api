package repositories

import (
	"context"

	"shipping-api/dtos"
	"shipping-api/models"

	"gorm.io/gorm"
)

type IBankRepository interface {
	Save(ctx context.Context, DB *gorm.DB, bank models.Bank) models.Bank
	Update(ctx context.Context, DB *gorm.DB, bank models.Bank) models.Bank
	Deleted(ctx context.Context, DB *gorm.DB, oid string)
	FindAll(ctx context.Context, DB *gorm.DB) []models.Bank
	FindByCriteriaPage(ctx context.Context, DB *gorm.DB, page int, pageSize int, condition dtos.FilterBankDto) ([]models.Bank, error)
	FindCountByCriteria(ctx context.Context, DB *gorm.DB, condition dtos.FilterBankDto) (int64, error)
	AdvanceFlter(ctx context.Context, DB *gorm.DB, condition dtos.FilterBankDto) ([]models.Bank, error)
	FindById(ctx context.Context, DB *gorm.DB, oid string) (models.Bank, error)
	FindGetLastData(ctx context.Context, DB *gorm.DB) (string, error)
}
