package services

import (
	"context"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
)

type IUsageRecordService interface {
	Create(ctx context.Context, request dtos.CreateUsageRecordDto, userOid string) (mappings.MessageVm, error)
	Update(ctx context.Context, request dtos.UpdateUsageRecordDto, oid string, userOid string) (mappings.MessageVm, error)
	Deleted(ctx context.Context, oid string, userOid string) (mappings.MessageVm, error)
	FindAll(ctx context.Context, userOid string) ([]mappings.UsageRecordVm, error)
	FindPage(ctx context.Context, condition dtos.FilterUsageRecordDto, page, pageSize int, userOid string) ([]mappings.UsageRecordVm, int64, error)
	FindById(ctx context.Context, oid string, userOid string) (mappings.UsageRecordVm, error)
}
