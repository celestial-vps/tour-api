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
	RoleName         string     `json:"role_name" db:"role_name"`
	TargetType       string     `json:"target_type" db:"target_type"`
	IsAdministrative bool       `json:"is_administrative" db:"is_administrative"`
	ReadState        bool       `json:"read_state" db:"read_state"`
	WriteState       bool       `json:"write_state" db:"write_state"`
	CreateState      bool       `json:"create_state" db:"create_state"`
	DeleteState      bool       `json:"delete_state" db:"delete_state"`
	NavigateState    bool       `json:"navigate_state" db:"navigate_state"`
	Users            []User     `json:"users" db:"-"`
	CreatedBy        uuid.UUID  `json:"created_by" db:"created_by"`
	CreatedAt        time.Time  `json:"created_at" db:"created_at"`
	LastModifiedBy   uuid.UUID  `json:"last_modified_by" db:"last_modified_by"`
	UpdatedAt        *time.Time `json:"updated_at" db:"updated_at"`
	DeletedBy        *uuid.UUID `json:"deleted_by" db:"deleted_by"`
	DeletedAt        *time.Time `json:"deleted_at" db:"deleted_at"`
}
