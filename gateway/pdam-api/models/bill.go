package models

import (
	"time"

	"github.com/google/uuid"
)

type Bill struct {
	Oid         uuid.UUID    `json:"oid"`
	UsageOid    uuid.UUID    `json:"usageOid"`
	Usage       *UsageRecord `json:"usage"`
	BillingDate time.Time    `json:"billingDate"`
	TotalAmount float64      `json:"totalAmount"`
	Status      string       `json:"status"` // Unpaid / Paid / Overdue
	CreatedAt   time.Time    `json:"createdAt"`
	UpdatedAt   *time.Time   `json:"updatedAt"`
	DeletedAt   *time.Time   `json:"deletedAt"`
}
