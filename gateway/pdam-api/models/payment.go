package models

import (
	"time"

	"github.com/google/uuid"
)

type Payment struct {
	Oid               uuid.UUID         `json:"oid"`
	BillOid           uuid.UUID         `json:"billOid"`
	Bill              *Bill             `json:"bill"`
	PaymentDate       time.Time         `json:"paymentDate"`
	AmountPaid        float64           `json:"amountPaid"`
	PaymentMethod     string            `json:"paymentMethod"` // Cash / Transfer / QRIS / etc.
	TransactionRecord TransactionRecord `json:"transactionRecord"`
}

type PaymentDomain struct {
	Oid            uuid.UUID  `json:"oid"`
	BillOid        uuid.UUID  `json:"billOid"`
	Bill           *Bill      `json:"bill"`
	PaymentDate    time.Time  `json:"paymentDate"`
	AmountPaid     float64    `json:"amountPaid"`
	PaymentMethod  string     `json:"paymentMethod"` // Cash / Transfer / QRIS / etc.
	CreatedBy      uuid.UUID  `json:"created_by"`
	CreatedAt      time.Time  `json:"created_at"`
	LastModifiedBy uuid.UUID  `json:"lastModified_by"`
	UpdatedAt      *time.Time `json:"updated_at"`
	DeletedBy      *uuid.UUID `json:"deleted_by"`
	DeletedAt      *time.Time `json:"deleted_at"`
}
