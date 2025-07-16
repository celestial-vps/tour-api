package models

import (
	"time"

	"github.com/google/uuid"
)

type ImageFile struct {
	Oid               uuid.UUID         `json:"oid"`
	FileName          *string           `json:"file_name"`
	FilePath          *string           `json:"file_path"`
	FileMime          *string           `json:"file_mime"`
	FileUrl           *string           `json:"file_url"`
	TransactionRecord TransactionRecord `json:"transaction_record"`
}

type ImageFileDomain struct {
	Oid            uuid.UUID  `json:"oid"`
	FileName       *string    `json:"file_name"`
	FilePath       *string    `json:"file_path"`
	FileMime       *string    `json:"file_mime"`
	FileUrl        *string    `json:"file_url"`
	CreatedBy      uuid.UUID  `json:"created_by"`
	CreatedAt      time.Time  `json:"created_at"`
	LastModifiedBy uuid.UUID  `json:"last__modified_by"`
	UpdatedAt      *time.Time `json:"updated_at"`
	DeletedBy      *uuid.UUID `json:"deleted_by"`
	DeletedAt      *time.Time `json:"deleted_at"`
}
