package models

import (
	"time"

	"github.com/google/uuid"
)

type Bill struct {
	Oid               uuid.UUID         `json:"oid"`
	UsageOid          uuid.UUID         `json:"usageOid"`
	Usage             *UsageRecord      `json:"usage"`
	BillingDate       time.Time         `json:"billingDate"`
	TotalAmount       float64           `json:"totalAmount"`
	Status            string            `json:"status"` // Unpaid / Paid / Overdue
	TransactionRecord TransactionRecord `json:"transactionRecord"`
}

type BillDomain struct {
	Oid            uuid.UUID    `json:"oid"`
	UsageOid       uuid.UUID    `json:"usageOid"`
	Usage          *UsageRecord `json:"usage"`
	BillingDate    time.Time    `json:"billingDate"`
	TotalAmount    float64      `json:"totalAmount"`
	Status         string       `json:"status"` // Unpaid / Paid / Overdue
	CreatedBy      uuid.UUID    `json:"created_by"`
	CreatedAt      time.Time    `json:"created_at"`
	LastModifiedBy uuid.UUID    `json:"lastModified_by"`
	UpdatedAt      *time.Time   `json:"updated_at"`
	DeletedBy      *uuid.UUID   `json:"deleted_by"`
	DeletedAt      *time.Time   `json:"deleted_at"`
}
