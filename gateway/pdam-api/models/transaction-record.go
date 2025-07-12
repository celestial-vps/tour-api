package models

import (
	"time"

	"github.com/google/uuid"
)

type TransactionRecord struct {
	Description    *string    `json:"description"`
	CreatedBy      uuid.UUID  `json:"createdBy"`
	CreatedAt      time.Time  `json:"createdAt"`
	LastModifiedBy uuid.UUID  `json:"lastModifiedBy"`
	UpdatedAt      *time.Time `json:"updatedAt"`
	DeletedBy      *uuid.UUID `json:"deletedBy"`
	DeletedAt      *time.Time `json:"deletedAt"`
}
