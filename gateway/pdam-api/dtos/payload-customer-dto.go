package dtos

type FilterCustomerDto struct {
	FirstName string `json:"firstName" validate:"omitempty"`
	LastName  string `json:"lastName" validate:"omitempty"`
}

type CreateCustomerDto struct {
	FirstName   string `json:"firstName" validate:"required" `
	MiddleName  string `json:"middleName" validate:"omitempty"`
	LastName    string `json:"lastName" validate:"omitempty"`
	Email       string `json:"email" validate:"required,email" `
	PhoneNumber string `json:"phoneNumber" validate:"required" `
	Address     string `json:"address" validate:"required" `
}

type UpdateCustomerDto struct {
	FirstName   string `json:"firstName" validate:"required" `
	MiddleName  string `json:"middleName" validate:"omitempty"`
	LastName    string `json:"lastName" validate:"omitempty"`
	Email       string `json:"email" validate:"required,email" `
	PhoneNumber string `json:"phoneNumber" validate:"required" `
	Address     string `json:"address" validate:"required" `
}
