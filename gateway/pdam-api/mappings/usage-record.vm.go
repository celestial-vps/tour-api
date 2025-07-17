package mappings

import (
	"time"

	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/models"
)

type UsageRecordVm struct {
	Oid           uuid.UUID  `json:"oid"`
	MeterOid      uuid.UUID  `json:"customerType"`
	BillingMonth  time.Time  `json:"minVolume"`
	StartReading  int        `json:"maxVolume"`
	EndReading    int        `json:"pricePerM3"`
	ConsumptionM3 int        `json:"effectiveFrom"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     *time.Time `json:"updatedAt"`
}

func ToUsageRecordResponse(customer models.UsageRecordDomain) UsageRecordVm {
	return UsageRecordVm{
		Oid:           customer.Oid,
		MeterOid:      customer.MeterOid,
		BillingMonth:  customer.BillingMonth,
		StartReading:  customer.StartReading,
		EndReading:    customer.EndReading,
		ConsumptionM3: customer.ConsumptionM3,
		CreatedAt:     customer.CreatedAt,
		UpdatedAt:     customer.UpdatedAt,
	}
}

func ToUsageRecordNormalResponse(customer models.UsageRecord) UsageRecordVm {
	return UsageRecordVm{
		Oid:           customer.Oid,
		MeterOid:      customer.MeterOid,
		BillingMonth:  customer.BillingMonth,
		StartReading:  customer.StartReading,
		EndReading:    customer.EndReading,
		ConsumptionM3: customer.ConsumptionM3,
		// CreatedAt:     customer.CreatedAt,
		// UpdatedAt:     customer.UpdatedAt,
	}
}

func ToUsageRecordResponses(customers []models.UsageRecordDomain) []UsageRecordVm {
	var customerResponses []UsageRecordVm
	for _, customer := range customers {
		customerResponses = append(customerResponses, ToUsageRecordResponse(customer))
	}
	return customerResponses
}
