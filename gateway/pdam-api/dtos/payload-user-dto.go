package dtos

type FilterUserDto struct {
	Email string `json:"email" validate:"omitempty"`
}

type RegisterDto struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type LoginDto struct {
	Email        string `json:"email" validate:"required"`
	Password     string `json:"password" validate:"required"`
	AndroidToken string `json:"androidToken" validate:"omitempty"`
	Platform     string `json:"platform" validate:"required"`
	IosToken     string `json:"iosToken" validate:"omitempty"`
	WebToken     string `json:"webToken" validate:"omitempty"`
	DesktopToken string `json:"desktopToken" validate:"omitempty"`
}

type CreateUserDto struct {
	Name         string `json:"name" validate:"required"`
	Email        string `json:"email" validate:"required,email"`
	Password     string `json:"password" validate:"required"`
	AndroidToken string `json:"androidToken" validate:"required"`
	IsActive     *bool  `json:"isActive" validate:"required"` // Use pointer
	RoleOid      string `json:"roleOid" validate:"required"`
	ActivatedAt  string `json:"activatedAt" validate:"required"`
}

type UpdateUserDto struct {
	Name         string `json:"name" validate:"required"`
	Email        string `json:"email" validate:"required,email"`
	Password     string `json:"password" validate:"required"`
	AndroidToken string `json:"androidToken" validate:"required"`
	IsActive     *bool  `json:"isActive" validate:"required"` // Use pointer
	RoleOid      string `json:"roleOid" validate:"required"`
	ActivatedAt  string `json:"activatedAt"`
}
