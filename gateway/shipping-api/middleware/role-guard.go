package middleware

import (
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"shipping-api/common"
)

// RoleGuard checks if the user has the required role and stores the JWT claims in context
func RoleGuard(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader(authorizationHeaderKey)
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized("Authorization header is not provided"))
			return
		}

		fields := strings.Fields(authHeader)
		if len(fields) != 2 || strings.ToLower(fields[0]) != authorizationTypeBearer {
			c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized("Invalid authorization header format"))
			return
		}

		accessToken := fields[1]
		marker, err := NewJwt()
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized("Failed to initialize JWT handler"))
			return
		}

		token, err := marker.VerifyToken(accessToken)
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized("Invalid token"))
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized("Invalid token claims"))
			return
		}

		username, ok := claims["username"].(string)
		if !ok || username == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized("Username claim missing"))
			return
		}

		// Validasi role user dari database
		// ctx := c.Request.Context()
		// db := database.GetConnection()
		// tx, err := db.Begin()
		// if err != nil {
		// 	c.AbortWithStatusJSON(http.StatusInternalServerError, common.ResponseUnAuthorized("Database transaction failed"))
		// 	return
		// }
		// defer common.CommitOrRollback(tx)

		// userRepository := repositories.NewUserRepository()
		// userRole, err := userRepository.FindUserRole(ctx, tx, username)
		// if err != nil {
		// 	c.AbortWithStatusJSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		// 	return
		// }

		// if userRole != requiredRole {
		// 	c.AbortWithStatusJSON(http.StatusForbidden, common.ResponseUnAuthorized("Insufficient role"))
		// 	return
		// }

		if claims["role"].(string) != requiredRole {
			c.AbortWithStatusJSON(http.StatusForbidden, common.ResponseUnAuthorized("Insufficient role"))
			return
		}

		// Simpan claims ke context
		c.Set("authorization_payload", claims)

		c.Next()
	}
}
