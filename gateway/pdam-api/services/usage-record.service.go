package services

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
	"github.com/pdam-api/go-pdam-api/middleware"
	"github.com/pdam-api/go-pdam-api/models"
	"github.com/pdam-api/go-pdam-api/repositories"
)

type UsageRecordService struct {
	UsageRecordRepository repositories.IUsageRecordRepository
	ImageFileRepository   repositories.IImageFileRepository
	DB                    *sql.DB
	Validate              *validator.Validate
}

func NewUsageRecordService(usageRecordRepository repositories.IUsageRecordRepository,
	imageFileRepository repositories.IImageFileRepository,
	DB *sql.DB, validate *validator.Validate) IUsageRecordService {
	return &UsageRecordService{
		UsageRecordRepository: usageRecordRepository,
		ImageFileRepository:   imageFileRepository,
		DB:                    DB,
		Validate:              validate,
	}
}
func (service *UsageRecordService) Create(ctx context.Context, request dtos.CreateUsageRecordDto, userOid string) (mappings.MessageVm, error) {
	createdBy, err := uuid.Parse(userOid)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("invalid userOid: %w", err)
	}

	usageRecord := models.UsageRecord{
		Oid: uuid.New(),
		// MeterOid:      request.MeterOid,
		BillingMonth:  request.BillingMonth,
		StartReading:  request.StartReading,
		EndReading:    request.EndReading,
		ConsumptionM3: request.ConsumptionM3,
		TransactionRecord: models.TransactionRecord{
			CreatedBy: createdBy,
			CreatedAt: time.Now(),
		},
	}

	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "CREATE", "usageRecords", userOid, nil, fmt.Errorf("failed to begin transaction: %w", err))
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	usageRecord, err = service.UsageRecordRepository.Save(ctx, tx, usageRecord)
	if err != nil {
		middleware.Failed(ctx, "CREATE", "usageRecords", userOid, nil, fmt.Errorf("failed to save usageRecord: %w", err))
		return mappings.MessageVm{}, fmt.Errorf("failed to save usageRecord: %w", err)
	}

	messageVm := mappings.MessageVm{
		Value: usageRecord.Oid.String(),
		Name:  usageRecord.MeterOid.String(),
	}

	// Kirim audit trail success
	newData := map[string]interface{}{
		"MeterOid":     usageRecord.MeterOid,
		"BillingMonth": usageRecord.BillingMonth,
		"StartReading": usageRecord.StartReading,
		"EndReading":   usageRecord.EndReading,
		"EfectiveFrom": usageRecord.ConsumptionM3,
	}

	middleware.Success(ctx, "CREATE", "usageRecords", userOid, usageRecord.Oid.String(), newData)

	return messageVm, nil
}

func (service *UsageRecordService) Update(ctx context.Context, request dtos.UpdateUsageRecordDto, oid string, userOid string) (mappings.MessageVm, error) {
	// Validasi DTO
	if err := service.Validate.Struct(request); err != nil {
		return mappings.MessageVm{}, fmt.Errorf("validation error: %w", err)
	}

	tx, err := service.DB.Begin()
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	// Cari data lama untuk audit
	usageRecord, err := service.UsageRecordRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "UPDATE", "usageRecords", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf(common.NewNotFoundError("usageRecord not found").Error)
	}

	// Update data
	now := time.Now()
	// usageRecord.MeterOid = request.MeterOid
	usageRecord.BillingMonth = request.BillingMonth
	usageRecord.StartReading = request.StartReading
	usageRecord.EndReading = request.EndReading
	usageRecord.ConsumptionM3 = request.ConsumptionM3
	usageRecord.TransactionRecord.UpdatedAt = &now

	updatedUsageRecord := service.UsageRecordRepository.Update(ctx, tx, usageRecord)

	// Audit success
	middleware.Success(ctx, "UPDATE", "usageRecords", userOid, oid, map[string]interface{}{
		"MeterOid":      updatedUsageRecord.MeterOid,
		"BillingMonth":  updatedUsageRecord.BillingMonth,
		"StartReading":  updatedUsageRecord.StartReading,
		"EndReading":    updatedUsageRecord.EndReading,
		"ConsumptionM3": updatedUsageRecord.ConsumptionM3,
	})

	// Build response
	messageVm := mappings.MessageVm{
		Value: updatedUsageRecord.Oid.String(),
		Name:  updatedUsageRecord.MeterOid.String(),
	}

	return messageVm, nil
}

