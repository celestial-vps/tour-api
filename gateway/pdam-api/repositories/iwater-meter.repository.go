package repositories

import (
	"context"
	"database/sql"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/models"
)

type IWaterMeterRepository interface {
	Save(ctx context.Context, tx *sql.Tx, tarif models.WaterMeter) (models.WaterMeter, error)
	Update(ctx context.Context, tx *sql.Tx, tarif models.WaterMeter) models.WaterMeter
	Deleted(ctx context.Context, tx *sql.Tx, oid string) error
	FindAll(ctx context.Context, tx *sql.Tx) ([]models.WaterMeterDomain, error)
	FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterWaterMeterDto) ([]models.WaterMeterDomain, error)
	FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterWaterMeterDto) (int64, error)
	AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterWaterMeterDto) ([]models.WaterMeterDomain, error)
	FindById(ctx context.Context, tx *sql.Tx, oid string) (models.WaterMeter, error)
}
