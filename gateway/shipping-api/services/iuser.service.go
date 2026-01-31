package services

import (
	"context"

	"shipping-api/dtos"
	"shipping-api/mappings"
)

type IUserService interface {
	Create(ctx context.Context, request dtos.CreateUserDto, userOid string) mappings.MessageVm
	Register(ctx context.Context, request dtos.RegisterDto) mappings.UserRegisterVm
	Login(ctx context.Context, request dtos.LoginDto) mappings.UserLoginVm
	RefreshToken(ctx context.Context, oid string, email string) mappings.UserLoginVm
	// GetUserRole(ctx context.Context, email string) mappings.UserLoginVm
	Update(ctx context.Context, request dtos.UpdateUserDto, oid string, userOid string) mappings.MessageVm
	Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm
	FindAll(ctx context.Context) []mappings.UserVm
	FindPage(ctx context.Context, condition dtos.FilterUserDto, page, pageSize int) ([]mappings.UserVm, int64)
	FindByEmail(ctx context.Context, email string) mappings.UserVm
	FindById(ctx context.Context, oid string) mappings.UserVm
}
