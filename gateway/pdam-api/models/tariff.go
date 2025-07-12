package models

import (
	"time"

	"github.com/google/uuid"
)

type Tariff struct {
	Oid               uuid.UUID         `json:"oid"`
	CustomerType      string            `json:"customerType"` // Residential / Commercial / Industrial
	MinVolume         int               `json:"minVolume"`
	MaxVolume         int               `json:"maxVolume"`
	PricePerM3        float64           `json:"pricePerM3"`
	EffectiveFrom     time.Time         `json:"effectiveFrom"`
	EffectiveTo       *time.Time        `json:"effectiveTo"`
	TransactionRecord TransactionRecord `json:"transactionRecord"`
}
