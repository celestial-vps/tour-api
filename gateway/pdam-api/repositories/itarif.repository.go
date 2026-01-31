package repositories

import (
	"context"
	"database/sql"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/models"
)

type ITarifRepository interface {
	Save(ctx context.Context, tx *sql.Tx, tarif models.Tarif) (models.Tarif, error)
	Update(ctx context.Context, tx *sql.Tx, tarif models.Tarif) models.Tarif
	Deleted(ctx context.Context, tx *sql.Tx, oid string) error
	FindAll(ctx context.Context, tx *sql.Tx) ([]models.TarifDomain, error)
	FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterTarifDto) ([]models.TarifDomain, error)
	FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterTarifDto) (int64, error)
	AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterTarifDto) ([]models.TarifDomain, error)
	FindById(ctx context.Context, tx *sql.Tx, oid string) (models.Tarif, error)
}
