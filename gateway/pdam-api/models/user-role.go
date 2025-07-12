package models

import (
	"time"

	"github.com/google/uuid"
)

type UserRole struct {
	Oid               uuid.UUID         `json:"oid"`
	RoleName          string            `json:"roleName"`
	TargetType        string            `json:"targetType"`
	IsAdministrative  bool              `json:"isAdministrative"`
	ReadState         bool              `json:"readState"`
	WriteState        bool              `json:"writeState"`
	CreateState       bool              `json:"createState"`
	DeleteState       bool              `json:"deleteState"`
	NavigateState     bool              `json:"navigateState"`
	Users             []User            `json:"users"`
	TransactionRecord TransactionRecord `json:"transactionRecord"`
}

type UserRoleDomain struct {
	Oid              uuid.UUID  `json:"oid"`
	RoleName         string     `json:"roleName"`
	TargetType       string     `json:"targetType"`
	IsAdministrative bool       `json:"isAdministrative"`
	ReadState        bool       `json:"readState"`
	WriteState       bool       `json:"writeState"`
	CreateState      bool       `json:"createState"`
	DeleteState      bool       `json:"deleteState"`
	NavigateState    bool       `json:"navigateState"`
	Users            []User     `json:"users"`
	CreatedBy        uuid.UUID  `json:"createdBy"`
	CreatedAt        time.Time  `json:"createdAt"`
	LastModifiedBy   uuid.UUID  `json:"lastModifiedBy"`
	UpdatedAt        *time.Time `json:"updatedAt"`
	DeletedBy        *uuid.UUID `json:"deletedBy"`
	DeletedAt        *time.Time `json:"deletedAt"`
}
