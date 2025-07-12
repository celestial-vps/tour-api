package models

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

// User represents a user in the system
type User struct {
	Oid            uuid.UUID      `json:"oid"`
	Name           string         `json:"name"`
	Email          string         `json:"email"`
	Password       string         `json:"password"`
	Birthday       *time.Time     `json:"birthday"`
	MemberNumber   sql.NullString `json:"memberNumber"`
	AndroidToken   *string        `json:"androidToken"`
	ExpiredTime    *string        `json:"expiredTime"`
	IsActive       *bool          `json:"isActive"`
	ActivatedAt    sql.NullTime   `json:"activatedAt"`
	RoleOid        uuid.UUID      `json:"roleOid"`
	Role           *UserRole      `json:"role"`
	Description    *string        `json:"description"`
	CreatedBy      *uuid.UUID     `json:"createdBy"`
	CreatedAt      time.Time      `json:"createdAt"`
	LastModifiedBy uuid.UUID      `json:"lastModifiedBy"`
	UpdatedAt      *time.Time     `json:"updatedAt"`
	DeletedBy      *uuid.UUID     `json:"deletedBy"`
	DeletedAt      *time.Time     `json:"deletedAt"`
}

type UserJoinUserRole struct {
	Oid              uuid.UUID      `json:"oid"`
	Name             string         `json:"name"`
	Email            string         `json:"email"`
	Password         string         `json:"password"`
	Birthday         *time.Time     `json:"birthday"`
	MemberNumber     sql.NullString `json:"memberNumber"`
	AndroidToken     *string        `json:"androidToken"`
	ExpiredTime      *string        `json:"expiredTime"`
	IsActive         *bool          `json:"isActive"`
	ActivatedAt      sql.NullTime   `json:"activatedAt"`
	CreatedBy        *uuid.UUID     `json:"createdBy"`
	CreatedAt        time.Time      `json:"createdAt"`
	LastModifiedBy   uuid.UUID      `json:"lastModifiedBy"`
	UpdatedAt        *time.Time     `json:"updatedAt"`
	DeletedBy        *uuid.UUID     `json:"deletedBy"`
	DeletedAt        *time.Time     `json:"deletedAt"`
	RoleOid          *uuid.UUID     `json:"roleOid"`
	RoleName         string         `json:"roleName"`
	TargetType       string         `json:"targetType"`
	IsAdministrative bool           `json:"isAdministrative"`
	ReadState        bool           `json:"readState"`
	WriteState       bool           `json:"writeState"`
	CreateState      bool           `json:"createState"`
	DeleteState      bool           `json:"deleteState"`
	NavigateState    bool           `json:"navigateState"`
}
