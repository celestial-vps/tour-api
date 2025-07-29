package services

import (
	"context"

	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
)

type INotificationService interface {
	SendAllNotification(ctx context.Context, message dtos.SendNotificationDto, userOid string) (mappings.MessageVm, error)
	SingleNotification(ctx context.Context, message dtos.SinggleNotificationDto, userOid string) (mappings.MessageVm, error)
}
