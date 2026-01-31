package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TransactionRecord struct {
	CreatedBy      uuid.UUID      `gorm:"column:createdBy;type:char(36);"`
	CreatedAt      time.Time      `gorm:"column:createdAt;autoCreateTime"`
	LastModifiedBy uuid.UUID      `gorm:"column:lastModifiedBy;type:char(36);"`
	UpdatedAt      *time.Time     `gorm:"column:updatedAt;autoUpdateTime<-:update"` // <- permission field hanya boleh di update
	DeletedBy      *uuid.UUID     `gorm:"column:deletedBy;type:char(36);"`
	DeletedAt      gorm.DeletedAt `gorm:"column:deletedAt"` //permission field tidak di create atau read
}
