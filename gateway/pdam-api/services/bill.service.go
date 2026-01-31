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

type BillService struct {
	BillRepository      repositories.IBillRepository
	ImageFileRepository repositories.IImageFileRepository
	DB                  *sql.DB
	Validate            *validator.Validate
}

func NewBillService(billRepository repositories.IBillRepository,
	imageFileRepository repositories.IImageFileRepository,
	DB *sql.DB, validate *validator.Validate) IBillService {
	return &BillService{
		BillRepository:      billRepository,
		ImageFileRepository: imageFileRepository,
		DB:                  DB,
		Validate:            validate,
	}
}
func (service *BillService) Create(ctx context.Context, request dtos.CreateBillDto, userOid string) (mappings.MessageVm, error) {
	createdBy, err := uuid.Parse(userOid)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("invalid userOid: %w", err)
	}

	bill := models.Bill{
		Oid: uuid.New(),
		// UsageOid:    request.UsageOid,
		BillingDate: request.BillingDate,
		TotalAmount: request.TotalAmount,
		Status:      request.Status,
		TransactionRecord: models.TransactionRecord{
			CreatedBy: createdBy,
			CreatedAt: time.Now(),
		},
	}

	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "CREATE", "bills", userOid, nil, fmt.Errorf("failed to begin transaction: %w", err))
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	bill, err = service.BillRepository.Save(ctx, tx, bill)
	if err != nil {
		middleware.Failed(ctx, "CREATE", "bills", userOid, nil, fmt.Errorf("failed to save bill: %w", err))
		return mappings.MessageVm{}, fmt.Errorf("failed to save bill: %w", err)
	}

	messageVm := mappings.MessageVm{
		Value: bill.Oid.String(),
		Name:  bill.UsageOid.String(),
	}

	// Kirim audit trail success
	newData := map[string]interface{}{
		"UsageOid":    bill.UsageOid,
		"BillingDate": bill.BillingDate,
		"TotalAmount": bill.TotalAmount,
		"Status":      bill.Status,
	}

	middleware.Success(ctx, "CREATE", "bills", userOid, bill.Oid.String(), newData)

	return messageVm, nil
}

func (service *BillService) Update(ctx context.Context, request dtos.UpdateBillDto, oid string, userOid string) (mappings.MessageVm, error) {
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
	bill, err := service.BillRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "UPDATE", "bills", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf(common.NewNotFoundError("bill not found").Error)
	}

	// Update data
	now := time.Now()
	// bill.UsageOid = request.UsageOid
	bill.BillingDate = request.BillingDate
	bill.TotalAmount = request.TotalAmount
	bill.Status = request.Status
	bill.TransactionRecord.UpdatedAt = &now

	updatedBill := service.BillRepository.Update(ctx, tx, bill)

	// Audit success
	middleware.Success(ctx, "UPDATE", "bills", userOid, oid, map[string]interface{}{
		"UsageOid":    updatedBill.UsageOid,
		"BillingDate": updatedBill.BillingDate,
		"TotalAmount": updatedBill.TotalAmount,
		"Status":      updatedBill.Status,
	})

	// Build response
	messageVm := mappings.MessageVm{
		Value: updatedBill.Oid.String(),
		Name:  updatedBill.UsageOid.String(),
	}

	return messageVm, nil
}

func (service *BillService) Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	bill, err := service.BillRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "DELETE", "bills", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf(common.NewNotFoundError("bill not found").Error)
	}

	// Simpan data lama untuk audit
	oldData := map[string]interface{}{
		"UsageOid":    bill.UsageOid,
		"BillingDate": bill.BillingDate,
		"TotalAmount": bill.TotalAmount,
		"Status":      bill.Status,
	}

	// Lakukan delete
	if err := service.BillRepository.Deleted(ctx, tx, oid); err != nil {
		middleware.Failed(ctx, "DELETE", "bills", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf("failed to delete bill: %w", err)
	}

	// Audit success
	middleware.Success(ctx, "DELETE", "bills", userOid, oid, oldData)

	// Response
	messageVm := mappings.MessageVm{
		Value: bill.Oid.String(),
		Name:  bill.UsageOid.String(),
	}
	return messageVm, nil
}

func (service *BillService) FindAll(ctx context.Context, userOid string) ([]mappings.BillVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "bills", userOid, nil, err)
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	bills, err := service.BillRepository.FindAll(ctx, tx)
	if err != nil {
		middleware.Failed(ctx, "READ", "bills", userOid, nil, err)
		return nil, fmt.Errorf("failed to find bills: %w", err)
	}

	newData := map[string]interface{}{
		"count": len(bills),
	}
	middleware.Success(ctx, "READ", "bills", userOid, nil, newData)

	return mappings.ToBillResponses(bills), nil
}

func (service *BillService) FindPage(ctx context.Context, condition dtos.FilterBillDto, page, pageSize int, userOid string) ([]mappings.BillVm, int64, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "bills", userOid, nil, err)
		return nil, 0, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	count, err := service.BillRepository.FindCountByCriteria(ctx, tx, condition)
	if err != nil {
		middleware.Failed(ctx, "READ", "bills", userOid, nil, err)
		return nil, 0, fmt.Errorf(common.NewNotFoundError("bill not found").Error)
	}

	bills, err := service.BillRepository.FindByCriteriaPage(ctx, tx, page, pageSize, condition)
	if err != nil {
		middleware.Failed(ctx, "READ", "bills", userOid, nil, err)
		return nil, 0, fmt.Errorf(common.NewNotFoundError("bill not found").Error)
	}

	middleware.Success(ctx, "READ", "bills", userOid, nil, map[string]interface{}{
		"page":     page,
		"pageSize": pageSize,
		"count":    count,
	})

	return mappings.ToBillResponses(bills), count, nil
}

func (service *BillService) FindById(ctx context.Context, oid string, userOid string) (mappings.BillVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "bills", userOid, oid, err)
		return mappings.BillVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	bill, err := service.BillRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "READ", "bills", userOid, oid, err)
		return mappings.BillVm{}, fmt.Errorf(common.NewNotFoundError("bill not found").Error)
	}

	middleware.Success(ctx, "READ", "bills", userOid, oid, nil)

	return mappings.ToBillNormalResponse(bill), nil
}
