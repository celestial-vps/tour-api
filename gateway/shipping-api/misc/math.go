package misc

import (
	"fmt"
	"math"
	"strings"
)

func Round(val float64, roundOn float64, places int) (newVal float64) {
	var round float64
	pow := math.Pow(10, float64(places))
	digit := pow * val
	_, div := math.Modf(digit)
	if div >= roundOn {
		round = math.Ceil(digit)
	} else {
		round = math.Floor(digit)
	}
	newVal = round / pow
	return
}
func IncrementCode(lastCode string) (string, error) {

	var number int

	// Trim whitespace from the input
	lastCode = strings.TrimSpace(lastCode)

	// Split the last code into prefix and numeric part
	n, err := fmt.Sscanf(lastCode, "B-%d", &number) // Adjusted format to match "B-000001"
	if err != nil || n != 1 {
		return "", fmt.Errorf("invalid bank code format: '%s'", lastCode)
	}

	// Increment the numeric part
	number++

	// Format the new code with leading zeros
	newCode := fmt.Sprintf("B-%06d", number) // Ensure the prefix "B-" is used here
	return newCode, nil
}

func IncrementData(lastCode string) (string, error) {
	var number int
	var hr string
	var month, year int

	// Trim whitespace from the input
	lastCode = strings.TrimSpace(lastCode)

	// Split the last code into its components
	n, err := fmt.Sscanf(lastCode, "B-%d/%3s/%d/%d", &number, &hr, &month, &year)
	if err != nil || n != 4 {
		return "", fmt.Errorf("invalid bank code format: '%s'", lastCode)
	}

	// Increment the numeric part
	number++

	// Format the new code with leading zeros
	newCode := fmt.Sprintf("B-%06d/%s/%02d/%d", number, hr, month, year)
	return newCode, nil
}
