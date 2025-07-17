package services

import (
	"context"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
)

type IBillService interface {
	Create(ctx context.Context, request dtos.CreateBillDto, userOid string) (mappings.MessageVm, error)
	Update(ctx context.Context, request dtos.UpdateBillDto, oid string, userOid string) (mappings.MessageVm, error)
	Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error)
	FindAll(ctx context.Context, userOid string) ([]mappings.BillVm, error)
	FindPage(ctx context.Context, condition dtos.FilterBillDto, page, pageSize int, userOid string) ([]mappings.BillVm, int64, error)
	FindById(ctx context.Context, oid string, userOid string) (mappings.BillVm, error)
}
