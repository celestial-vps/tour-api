package dtos

type FilterUserRoleDto struct {
	RoleName string `json:"roleName" validate:"omitempty"`
}

type CreateUserRoleDto struct {
	RoleName         string `json:"roleName" validate:"required"`
	TargetType       string `json:"targetType" validate:"required"`
	IsAdministrative bool   `json:"isAdministrative" validate:"required,boolean"`
	ReadState        bool   `json:"readState" validate:"required,boolean"`
	WriteState       bool   `json:"writeState" validate:"required,boolean"`
	CreateState      bool   `json:"createState" validate:"required,boolean"`
	DeleteState      bool   `json:"deleteState" validate:"required,boolean"`
	NavigateState    bool   `json:"navigateState" validate:"required,boolean"`
}

type UpdateUserRoleDto struct {
	RoleName         string `json:"roleName" validate:"required"`
	TargetType       string `json:"targetType" validate:"required"`
	IsAdministrative bool   `json:"isAdministrative" validate:"required,boolean"`
	ReadState        bool   `json:"readState" validate:"required,boolean"`
	WriteState       bool   `json:"writeState" validate:"required,boolean"`
	CreateState      bool   `json:"createState" validate:"required,boolean"`
	DeleteState      bool   `json:"deleteState" validate:"required,boolean"`
	NavigateState    bool   `json:"navigateState" validate:"required,boolean"`
}
