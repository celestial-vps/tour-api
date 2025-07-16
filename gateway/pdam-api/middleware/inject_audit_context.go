// middleware/inject_audit_context.go
package middleware

import (
	"context"

	"github.com/gin-gonic/gin"
)

func InjectAuditContext() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.WithValue(c.Request.Context(), "client_ip", c.ClientIP())
		ctx = context.WithValue(ctx, "user_agent", c.GetHeader("User-Agent"))
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}
