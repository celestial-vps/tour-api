package mappings

import (
	"time"

	"shipping-api/models"

	"github.com/google/uuid"
)

type UserRoleVm struct {
	Oid              uuid.UUID    `json:"oid"`
	RoleName         string       `json:"roleName"`
	TargetType       string       `json:"targetType"`
	IsAdministrative bool         `json:"isAdministrative"`
	ReadState        bool         `json:"readState"`
	WriteState       bool         `json:"writeState"`
	CreateState      bool         `json:"createState"`
	DeleteState      bool         `json:"deleteState"`
	NavigateState    bool         `json:"navigateState"`
	CreatedAt        time.Time    `json:"createdAt"`
	UpdatedAt        *time.Time   `json:"updatedAt"`
	Users            []UserMiniVm `json:"users"`
}

type UserMiniVm struct {
	Oid  uuid.UUID `json:"oid"`
	Name *string   `json:"name"`
}

func ToUserRoleResponse(userRole models.UserRole) UserRoleVm {
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
		CreatedAt:        userRole.TransactionRecord.CreatedAt,
		UpdatedAt:        userRole.TransactionRecord.UpdatedAt,
		Users:            ToUserMiniResponses(userRole.Users),
	}

}

func ToUserRoleResponses(userRoles []models.UserRole) []UserRoleVm {
	var userRoleResponses []UserRoleVm
	for _, userRole := range userRoles {
		userRoleResponses = append(userRoleResponses, ToUserRoleResponse(userRole))
	}
	return userRoleResponses
}

func ToUserMiniResponse(user models.User) UserMiniVm {
	return UserMiniVm{
		Oid:  user.Oid,
		Name: &user.Email,
	}
}

func ToUserMiniResponses(users []models.User) []UserMiniVm {
	var userResponses []UserMiniVm
	for _, user := range users {
		userResponses = append(userResponses, ToUserMiniResponse(user))
	}
	return userResponses
}
