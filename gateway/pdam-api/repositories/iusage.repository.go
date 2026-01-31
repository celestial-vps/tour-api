package repositories

import (
	"context"
	"database/sql"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/models"
)

type IUsageRecordRepository interface {
	Save(ctx context.Context, tx *sql.Tx, tarif models.UsageRecord) (models.UsageRecord, error)
	Update(ctx context.Context, tx *sql.Tx, tarif models.UsageRecord) models.UsageRecord
	Deleted(ctx context.Context, tx *sql.Tx, oid string) error
	FindAll(ctx context.Context, tx *sql.Tx) ([]models.UsageRecordDomain, error)
	FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterUsageRecordDto) ([]models.UsageRecordDomain, error)
	FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterUsageRecordDto) (int64, error)
	AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterUsageRecordDto) ([]models.UsageRecordDomain, error)
	FindById(ctx context.Context, tx *sql.Tx, oid string) (models.UsageRecord, error)
}
