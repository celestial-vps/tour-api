package services

import (
	"context"
	"encoding/json"

	"time"

	"shipping-api/common"
	"shipping-api/dtos"
	"shipping-api/mappings"
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

// func (service *BankService) Create(ctx context.Context, request dtos.CreateBankDto, userOid string) mappings.MessageVm {
// 	createdBy, err := uuid.Parse(userOid)
// 	if err != nil {
// 		common.PanicIfError(err)
// 	}

// 	code, err := service.BankRepository.FindGetLastData(ctx, service.DB)
// 	if err != nil {
// 		common.PanicIfError(err)
// 	}

// 	bank := models.Bank{
// 		Oid:       uuid.New(),
// 		BankCode:  code, // request.BankCode,
// 		BankName:  request.BankName,
// 		ShortName: request.ShortName,
// 		TransactionRecord: models.TransactionRecord{
// 			CreatedBy: createdBy,
// 			CreatedAt: time.Now(),
// 		},
// 	}
// 	bank = service.BankRepository.Save(ctx, service.DB, bank)
// 	messageVm := mappings.MessageVm{
// 		Value: bank.Oid.String(),
// 		Name:  bank.BankName,
// 	}
// 	banks := service.BankRepository.FindAll(ctx, service.DB)

// 	err = service.RedisClient.Set(ctx, "banks", banks, 0).Err()
// 	if err != nil {
// 		common.PanicIfError(err)
// 	}

//		return messageVm
//	}
func (service *BankService) Create(ctx context.Context, request dtos.CreateBankDto, userOid string) mappings.MessageVm {
	createdBy, err := uuid.Parse(userOid)
	if err != nil {
		common.PanicIfError(err)
	}

	code, err := service.BankRepository.FindGetLastData(ctx, service.DB)
	if err != nil {
		common.PanicIfError(err)
	}

	bank := models.Bank{
		Oid:       uuid.New(),
		BankCode:  code, // request.BankCode,
		BankName:  request.BankName,
		ShortName: request.ShortName,
		TransactionRecord: models.TransactionRecord{
			CreatedBy: createdBy,
			CreatedAt: time.Now(),
		},
	}

	bank = service.BankRepository.Save(ctx, service.DB, bank)

	messageVm := mappings.MessageVm{
		Value: bank.Oid.String(),
		Name:  bank.BankName,
	}

	// Fetch all banks after saving the new bank
	banks := service.BankRepository.FindAll(ctx, service.DB)

	// Step 1: Serialize the banks slice to JSON
	banksJSON, err := json.Marshal(banks)
	if err != nil {
		common.PanicIfError(err) // Handle the error appropriately
	}

	// Step 2: Store the JSON in Redis
	// err = service.RedisClient.Set(ctx, "banks", banksJSON, 0).Err()
	err = service.RedisClient.Set(ctx, "bank", banksJSON, 0).Err() // Use "bank" to match the read

	if err != nil {
		common.PanicIfError(err) // Handle the error appropriately
	}

	return messageVm
}

func (service *BankService) Update(ctx context.Context, request dtos.UpdateBankDto, oid string, userOid string) mappings.MessageVm {

	err := service.Validate.Struct(request)
	common.PanicIfError(err)
	lastModifiedBy, err := uuid.Parse(userOid)
	if err != nil {
		common.PanicIfError(err)
	}

	bank, err := service.BankRepository.FindById(ctx, service.DB, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	now := time.Now()
	bank.BankCode = request.BankCode
	bank.BankName = request.BankName
	bank.ShortName = request.ShortName
	bank.TransactionRecord.LastModifiedBy = lastModifiedBy
	bank.TransactionRecord.UpdatedAt = &now
	bank = service.BankRepository.Update(ctx, service.DB, bank)

	// return mappings.ToBankResponse(bank)
	messageVm := mappings.MessageVm{
		Value: bank.Oid.String(),
		Name:  bank.BankName,
	}
	return messageVm
}

func (service *BankService) Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm {
	// case for soft  delete
	// deletedBy, err := uuid.Parse(userOid)
	// if err != nil {
	// 	common.PanicIfError(err)
	// }

	bank, err := service.BankRepository.FindById(ctx, service.DB, oid)
	// bank.TransactionRecord.DeletedBy = deletedBy
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	// service.BankRepository.Deleted(ctx, service.DB, bank, oid)
	service.BankRepository.Deleted(ctx, service.DB, oid)
	messageVm := mappings.MessageVm{
		Value: bank.Oid.String(),
		Name:  bank.BankName,
	}
	return messageVm
}

func (service *BankService) FindAll(ctx context.Context) []mappings.BankVm {
	banks := service.BankRepository.FindAll(ctx, service.DB)

	return mappings.ToBankResponses(banks)
}

func (service *BankService) FindAllRedis(ctx context.Context) []mappings.BankVm {
	// banks := service.BankRepository.FindAll(ctx, service.DB)
	banksJSON, err := service.RedisClient.Get(ctx, "bank").Result()
	if err == redis.Nil {
		panic(common.NewNotFoundError(err.Error()))
	} else if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	var banks []models.Bank
	err = json.Unmarshal([]byte(banksJSON), &banks)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	return mappings.ToBankResponses(banks)
}

func (service *BankService) FindPage(ctx context.Context, condition dtos.FilterBankDto, page, pageSize int) ([]mappings.BankVm, int64) {
	// banks, _, err := service.BankRepository.Find(ctx, service.DB, condition, page, pageSize)

	count, err := service.BankRepository.FindCountByCriteria(ctx, service.DB, condition)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	banks, err := service.BankRepository.FindByCriteriaPage(ctx, service.DB, page, pageSize, condition)

	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	return mappings.ToBankResponses(banks), count
}

func (service *BankService) FindById(ctx context.Context, oid string) mappings.BankVm {

	bank, err := service.BankRepository.FindById(ctx, service.DB, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	return mappings.ToBankResponse(bank)
}
