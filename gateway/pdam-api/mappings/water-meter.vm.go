package mappings

import (
	"time"

	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/models"
)

type WaterMeterVm struct {
	Oid          uuid.UUID  `json:"oid"`
	SerialNumber string     `json:"serialNumber"`
	CustomerOid  uuid.UUID  `json:"customerOid"`
	InstalledAt  time.Time  `json:"installedAt"`
	ReplacedAt   *time.Time `json:"replacedAt"`
	Status       string     `json:"status"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    *time.Time `json:"updatedAt"`
}

func ToWaterMeterResponse(customer models.WaterMeterDomain) WaterMeterVm {
	return WaterMeterVm{
		Oid:          customer.Oid,
		SerialNumber: customer.SerialNumber,
		CustomerOid:  customer.CustomerOid,
		InstalledAt:  customer.InstalledAt,
		ReplacedAt:   customer.ReplacedAt,
		Status:       customer.Status,
	}
}

func ToWaterMeterNormalResponse(customer models.WaterMeter) WaterMeterVm {
	return WaterMeterVm{
		Oid:          customer.Oid,
		SerialNumber: customer.SerialNumber,
		CustomerOid:  customer.CustomerOid,
		InstalledAt:  customer.InstalledAt,
		ReplacedAt:   customer.ReplacedAt,
		Status:       customer.Status,
	}
}

func ToWaterMeterResponses(customers []models.WaterMeterDomain) []WaterMeterVm {
	var customerResponses []WaterMeterVm
	for _, customer := range customers {
		customerResponses = append(customerResponses, ToWaterMeterResponse(customer))
	}
	return customerResponses
}
