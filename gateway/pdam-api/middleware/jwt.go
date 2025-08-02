package middleware

import (
	"fmt"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type Maker struct {
	secretKey string
}

func NewJwt() (*Maker, error) {
	secret := os.Getenv("SECREATKEY")
	if secret == "" {
		return nil, fmt.Errorf("environment variable SECREATKEY is not set")
	}

	return &Maker{
		secretKey: secret,
	}, nil
}

func (maker *Maker) CreateToken(oid string, emailName string) (string, error) {
	claims := jwt.MapClaims{
		"userOid":  oid,
		"username": emailName,
		"level":    "application",
		"exp":      time.Now().Add(72 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(maker.secretKey))
}

func (maker *Maker) VerifyToken(accessToken string) (*jwt.Token, error) {
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(accessToken, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(maker.secretKey), nil
	})
	return token, err
}

func (maker *Maker) GetClaims(tokenString string) JwtClaims {
	claims := &JwtClaims{}
	_, err := maker.getTokenFromString(tokenString, claims)
	if err != nil {
		// optionally handle error
	}
	return *claims
}

func (maker *Maker) GetClaimsByOid(tokenString string) (JwtClaims, error) {
	claims := &JwtClaims{}
	_, err := maker.getTokenFromString(tokenString, claims)
	return *claims, err
}

func (maker *Maker) getTokenFromString(tokenString string, claims *JwtClaims) (*jwt.Token, error) {
	return jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(maker.secretKey), nil
	})
}
