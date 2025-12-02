package repositories

import (
	"context"
	"fmt"
	"time"

	"shipping-api/dtos"
	"shipping-api/misc"
	"shipping-api/models"

	"gorm.io/gorm"
)

type BankRepository struct {
}

func NewBankRepository() IBankRepository {
	return &BankRepository{}
}

func (repository *BankRepository) Save(ctx context.Context, DB *gorm.DB, bank models.Bank) (models.Bank, error) {

	result := DB.Create(&bank)
	if result.Error != nil {
		return models.Bank{}, result.Error
	}

	return bank, nil
}

func (repository *BankRepository) Update(ctx context.Context, DB *gorm.DB, bank models.Bank) (models.Bank, error) {
	err := DB.WithContext(ctx).Save(&bank).Error
	if err != nil {
		return models.Bank{}, err
	}
	return bank, nil
}

func (repository *BankRepository) Deleted(ctx context.Context, DB *gorm.DB, oid string) error {
	result := DB.WithContext(ctx).Unscoped().Delete(&models.Bank{}, "oid = ?", oid)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (repository *BankRepository) FindAll(ctx context.Context, DB *gorm.DB) ([]models.Bank, error) {
	var banks []models.Bank
	result := DB.WithContext(ctx).Find(&banks)
	if result.Error != nil {
		return nil, result.Error
	}
	return banks, nil
}

func (repository *BankRepository) FindCountByCriteria(ctx context.Context, DB *gorm.DB, condition dtos.FilterBankDto) (int64, error) {
	var count int64
	query := DB.WithContext(ctx).Model(&models.Bank{})

	if condition.BankCode != "" {
		query = query.Where("bank_code LIKE ?", "%"+condition.BankCode+"%")
	}
	if condition.BankName != "" {
		query = query.Where("bank_name LIKE ?", "%"+condition.BankName+"%")
	}

	if err := query.Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (repository *BankRepository) AdvanceFlter(ctx context.Context, DB *gorm.DB, condition dtos.FilterBankDto) ([]models.Bank, error) {
	var banks []models.Bank

	query := DB.WithContext(ctx).Model(&models.Bank{})

	// Build condition
	if condition.BankCode != "" {
		query = query.Where("bank_code LIKE ?", "%"+condition.BankCode+"%")
	}
	if condition.BankName != "" {
		query = query.Where("bank_name LIKE ?", "%"+condition.BankName+"%")
	}

	// Execute query
	if err := query.Find(&banks).Error; err != nil {
		return nil, err
	}

	return banks, nil
}

func (repository *BankRepository) FindByCriteriaPage(ctx context.Context, DB *gorm.DB, page int, pageSize int, condition dtos.FilterBankDto) ([]models.Bank, error) {
	var banks []models.Bank

	query := DB.WithContext(ctx).Model(&models.Bank{})

	// Build condition
	if condition.BankCode != "" {
		query = query.Where("bank_code LIKE ?", "%"+condition.BankCode+"%")
	}
	if condition.BankName != "" {
		query = query.Where("bank_name LIKE ?", "%"+condition.BankName+"%")
	}

	// Paginate
	offset := (page - 1) * pageSize
	if err := query.Offset(offset).Limit(pageSize).Find(&banks).Error; err != nil {
		return nil, err
	}

	return banks, nil
}

func (repository *BankRepository) FindById(ctx context.Context, DB *gorm.DB, oid string) (models.Bank, error) {
	var bank models.Bank
	err := DB.WithContext(ctx).Where("oid = ?", oid).First(&bank).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Return custom NotFound error, tapi tidak panic
			return models.Bank{}, fmt.Errorf("bank not found: %w", err)
		}
		return models.Bank{}, err
	}
	return bank, nil
}

func (repository *BankRepository) FindGetLastData(ctx context.Context, DB *gorm.DB) (string, error) {
	var lastBank models.Bank

	err := DB.WithContext(ctx).Order("createdAt DESC").First(&lastBank).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Tidak ada record, buat kode default
			currentTime := time.Now()
			month := currentTime.Month()
			year := currentTime.Year()
			return fmt.Sprintf("B-000001/HRD/%02d/%d", month, year), nil
		}
		return "", fmt.Errorf("failed to query last bank data: %w", err)
	}

	// Jika ada record, parse last bank code dan increment
	nextCode, err := misc.IncrementData(lastBank.BankCode)
	if err != nil {
		return "", fmt.Errorf("failed to increment bank code: %w", err)
	}

	return nextCode, nil
}
