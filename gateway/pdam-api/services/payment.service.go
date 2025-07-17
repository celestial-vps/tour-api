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

type PaymentService struct {
	PaymentRepository   repositories.IPaymentRepository
	ImageFileRepository repositories.IImageFileRepository
	DB                  *sql.DB
	Validate            *validator.Validate
}

func NewPaymentService(paymentRepository repositories.IPaymentRepository,
	imageFileRepository repositories.IImageFileRepository,
	DB *sql.DB, validate *validator.Validate) IPaymentService {
	return &PaymentService{
		PaymentRepository:   paymentRepository,
		ImageFileRepository: imageFileRepository,
		DB:                  DB,
		Validate:            validate,
	}
}
func (service *PaymentService) Create(ctx context.Context, request dtos.CreatePaymentDto, userOid string) (mappings.MessageVm, error) {
	createdBy, err := uuid.Parse(userOid)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("invalid userOid: %w", err)
	}

	payment := models.Payment{
		Oid:           uuid.New(),
		BillOid:       request.BillOid,
		PaymentDate:   request.PaymentDate,
		AmountPaid:    request.AmountPaid,
		PaymentMethod: request.PaymentMethod,
		TransactionRecord: models.TransactionRecord{
			CreatedBy: createdBy,
			CreatedAt: time.Now(),
		},
	}

	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "CREATE", "payments", userOid, nil, fmt.Errorf("failed to begin transaction: %w", err))
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	payment, err = service.PaymentRepository.Save(ctx, tx, payment)
	if err != nil {
		middleware.Failed(ctx, "CREATE", "payments", userOid, nil, fmt.Errorf("failed to save payment: %w", err))
		return mappings.MessageVm{}, fmt.Errorf("failed to save payment: %w", err)
	}

	messageVm := mappings.MessageVm{
		Value: payment.Oid.String(),
		Name:  payment.BillOid.String(),
	}

	// Kirim audit trail success
	newData := map[string]interface{}{
		"BillOid":       payment.BillOid,
		"PaymentDate":   payment.PaymentDate,
		"AmountPaid":    payment.AmountPaid,
		"PaymentMethod": payment.PaymentMethod,
	}

	middleware.Success(ctx, "CREATE", "payments", userOid, payment.Oid.String(), newData)

	return messageVm, nil
}

func (service *PaymentService) Update(ctx context.Context, request dtos.UpdatePaymentDto, oid string, userOid string) (mappings.MessageVm, error) {
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
	payment, err := service.PaymentRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "UPDATE", "payments", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf(common.NewNotFoundError("payment not found").Error)
	}

	// Update data
	now := time.Now()
	payment.BillOid = request.BillOid
	payment.PaymentDate = request.PaymentDate
	payment.AmountPaid = request.AmountPaid
	payment.PaymentMethod = request.PaymentMethod
	payment.TransactionRecord.UpdatedAt = &now

	updatedPayment := service.PaymentRepository.Update(ctx, tx, payment)

	// Audit success
	middleware.Success(ctx, "UPDATE", "payments", userOid, oid, map[string]interface{}{
		"BillOid":       updatedPayment.BillOid,
		"PaymentDate":   updatedPayment.PaymentDate,
		"AmountPaid":    updatedPayment.AmountPaid,
		"PaymentMethod": updatedPayment.PaymentMethod,
	})

	// Build response
	messageVm := mappings.MessageVm{
		Value: updatedPayment.Oid.String(),
		Name:  updatedPayment.BillOid.String(),
	}

	return messageVm, nil
}

func (service *PaymentService) Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	payment, err := service.PaymentRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "DELETE", "payments", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf(common.NewNotFoundError("payment not found").Error)
	}

	// Simpan data lama untuk audit
	oldData := map[string]interface{}{
		"BillOid":       payment.BillOid,
		"PaymentDate":   payment.PaymentDate,
		"AmountPaid":    payment.AmountPaid,
		"PaymentMethod": payment.PaymentMethod,
	}

	// Lakukan delete
	if err := service.PaymentRepository.Deleted(ctx, tx, oid); err != nil {
		middleware.Failed(ctx, "DELETE", "payments", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf("failed to delete payment: %w", err)
	}

	// Audit success
	middleware.Success(ctx, "DELETE", "payments", userOid, oid, oldData)

	// Response
	messageVm := mappings.MessageVm{
		Value: payment.Oid.String(),
		Name:  payment.BillOid.String(),
	}
	return messageVm, nil
}

func (service *PaymentService) FindAll(ctx context.Context, userOid string) ([]mappings.PaymentVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "payments", userOid, nil, err)
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	payments, err := service.PaymentRepository.FindAll(ctx, tx)
	if err != nil {
		middleware.Failed(ctx, "READ", "payments", userOid, nil, err)
		return nil, fmt.Errorf("failed to find payments: %w", err)
	}

	newData := map[string]interface{}{
		"count": len(payments),
	}
	middleware.Success(ctx, "READ", "payments", userOid, nil, newData)

	return mappings.ToPaymentResponses(payments), nil
}

func (service *PaymentService) FindPage(ctx context.Context, condition dtos.FilterPaymentDto, page, pageSize int, userOid string) ([]mappings.PaymentVm, int64, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "payments", userOid, nil, err)
		return nil, 0, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	count, err := service.PaymentRepository.FindCountByCriteria(ctx, tx, condition)
	if err != nil {
		middleware.Failed(ctx, "READ", "payments", userOid, nil, err)
		return nil, 0, fmt.Errorf(common.NewNotFoundError("payment not found").Error)
	}

	payments, err := service.PaymentRepository.FindByCriteriaPage(ctx, tx, page, pageSize, condition)
	if err != nil {
		middleware.Failed(ctx, "READ", "payments", userOid, nil, err)
		return nil, 0, fmt.Errorf(common.NewNotFoundError("payment not found").Error)
	}

	middleware.Success(ctx, "READ", "payments", userOid, nil, map[string]interface{}{
		"page":     page,
		"pageSize": pageSize,
		"count":    count,
	})

	return mappings.ToPaymentResponses(payments), count, nil
}

func (service *PaymentService) FindById(ctx context.Context, oid string, userOid string) (mappings.PaymentVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "payments", userOid, oid, err)
		return mappings.PaymentVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	payment, err := service.PaymentRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "READ", "payments", userOid, oid, err)
		return mappings.PaymentVm{}, fmt.Errorf(common.NewNotFoundError("payment not found").Error)
	}

	middleware.Success(ctx, "READ", "payments", userOid, oid, nil)

	return mappings.ToPaymentNormalResponse(payment), nil
}
