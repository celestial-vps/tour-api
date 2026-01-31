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
	AndroidToken   *string      `json:"android_token" db:"android_token"`
	TokenIos       *string      `json:"token_ios" db:"token_ios"`
	TokenWeb       *string      `json:"token_web" db:"token_web"`
	TokenDesktop   *string      `json:"token_desktop" db:"token_desktop"`
	ExpiredTime    *string      `json:"expired_time" db:"expired_time"`
	IsActive       *bool        `json:"is_active" db:"is_active"`
	ActivatedAt    sql.NullTime `json:"activated_at" db:"activated_at"`
	RoleOid        uuid.UUID    `json:"role_oid" db:"role_oid"`
	Role           *UserRole    `json:"role" db:"-"`
	CreatedBy      *uuid.UUID   `json:"created_by" db:"created_by"`
	CreatedAt      time.Time    `json:"created_at" db:"created_at"`
	LastModifiedBy uuid.UUID    `json:"last_modified_by" db:"last_modified_by"`
	UpdatedAt      *time.Time   `json:"updated_at" db:"updated_at"`
	DeletedBy      *uuid.UUID   `json:"deleted_by" db:"deleted_by"`
	DeletedAt      *time.Time   `json:"deleted_at" db:"deleted_at"`
}

type UserJoinUserRole struct {
	Oid              uuid.UUID    `json:"oid" db:"oid"`
	Name             string       `json:"name" db:"name"`
	Email            string       `json:"email" db:"email"`
	Password         string       `json:"password" db:"password"`
	AndroidToken     *string      `json:"android_token" db:"android_token"`
	ExpiredTime      *string      `json:"expired_time" db:"expired_time"`
	IsActive         *bool        `json:"is_active" db:"is_active"`
	ActivatedAt      sql.NullTime `json:"activatedAt" db:"activated_at"`
	CreatedBy        *uuid.UUID   `json:"created_by" db:"created_by"`
	CreatedAt        time.Time    `json:"created_at" db:"created_at"`
	LastModifiedBy   uuid.UUID    `json:"last_modified_by" db:"last_modified_by"`
	UpdatedAt        *time.Time   `json:"updated_at" db:"updated_at"`
	DeletedBy        *uuid.UUID   `json:"deleted_by" db:"deleted_by"`
	DeletedAt        *time.Time   `json:"deleted_at" db:"deleted_at"`
	RoleOid          *uuid.UUID   `json:"role_oid" db:"role_oid"`
	RoleName         string       `json:"role_name" db:"role_name"`
	TargetType       string       `json:"target_type" db:"target_type"`
	IsAdministrative bool         `json:"is_aministrative" db:"is_administrative"`
	ReadState        bool         `json:"read_state" db:"read_state"`
	WriteState       bool         `json:"write_state" db:"write_state"`
	CreateState      bool         `json:"create_state" db:"create_state"`
	DeleteState      bool         `json:"delete_state" db:"delete_state"`
	NavigateState    bool         `json:"navigate_state" db:"navigate_state"`
}
