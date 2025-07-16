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

type CustomerService struct {
	CustomerRepository  repositories.ICustomerRepository
	ImageFileRepository repositories.IImageFileRepository
	DB                  *sql.DB
	Validate            *validator.Validate
}

func NewCustomerService(customerRepository repositories.ICustomerRepository,
	imageFileRepository repositories.IImageFileRepository,
	DB *sql.DB, validate *validator.Validate) ICustomerService {
	return &CustomerService{
		CustomerRepository:  customerRepository,
		ImageFileRepository: imageFileRepository,
		DB:                  DB,
		Validate:            validate,
	}
}
func (service *CustomerService) Create(ctx context.Context, request dtos.CreateCustomerDto, userOid string) (mappings.MessageVm, error) {
	createdBy, err := uuid.Parse(userOid)
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("invalid userOid: %w", err)
	}

	customer := models.Customer{
		Oid: uuid.New(),
		Name: models.Name{
			FirstName:  request.FirstName,
			MiddleName: &request.MiddleName,
			LastName:   &request.LastName,
		},
		Email:       request.Email,
		PhoneNumber: request.PhoneNumber,
		Address:     request.Address,
		TransactionRecord: models.TransactionRecord{
			CreatedBy: createdBy,
			CreatedAt: time.Now(),
		},
	}

	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "CREATE", "customers", userOid, nil, fmt.Errorf("failed to begin transaction: %w", err))
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	customer, err = service.CustomerRepository.Save(ctx, tx, customer)
	if err != nil {
		middleware.Failed(ctx, "CREATE", "customers", userOid, nil, fmt.Errorf("failed to save customer: %w", err))
		return mappings.MessageVm{}, fmt.Errorf("failed to save customer: %w", err)
	}

	messageVm := mappings.MessageVm{
		Value: customer.Oid.String(),
		Name:  customer.Name.FirstName,
	}

	// Kirim audit trail success
	newData := map[string]interface{}{
		"FirstName":  customer.Name.FirstName,
		"MiddleName": customer.Name.MiddleName,
		"LastName":   customer.Name.LastName,
		"Email":      customer.Email,
		"Phone":      customer.PhoneNumber,
		"Address":    customer.Address,
	}

	middleware.Success(ctx, "CREATE", "customers", userOid, customer.Oid.String(), newData)

	return messageVm, nil
}

func (service *CustomerService) Update(ctx context.Context, request dtos.UpdateCustomerDto, oid string, userOid string) (mappings.MessageVm, error) {
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
	customer, err := service.CustomerRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "UPDATE", "customers", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf(common.NewNotFoundError("customer not found").Error)
	}

	// Update data
	now := time.Now()
	customer.Name.FirstName = request.FirstName
	customer.Name.MiddleName = &request.MiddleName
	customer.Name.LastName = &request.LastName
	customer.Email = request.Email
	customer.PhoneNumber = request.PhoneNumber
	customer.Address = request.Address
	customer.TransactionRecord.UpdatedAt = &now

	updatedCustomer := service.CustomerRepository.Update(ctx, tx, customer)

	// Audit success
	middleware.Success(ctx, "UPDATE", "customers", userOid, oid, map[string]interface{}{
		"FirstName":  updatedCustomer.Name.FirstName,
		"MiddleName": updatedCustomer.Name.MiddleName,
		"LastName":   updatedCustomer.Name.LastName,
		"Email":      updatedCustomer.Email,
		"Phone":      updatedCustomer.PhoneNumber,
		"Address":    updatedCustomer.Address,
	})

	// Build response
	messageVm := mappings.MessageVm{
		Value: updatedCustomer.Oid.String(),
		Name:  updatedCustomer.Name.FirstName,
	}

	return messageVm, nil
}

func (service *CustomerService) Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	customer, err := service.CustomerRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "DELETE", "customers", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf(common.NewNotFoundError("customer not found").Error)
	}

	// Simpan data lama untuk audit
	oldData := map[string]interface{}{
		"FirstName":  customer.Name.FirstName,
		"MiddleName": customer.Name.MiddleName,
		"LastName":   customer.Name.LastName,
		"Email":      customer.Email,
		"Phone":      customer.PhoneNumber,
		"Address":    customer.Address,
	}

	// Lakukan delete
	if err := service.CustomerRepository.Deleted(ctx, tx, oid); err != nil {
		middleware.Failed(ctx, "DELETE", "customers", userOid, oid, err)
		return mappings.MessageVm{}, fmt.Errorf("failed to delete customer: %w", err)
	}

	// Audit success
	middleware.Success(ctx, "DELETE", "customers", userOid, oid, oldData)

	// Response
	messageVm := mappings.MessageVm{
		Value: customer.Oid.String(),
		Name:  customer.Name.FirstName,
	}
	return messageVm, nil
}

func (service *CustomerService) FindAll(ctx context.Context, userOid string) ([]mappings.CustomerVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "customers", userOid, nil, err)
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	customers, err := service.CustomerRepository.FindAll(ctx, tx)
	if err != nil {
		middleware.Failed(ctx, "READ", "customers", userOid, nil, err)
		return nil, fmt.Errorf("failed to find customers: %w", err)
	}

	newData := map[string]interface{}{
		"count": len(customers),
	}
	middleware.Success(ctx, "READ", "customers", userOid, nil, newData)

	return mappings.ToCustomerResponses(customers), nil
}

func (service *CustomerService) FindPage(ctx context.Context, condition dtos.FilterCustomerDto, page, pageSize int, userOid string) ([]mappings.CustomerVm, int64, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "customers", userOid, nil, err)
		return nil, 0, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	count, err := service.CustomerRepository.FindCountByCriteria(ctx, tx, condition)
	if err != nil {
		middleware.Failed(ctx, "READ", "customers", userOid, nil, err)
		return nil, 0, fmt.Errorf(common.NewNotFoundError("customer not found").Error)
	}

	customers, err := service.CustomerRepository.FindByCriteriaPage(ctx, tx, page, pageSize, condition)
	if err != nil {
		middleware.Failed(ctx, "READ", "customers", userOid, nil, err)
		return nil, 0, fmt.Errorf(common.NewNotFoundError("customer not found").Error)
	}

	middleware.Success(ctx, "READ", "customers", userOid, nil, map[string]interface{}{
		"page":     page,
		"pageSize": pageSize,
		"count":    count,
	})

	return mappings.ToCustomerResponses(customers), count, nil
}

func (service *CustomerService) FindById(ctx context.Context, oid string, userOid string) (mappings.CustomerVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "customers", userOid, oid, err)
		return mappings.CustomerVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	customer, err := service.CustomerRepository.FindById(ctx, tx, oid)
	if err != nil {
		middleware.Failed(ctx, "READ", "customers", userOid, oid, err)
		return mappings.CustomerVm{}, fmt.Errorf(common.NewNotFoundError("customer not found").Error)
	}

	middleware.Success(ctx, "READ", "customers", userOid, oid, nil)

	return mappings.ToCustomerNormalResponse(customer), nil
}
