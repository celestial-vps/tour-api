package dtos

import (
	"time"

	"github.com/google/uuid"
)

type FilterPaymentDto struct {
	BillOid string `json:"billOid" validate:"omitempty"`
}

type CreatePaymentDto struct {
	BillOid       uuid.UUID `json:"billOid" validate:"required" `
	PaymentDate   time.Time `json:"paymentDate" validate:"omitempty"`
	AmountPaid    float64   `json:"amountPaid" validate:"required" `
	PaymentMethod string    `json:"paymentMethod" validate:"required" `
}

type UpdatePaymentDto struct {
	BillOid       uuid.UUID `json:"billOid" validate:"required" `
	PaymentDate   time.Time `json:"paymentDate" validate:"omitempty"`
	AmountPaid    float64   `json:"amountPaid" validate:"required" `
	PaymentMethod string    `json:"paymentMethod" validate:"required" `
}
