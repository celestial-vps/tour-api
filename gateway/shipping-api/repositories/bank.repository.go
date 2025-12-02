package repositories

import (
	"context"
	"fmt"
	"time"

	"shipping-api/common"
	"shipping-api/dtos"
	"shipping-api/misc"
	"shipping-api/models"

	"gorm.io/gorm"
)

type BankRepository struct {
}

// FindGetLastData implements IBankRepository.
func (repository *BankRepository) FindGetLastData(ctx context.Context, DB *gorm.DB) (string, error) {
	var lastBank models.Bank

	if err := DB.Order("createdAt desc").First(&lastBank).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			currentTime := time.Now()
			month := currentTime.Month() // Get current month
			year := currentTime.Year()   // Get current year
			return fmt.Sprintf("B-000001/HRD/%02d/%d", month, year), nil
		}
		return "", fmt.Errorf("failed to query last bank data: %w", err)
	} else {
		// If records exist, parse the last bank code
		lastCode := lastBank.BankCode
		nextCode, err := misc.IncrementData(lastCode)
		if err != nil {
			common.PanicIfError(err)
		}
		return nextCode, err
	}
}

func NewBankRepository() IBankRepository {
	return &BankRepository{}
}

func (repository *BankRepository) Save(ctx context.Context, DB *gorm.DB, bank models.Bank) models.Bank {

	result := DB.Create(&bank)
	if result.Error != nil {
		common.PanicIfError(result.Error)
	}

	return bank
}

func (repository *BankRepository) Update(ctx context.Context, DB *gorm.DB, bank models.Bank) models.Bank {

	err := DB.WithContext(ctx).Save(bank).Error
	if err != nil {
		common.PanicIfError(err)
	}
	return bank
}

// func (repository *BankRepository) Deleted(ctx context.Context, DB *gorm.DB, bank models.Bank, oid string) {
func (repository *BankRepository) Deleted(ctx context.Context, DB *gorm.DB, oid string) {
	// err := DB.WithContext(ctx).Delete(&bank).Error	// soft delete because  the model DeletedAt      gorm.DeletedAt `gorm:"column:deletedAt"`
	// err := DB.WithContext(ctx).Delete(&models.Bank{}, "oid = ?", oid).Error				// soft delete
	result := DB.WithContext(ctx).Unscoped().Delete(&models.Bank{}, "oid = ?", oid) // hard delete
	if result.Error != nil {
		common.PanicIfError(result.Error)
	}
	if result.RowsAffected == 0 {
		common.PanicIfError(result.Error)
	}

}

func (repository *BankRepository) FindAll(ctx context.Context, DB *gorm.DB) []models.Bank {
	// sqlDB, err := DB.DB()
	// if err != nil {
	// 	common.PanicIfError(err)
	// }
	// sqlDB.SetMaxOpenConns(100) // Adjust the number as needed
	// sqlDB.SetMaxIdleConns(10)  // Adjust the number as needed
	// sqlDB.SetConnMaxLifetime(0)

	var banks []models.Bank
	result := DB.Find(&banks)
	if result.Error != nil {
		common.PanicIfError(result.Error)
	}
	return banks
}

// FindCountByCriteria implements IBankRepository.
func (repository *BankRepository) FindCountByCriteria(ctx context.Context, DB *gorm.DB, condition dtos.FilterBankDto) (int64, error) {
	var count int64
	// Initialize the query
	query := DB.WithContext(ctx).Model(&models.Bank{})
	// Build the condition based on the filter values
	if condition.BankCode != "" {
		query = query.Where("bankCode LIKE ?", "%"+condition.BankCode+"%")
	}
	if condition.BankName != "" {
		query = query.Or("bankName LIKE ?", "%"+condition.BankName+"%")
	}

	// Count total customers matching the condition
	err := query.Count(&count).Error
	if err != nil {
		return 0, err
	}

	return count, nil
}

// AdvanceFlter implements IBankRepository.
func (repository *BankRepository) AdvanceFlter(ctx context.Context, DB *gorm.DB, condition dtos.FilterBankDto) ([]models.Bank, error) {
	var banks []models.Bank

	// Initialize the query
	query := DB.WithContext(ctx).Model(&models.Bank{})
	// Build the condition based on the filter values
	if condition.BankCode != "" {
		query = query.Where("bankCode LIKE ?", "%"+condition.BankCode+"%")
	}
	if condition.BankName != "" {
		query = query.Or("bankName LIKE ?", "%"+condition.BankName+"%")
	}

	// Retrieve the paginated records
	err := query.Find(&banks).Error
	if err != nil {
		common.PanicIfError(err)
	}

	return banks, nil
}

