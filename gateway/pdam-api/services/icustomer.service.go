package services

import (
	"context"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
)

type ICustomerService interface {
	Create(ctx context.Context, request dtos.CreateCustomerDto, userOid string) mappings.MessageVm
	Update(ctx context.Context, request dtos.UpdateCustomerDto, oid string, userOid string) mappings.MessageVm
	Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm
	FindAll(ctx context.Context) []mappings.CustomerVm
	FindPage(ctx context.Context, condition dtos.FilterCustomerDto, page, pageSize int) ([]mappings.CustomerVm, int64)
	FindById(ctx context.Context, oid string) mappings.CustomerVm
}
