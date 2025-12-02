package services

import (
	"context"
	"time"

	"shipping-api/common"
	"shipping-api/dtos"
	"shipping-api/mappings"
	"shipping-api/models"
	"shipping-api/repositories"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRoleService struct {
	UserRoleRepository repositories.IUserRoleRepository
	DB                 *gorm.DB
	Validate           *validator.Validate
}

func NewUserRoleService(userRoleRepository repositories.IUserRoleRepository, DB *gorm.DB, validate *validator.Validate) IUserRoleService {
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
	userRole = service.UserRoleRepository.Save(ctx, service.DB, userRole)
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

	userRole, err := service.UserRoleRepository.FindById(ctx, service.DB, oid)
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
	userRole.TransactionRecord.LastModifiedBy = lastModifiedBy
	userRole.TransactionRecord.UpdatedAt = &now
	userRole = service.UserRoleRepository.Update(ctx, service.DB, userRole)

	// return mappings.ToUserRoleResponse(userRole)
	messageVm := mappings.MessageVm{
		Value: userRole.Oid.String(),
		Name:  userRole.RoleName,
	}
	return messageVm
}

func (service *UserRoleService) Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm {

	userRole, err := service.UserRoleRepository.FindById(ctx, service.DB, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	service.UserRoleRepository.Deleted(ctx, service.DB, oid)
	messageVm := mappings.MessageVm{
		Value: userRole.Oid.String(),
		Name:  userRole.RoleName,
	}
	return messageVm
}

func (service *UserRoleService) FindAll(ctx context.Context) []mappings.UserRoleVm {
	userRoles := service.UserRoleRepository.FindAll(ctx, service.DB)

	return mappings.ToUserRoleResponses(userRoles)
}

func (service *UserRoleService) FindPage(ctx context.Context, condition dtos.FilterUserRoleDto, page, pageSize int) ([]mappings.UserRoleVm, int64) {
	count, err := service.UserRoleRepository.FindCountByCriteria(ctx, service.DB, condition)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	userRoles, err := service.UserRoleRepository.FindByCriteriaPage(ctx, service.DB, page, pageSize, condition)

	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	return mappings.ToUserRoleResponses(userRoles), count
}

func (service *UserRoleService) FindById(ctx context.Context, oid string) mappings.UserRoleVm {

	userRole, err := service.UserRoleRepository.FindById(ctx, service.DB, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	return mappings.ToUserRoleResponse(userRole)
}
