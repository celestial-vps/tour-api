package dtos

import "time"

type FilterUsageRecordDto struct {
	MeterOid string `json:"meterOid" validate:"omitempty"`
}

type CreateUsageRecordDto struct {
	MeterOid      string    `json:"meterOid" validate:"required" `
	BillingMonth  time.Time `json:"billingMonth" validate:"omitempty"`
	StartReading  int       `json:"startReading" validate:"required" `
	EndReading    int       `json:"endReading" validate:"required" `
	ConsumptionM3 int       `json:"consumptionM3" validate:"required" `
}

type UpdateUsageRecordDto struct {
	MeterOid      string    `json:"meterOid" validate:"required" `
	BillingMonth  time.Time `json:"billingMonth" validate:"omitempty"`
	StartReading  int       `json:"startReading" validate:"required" `
	EndReading    int       `json:"endReading" validate:"required" `
	ConsumptionM3 int       `json:"consumptionM3" validate:"required" `
}
