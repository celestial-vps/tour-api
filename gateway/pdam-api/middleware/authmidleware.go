package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/database"
	"github.com/pdam-api/go-pdam-api/repositories"
)

const (
	authorizationHeaderKey  = "authorization"
	authorizationTypeBearer = "bearer"
	authorizationPayloadKey = "authorization_payload"
)

func JWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		// email, err := misc.ValidateHeader(params.HTTPRequest.Header.Get("Authorization"))
		authHeader := c.GetHeader(authorizationHeaderKey)
		if len(authHeader) == 0 {
			err := errors.New("authorization header is not provided")
			c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
			return
		}

		fields := strings.Fields(authHeader)
		if len(fields) < 2 {
			err := errors.New("invalid authorization header format")
			c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
			return
		}

		authorizationType := strings.ToLower(fields[0])
		if authorizationType != authorizationTypeBearer {
			err := fmt.Errorf("unsupported authorization type %s", authorizationType)
			c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
			return
		}

		accessToken := fields[1]
		marker, err := NewJwt()
		payload, err := marker.VerifyToken(accessToken)
		if claims, ok := payload.Claims.(jwt.MapClaims); ok && payload.Valid {
			// Access fields from the map
			if username, ok := claims["username"].(string); ok {
				// fmt.Println("Username:", username)
				// conditions := make(map[string]interface{})
				// if username != "" {
				// 	conditions["username"] = "" + username + ""
				// }

				ctx := c.Request.Context()
				// database.ConnectDatabase()
				DB := database.GetConnection()
				tx, err := DB.Begin()
				common.PanicIfError(err)
				defer common.CommitOrRollback(tx)
				userRepository := repositories.NewUserRepository()
				_, err = userRepository.FindUserRole(ctx, tx, username)
				if err != nil {
					fmt.Println("Role Not Found")
					c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
					return
				}
				// if err != nil {
				// 	fmt.Println("Role Not Found")
				// 	c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
				// 	return
				// }
			} else {
				fmt.Println("Username claim is missing or not a string")
			}
		} else {
			fmt.Println("Invalid token")
		}
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
			return
		}

		c.Set(authorizationPayloadKey, payload)

		c.Next()
	}
}
