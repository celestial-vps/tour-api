package repositories

import (
	"context"
	"database/sql"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/models"
)

type IBillRepository interface {
	Save(ctx context.Context, tx *sql.Tx, tarif models.Bill) (models.Bill, error)
	Update(ctx context.Context, tx *sql.Tx, tarif models.Bill) models.Bill
	Deleted(ctx context.Context, tx *sql.Tx, oid string) error
	FindAll(ctx context.Context, tx *sql.Tx) ([]models.BillDomain, error)
	FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterBillDto) ([]models.BillDomain, error)
	FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterBillDto) (int64, error)
	AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterBillDto) ([]models.BillDomain, error)
	FindById(ctx context.Context, tx *sql.Tx, oid string) (models.Bill, error)
}
