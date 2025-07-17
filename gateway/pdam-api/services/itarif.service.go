package services

import (
	"context"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
)

type ITarifService interface {
	Create(ctx context.Context, request dtos.CreateTarifDto, userOid string) (mappings.MessageVm, error)
	Update(ctx context.Context, request dtos.UpdateTarifDto, oid string, userOid string) (mappings.MessageVm, error)
	Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error)
	FindAll(ctx context.Context, userOid string) ([]mappings.TarifVm, error)
	FindPage(ctx context.Context, condition dtos.FilterTarifDto, page, pageSize int, userOid string) ([]mappings.TarifVm, int64, error)
	FindById(ctx context.Context, oid string, userOid string) (mappings.TarifVm, error)
}
