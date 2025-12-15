package dtos

type SuccessResponse struct {
	Code    int         `json:"code"`
	Status  int         `json:"status"`
	Message string      `json:"message"`
	Total   int         `json:"total,omitempty"`
	Data    interface{} `json:"data"`
}

type ErrorResponse struct {
	Code    int      `json:"code"`
	Status  int      `json:"status"`
	Message string   `json:"message"`
	Data    []string `json:"data,omitempty"`
}
