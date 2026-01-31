package models

import (
	"time"

	"github.com/google/uuid"
)

type UsageRecord struct {
	Oid               uuid.UUID         `json:"oid"`
	MeterOid          uuid.UUID         `json:"meterOid"`
	Meter             *WaterMeter       `json:"meter"`
	BillingMonth      time.Time         `json:"billingMonth"` // Use first day of month
	StartReading      int               `json:"startReading"`
	EndReading        int               `json:"endReading"`
	ConsumptionM3     int               `json:"consumptionM3"`
	TransactionRecord TransactionRecord `json:"transactionRecord"`
}

type UsageRecordDomain struct {
	Oid            uuid.UUID   `json:"oid"`
	MeterOid       uuid.UUID   `json:"meterOid"`
	Meter          *WaterMeter `json:"meter"`
	BillingMonth   time.Time   `json:"billingMonth"` // Use first day of month
	StartReading   int         `json:"startReading"`
	EndReading     int         `json:"endReading"`
	ConsumptionM3  int         `json:"consumptionM3"`
	CreatedBy      uuid.UUID   `json:"created_by"`
	CreatedAt      time.Time   `json:"created_at"`
	LastModifiedBy uuid.UUID   `json:"lastModified_by"`
	UpdatedAt      *time.Time  `json:"updated_at"`
	DeletedBy      *uuid.UUID  `json:"deleted_by"`
	DeletedAt      *time.Time  `json:"deleted_at"`
}
