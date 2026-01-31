package mappings

import (
	"time"

	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/models"
)

type CustomerVm struct {
	Oid         uuid.UUID  `json:"oid"`
	FirstName   string     `json:"firstName"`
	MiddleName  *string    `json:"middleName"`
	LastName    *string    `json:"lastName"`
	Email       string     `json:"email"`
	PhoneNumber string     `json:"phoneNumber"`
	Address     string     `json:"address"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   *time.Time `json:"updatedAt"`
}

func ToCustomerResponse(customer models.CustomerDomain) CustomerVm {
	return CustomerVm{
		Oid:         customer.Oid,
		FirstName:   customer.FirstName,
		MiddleName:  customer.MiddleName,
		LastName:    customer.LastName,
		Email:       customer.Email,
		PhoneNumber: customer.PhoneNumber,
		Address:     customer.Address,
		CreatedAt:   customer.CreatedAt,
		UpdatedAt:   customer.UpdatedAt,
	}
}
func ToCustomerNormalResponse(customer models.Customer) CustomerVm {
	return CustomerVm{
		Oid:         customer.Oid,
		FirstName:   customer.Name.FirstName,
		MiddleName:  customer.Name.MiddleName,
		LastName:    customer.Name.LastName,
		Email:       customer.Email,
		PhoneNumber: customer.PhoneNumber,
		Address:     customer.Address,
		CreatedAt:   customer.TransactionRecord.CreatedAt,
		UpdatedAt:   customer.TransactionRecord.UpdatedAt,
	}
}

func ToCustomerResponses(customers []models.CustomerDomain) []CustomerVm {
	var customerResponses []CustomerVm
	for _, customer := range customers {
		customerResponses = append(customerResponses, ToCustomerResponse(customer))
	}
	return customerResponses
}
