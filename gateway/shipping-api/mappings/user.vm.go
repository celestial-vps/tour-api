package mappings

import (
	"time"

	"shipping-api/models"

	"github.com/google/uuid"
)

type UserVm struct {
	Oid          uuid.UUID      `json:"oid"`
	Name         *string        `json:"name"`
	Email        string         `json:"email"`
	Role         UserRoleMiniVm `json:"role"`
	Password     string         `json:"password"`
	Birthday     *time.Time     `json:"birthday"`
	MemberNumber string         `json:"memberNumber"`
	AndroidToken *string        `json:"androidToken"`
	ExpiredTime  *string        `json:"expiredTime"`
	IsActive     *bool          `json:"isActive"`
	ActivatedAt  string         `json:"activatedAt"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    *time.Time     `json:"updatedAt"`
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
		Role:         ToUserRoleMiniResponse(user.Role),
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

func ToUserRoleMiniResponse(userRole *models.UserRole) UserRoleMiniVm {
	return UserRoleMiniVm{
		Oid:      userRole.Oid,
		RoleName: userRole.RoleName,
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
