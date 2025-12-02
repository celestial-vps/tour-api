package dtos

type FilterUserDto struct {
	Email string `json:"email" validate:"omitempty" example:"user@example.com"`
}

type RegisterDto struct {
	Email    string `json:"email" validate:"required,email" example:"weslyaioria@gmail.com"`
	Password string `json:"password" validate:"required" example:"serverh5n"`
}

type LoginDto struct {
	Email    string `json:"email" validate:"required" example:"weslyaioria@gmail.com"`
	Password string `json:"password" validate:"required" example:"serverh5n"`
}

type CreateUserDto struct {
	Name         string `json:"name" validate:"required" example:"Wesly Aioria"`
	Email        string `json:"email" validate:"required,email" example:"weslyaioria@gmail.com"`
	Password     string `json:"password" validate:"required" example:"serverh5n"`
	AndroidToken string `json:"androidToken" validate:"required" example:"abcdef123456"`
	IsActive     *bool  `json:"isActive" validate:"required" example:"true"`
	RoleOid      string `json:"roleOid" validate:"required" example:"role-uuid-1234"`
	ActivatedAt  string `json:"activatedAt" validate:"required" example:"2025-12-02T12:00:00Z"`
}

type UpdateUserDto struct {
	Name         string `json:"name" validate:"required" example:"Wesly Aioria"`
	Email        string `json:"email" validate:"required,email" example:"weslyaioria@gmail.com"`
	Password     string `json:"password" validate:"required" example:"serverh5n"`
	AndroidToken string `json:"androidToken" validate:"required" example:"abcdef123456"`
	IsActive     *bool  `json:"isActive" validate:"required" example:"true"`
	RoleOid      string `json:"roleOid" validate:"required" example:"role-uuid-1234"`
	ActivatedAt  string `json:"activatedAt" example:"2025-12-02T12:00:00Z"`
}
