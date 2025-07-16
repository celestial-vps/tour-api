package services

import (
	"context"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
)

type IImageFileService interface {
	Create(ctx context.Context, request dtos.CreateImageFileDto, userOid string) mappings.MessageVm
	Update(ctx context.Context, request dtos.UpdateImageFileDto, oid string, userOid string) mappings.MessageVm
	Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm
	FindById(ctx context.Context, oid string) mappings.ImageFileVm
	FindPage(ctx context.Context, condition dtos.FilterImageFileDto, page, pageSize int) ([]mappings.ImageFileVm, int64)
}
