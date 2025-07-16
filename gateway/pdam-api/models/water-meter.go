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
