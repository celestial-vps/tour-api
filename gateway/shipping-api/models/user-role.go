package models

import (
	"github.com/google/uuid"
)

type UserRole struct {
	Oid               uuid.UUID         `gorm:"type:char(36);primaryKey" json:"oid"`
	RoleName          string            `gorm:"column:roleName;type:varchar(50);unique;not null" json:"roleName"`
	TargetType        string            `gorm:"column:targetType;type:varchar(50)" json:"targetType"`
	IsAdministrative  bool              `gorm:"column:isAdministrative;type:boolean" json:"isAdministrative"`
	ReadState         bool              `gorm:"column:readState;type:boolean" json:"readState"`
	WriteState        bool              `gorm:"column:writeState;type:boolean" json:"writeState"`
	CreateState       bool              `gorm:"column:createState;type:boolean" json:"createState"`
	DeleteState       bool              `gorm:"column:deleteState;type:boolean" json:"deleteState"`
	NavigateState     bool              `gorm:"column:navigateState;type:boolean" json:"navigateState"`
	Users             []User            `gorm:"foreignKey:RoleOid;references:Oid" json:"users"`
	TransactionRecord TransactionRecord `gorm:"embedded" json:"transactionRecord"`
}
