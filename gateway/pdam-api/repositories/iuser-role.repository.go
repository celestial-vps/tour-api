package repositories

import (
	"context"
	"database/sql"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/models"
)

type IUserRoleRepository interface {
	Save(ctx context.Context, tx *sql.Tx, userRole models.UserRole) models.UserRole
	Update(ctx context.Context, tx *sql.Tx, userRole models.UserRoleDomain) models.UserRoleDomain
	Deleted(ctx context.Context, tx *sql.Tx, oid string)
	FindAll(ctx context.Context, tx *sql.Tx) []models.UserRoleDomain
	FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterUserRoleDto) ([]models.UserRoleDomain, error)
	FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterUserRoleDto) (int64, error)
	AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterUserRoleDto) ([]models.UserRoleDomain, error)
	FindById(ctx context.Context, tx *sql.Tx, oid string) (models.UserRoleDomain, error)
}
