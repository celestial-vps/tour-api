package services

import (
	"context"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
)

type IUserRoleService interface {
	Create(ctx context.Context, request dtos.CreateUserRoleDto, userOid string) mappings.MessageVm
	Update(ctx context.Context, request dtos.UpdateUserRoleDto, oid string, userOid string) mappings.MessageVm
	Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm
	FindAll(ctx context.Context) []mappings.UserRoleVm
	FindPage(ctx context.Context, condition dtos.FilterUserRoleDto, page, pageSize int) ([]mappings.UserRoleVm, int64)
	FindById(ctx context.Context, oid string) mappings.UserRoleVm
}
