package services

import (
	"context"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
)

type IUserService interface {
	Create(ctx context.Context, request dtos.CreateUserDto, userOid string) mappings.MessageVm
	Register(ctx context.Context, request dtos.RegisterDto) mappings.UserRegisterVm
	Login(ctx context.Context, request dtos.LoginDto) mappings.UserLoginVm
	// GetUserRole(ctx context.Context, email string) mappings.UserLoginVm
	Update(ctx context.Context, request dtos.UpdateUserDto, oid string, userOid string) mappings.MessageVm
	Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm
	FindAll(ctx context.Context) []mappings.UserVm
	FindPage(ctx context.Context, condition dtos.FilterUserDto, page, pageSize int) ([]mappings.UserVm, int64)
	FindByEmail(ctx context.Context, email string) mappings.UserVm
	FindById(ctx context.Context, oid string) mappings.UserVm
}
