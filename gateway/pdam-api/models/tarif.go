package models

import (
	"time"

	"github.com/google/uuid"
)

type Tarif struct {
	Oid               uuid.UUID         `json:"oid"`
	CustomerType      string            `json:"customerType"` // Residential / Commercial / Industrial
	MinVolume         int               `json:"minVolume"`
	MaxVolume         int               `json:"maxVolume"`
	PricePerM3        float64           `json:"pricePerM3"`
	EffectiveFrom     time.Time         `json:"effectiveFrom"`
	EffectiveTo       *time.Time        `json:"effectiveTo"`
	TransactionRecord TransactionRecord `json:"transactionRecord"`
}

type TarifDomain struct {
	Oid            uuid.UUID  `json:"oid"`
	CustomerType   string     `json:"customerType"` // Residential / Commercial / Industrial
	MinVolume      int        `json:"minVolume"`
	MaxVolume      int        `json:"maxVolume"`
	PricePerM3     float64    `json:"pricePerM3"`
	EffectiveFrom  time.Time  `json:"effectiveFrom"`
	EffectiveTo    *time.Time `json:"effectiveTo"`
	CreatedBy      uuid.UUID  `json:"created_by"`
	CreatedAt      time.Time  `json:"created_at"`
	LastModifiedBy uuid.UUID  `json:"lastModified_by"`
	UpdatedAt      *time.Time `json:"updated_at"`
	DeletedBy      *uuid.UUID `json:"deleted_by"`
	DeletedAt      *time.Time `json:"deleted_at"`
}
