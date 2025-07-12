package services

import (
	"context"
	"database/sql"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
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

func (service *CustomerService) Create(ctx context.Context, request dtos.CreateCustomerDto, userOid string) mappings.MessageVm {
	var imageOid *uuid.UUID // Use a pointer to uuid.UUID for nil handling
	createdBy, err := uuid.Parse(userOid)
	if err != nil {
		common.PanicIfError(err)
	}
	if request.ImageOid != "" {
		_, err := uuid.Parse(request.ImageOid)
		if err != nil {
			common.PanicIfError(err)
		}
		tx, err := service.DB.Begin()
		common.PanicIfError(err)
		defer common.CommitOrRollback(tx)
		// Fetch the ImageFile from the repository
		imageFile, err := service.CustomerRepository.FindById(ctx, tx, request.ImageOid)
		if err != nil {
			panic(common.NewNotFoundError(err.Error()))
		}

		// Set imageOid to the found ImageFile Oid
		imageOid = &imageFile.Oid
	}

	customer := models.Customer{
		Oid: uuid.New(),
		Name: models.Name{
			FirstName:  request.FirstName,
			MiddleName: &request.MiddleName,
			LastName:   &request.LastName,
		},
		// Name:        ,
		// LastName:    request.LastName,
		Email:       request.Email,
		PhoneNumber: request.PhoneNumber,
		Address:     request.Address,
		ImageOid:    imageOid,
		TransactionRecord: models.TransactionRecord{
			CreatedBy: createdBy,
			CreatedAt: time.Now(),
		},
	}

	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	customer = service.CustomerRepository.Save(ctx, tx, customer)
	// return mappings.ToCustomerResponse(customer)
	messageVm := mappings.MessageVm{
		Value: customer.Oid.String(),
		Name:  customer.Name.FirstName,
	}
	return messageVm
}

func (service *CustomerService) Update(ctx context.Context, request dtos.UpdateCustomerDto, oid string, userOid string) mappings.MessageVm {
	err := service.Validate.Struct(request)
	common.PanicIfError(err)

	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	customer, err := service.CustomerRepository.FindById(ctx, tx, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	now := time.Now()
	customer.Name.FirstName = request.FirstName
	customer.Name.MiddleName = &request.MiddleName
	customer.Name.LastName = &request.LastName
	customer.Email = request.Email
	customer.PhoneNumber = request.PhoneNumber
	customer.Address = request.Address
	customer.TransactionRecord.UpdatedAt = &now
	customer = service.CustomerRepository.Update(ctx, tx, customer)

	// return mappings.ToCustomerResponse(customer)
	messageVm := mappings.MessageVm{
		Value: customer.Oid.String(),
		Name:  customer.Name.FirstName,
	}
	return messageVm
}

func (service *CustomerService) Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	customer, err := service.CustomerRepository.FindById(ctx, tx, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	service.CustomerRepository.Deleted(ctx, tx, oid)
	messageVm := mappings.MessageVm{
		Value: customer.Oid.String(),
		Name:  customer.Name.FirstName,
	}
	return messageVm
}

func (service *CustomerService) FindAll(ctx context.Context) []mappings.CustomerVm {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	customers := service.CustomerRepository.FindAll(ctx, tx)

	return mappings.ToCustomerResponses(customers)
}

func (service *CustomerService) FindPage(ctx context.Context, condition dtos.FilterCustomerDto, page, pageSize int) ([]mappings.CustomerVm, int64) {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	count, err := service.CustomerRepository.FindCountByCriteria(ctx, tx, condition)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	customers, err := service.CustomerRepository.FindByCriteriaPage(ctx, tx, page, pageSize, condition)

	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	return mappings.ToCustomerResponses(customers), count
}

func (service *CustomerService) FindById(ctx context.Context, oid string) mappings.CustomerVm {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	customer, err := service.CustomerRepository.FindById(ctx, tx, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	return mappings.ToCustomerNormalResponse(customer)
}
