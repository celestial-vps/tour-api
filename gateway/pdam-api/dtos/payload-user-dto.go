package dtos

type FilterUserDto struct {
	Email string `json:"email" validate:"omitempty"`
}

type RegisterDto struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type LoginDto struct {
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type CreateUserDto struct {
	Name         string `json:"name" validate:"required"`
	Email        string `json:"email" validate:"required,email"`
	Password     string `json:"password" validate:"required"`
	Birthday     string `json:"birthday" validate:"required"`
	MemberNumber string `json:"memberNumber" validate:"required"`
	AndroidToken string `json:"androidToken" validate:"required"`
	IsActive     *bool  `json:"isActive" validate:"required"` // Use pointer
	RoleOid      string `json:"roleOid" validate:"required"`
	ActivatedAt  string `json:"activatedAt" validate:"required"`
}

type UpdateUserDto struct {
	Name         string `json:"name" validate:"required"`
	Email        string `json:"email" validate:"required,email"`
	Password     string `json:"password" validate:"required"`
	Birthday     string `json:"birthday" validate:"required"`
	MemberNumber string `json:"memberNumber" validate:"required"`
	AndroidToken string `json:"androidToken" validate:"required"`
	IsActive     *bool  `json:"isActive" validate:"required"` // Use pointer
	RoleOid      string `json:"roleOid" validate:"required"`
	ActivatedAt  string `json:"activatedAt"`
}
