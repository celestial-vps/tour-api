package dtos

import "time"

type FilterTarifDto struct {
	CustomerType string `json:"customerType" validate:"omitempty"`
}

type CreateTarifDto struct {
	CustomerType  string     `json:"customerType" validate:"required" `
	MinVolume     int        `json:"minVolume" validate:"omitempty"`
	MaxVolume     int        `json:"maxVolume" validate:"required" `
	PricePerM3    float64    `json:"pricePerM3" validate:"required" `
	EffectiveFrom time.Time  `json:"effectiveFrom" validate:"required" `
	EffectiveTo   *time.Time `json:"effectiveTo" validate:"required" `
}

type UpdateTarifDto struct {
	CustomerType  string     `json:"customerType" validate:"required" `
	MinVolume     int        `json:"minVolume" validate:"omitempty"`
	MaxVolume     int        `json:"maxVolume" validate:"required" `
	PricePerM3    float64    `json:"pricePerM3" validate:"required" `
	EffectiveFrom time.Time  `json:"effectiveFrom" validate:"required" `
	EffectiveTo   *time.Time `json:"e" validate:"required" `
}
