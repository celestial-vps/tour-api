package mappings

import (
	"time"

	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/models"
)

type TarifVm struct {
	Oid           uuid.UUID  `json:"oid"`
	CustomerType  string     `json:"customerType"`
	MinVolume     int        `json:"minVolume"`
	MaxVolume     int        `json:"maxVolume"`
	PricePerM3    float64    `json:"pricePerM3"`
	EffectiveFrom time.Time  `json:"effectiveFrom"`
	EffectiveTo   *time.Time `json:"effectiveTo"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     *time.Time `json:"updatedAt"`
}

func ToTarifResponse(customer models.TarifDomain) TarifVm {
	return TarifVm{
		Oid:           customer.Oid,
		CustomerType:  customer.CustomerType,
		MinVolume:     customer.MinVolume,
		MaxVolume:     customer.MaxVolume,
		PricePerM3:    customer.PricePerM3,
		EffectiveFrom: customer.EffectiveFrom,
		EffectiveTo:   customer.EffectiveTo,
		CreatedAt:     customer.CreatedAt,
		UpdatedAt:     customer.UpdatedAt,
	}
}

func ToTarifNormalResponse(customer models.Tarif) TarifVm {
	return TarifVm{
		Oid:           customer.Oid,
		CustomerType:  customer.CustomerType,
		MinVolume:     customer.MinVolume,
		MaxVolume:     customer.MaxVolume,
		PricePerM3:    customer.PricePerM3,
		EffectiveFrom: customer.EffectiveFrom,
		EffectiveTo:   customer.EffectiveTo,
		// CreatedAt:     customer.CreatedAt,
		// UpdatedAt:     customer.UpdatedAt,
	}
}

func ToTarifResponses(customers []models.TarifDomain) []TarifVm {
	var customerResponses []TarifVm
	for _, customer := range customers {
		customerResponses = append(customerResponses, ToTarifResponse(customer))
	}
	return customerResponses
}
