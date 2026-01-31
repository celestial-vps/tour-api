package dtos

type SendNotificationDto struct {
	Platform string `json:"platform" validate:"required"`
	Title    string `json:"title" validate:"required" `
	Message  string `json:"message" validate:"required" `
}

type SinggleNotificationDto struct {
	UserOid string `json:"userOid" validate:"required" `
	Title   string `json:"title" validate:"required" `
	Message string `json:"message" validate:"required" `
}
