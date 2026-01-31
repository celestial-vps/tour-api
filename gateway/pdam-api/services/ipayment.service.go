package services

import (
	"context"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
)

type IPaymentService interface {
	Create(ctx context.Context, request dtos.CreatePaymentDto, userOid string) (mappings.MessageVm, error)
	Update(ctx context.Context, request dtos.UpdatePaymentDto, oid string, userOid string) (mappings.MessageVm, error)
	Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error)
	FindAll(ctx context.Context, userOid string) ([]mappings.PaymentVm, error)
	FindPage(ctx context.Context, condition dtos.FilterPaymentDto, page, pageSize int, userOid string) ([]mappings.PaymentVm, int64, error)
	FindById(ctx context.Context, oid string, userOid string) (mappings.PaymentVm, error)
}
