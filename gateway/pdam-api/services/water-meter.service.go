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

type WaterMeterService struct {
	WaterMeterRepository repositories.IWaterMeterRepository
	ImageFileRepository  repositories.IImageFileRepository
	DB                   *sql.DB
	Validate             *validator.Validate
}

func NewWaterMeterService(waterMeterRepository repositories.IWaterMeterRepository,
	imageFileRepository repositories.IImageFileRepository,
	DB *sql.DB, validate *validator.Validate) IWaterMeterService {
	return &WaterMeterService{
		WaterMeterRepository: waterMeterRepository,
		ImageFileRepository:  imageFileRepository,
		DB:                   DB,
		Validate:             validate,
	}
}
func (service *WaterMeterService) Create(ctx context.Context, request dtos.CreateWaterMeterDto, userOid string) (mappings.MessageVm, error) {
	createdBy, err := uuid.Parse(userOid)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("invalid userOid: %w", err)
	}

	waterMeter := models.WaterMeter{
		Oid:          uuid.New(),
		SerialNumber: request.SerialNumber,
		// CustomerOid:  request.CustomerOid,
		// InstalledAt:  request.InstalledAt,
		// ReplacedAt:   request.ReplacedAt,
		Status: request.Status,
		TransactionRecord: models.TransactionRecord{
			CreatedBy: createdBy,
			CreatedAt: time.Now(),
		},
	}

	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "CREATE", "waterMeters", userOid, nil, fmt.Errorf("failed to begin transaction: %w", err))
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	waterMeter, err = service.WaterMeterRepository.Save(ctx, tx, waterMeter)
	if err != nil {
		middleware.Failed(ctx, "CREATE", "waterMeters", userOid, nil, fmt.Errorf("failed to save waterMeter: %w", err))
		return mappings.MessageVm{}, fmt.Errorf("failed to save waterMeter: %w", err)
	}

	messageVm := mappings.MessageVm{
		Value: waterMeter.Oid.String(),
		Name:  waterMeter.SerialNumber,
	}

	// Kirim audit trail success
	newData := map[string]interface{}{
		"SerialNumber": waterMeter.SerialNumber,
		"CustomerOid":  waterMeter.CustomerOid,
		"InstalledAt":  waterMeter.InstalledAt,
		"ReplacedAt":   waterMeter.ReplacedAt,
		"Status":       waterMeter.Status,
	}

	middleware.Success(ctx, "CREATE", "waterMeters", userOid, waterMeter.Oid.String(), newData)

	return messageVm, nil
}

func (service *WaterMeterService) Update(ctx context.Context, request dtos.UpdateWaterMeterDto, oid string, userOid string) (mappings.MessageVm, error) {
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
	waterMeter, err := service.WaterMeterRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "UPDATE", "waterMeters", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf(common.NewNotFoundError("waterMeter not found").Error)
	}

	// Update data
	now := time.Now()
	waterMeter.SerialNumber = request.SerialNumber
	// waterMeter.CustomerOid = &request.CustomerOid
	// waterMeter.InstalledAt = &request.InstalledAt
	// waterMeter.ReplacedAt = request.ReplacedAt
	waterMeter.Status = request.Status
	waterMeter.TransactionRecord.UpdatedAt = &now

	updatedWaterMeter := service.WaterMeterRepository.Update(ctx, tx, waterMeter)

	// Audit success
	middleware.Success(ctx, "UPDATE", "waterMeters", userOid, oid, map[string]interface{}{
		"SerialNumber": updatedWaterMeter.SerialNumber,
		"CustomerOid":  updatedWaterMeter.CustomerOid,
		"InstalledAt":  updatedWaterMeter.InstalledAt,
		"ReplacedAt":   updatedWaterMeter.ReplacedAt,
		"Status":       updatedWaterMeter.Status,
	})

	// Build response
	messageVm := mappings.MessageVm{
		Value: updatedWaterMeter.Oid.String(),
		Name:  updatedWaterMeter.SerialNumber,
	}

	return messageVm, nil
}

func (service *WaterMeterService) Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	waterMeter, err := service.WaterMeterRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "DELETE", "waterMeters", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf(common.NewNotFoundError("waterMeter not found").Error)
	}

	// Simpan data lama untuk audit
	oldData := map[string]interface{}{
		"SerialNumber": waterMeter.SerialNumber,
		"CustomerOid":  waterMeter.CustomerOid,
		"InstalledAt":  waterMeter.InstalledAt,
		"ReplacedAt":   waterMeter.ReplacedAt,
		"Status":       waterMeter.Status,
	}

	// Lakukan delete
	if err := service.WaterMeterRepository.Deleted(ctx, tx, oid); err != nil {
		middleware.Failed(ctx, "DELETE", "waterMeters", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf("failed to delete waterMeter: %w", err)
	}

	// Audit success
	middleware.Success(ctx, "DELETE", "waterMeters", userOid, oid, oldData)

	// Response
	messageVm := mappings.MessageVm{
		Value: waterMeter.Oid.String(),
		Name:  waterMeter.SerialNumber,
	}
	return messageVm, nil
}

func (service *WaterMeterService) FindAll(ctx context.Context, userOid string) ([]mappings.WaterMeterVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "waterMeters", userOid, nil, err)
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	waterMeters, err := service.WaterMeterRepository.FindAll(ctx, tx)
	if err != nil {
		middleware.Failed(ctx, "READ", "waterMeters", userOid, nil, err)
		return nil, fmt.Errorf("failed to find waterMeters: %w", err)
	}

	newData := map[string]interface{}{
		"count": len(waterMeters),
	}
	middleware.Success(ctx, "READ", "waterMeters", userOid, nil, newData)

	return mappings.ToWaterMeterResponses(waterMeters), nil
}

func (service *WaterMeterService) FindPage(ctx context.Context, condition dtos.FilterWaterMeterDto, page, pageSize int, userOid string) ([]mappings.WaterMeterVm, int64, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "waterMeters", userOid, nil, err)
		return nil, 0, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	count, err := service.WaterMeterRepository.FindCountByCriteria(ctx, tx, condition)
	if err != nil {
		middleware.Failed(ctx, "READ", "waterMeters", userOid, nil, err)
		return nil, 0, fmt.Errorf(common.NewNotFoundError("waterMeter not found").Error)
	}

	waterMeters, err := service.WaterMeterRepository.FindByCriteriaPage(ctx, tx, page, pageSize, condition)
	if err != nil {
		middleware.Failed(ctx, "READ", "waterMeters", userOid, nil, err)
		return nil, 0, fmt.Errorf(common.NewNotFoundError("waterMeter not found").Error)
	}

	middleware.Success(ctx, "READ", "waterMeters", userOid, nil, map[string]interface{}{
		"page":     page,
		"pageSize": pageSize,
		"count":    count,
	})

	return mappings.ToWaterMeterResponses(waterMeters), count, nil
}

func (service *WaterMeterService) FindById(ctx context.Context, oid string, userOid string) (mappings.WaterMeterVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "waterMeters", userOid, oid, err)
		return mappings.WaterMeterVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	waterMeter, err := service.WaterMeterRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "READ", "waterMeters", userOid, oid, err)
		return mappings.WaterMeterVm{}, fmt.Errorf(common.NewNotFoundError("waterMeter not found").Error)
	}

	middleware.Success(ctx, "READ", "waterMeters", userOid, oid, nil)

	return mappings.ToWaterMeterNormalResponse(waterMeter), nil
}