// FindByCriteriaPage implements IBankRepository.
func (repository *BankRepository) FindByCriteriaPage(ctx context.Context, DB *gorm.DB, page int, pageSize int, condition dtos.FilterBankDto) ([]models.Bank, error) {
	var banks []models.Bank

	// Initialize the query
	query := DB.WithContext(ctx).Model(&models.Bank{})
	// Build the condition based on the filter values
	if condition.BankCode != "" {
		query = query.Where("bankCode LIKE ?", "%"+condition.BankCode+"%")
	}
	if condition.BankName != "" {
		query = query.Or("bankName LIKE ?", "%"+condition.BankName+"%")
	}

	// Retrieve the paginated records
	err := query.Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&banks).Error
	if err != nil {
		common.PanicIfError(err)
	}

	return banks, nil
}

// FindById implements IBankRepository.
func (repository *BankRepository) FindById(ctx context.Context, DB *gorm.DB, oid string) (models.Bank, error) {
	var bank models.Bank
	err := DB.WithContext(ctx).Where("oid = ?", oid).First(&bank).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			panic(common.NewNotFoundError(err.Error()))
		} else {
			common.PanicIfError(err)
		}
	}
	return bank, err
}

// // FindByCriteria implements IBankRepository.
// func (repository *BankRepository) FindByCriteriaPage(ctx context.Context, DB *gorm.DB, condition dtos.FilterBankDto, page int, pageSize int) ([]models.Bank, error) {
// 	var banks []models.Bank

// 	// Initialize the query
// 	query := DB.WithContext(ctx).Model(&models.Bank{})
// 	// Build the condition based on the filter values
// 	if condition.BankCode != "" {
// 		query = query.Where("bankCode LIKE ?", "%"+condition.BankCode+"%")
// 	}
// 	if condition.BankName != "" {
// 		query = query.Or("bankName LIKE ?", "%"+condition.BankName+"%")
// 	}

// 	// Count total customers matching the condition
// 	// err := query.Count(&count).Error
// 	// if err != nil {
// 	// 	return nil, 0, err
// 	// }
// 	// Retrieve the paginated records
// 	err := query.Offset((page - 1) * pageSize).
// 		Limit(pageSize).
// 		Find(&banks).Error
// 	if err != nil {
// 		common.PanicIfError(err)
// 	}

// 	return banks, nil
// }

// // FindCountByCriteria implements IBankRepository.
// func (repository *BankRepository) FindCountByCriteria(ctx context.Context, DB *gorm.DB, condition dtos.FilterBankDto) (int64, error) {
// 	var count int64

// 	// Initialize the query
// 	query := DB.WithContext(ctx).Model(&models.Bank{})
// 	if condition.BankCode != "" {
// 		query = query.Where("bankCode LIKE ?", "%"+condition.BankCode+"%")
// 	}
// 	if condition.BankName != "" {
// 		query = query.Or("bankName LIKE ?", "%"+condition.BankName+"%")
// 	}

// 	// Count the total number of records matching the condition
// 	err := query.Count(&count).Error
// 	common.PanicIfError(err)
// 	return count, nil
// }

// func (repository *BankRepository) FindCountByCriteria(ctx context.Context, DB *gorm.DB, condition interface{}) (int64, error) {
// 	var count int64
// 	filterCondition, ok := condition.(dtos.FilterBankDto)
// 	if !ok {
// 		return 0, fmt.Errorf("invalid condition type: %T", condition)
// 		// common.PanicIfError("invalid condition type: " condition)
// 	}

// 	// Initialize the query
// 	query := DB.WithContext(ctx).Model(&models.Bank{})

// 	// Apply conditions based on available filter values
// 	if filterCondition.BankCode != "" {
// 		query = query.Where("bankCode LIKE ?", "%"+filterCondition.BankCode+"%")
// 	}
// 	if filterCondition.BankName != "" {
// 		query = query.Where("bankName LIKE ?", "%"+filterCondition.BankName+"%")
// 	}

// 	// Count the total number of records matching the condition
// 	err := query.Count(&count).Error
// 	common.PanicIfError(err)
// 	return count, nil
// }

// func (repository *BankRepository) FindByCriteria(ctx context.Context, DB *gorm.DB, condition interface{}, page, pageSize int) ([]models.Bank,error)  {
// 	var banks []models.Bank
// 	// Type assertion to ensure condition is of the expected type
// 	filterCondition, ok := condition.(dtos.FilterBankDto)
// 	if !ok {
// 		return nil, fmt.Errorf("invalid condition type: %T", condition)
// 		// common.PanicIfError("invalid condition type: " condition)
// 	}

// 	// Initialize the query
// 	query := DB.WithContext(ctx).Model(&models.Bank{})

// 	// Apply conditions based on available filter values
// 	if filterCondition.BankCode != "" {
// 		query = query.Where("bankCode LIKE ?", "%"+filterCondition.BankCode+"%")
// 	}
// 	if filterCondition.BankName != "" {
// 		query = query.Where("bankName LIKE ?", "%"+filterCondition.BankName+"%")
// 	}

// 	// Retrieve the paginated records
// 	err := query.Offset((page - 1) * pageSize).
// 		Limit(pageSize).
// 		Find(&banks).Error
// 	if err != nil {
// 		common.PanicIfError(err)
// 	}

// 	return banks,nil
// }
