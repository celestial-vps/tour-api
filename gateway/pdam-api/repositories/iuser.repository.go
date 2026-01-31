package repositories

import (
	"context"
	"database/sql"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/models"
)

type IUserRepository interface {
	Save(ctx context.Context, tx *sql.Tx, user models.User) models.User
	Update(ctx context.Context, tx *sql.Tx, user models.User) models.User
	Deleted(ctx context.Context, tx *sql.Tx, oid string)
	FindAll(ctx context.Context, tx *sql.Tx) []models.User
	FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterUserDto) ([]models.UserJoinUserRole, error)
	FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterUserDto) (int64, error)
	AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterUserDto) ([]models.User, error)
	FindUserRole(ctx context.Context, tx *sql.Tx, email string) (string, error)
	FindById(ctx context.Context, tx *sql.Tx, oid string) (models.UserJoinUserRole, error)
	FindByMiniId(ctx context.Context, tx *sql.Tx, oid string) (models.User, error)
}
