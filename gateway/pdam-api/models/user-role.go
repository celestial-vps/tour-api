package models

import (
	"time"

	"github.com/google/uuid"
)

type UserRole struct {
	Oid               uuid.UUID         `json:"oid" db:"oid"`
	RoleName          string            `json:"roleName" db:"role_name"`
	TargetType        string            `json:"targetType" db:"target_type"`
	IsAdministrative  bool              `json:"isAdministrative" db:"is_administrative"`
	ReadState         bool              `json:"readState" db:"read_state"`
	WriteState        bool              `json:"writeState" db:"write_state"`
	CreateState       bool              `json:"createState" db:"create_state"`
	DeleteState       bool              `json:"deleteState" db:"delete_state"`
	NavigateState     bool              `json:"navigateState" db:"navigate_state"`
	Users             []User            `json:"users" db:"-"`
	TransactionRecord TransactionRecord `json:"transactionRecord" db:"-"`
}

type UserRoleDomain struct {
	Oid              uuid.UUID  `json:"oid" db:"oid"`
	RoleName         string     `json:"roleName" db:"role_name"`
	TargetType       string     `json:"targetType" db:"target_type"`
	IsAdministrative bool       `json:"isAdministrative" db:"is_administrative"`
	ReadState        bool       `json:"readState" db:"read_state"`
	WriteState       bool       `json:"writeState" db:"write_state"`
	CreateState      bool       `json:"createState" db:"create_state"`
	DeleteState      bool       `json:"deleteState" db:"delete_state"`
	NavigateState    bool       `json:"navigateState" db:"navigate_state"`
	Users            []User     `json:"users" db:"-"`
	CreatedBy        uuid.UUID  `json:"createdBy" db:"created_by"`
	CreatedAt        time.Time  `json:"createdAt" db:"created_at"`
	LastModifiedBy   uuid.UUID  `json:"lastModifiedBy" db:"last_modified_by"`
	UpdatedAt        *time.Time `json:"updatedAt" db:"updated_at"`
	DeletedBy        *uuid.UUID `json:"deletedBy" db:"deleted_by"`
	DeletedAt        *time.Time `json:"deletedAt" db:"deleted_at"`
}
