package services

import (
	"context"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
)

type ICustomerService interface {
	Create(ctx context.Context, request dtos.CreateCustomerDto, userOid string) (mappings.MessageVm, error)
	Update(ctx context.Context, request dtos.UpdateCustomerDto, oid string, userOid string) (mappings.MessageVm, error)
	Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error)
	FindAll(ctx context.Context, userOid string) ([]mappings.CustomerVm, error)
	FindPage(ctx context.Context, condition dtos.FilterCustomerDto, page, pageSize int, userOid string) ([]mappings.CustomerVm, int64, error)
	FindAdvance(ctx context.Context, condition dtos.FilterCustomerDto, userOid string) ([]mappings.CustomerVm, error)
	FindById(ctx context.Context, oid string, userOid string) (mappings.CustomerVm, error)
}
