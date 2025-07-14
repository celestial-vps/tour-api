package models

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type User struct {
	Oid            uuid.UUID    `json:"oid" db:"oid"`
	Email          string       `json:"email" db:"email"`
	Password       string       `json:"password" db:"password"`
	AndroidToken   *string      `json:"androidToken" db:"android_token"`
	ExpiredTime    *string      `json:"expiredTime" db:"expired_time"`
	IsActive       *bool        `json:"isActive" db:"is_active"`
	ActivatedAt    sql.NullTime `json:"activatedAt" db:"activated_at"`
	RoleOid        uuid.UUID    `json:"roleOid" db:"role_oid"`
	Role           *UserRole    `json:"role" db:"-"`
	CreatedBy      *uuid.UUID   `json:"createdBy" db:"created_by"`
	CreatedAt      time.Time    `json:"createdAt" db:"created_at"`
	LastModifiedBy uuid.UUID    `json:"lastModifiedBy" db:"last_modified_by"`
	UpdatedAt      *time.Time   `json:"updatedAt" db:"updated_at"`
	DeletedBy      *uuid.UUID   `json:"deletedBy" db:"deleted_by"`
	DeletedAt      *time.Time   `json:"deletedAt" db:"deleted_at"`
}

type UserJoinUserRole struct {
	Oid              uuid.UUID    `json:"oid" db:"oid"`
	Name             string       `json:"name" db:"name"`
	Email            string       `json:"email" db:"email"`
	Password         string       `json:"password" db:"password"`
	AndroidToken     *string      `json:"androidToken" db:"android_token"`
	ExpiredTime      *string      `json:"expiredTime" db:"expired_time"`
	IsActive         *bool        `json:"isActive" db:"is_active"`
	ActivatedAt      sql.NullTime `json:"activatedAt" db:"activated_at"`
	CreatedBy        *uuid.UUID   `json:"createdBy" db:"created_by"`
	CreatedAt        time.Time    `json:"createdAt" db:"created_at"`
	LastModifiedBy   uuid.UUID    `json:"lastModifiedBy" db:"last_modified_by"`
	UpdatedAt        *time.Time   `json:"updatedAt" db:"updated_at"`
	DeletedBy        *uuid.UUID   `json:"deletedBy" db:"deleted_by"`
	DeletedAt        *time.Time   `json:"deletedAt" db:"deleted_at"`
	RoleOid          *uuid.UUID   `json:"roleOid" db:"role_oid"`
	RoleName         string       `json:"roleName" db:"role_name"`
	TargetType       string       `json:"targetType" db:"target_type"`
	IsAdministrative bool         `json:"isAdministrative" db:"is_administrative"`
	ReadState        bool         `json:"readState" db:"read_state"`
	WriteState       bool         `json:"writeState" db:"write_state"`
	CreateState      bool         `json:"createState" db:"create_state"`
	DeleteState      bool         `json:"deleteState" db:"delete_state"`
	NavigateState    bool         `json:"navigateState" db:"navigate_state"`
}
