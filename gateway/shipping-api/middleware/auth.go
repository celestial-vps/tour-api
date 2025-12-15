// utils/auth.go

package middleware

import (
	"errors"

	"github.com/dgrijalva/jwt-go" // atau dgrijalva/jwt-go tergantung yang kamu pakai
	"github.com/gin-gonic/gin"
)

func GetUserOidFromContext(c *gin.Context) (string, error) {
	payloadValue, exists := c.Get("authorization_payload")
	if !exists {
		return "", errors.New("no token payload")
	}

	payload, ok := payloadValue.(jwt.MapClaims)
	if !ok {
		return "", errors.New("invalid token payload")
	}

	userOid, ok := payload["userOid"].(string)
	if !ok {
		return "", errors.New("userOid not found in token")
	}

	return userOid, nil
}
