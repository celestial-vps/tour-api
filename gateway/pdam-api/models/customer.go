package models

import (
	"time"

	"github.com/google/uuid"
)

type Customer struct {
	Oid               uuid.UUID         `json:"oid"`
	Name              Name              `json:"name"`
	Email             string            `json:"email"`
	PhoneNumber       string            `json:"phoneNumber"`
	Address           string            `json:"address"`
	ImageOid          *uuid.UUID        `json:"imageOider"`
	ImageFile         *ImageFile        `json:"imageFile"`
	TransactionRecord TransactionRecord `json:"transactionRecord"`
}

type CustomerDomain struct {
	Oid            uuid.UUID  `json:"oid"`
	FirstName      string     `json:"firstName"`  // First name of the person
	MiddleName     *string    `json:"middleName"` // Middle name of the person
	LastName       *string    `json:"lastName"`   // Last name of the person
	Email          string     `json:"email"`
	PhoneNumber    string     `json:"phoneNumber"`
	Address        string     `json:"address"`
	ImageOid       *uuid.UUID `json:"imageOider"`
	ImageFile      *ImageFile `json:"imageFile"`
	CreatedBy      uuid.UUID  `json:"created_by"`
	CreatedAt      time.Time  `json:"created_at"`
	LastModifiedBy uuid.UUID  `json:"lastModified_by"`
	UpdatedAt      *time.Time `json:"updated_at"`
	DeletedBy      *uuid.UUID `json:"deleted_by"`
	DeletedAt      *time.Time `json:"deleted_at"`
}
