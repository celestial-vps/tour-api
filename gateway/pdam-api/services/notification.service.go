package services

import (
	"context"
	"database/sql"
	"fmt"

	"firebase.google.com/go/v4/messaging"
	"github.com/go-playground/validator/v10"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
	"github.com/pdam-api/go-pdam-api/middleware"
	"github.com/pdam-api/go-pdam-api/misc"
	"github.com/pdam-api/go-pdam-api/repositories"
)

type NotificationService struct {
	UserRepository repositories.IUserRepository
	DB             *sql.DB
	Validate       *validator.Validate
	FCMClient      *messaging.Client // ✅ Gunakan messaging.Client dari Firebase SDK resmi
}

func NewNotificationService(
	userRepository repositories.IUserRepository,
	DB *sql.DB,
	validate *validator.Validate,
	fcmClient *messaging.Client, // ✅ Tambahkan parameter
) INotificationService {
	return &NotificationService{
		UserRepository: userRepository,
		DB:             DB,
		Validate:       validate,
		FCMClient:      fcmClient, // ✅ Set FCMClient ke struct
	}
}

func (service *NotificationService) SendAllNotification(ctx context.Context, request dtos.SendNotificationDto, userOid string) (mappings.MessageVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "notifications", userOid, nil, err)
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	users := service.UserRepository.FindAll(ctx, tx)

	var tokens []string

	if request.Platform == "android" {
		for _, user := range users {
			if user.AndroidToken != nil && *user.AndroidToken != "" {
				tokens = append(tokens, *user.AndroidToken)
			}
		}
	} else if request.Platform == "ios" {
		for _, user := range users {
			if user.TokenIos != nil && *user.TokenIos != "" {
				tokens = append(tokens, *user.TokenIos)
			}
		}
	} else if request.Platform == "web" {
		for _, user := range users {
			if user.TokenWeb != nil && *user.TokenWeb != "" {
				tokens = append(tokens, *user.TokenWeb)
			}
		}
	} else if request.Platform == "desktop" {
		for _, user := range users {
			if user.TokenDesktop != nil && *user.TokenDesktop != "" {
				tokens = append(tokens, *user.TokenDesktop)
			}
		}
	}

	// for _, user := range users {
	// 	if user.AndroidToken != nil && *user.AndroidToken != "" {
	// 		tokens = append(tokens, *user.AndroidToken)
	// 	}
	// }

	title := request.Title  //"Informasi Penting"
	body := request.Message // "Ada pemberitahuan baru untuk Anda."

	// ✅ Kirim FCM dalam goroutine
	err = misc.SendFCMToDevices(ctx, service.FCMClient, tokens, title, body)
	if err != nil {
		middleware.Failed(ctx, "SEND_FCM", "notifications", userOid, nil, err)
		return mappings.MessageVm{}, err
	}
	newData := map[string]interface{}{
		"count":          len(users),
		"token_sent_cnt": len(tokens),
	}
	middleware.Success(ctx, "READ", "notifications", userOid, nil, newData)

	messageVm := mappings.MessageVm{
		Value: "send notification to " + fmt.Sprint(len(tokens)) + " users",
		Name:  "Notification Sent",
	}
	return messageVm, nil
}

func (service *NotificationService) SingleNotification(ctx context.Context, request dtos.SinggleNotificationDto, userOid string) (mappings.MessageVm, error) {
	tx, err := service.DB.Begin()
	if err != nil {
		middleware.Failed(ctx, "READ", "notifications", userOid, nil, err)
		return mappings.MessageVm{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer common.CommitOrRollback(tx)

	users := service.UserRepository.FindAll(ctx, tx)

	var tokens []string
	for _, user := range users {
		if user.AndroidToken != nil && *user.AndroidToken != "" {
			tokens = append(tokens, *user.AndroidToken)
		}
	}

	title := request.Title  //"Informasi Penting"
	body := request.Message // "Ada pemberitahuan baru untuk Anda."

	// ✅ Kirim FCM dalam goroutine
	misc.SendFCMToDevices(ctx, service.FCMClient, tokens, title, body)
	// go func() {
	// 	misc.SendFCMToDevices(ctx, service.FCMClient, tokens, title, body)
	// }()

	newData := map[string]interface{}{
		"count":          len(users),
		"token_sent_cnt": len(tokens),
	}
	middleware.Success(ctx, "READ", "notifications", userOid, nil, newData)

	messageVm := mappings.MessageVm{
		Value: "send notification to " + fmt.Sprint(len(tokens)) + " users",
		Name:  "Notification Sent",
	}
	return messageVm, nil
}
