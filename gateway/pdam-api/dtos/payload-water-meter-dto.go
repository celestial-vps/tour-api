package dtos

type FilterWaterMeterDto struct {
	SerialNumber string `json:"serialNumber" validate:"omitempty"`
}

type CreateWaterMeterDto struct {
	SerialNumber string `json:"serialNumber" validate:"required" `
	CustomerOid  string `json:"customerOid" validate:"omitempty"`
	InstalledAt  string `json:"installedAt" validate:"required" `
	ReplacedAt   string `json:"replacedAt" validate:"omitempty" `
	Status       string `json:"status" validate:"required" `
}

type UpdateWaterMeterDto struct {
	SerialNumber string `json:"serialNumber" validate:"required" `
	CustomerOid  string `json:"customerOid" validate:"omitempty"`
	InstalledAt  string `json:"installedAt" validate:"required" `
	ReplacedAt   string `json:"replacedAt" validate:"omitempty" `
	Status       string `json:"status" validate:"required" `
}
