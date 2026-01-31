package misc

import (
	"context"
	"log"

	"firebase.google.com/go/v4/messaging"
)

func SendFCMToDevices(ctx context.Context, client *messaging.Client, tokens []string, title, body string) error {
	if len(tokens) == 0 {
		log.Println("No FCM tokens to send")
		return nil
	}

	msg := &messaging.MulticastMessage{
		Tokens: tokens,
		Notification: &messaging.Notification{
			Title: title,
			Body:  body,
		},
	}

	resp, err := client.SendEachForMulticast(ctx, msg)
	if err != nil {
		log.Printf("Error sending FCM individually: %v", err)
		return err
	}

	success := 0
	failure := 0
	for i, r := range resp.Responses {
		if r.Success {
			success++
		} else {
			log.Printf("Failed token[%d]: %s, error: %v", i, tokens[i], r.Error)
			failure++
		}
	}
	log.Printf("FCM sent (individually): %d success, %d failure", success, failure)

	return nil
}
