package models

import (
	"github.com/google/uuid"
)

type Bank struct {
	Oid               uuid.UUID         `gorm:"column:oid;type:char(36);primary_key"`
	BankCode          string            `gorm:"column:bankCode;type:varchar(20);unique"`
	BankName          string            `gorm:"column:bankName;type:varchar(40)"`
	ShortName         string            `gorm:"column:shortName;type:varchar(4)"`
	TransactionRecord TransactionRecord `gorm:"embedded"`
}
