package services

import (
	"context"

	"shipping-api/dtos"
	"shipping-api/mappings"
)

type IBankService interface {
	Create(ctx context.Context, request dtos.CreateBankDto, userOid string) (mappings.MessageVm, error)
	Update(ctx context.Context, request dtos.UpdateBankDto, oid, userOid string) (mappings.MessageVm, error)
	Deleted(ctx context.Context, oid, userOid string) (mappings.MessageVm, error)
	FindAll(ctx context.Context) ([]mappings.BankVm, error)
	FindAllRedis(ctx context.Context) ([]mappings.BankVm, error)
	FindPage(ctx context.Context, condition dtos.FilterBankDto, page, pageSize int) ([]mappings.BankVm, int64, error)
	FindById(ctx context.Context, oid string) (mappings.BankVm, error)
}
