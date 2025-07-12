package models

type Name struct {
	FirstName  string  `json:"firstName"`  // First name of the person
	MiddleName *string `json:"middleName"` // Middle name of the person
	LastName   *string `json:"lastName"`   // Last name of the person
}
