package models

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	Oid            uuid.UUID      `gorm:"type:char(36);primaryKey" json:"oid"`
	Email          string         `gorm:"type:varchar(150);unique;not null" json:"email"`
	Password       string         `gorm:"type:varchar(150);not null" json:"password"`
	AndroidToken   *string        `gorm:"column:androidToken;type:varchar(255)" json:"androidToken,omitempty"` // Omit if null
	ExpiredTime    *string        `gorm:"column:expiredTime;type:varchar(50)" json:"expiredTime,omitempty"`    // Omit if null
	IsActive       *bool          `gorm:"column:isActive;type:boolean" json:"isActive,omitempty"`              // Omit if null
	ActivatedAt    sql.NullTime   `gorm:"column:activatedAt;type:timestamp" json:"activatedAt,omitempty"`      // Omit if null
	RoleOid        uuid.UUID      `gorm:"column:roleOid;type:char(36);not null" json:"roleOid"`                // Foreign key to UserRole
	Role           *UserRole      `gorm:"foreignKey:roleOid;references:Oid" json:"role,omitempty"`
	Description    *string        `gorm:"column:description;type:text;default:null"`
	CreatedBy      *uuid.UUID     `gorm:"column:createdBy;type:char(36);"`
	CreatedAt      time.Time      `gorm:"column:createdAt;autoCreateTime"`
	LastModifiedBy uuid.UUID      `gorm:"column:lastModifiedBy;type:char(36);"`
	UpdatedAt      *time.Time     `gorm:"column:updatedAt;autoUpdateTime<-:update"` // <- permission field hanya boleh di update
	DeletedBy      *uuid.UUID     `gorm:"column:deletedBy;type:char(36);"`
	DeletedAt      gorm.DeletedAt `gorm:"column:deletedAt"`
	// TransactionRecord TransactionRecord `gorm:"embedded" json:"transactionRecord"`
}
