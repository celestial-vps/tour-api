package models

import (
	"time"

	"github.com/google/uuid"
)

type TransactionRecord struct {
	CreatedBy      uuid.UUID  `json:"created_by"`
	CreatedAt      time.Time  `json:"created_at"`
	LastModifiedBy uuid.UUID  `json:"last_modified_by"`
	UpdatedAt      *time.Time `json:"updated_at"`
	DeletedBy      *uuid.UUID `json:"deleted_by"`
	DeletedAt      *time.Time `json:"deleted_at"`
}
