package dtos

type FilterUserRoleDto struct {
	RoleName string `json:"roleName" validate:"omitempty" example:"Admin"`
}

type CreateUserRoleDto struct {
	RoleName         string `json:"roleName" validate:"required" example:"Admin"`
	TargetType       string `json:"targetType" validate:"required" example:"System"`
	IsAdministrative bool   `json:"isAdministrative" validate:"required,boolean" example:"true"`
	ReadState        bool   `json:"readState" validate:"required,boolean" example:"true"`
	WriteState       bool   `json:"writeState" validate:"required,boolean" example:"true"`
	CreateState      bool   `json:"createState" validate:"required,boolean" example:"true"`
	DeleteState      bool   `json:"deleteState" validate:"required,boolean" example:"false"`
	NavigateState    bool   `json:"navigateState" validate:"required,boolean" example:"true"`
}

type UpdateUserRoleDto struct {
	RoleName         string `json:"roleName" validate:"required" example:"Admin"`
	TargetType       string `json:"targetType" validate:"required" example:"System"`
	IsAdministrative bool   `json:"isAdministrative" validate:"required,boolean" example:"true"`
	ReadState        bool   `json:"readState" validate:"required,boolean" example:"true"`
	WriteState       bool   `json:"writeState" validate:"required,boolean" example:"true"`
	CreateState      bool   `json:"createState" validate:"required,boolean" example:"true"`
	DeleteState      bool   `json:"deleteState" validate:"required,boolean" example:"false"`
	NavigateState    bool   `json:"navigateState" validate:"required,boolean" example:"true"`
}
