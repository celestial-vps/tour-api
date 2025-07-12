package repositories

import (
	"context"
	"database/sql"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/models"
)

type ICustomerRepository interface {
	Save(ctx context.Context, tx *sql.Tx, customer models.Customer) models.Customer
	Update(ctx context.Context, tx *sql.Tx, customer models.Customer) models.Customer
	Deleted(ctx context.Context, tx *sql.Tx, oid string)
	FindAll(ctx context.Context, tx *sql.Tx) []models.CustomerDomain
	FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterCustomerDto) ([]models.CustomerDomain, error)
	FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterCustomerDto) (int64, error)
	AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterCustomerDto) ([]models.CustomerDomain, error)
	FindById(ctx context.Context, tx *sql.Tx, oid string) (models.Customer, error)
}
