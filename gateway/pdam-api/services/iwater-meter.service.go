package services

import (
	"context"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
)

type IWaterMeterService interface {
	Create(ctx context.Context, request dtos.CreateWaterMeterDto, userOid string) (mappings.MessageVm, error)
	Update(ctx context.Context, request dtos.UpdateWaterMeterDto, oid string, userOid string) (mappings.MessageVm, error)
	Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error)
	FindAll(ctx context.Context, userOid string) ([]mappings.WaterMeterVm, error)
	FindPage(ctx context.Context, condition dtos.FilterWaterMeterDto, page, pageSize int, userOid string) ([]mappings.WaterMeterVm, int64, error)
	FindById(ctx context.Context, oid string, userOid string) (mappings.WaterMeterVm, error)
}
