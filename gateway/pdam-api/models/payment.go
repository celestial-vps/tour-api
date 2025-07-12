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
