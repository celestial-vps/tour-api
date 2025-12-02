package dtos

type FilterBankDto struct {
	BankCode string `json:"bankCode" validate:"omitempty" example:"B001"`         // contoh default filter code
	BankName string `json:"bankName" validate:"omitempty" example:"Bank Central"` // contoh default filter name
}

type CreateBankDto struct {
	BankCode  string `json:"bankCode" validate:"required" example:"B001"`         // contoh default bank code
	BankName  string `json:"bankName" validate:"required" example:"Bank Central"` // contoh default bank name
	ShortName string `json:"shortName" validate:"required,max=3" example:"BC"`    // contoh default short name
}

type UpdateBankDto struct {
	BankCode  string `json:"bankCode" validate:"required" example:"B001"`         // contoh default bank code
	BankName  string `json:"bankName" validate:"required" example:"Bank Central"` // contoh default bank name
	ShortName string `json:"shortName" validate:"required,max=3" example:"BC"`    // contoh default short name
}
