package misc

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"google.golang.org/api/option"
)

func InitFirebaseMessagingClient() (*messaging.Client, error) {
	jsonPath := "config/firebase/mpdam-33108-firebase-adminsdk-fbsvc-d01abac5ae.json"

	// ✅ Cek apakah file ada
	if _, err := os.Stat(jsonPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("firebase credentials file not found at: %s", jsonPath)
	}

	// ✅ Baca isi file untuk log (debug)
	_, err := ioutil.ReadFile(jsonPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read firebase credentials file: %w", err)
	}

	log.Println("Firebase credentials file loaded successfully.")
	// Jangan print isi file di production untuk keamanan

	// ✅ Tambahkan ProjectID di config supaya SDK tahu target project-nya
	conf := &firebase.Config{
		ProjectID: "mpdam-33108",
	}

	opt := option.WithCredentialsFile(jsonPath)
	app, err := firebase.NewApp(context.Background(), conf, opt)
	if err != nil {
		return nil, fmt.Errorf("error initializing Firebase app: %w", err)
	}

	client, err := app.Messaging(context.Background())
	if err != nil {
		return nil, fmt.Errorf("error initializing FCM client: %w", err)
	}

	return client, nil
}
