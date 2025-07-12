package mappings

import (
	"time"

	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/models"
)

type UserRoleVm struct {
	Oid              uuid.UUID  `json:"oid"`
	RoleName         string     `json:"roleName"`
	TargetType       string     `json:"targetType"`
	IsAdministrative bool       `json:"isAdministrative"`
	ReadState        bool       `json:"readState"`
	WriteState       bool       `json:"writeState"`
	CreateState      bool       `json:"createState"`
	DeleteState      bool       `json:"deleteState"`
	NavigateState    bool       `json:"navigateState"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        *time.Time `json:"updatedAt"`
}

func ToUserRoleResponse(userRole models.UserRoleDomain) UserRoleVm {
	return UserRoleVm{
		Oid:              userRole.Oid,
		RoleName:         userRole.RoleName,
		TargetType:       userRole.TargetType,
		IsAdministrative: userRole.IsAdministrative,
		ReadState:        userRole.ReadState,
		WriteState:       userRole.WriteState,
		CreateState:      userRole.CreateState,
		DeleteState:      userRole.DeleteState,
		NavigateState:    userRole.NavigateState,
		CreatedAt:        userRole.CreatedAt,
		// UpdatedAt:        userRole.UpdatedAt,
	}
}

func ToUserRoleResponses(userRoles []models.UserRoleDomain) []UserRoleVm {
	var userRoleResponses []UserRoleVm
	for _, userRole := range userRoles {
		userRoleResponses = append(userRoleResponses, ToUserRoleResponse(userRole))
	}
	return userRoleResponses
}
