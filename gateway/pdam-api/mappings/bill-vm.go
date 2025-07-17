package mappings

import (
	"time"

	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/models"
)

type BillVm struct {
	Oid         uuid.UUID  `json:"oid"`
	UsageOid    uuid.UUID  `json:"usageOid"`
	BillingDate time.Time  `json:"billingDate"`
	TotalAmount float64    `json:"totalAmount"`
	Status      string     `json:"status"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   *time.Time `json:"updatedAt"`
}

func ToBillResponse(customer models.BillDomain) BillVm {
	return BillVm{
		Oid:         customer.Oid,
		UsageOid:    customer.UsageOid,
		BillingDate: customer.BillingDate,
		TotalAmount: customer.TotalAmount,
		Status:      customer.Status,
		CreatedAt:   customer.CreatedAt,
		UpdatedAt:   customer.UpdatedAt,
	}
}

func ToBillNormalResponse(customer models.Bill) BillVm {
	return BillVm{
		Oid:         customer.Oid,
		UsageOid:    customer.UsageOid,
		BillingDate: customer.BillingDate,
		TotalAmount: customer.TotalAmount,
		Status:      customer.Status,
		// CreatedAt:     customer.CreatedAt,
		// UpdatedAt:     customer.UpdatedAt,
	}
}

func ToBillResponses(customers []models.BillDomain) []BillVm {
	var customerResponses []BillVm
	for _, customer := range customers {
		customerResponses = append(customerResponses, ToBillResponse(customer))
	}
	return customerResponses
}
