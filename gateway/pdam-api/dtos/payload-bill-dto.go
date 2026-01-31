package dtos

import "time"

type FilterBillDto struct {
	UsageOid string `json:"usageOid" validate:"omitempty"`
}

type CreateBillDto struct {
	UsageOid    string    `json:"usageOid" validate:"required" `
	BillingDate time.Time `json:"billingDate" validate:"required" `
	TotalAmount float64   `json:"totalAmount" validate:"required" `
	Status      string    `json:"status" validate:"required" `
}

type UpdateBillDto struct {
	UsageOid    string    `json:"usageOid" validate:"required" `
	BillingDate time.Time `json:"billingDate" validate:"required" `
	TotalAmount float64   `json:"totalAmount" validate:"required" `
	Status      string    `json:"status" validate:"required" `
}
