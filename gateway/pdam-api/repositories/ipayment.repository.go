package repositories

import (
	"context"
	"database/sql"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/models"
)

type IPaymentRepository interface {
	Save(ctx context.Context, tx *sql.Tx, tarif models.Payment) (models.Payment, error)
	Update(ctx context.Context, tx *sql.Tx, tarif models.Payment) models.Payment
	Deleted(ctx context.Context, tx *sql.Tx, oid string) error
	FindAll(ctx context.Context, tx *sql.Tx) ([]models.PaymentDomain, error)
	FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterPaymentDto) ([]models.PaymentDomain, error)
	FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterPaymentDto) (int64, error)
	AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterPaymentDto) ([]models.PaymentDomain, error)
	FindById(ctx context.Context, tx *sql.Tx, oid string) (models.Payment, error)
}
