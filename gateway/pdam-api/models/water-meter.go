package models

import (
	"time"

	"github.com/google/uuid"
)

type WaterMeter struct {
	Oid               uuid.UUID         `json:"oid"`
	SerialNumber      string            `json:"serialNumber"`
	CustomerOid       uuid.UUID         `json:"customerOid"`
	Customer          *Customer         `json:"customer"`
	InstalledAt       time.Time         `json:"installedAt"`
	ReplacedAt        *time.Time        `json:"replacedAt"`
	Status            string            `json:"status"` // Active / Inactive
	TransactionRecord TransactionRecord `json:"transactionRecord"`
}

type WaterMeterDomain struct {
	Oid            uuid.UUID  `json:"oid"`
	SerialNumber   string     `json:"serialNumber"`
	CustomerOid    uuid.UUID  `json:"customerOid"`
	Customer       *Customer  `json:"customer"`
	InstalledAt    time.Time  `json:"installedAt"`
	ReplacedAt     *time.Time `json:"replacedAt"`
	Status         string     `json:"status"` // Active / Inactive
	CreatedBy      uuid.UUID  `json:"created_by"`
	CreatedAt      time.Time  `json:"created_at"`
	LastModifiedBy uuid.UUID  `json:"lastModified_by"`
	UpdatedAt      *time.Time `json:"updated_at"`
	DeletedBy      *uuid.UUID `json:"deleted_by"`
	DeletedAt      *time.Time `json:"deleted_at"`
}
