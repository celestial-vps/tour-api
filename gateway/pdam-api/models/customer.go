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
	Description    *string    `json:"description"`
	CreatedBy      uuid.UUID  `json:"createdBy"`
	CreatedAt      time.Time  `json:"createdAt"`
	LastModifiedBy uuid.UUID  `json:"lastModifiedBy"`
	UpdatedAt      *time.Time `json:"updatedAt"`
	DeletedBy      *uuid.UUID `json:"deletedBy"`
	DeletedAt      *time.Time `json:"deletedAt"`
}
