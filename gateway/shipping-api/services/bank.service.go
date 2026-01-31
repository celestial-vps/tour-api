package services

import (
	"context"
	"encoding/json"
	"fmt"

	"time"

	"shipping-api/dtos"
	"shipping-api/mappings"
	"shipping-api/middleware"
	"shipping-api/models"
	"shipping-api/repositories"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type BankService struct {
	BankRepository repositories.IBankRepository
	DB             *gorm.DB
	Validate       *validator.Validate
	RedisClient    *redis.Client // Redis client
}

func NewBankService(bankRepository repositories.IBankRepository, redisClient *redis.Client, DB *gorm.DB, validate *validator.Validate) IBankService {
	return &BankService{
		BankRepository: bankRepository,
		RedisClient:    redisClient,
		DB:             DB,
		Validate:       validate,
	}
}

func (service *BankService) Create(ctx context.Context, request dtos.CreateBankDto, userOid string) (mappings.MessageVm, error) {
	var (
		err     error
		bank    models.Bank
		newData map[string]interface{}
	)

	defer func() {
		if err != nil {
			middleware.Failed(ctx, "CREATE", "banks", userOid, nil, err)
		} else {
			middleware.Success(ctx, "CREATE", "banks", userOid, bank.Oid.String(), newData)
		}
	}()

	// Parse userOid
	createdBy, err := uuid.Parse(userOid)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("invalid userOid: %w", err)
	}

	// Get last bank code
	code, err := service.BankRepository.FindGetLastData(ctx, service.DB)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("failed to get last bank code: %w", err)
	}

	// Build bank model
	bank = models.Bank{
		Oid:       uuid.New(),
		BankCode:  code,
		BankName:  request.BankName,
		ShortName: request.ShortName,
		TransactionRecord: models.TransactionRecord{
			CreatedBy: createdBy,
			CreatedAt: time.Now(),
		},
	}

	// Save bank
	bank, err = service.BankRepository.Save(ctx, service.DB, bank)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("failed to save bank: %w", err)
	}

	// Prepare newData for audit
	newData = map[string]interface{}{
		"BankCode":  bank.BankCode,
		"BankName":  bank.BankName,
		"ShortName": bank.ShortName,
	}

	messageVm := mappings.MessageVm{
		Value: bank.Oid.String(),
		Name:  bank.BankName,
	}

	// Fetch all banks and update Redis
	banks, err := service.BankRepository.FindAll(ctx, service.DB)
	if err != nil {
		return messageVm, fmt.Errorf("failed to fetch all banks: %w", err)
	}

	banksJSON, err := json.Marshal(banks)
	if err != nil {
		return messageVm, fmt.Errorf("failed to marshal banks: %w", err)
	}

	err = service.RedisClient.Set(ctx, "bank", banksJSON, 0).Err()
	if err != nil {
		return messageVm, fmt.Errorf("failed to update Redis: %w", err)
	}

	return messageVm, nil
}

func (service *BankService) Update(ctx context.Context, request dtos.UpdateBankDto, oid string, userOid string) (mappings.MessageVm, error) {
	var (
		err     error
		bank    models.Bank
		newData map[string]interface{}
	)

	defer func() {
		if err != nil {
			middleware.Failed(ctx, "UPDATE", "banks", userOid, nil, err)
		} else {
			middleware.Success(ctx, "UPDATE", "banks", userOid, bank.Oid.String(), newData)
		}
	}()

	// Validate request
	err = service.Validate.Struct(request)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("validation failed: %w", err)
	}

	// Parse userOid
	lastModifiedBy, err := uuid.Parse(userOid)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("invalid userOid: %w", err)
	}

	// Find bank
	bank, err = service.BankRepository.FindById(ctx, service.DB, oid)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("bank not found: %w", err)
	}

	// Update bank fields
	now := time.Now()
	bank.BankCode = request.BankCode
	bank.BankName = request.BankName
	bank.ShortName = request.ShortName
	bank.TransactionRecord.LastModifiedBy = lastModifiedBy
	bank.TransactionRecord.UpdatedAt = &now

	// Save update
	bank, err = service.BankRepository.Update(ctx, service.DB, bank)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("failed to update bank: %w", err)
	}

	// Prepare audit data
	newData = map[string]interface{}{
		"BankCode":  bank.BankCode,
		"BankName":  bank.BankName,
		"ShortName": bank.ShortName,
	}

	messageVm := mappings.MessageVm{
		Value: bank.Oid.String(),
		Name:  bank.BankName,
	}

	return messageVm, nil
}

func (service *BankService) Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error) {
	var (
		err  error
		bank models.Bank
	)

	defer func() {
		if err != nil {
			middleware.Failed(ctx, "DELETE", "banks", userOid, nil, err)
		} else {
			middleware.Success(ctx, "DELETE", "banks", userOid, bank.Oid.String(), nil)
		}
	}()

	// Cari bank
	bank, err = service.BankRepository.FindById(ctx, service.DB, oid)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("bank not found: %w", err)
	}

	// Hapus bank
	err = service.BankRepository.Deleted(ctx, service.DB, oid)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("failed to delete bank: %w", err)
	}

	messageVm := mappings.MessageVm{
		Value: bank.Oid.String(),
		Name:  bank.BankName,
	}

	return messageVm, nil
}

func (service *BankService) FindAll(ctx context.Context) ([]mappings.BankVm, error) {
	banks, err := service.BankRepository.FindAll(ctx, service.DB)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch banks: %w", err)
	}

	return mappings.ToBankResponses(banks), nil
}

func (service *BankService) FindAllRedis(ctx context.Context) ([]mappings.BankVm, error) {
	banksJSON, err := service.RedisClient.Get(ctx, "bank").Result()
	if err != nil {
		if err == redis.Nil {
			return nil, fmt.Errorf("bank data not found in Redis: %w", err)
		}
		return nil, fmt.Errorf("failed to get bank data from Redis: %w", err)
	}

	var banks []models.Bank
	err = json.Unmarshal([]byte(banksJSON), &banks)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal bank data from Redis: %w", err)
	}

	return mappings.ToBankResponses(banks), nil
}

func (service *BankService) FindPage(ctx context.Context, condition dtos.FilterBankDto, page, pageSize int) ([]mappings.BankVm, int64, error) {
	// Hitung total record
	count, err := service.BankRepository.FindCountByCriteria(ctx, service.DB, condition)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count banks: %w", err)
	}

	// Ambil data page
	banks, err := service.BankRepository.FindByCriteriaPage(ctx, service.DB, page, pageSize, condition)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to fetch bank page: %w", err)
	}

	return mappings.ToBankResponses(banks), count, nil
}

func (service *BankService) FindById(ctx context.Context, oid string) (mappings.BankVm, error) {
	bank, err := service.BankRepository.FindById(ctx, service.DB, oid)
	if err != nil {
		return mappings.BankVm{}, fmt.Errorf("bank not found: %w", err)
	}

	return mappings.ToBankResponse(bank), nil
}
