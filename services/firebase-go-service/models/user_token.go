package models

import "github.com/kamva/mgm/v3"

type UserToken struct {
	mgm.DefaultModel `bson:",inline"`
	UserID           string `json:"userId" bson:"userId"`
	AccessToken      string `json:"accessToken" bson:"accessToken"`
	RefreshToken     string `json:"refreshToken" bson:"refreshToken"`
	DeviceType       string `json:"deviceType" bson:"deviceType"`
	ExpiresAt        int64  `json:"expiresAt" bson:"expiresAt"`
	RefreshExpiresAt int64  `json:"refreshExpiresAt" bson:"refreshExpiresAt"`
	Revoked          bool   `json:"revoked" bson:"revoked"`
}
