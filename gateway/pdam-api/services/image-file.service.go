package services

import (
	"context"
	"database/sql"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
	"github.com/pdam-api/go-pdam-api/models"
	"github.com/pdam-api/go-pdam-api/repositories"
)

type ImageFileService struct {
	ImageFileRepository repositories.IImageFileRepository
	DB                  *sql.DB
	Validate            *validator.Validate
}

func NewImageFileService(imageFileRepository repositories.IImageFileRepository, DB *sql.DB, validate *validator.Validate) IImageFileService {
	return &ImageFileService{
		ImageFileRepository: imageFileRepository,
		DB:                  DB,
		Validate:            validate,
	}
}

func (service *ImageFileService) Create(ctx context.Context, request dtos.CreateImageFileDto, userOid string) mappings.MessageVm {
	createdBy, err := uuid.Parse(userOid)
	if err != nil {
		common.PanicIfError(err)
	}
	imageFile := models.ImageFile{
		Oid:      uuid.New(),
		FileName: &request.FileName,
		FilePath: &request.FilePath,
		FileMime: &request.FileMime,
		FileUrl:  &request.FileUrl,
		TransactionRecord: models.TransactionRecord{
			CreatedBy: createdBy,
			CreatedAt: time.Now(),
		},
	}

	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	imageFile = service.ImageFileRepository.Save(ctx, tx, imageFile)
	// return mappings.ToImageFileResponse(imageFile)
	messageVm := mappings.MessageVm{
		Value: imageFile.Oid.String(),
		Name:  *imageFile.FileName,
	}
	return messageVm
}

func (service *ImageFileService) Update(ctx context.Context, request dtos.UpdateImageFileDto, oid string, userOid string) mappings.MessageVm {
	err := service.Validate.Struct(request)
	common.PanicIfError(err)
	lastModifiedBy, err := uuid.Parse(userOid)
	if err != nil {
		common.PanicIfError(err)
	}

	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	imageFile, err := service.ImageFileRepository.FindById(ctx, tx, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	now := time.Now()
	imageFile.FileName = &request.FileName
	imageFile.FileUrl = &request.FileUrl
	imageFile.FilePath = &request.FilePath
	imageFile.FileMime = &request.FileMime
	imageFile.LastModifiedBy = lastModifiedBy
	imageFile.UpdatedAt = &now
	imageFile = service.ImageFileRepository.Update(ctx, tx, imageFile)

	// return mappings.ToImageFileResponse(imageFile)
	messageVm := mappings.MessageVm{
		Value: imageFile.Oid.String(),
		Name:  *imageFile.FileName,
	}
	return messageVm
}

func (service *ImageFileService) Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	imageFile, err := service.ImageFileRepository.FindById(ctx, tx, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	service.ImageFileRepository.Deleted(ctx, tx, oid)
	messageVm := mappings.MessageVm{
		Value: imageFile.Oid.String(),
		Name:  *imageFile.FileName,
	}
	return messageVm
}

func (service *ImageFileService) FindById(ctx context.Context, oid string) mappings.ImageFileVm {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	imageFile, err := service.ImageFileRepository.FindById(ctx, tx, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	return mappings.ToImageFileResponse(imageFile)
}

// FindPage implements IImageFileService.
func (service *ImageFileService) FindPage(ctx context.Context, condition dtos.FilterImageFileDto, page int, pageSize int) ([]mappings.ImageFileVm, int64) {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	count, err := service.ImageFileRepository.FindCountByCriteria(ctx, tx, condition)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	imageFiles, err := service.ImageFileRepository.FindByCriteriaPage(ctx, tx, page, pageSize, condition)

	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	return mappings.ToImageFileResponses(imageFiles), count
}

// func (service *ImageFileService) FindPage(ctx context.Context, condition dtos.FilterImageFileDto, page, pageSize int) ([]mappings.ImageFileVm, int64) {
// 	count, err := service.ImageFileRepository.FindCountByCriteria(ctx, tx, condition)
// 	if err != nil {
// 		panic(common.NewNotFoundError(err.Error()))
// 	}
// 	imageFiles, err := service.ImageFileRepository.FindByCriteriaPage(ctx, tx, page, pageSize, condition)

// 	if err != nil {
// 		panic(common.NewNotFoundError(err.Error()))
// 	}
// 	return mappings.ToImageFileResponses(imageFiles), count
// }
