package mappings

import (
	"time"

	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/models"
)

type UserVm struct {
	Oid          uuid.UUID       `json:"oid"`
	Email        string          `json:"email"`
	Role         *UserRoleMiniVm `json:"role,omitempty"` // Use pointer and omit if nil
	Password     string          `json:"password"`
	AndroidToken *string         `json:"androidToken"`
	ExpiredTime  *string         `json:"expiredTime"`
	IsActive     *bool           `json:"isActive"`
	ActivatedAt  string          `json:"activatedAt"`
	CreatedAt    time.Time       `json:"createdAt"`
	UpdatedAt    *time.Time      `json:"updatedAt"`
}

type UserRoleMiniVm struct {
	Oid      uuid.UUID `json:"oid"`
	RoleName string    `json:"roleName"`
}

type UserRegisterVm struct {
	Oid       uuid.UUID  `json:"oid"`
	Email     string     `json:"email"`
	IsActive  *bool      `json:"isActive"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt *time.Time `json:"updatedAt"`
}

type UserLoginVm struct {
	Oid          uuid.UUID  `json:"oid"`
	Email        string     `json:"email"`
	Token        string     `json:"token"`
	RefreshToken string     `json:"refreshToken"`
	IsActive     *bool      `json:"isActive"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    *time.Time `json:"updatedAt"`
}

func ToUserResponse(user models.User) UserVm {
	return UserVm{
		Oid:          user.Oid,
		Email:        user.Email,
		Password:     user.Password,
		AndroidToken: user.AndroidToken,
		ExpiredTime:  user.ExpiredTime,
		IsActive:     user.IsActive,
		ActivatedAt:  user.ActivatedAt.Time.Format(time.RFC3339),
		CreatedAt:    user.CreatedAt,
		// UpdatedAt:    user.UpdatedAt,
	}
}

func ToUserRegisterResponse(user models.User) UserRegisterVm {
	return UserRegisterVm{
		Oid:       user.Oid,
		Email:     user.Email,
		IsActive:  user.IsActive,
		CreatedAt: user.CreatedAt,
		// UpdatedAt: user.UpdatedAt,
	}
}

func ToUserTokenResponse(user models.User, token string, refreshToken string, role string) UserLoginVm {
	return UserLoginVm{
		Oid:          user.Oid,
		Email:        user.Email,
		Token:        token,
		RefreshToken: refreshToken,
		IsActive:     user.IsActive,
		CreatedAt:    user.CreatedAt,
		// UpdatedAt:    user.UpdatedAt,
	}
}

func ToUserResponses(users []models.User) []UserVm {
	var userResponses []UserVm
	for _, user := range users {
		userResponses = append(userResponses, ToUserResponse(user))
	}
	return userResponses
}

func ToUserJoinUserRoleResponses(users []models.UserJoinUserRole) []UserVm {
	var userResponses []UserVm
	for _, user := range users {
		userResponses = append(userResponses, ToUserJoinUserRoleResponse(user))
	}
	return userResponses
}
func ToUserJoinUserRoleResponse(user models.UserJoinUserRole) UserVm {
	var role *UserRoleMiniVm // Use a pointer for Role

	if user.RoleOid != nil {
		r := UserRoleMiniVm{
			Oid:      *user.RoleOid,
			RoleName: user.RoleName,
		}
		role = &r // Assign a pointer to the new role
	}

	return UserVm{
		Oid:          user.Oid,
		Role:         role, // Will be nil if no role
		Email:        user.Email,
		Password:     user.Password,
		AndroidToken: user.AndroidToken,
		ExpiredTime:  user.ExpiredTime,
		IsActive:     user.IsActive,
		ActivatedAt:  user.ActivatedAt.Time.Format(time.RFC3339),
		CreatedAt:    user.CreatedAt,
		// UpdatedAt:    user.UpdatedAt,
	}
}
