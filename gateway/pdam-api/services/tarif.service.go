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

type TarifService struct {
	TarifRepository     repositories.ITarifRepository
	ImageFileRepository repositories.IImageFileRepository
	DB                  *sql.DB
	Validate            *validator.Validate
}

func NewTarifService(tarifRepository repositories.ITarifRepository,
	imageFileRepository repositories.IImageFileRepository,
	DB *sql.DB, validate *validator.Validate) ITarifService {
	return &TarifService{
		TarifRepository:     tarifRepository,
		ImageFileRepository: imageFileRepository,
		DB:                  DB,
		Validate:            validate,
	}
}
func (service *TarifService) Create(ctx context.Context, request dtos.CreateTarifDto, userOid string) (mappings.MessageVm, error) {
	createdBy, err := uuid.Parse(userOid)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("invalid userOid: %w", err)
	}

	tarif := models.Tarif{
		Oid:           uuid.New(),
		CustomerType:  request.CustomerType,
		MinVolume:     request.MinVolume,
		MaxVolume:     request.MaxVolume,
		PricePerM3:    request.PricePerM3,
		EffectiveFrom: request.EffectiveFrom,
		EffectiveTo:   request.EffectiveTo,
		TransactionRecord: models.TransactionRecord{
			CreatedBy: createdBy,
			CreatedAt: time.Now(),
		},
	}

	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "CREATE", "tarifs", userOid, nil, fmt.Errorf("failed to begin transaction: %w", err))
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	tarif, err = service.TarifRepository.Save(ctx, tx, tarif)
	if err != nil {
		middleware.Failed(ctx, "CREATE", "tarifs", userOid, nil, fmt.Errorf("failed to save tarif: %w", err))
		return mappings.MessageVm{}, fmt.Errorf("failed to save tarif: %w", err)
	}

	messageVm := mappings.MessageVm{
		Value: tarif.Oid.String(),
		Name:  tarif.CustomerType,
	}

	// Kirim audit trail success
	newData := map[string]interface{}{
		"CustomerType": tarif.CustomerType,
		"MinVolume":    tarif.MinVolume,
		"MaxVolume":    tarif.MaxVolume,
		"PricePerM3":   tarif.PricePerM3,
		"EfectiveFrom": tarif.EffectiveFrom,
		"EfectiveTo":   tarif.EffectiveTo,
	}

	middleware.Success(ctx, "CREATE", "tarifs", userOid, tarif.Oid.String(), newData)

	return messageVm, nil
}

func (service *TarifService) Update(ctx context.Context, request dtos.UpdateTarifDto, oid string, userOid string) (mappings.MessageVm, error) {
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
	tarif, err := service.TarifRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "UPDATE", "tarifs", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf(common.NewNotFoundError("tarif not found").Error)
	}

	// Update data
	now := time.Now()
	tarif.CustomerType = request.CustomerType
	tarif.MinVolume = request.MinVolume
	tarif.MaxVolume = request.MaxVolume
	tarif.PricePerM3 = request.PricePerM3
	tarif.EffectiveFrom = request.EffectiveFrom
	tarif.EffectiveTo = request.EffectiveTo
	tarif.TransactionRecord.UpdatedAt = &now

	updatedTarif := service.TarifRepository.Update(ctx, tx, tarif)

	// Audit success
	middleware.Success(ctx, "UPDATE", "tarifs", userOid, oid, map[string]interface{}{
		"CustomerType":  updatedTarif.CustomerType,
		"MinVolume":     updatedTarif.MinVolume,
		"MaxVolume":     updatedTarif.MaxVolume,
		"PricePerM3":    updatedTarif.PricePerM3,
		"EffectiveFrom": updatedTarif.EffectiveFrom,
		"EffectiveTo":   updatedTarif.EffectiveTo,
	})

	// Build response
	messageVm := mappings.MessageVm{
		Value: updatedTarif.Oid.String(),
		Name:  updatedTarif.CustomerType,
	}

	return messageVm, nil
}

func (service *TarifService) Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	tarif, err := service.TarifRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "DELETE", "tarifs", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf(common.NewNotFoundError("tarif not found").Error)
	}

	// Simpan data lama untuk audit
	oldData := map[string]interface{}{
		"CustomerType":  tarif.CustomerType,
		"MinVolume":     tarif.MinVolume,
		"MaxVolume":     tarif.MaxVolume,
		"PricePerM3":    tarif.PricePerM3,
		"EffectiveFrom": tarif.EffectiveFrom,
		"EffectiveTo":   tarif.EffectiveTo,
	}

	// Lakukan delete
	if err := service.TarifRepository.Deleted(ctx, tx, oid); err != nil {
		middleware.Failed(ctx, "DELETE", "tarifs", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf("failed to delete tarif: %w", err)
	}

	// Audit success
	middleware.Success(ctx, "DELETE", "tarifs", userOid, oid, oldData)

	// Response
	messageVm := mappings.MessageVm{
		Value: tarif.Oid.String(),
		Name:  tarif.CustomerType,
	}
	return messageVm, nil
}

func (service *TarifService) FindAll(ctx context.Context, userOid string) ([]mappings.TarifVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "tarifs", userOid, nil, err)
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	tarifs, err := service.TarifRepository.FindAll(ctx, tx)
	if err != nil {
		middleware.Failed(ctx, "READ", "tarifs", userOid, nil, err)
		return nil, fmt.Errorf("failed to find tarifs: %w", err)
	}

	newData := map[string]interface{}{
		"count": len(tarifs),
	}
	middleware.Success(ctx, "READ", "tarifs", userOid, nil, newData)

	return mappings.ToTarifResponses(tarifs), nil
}

func (service *TarifService) FindPage(ctx context.Context, condition dtos.FilterTarifDto, page, pageSize int, userOid string) ([]mappings.TarifVm, int64, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "tarifs", userOid, nil, err)
		return nil, 0, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	count, err := service.TarifRepository.FindCountByCriteria(ctx, tx, condition)
	if err != nil {
		middleware.Failed(ctx, "READ", "tarifs", userOid, nil, err)
		return nil, 0, fmt.Errorf(common.NewNotFoundError("tarif not found").Error)
	}

	tarifs, err := service.TarifRepository.FindByCriteriaPage(ctx, tx, page, pageSize, condition)
	if err != nil {
		middleware.Failed(ctx, "READ", "tarifs", userOid, nil, err)
		return nil, 0, fmt.Errorf(common.NewNotFoundError("tarif not found").Error)
	}

	middleware.Success(ctx, "READ", "tarifs", userOid, nil, map[string]interface{}{
		"page":     page,
		"pageSize": pageSize,
		"count":    count,
	})

	return mappings.ToTarifResponses(tarifs), count, nil
}

func (service *TarifService) FindById(ctx context.Context, oid string, userOid string) (mappings.TarifVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "tarifs", userOid, oid, err)
		return mappings.TarifVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	tarif, err := service.TarifRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "READ", "tarifs", userOid, oid, err)
		return mappings.TarifVm{}, fmt.Errorf(common.NewNotFoundError("tarif not found").Error)
	}

	middleware.Success(ctx, "READ", "tarifs", userOid, oid, nil)

	return mappings.ToTarifNormalResponse(tarif), nil
}
