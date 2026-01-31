package mappings

import (
	"time"

	"shipping-api/models"

	"github.com/google/uuid"
)

type BankVm struct {
	Oid       uuid.UUID  `json:"oid"`
	BankCode  string     `json:"bankCode"`
	BankName  string     `json:"bankName"`
	ShortName string     `json:"shortName"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt *time.Time `json:"updatedAt"`
}

func ToBankResponse(bank models.Bank) BankVm {
	return BankVm{
		Oid:       bank.Oid,
		BankCode:  bank.BankCode,
		BankName:  bank.BankName,
		ShortName: bank.ShortName,
		CreatedAt: bank.TransactionRecord.CreatedAt,
		UpdatedAt: bank.TransactionRecord.UpdatedAt,
	}
}

func ToBankResponses(banks []models.Bank) []BankVm {
	var bankResponses []BankVm
	for _, bank := range banks {
		bankResponses = append(bankResponses, ToBankResponse(bank))
	}
	return bankResponses
}
