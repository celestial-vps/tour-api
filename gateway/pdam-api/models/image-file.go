package models

import (
	"time"

	"github.com/google/uuid"
)

type ImageFile struct {
	Oid               uuid.UUID         `json:"oid"`
	FileName          *string           `json:"fileName"`
	FilePath          *string           `json:"filePath"`
	FileMime          *string           `json:"fileMime"`
	FileUrl           *string           `json:"fileUrl"`
	TransactionRecord TransactionRecord `json:"transactionRecord"`
}

type ImageFileDomain struct {
	Oid            uuid.UUID  `json:"oid"`
	FileName       *string    `json:"fileName"`
	FilePath       *string    `json:"filePath"`
	FileMime       *string    `json:"fileMime"`
	FileUrl        *string    `json:"fileUrl"`
	Description    *string    `json:"description"`
	CreatedBy      uuid.UUID  `json:"createdBy"`
	CreatedAt      time.Time  `json:"createdAt"`
	LastModifiedBy uuid.UUID  `json:"lastModifiedBy"`
	UpdatedAt      *time.Time `json:"updatedAt"`
	DeletedBy      *uuid.UUID `json:"deletedBy"`
	DeletedAt      *time.Time `json:"deletedAt"`
}