func (service *UsageRecordService) Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	usageRecord, err := service.UsageRecordRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "DELETE", "usageRecords", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf(common.NewNotFoundError("usageRecord not found").Error)
	}

	// Simpan data lama untuk audit
	oldData := map[string]interface{}{
		"MeterOid":      usageRecord.MeterOid,
		"BillingMonth":  usageRecord.BillingMonth,
		"StartReading":  usageRecord.StartReading,
		"EndReading":    usageRecord.EndReading,
		"ConsumptionM3": usageRecord.ConsumptionM3,
	}

	// Lakukan delete
	if err := service.UsageRecordRepository.Deleted(ctx, tx, oid); err != nil {
		middleware.Failed(ctx, "DELETE", "usageRecords", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf("failed to delete usageRecord: %w", err)
	}

	// Audit success
	middleware.Success(ctx, "DELETE", "usageRecords", userOid, oid, oldData)

	// Response
	messageVm := mappings.MessageVm{
		Value: usageRecord.Oid.String(),
		Name:  usageRecord.MeterOid.String(),
	}
	return messageVm, nil
}

func (service *UsageRecordService) FindAll(ctx context.Context, userOid string) ([]mappings.UsageRecordVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "usageRecords", userOid, nil, err)
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	usageRecords, err := service.UsageRecordRepository.FindAll(ctx, tx)
	if err != nil {
		middleware.Failed(ctx, "READ", "usageRecords", userOid, nil, err)
		return nil, fmt.Errorf("failed to find usageRecords: %w", err)
	}

	newData := map[string]interface{}{
		"count": len(usageRecords),
	}
	middleware.Success(ctx, "READ", "usageRecords", userOid, nil, newData)

	return mappings.ToUsageRecordResponses(usageRecords), nil
}

func (service *UsageRecordService) FindPage(ctx context.Context, condition dtos.FilterUsageRecordDto, page, pageSize int, userOid string) ([]mappings.UsageRecordVm, int64, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "usageRecords", userOid, nil, err)
		return nil, 0, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	count, err := service.UsageRecordRepository.FindCountByCriteria(ctx, tx, condition)
	if err != nil {
		middleware.Failed(ctx, "READ", "usageRecords", userOid, nil, err)
		return nil, 0, fmt.Errorf(common.NewNotFoundError("usageRecord not found").Error)
	}

	usageRecords, err := service.UsageRecordRepository.FindByCriteriaPage(ctx, tx, page, pageSize, condition)
	if err != nil {
		middleware.Failed(ctx, "READ", "usageRecords", userOid, nil, err)
		return nil, 0, fmt.Errorf(common.NewNotFoundError("usageRecord not found").Error)
	}

	middleware.Success(ctx, "READ", "usageRecords", userOid, nil, map[string]interface{}{
		"page":     page,
		"pageSize": pageSize,
		"count":    count,
	})

	return mappings.ToUsageRecordResponses(usageRecords), count, nil
}

func (service *UsageRecordService) FindById(ctx context.Context, oid string, userOid string) (mappings.UsageRecordVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "usageRecords", userOid, oid, err)
		return mappings.UsageRecordVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	usageRecord, err := service.UsageRecordRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "READ", "usageRecords", userOid, oid, err)
		return mappings.UsageRecordVm{}, fmt.Errorf(common.NewNotFoundError("usageRecord not found").Error)
	}

	middleware.Success(ctx, "READ", "usageRecords", userOid, oid, nil)

	return mappings.ToUsageRecordNormalResponse(usageRecord), nil
}
