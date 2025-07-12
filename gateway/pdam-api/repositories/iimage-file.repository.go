package repositories

import (
	"context"
	"database/sql"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/models"
)

type IImageFileRepository interface {
	Save(ctx context.Context, tx *sql.Tx, imageFile models.ImageFile) models.ImageFile
	Update(ctx context.Context, tx *sql.Tx, imageFile models.ImageFileDomain) models.ImageFileDomain
	Deleted(ctx context.Context, tx *sql.Tx, oid string)
	FindAll(ctx context.Context, tx *sql.Tx) []models.ImageFileDomain
	FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterImageFileDto) ([]models.ImageFileDomain, error)
	FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterImageFileDto) (int64, error)
	AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterImageFileDto) ([]models.ImageFileDomain, error)
	FindById(ctx context.Context, tx *sql.Tx, oid string) (models.ImageFileDomain, error)
}
