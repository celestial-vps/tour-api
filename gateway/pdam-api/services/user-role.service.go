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

type UserRoleService struct {
	UserRoleRepository repositories.IUserRoleRepository
	DB                 *sql.DB
	Validate           *validator.Validate
}

func NewUserRoleService(userRoleRepository repositories.IUserRoleRepository, DB *sql.DB, validate *validator.Validate) IUserRoleService {
	return &UserRoleService{
		UserRoleRepository: userRoleRepository,
		DB:                 DB,
		Validate:           validate,
	}
}

func (service *UserRoleService) Create(ctx context.Context, request dtos.CreateUserRoleDto, userOid string) mappings.MessageVm {
	createdBy, err := uuid.Parse(userOid)
	if err != nil {
		common.PanicIfError(err)
	}

	userRole := models.UserRole{
		Oid:              uuid.New(),
		RoleName:         request.RoleName,
		TargetType:       request.TargetType,
		IsAdministrative: request.IsAdministrative,
		ReadState:        request.ReadState,
		WriteState:       request.WriteState,
		CreateState:      request.CreateState,
		DeleteState:      request.DeleteState,
		NavigateState:    request.NavigateState,
		TransactionRecord: models.TransactionRecord{
			CreatedBy: createdBy,
			CreatedAt: time.Now(),
		},
	}

	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	userRole = service.UserRoleRepository.Save(ctx, tx, userRole)
	// return mappings.ToUserRoleResponse(userRole)
	messageVm := mappings.MessageVm{
		Value: userRole.Oid.String(),
		Name:  userRole.RoleName,
	}
	return messageVm
}

func (service *UserRoleService) Update(ctx context.Context, request dtos.UpdateUserRoleDto, oid string, userOid string) mappings.MessageVm {
	err := service.Validate.Struct(request)
	common.PanicIfError(err)

	lastModifiedBy, err := uuid.Parse(userOid)
	if err != nil {
		common.PanicIfError(err)
	}

	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	userRole, err := service.UserRoleRepository.FindById(ctx, tx, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	now := time.Now()
	// userRole.RoleName = request.RoleName
	userRole.TargetType = request.TargetType
	userRole.IsAdministrative = request.IsAdministrative
	userRole.ReadState = request.ReadState
	userRole.WriteState = request.WriteState
	userRole.CreateState = request.CreateState
	userRole.DeleteState = request.DeleteState
	userRole.NavigateState = request.NavigateState
	userRole.LastModifiedBy = lastModifiedBy
	userRole.UpdatedAt = &now
	userRole = service.UserRoleRepository.Update(ctx, tx, userRole)

	// return mappings.ToUserRoleResponse(userRole)
	messageVm := mappings.MessageVm{
		Value: userRole.Oid.String(),
		Name:  userRole.RoleName,
	}
	return messageVm
}

func (service *UserRoleService) Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	userRole, err := service.UserRoleRepository.FindById(ctx, tx, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	service.UserRoleRepository.Deleted(ctx, tx, oid)
	messageVm := mappings.MessageVm{
		Value: userRole.Oid.String(),
		Name:  userRole.RoleName,
	}
	return messageVm
}

func (service *UserRoleService) FindAll(ctx context.Context) []mappings.UserRoleVm {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	userRoles := service.UserRoleRepository.FindAll(ctx, tx)

	return mappings.ToUserRoleResponses(userRoles)
}

func (service *UserRoleService) FindPage(ctx context.Context, condition dtos.FilterUserRoleDto, page, pageSize int) ([]mappings.UserRoleVm, int64) {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	count, err := service.UserRoleRepository.FindCountByCriteria(ctx, tx, condition)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	userRoles, err := service.UserRoleRepository.FindByCriteriaPage(ctx, tx, page, pageSize, condition)

	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	return mappings.ToUserRoleResponses(userRoles), count
}

func (service *UserRoleService) FindById(ctx context.Context, oid string) mappings.UserRoleVm {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	userRole, err := service.UserRoleRepository.FindById(ctx, tx, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	return mappings.ToUserRoleResponse(userRole)
}
