package services

import (
	"context"

	"shipping-api/dtos"
	"shipping-api/mappings"
)

type IBankService interface {
	Create(ctx context.Context, request dtos.CreateBankDto, userOid string) mappings.MessageVm
	Update(ctx context.Context, request dtos.UpdateBankDto, oid string, userOid string) mappings.MessageVm
	Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm
	FindAll(ctx context.Context) []mappings.BankVm
	FindAllRedis(ctx context.Context) []mappings.BankVm
	FindPage(ctx context.Context, condition dtos.FilterBankDto, page, pageSize int) ([]mappings.BankVm, int64)
	FindById(ctx context.Context, oid string) mappings.BankVm
}
