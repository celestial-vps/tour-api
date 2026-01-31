package mappings

import (
	"time"

	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/models"
)

type PaymentVm struct {
	Oid           uuid.UUID  `json:"oid"`
	BillOid       uuid.UUID  `json:"billOid"`
	PaymentDate   time.Time  `json:"paymentDate"`
	AmountPaid    float64    `json:"amountPaid"`
	PaymentMethod string     `json:"paymentMethod"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     *time.Time `json:"updatedAt"`
}

func ToPaymentResponse(customer models.PaymentDomain) PaymentVm {
	return PaymentVm{
		Oid:           customer.Oid,
		BillOid:       customer.BillOid,
		PaymentDate:   customer.PaymentDate,
		AmountPaid:    customer.AmountPaid,
		PaymentMethod: customer.PaymentMethod,
		CreatedAt:     customer.CreatedAt,
		UpdatedAt:     customer.UpdatedAt,
	}
}

func ToPaymentNormalResponse(customer models.Payment) PaymentVm {
	return PaymentVm{
		Oid:           customer.Oid,
		BillOid:       customer.BillOid,
		PaymentDate:   customer.PaymentDate,
		AmountPaid:    customer.AmountPaid,
		PaymentMethod: customer.PaymentMethod,
		// CreatedAt:     customer.CreatedAt,
		// UpdatedAt:     customer.UpdatedAt,
	}
}

func ToPaymentResponses(customers []models.PaymentDomain) []PaymentVm {
	var customerResponses []PaymentVm
	for _, customer := range customers {
		customerResponses = append(customerResponses, ToPaymentResponse(customer))
	}
	return customerResponses
}
