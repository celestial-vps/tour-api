package dtos

type FilterBankDto struct {
	BankCode string `json:"bankCode" validate:"omitempty"`
	BankName string `json:"bankName" validate:"omitempty"`
}

type CreateBankDto struct {
	BankCode  string `json:"bankCode" validate:"required"`
	BankName  string `json:"bankName" validate:"required"`
	ShortName string `json:"shortName" validate:"required,max=3"`
}

type UpdateBankDto struct {
	BankCode  string `json:"bankCode" validate:"required"`
	BankName  string `json:"bankName" validate:"required"`
	ShortName string `json:"shortName" validate:"required,max=3"`
}
