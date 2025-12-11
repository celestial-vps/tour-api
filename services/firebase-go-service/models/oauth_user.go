package models

import "github.com/kamva/mgm/v3"

type OAuthUser struct {
	mgm.DefaultModel `bson:",inline"`
	UserID           string `json:"userId" bson:"userId"`
	Provider         string `json:"provider" bson:"provider"`
	ProviderID       string `json:"providerId" bson:"providerId"`
	AccessToken      string `json:"accessToken" bson:"accessToken"`
	RefreshToken     string `json:"refreshToken" bson:"refreshToken"`
	TokenExpiresAt   int64  `json:"tokenExpiresAt" bson:"tokenExpiresAt"`
}
