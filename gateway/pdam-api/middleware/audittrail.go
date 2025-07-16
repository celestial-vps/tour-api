package middleware

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type AuditPayload struct {
	TableName     string                 `json:"tableName"`
	RecordOid     *string                `json:"recordOid,omitempty"` // pointer
	Action        string                 `json:"action"`
	Status        string                 `json:"status"`
	Message       string                 `json:"message"`
	NewData       map[string]interface{} `json:"newData,omitempty"`
	PreviousData  map[string]interface{} `json:"previousData,omitempty"`  // ✅ Ganti dari `OldData`
	ChangedFields []string               `json:"changedFields,omitempty"` // Opsional
	UserOid       string                 `json:"userOid,omitempty"`
	IpAddress     string                 `json:"ipAddress,omitempty"`
	UserAgent     string                 `json:"userAgent,omitempty"`
}

func RecordAuditTrail(payload AuditPayload, url string) error {
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	fmt.Println("URL:", url)
	fmt.Println("Payload JSON:", string(jsonData))

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Bisa cek status code resp.StatusCode di sini jika perlu

	return nil
}
