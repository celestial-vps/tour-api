package controllers

import (
	"net/http"
	"os"
	"time"

	"go-auth-odm/middleware"
	"go-auth-odm/models"
	"go-auth-odm/utils"

	"github.com/Kamva/mgm/v3"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

// -------------------- REGISTER --------------------
func Register(c *gin.Context) {
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashed, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	input.Password = hashed
	input.RoleOid = os.Getenv("ROLE_USER_ID")
	input.ID = uuid.New().String()
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()

	err = mgm.Coll(&input).Create(&input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": input})
}

// -------------------- LOGIN --------------------
func Login(c *gin.Context) {
	var body struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := &models.User{}
	err := mgm.Coll(user).First(bson.M{"email": body.Email}, user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	if !utils.CheckPassword(body.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	// Generate JWT & refresh token
	accessToken, _ := middleware.CreateToken(user.ID, user.Email)
	refreshToken, _ := utils.GenerateRefreshToken()
	now := time.Now().Unix()

	tokenDoc := &models.UserToken{
		UserID:           user.ID,
		AccessToken:      accessToken,
		RefreshToken:     refreshToken,
		DeviceType:       "web",
		ExpiresAt:        now + 1800, // 30 min
		RefreshExpiresAt: now + 30*24*3600,
		Revoked:          false,
	}

	mgm.Coll(tokenDoc).Create(tokenDoc)

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{
			"id":               user.ID,
			"email":            user.Email,
			"name":             user.Name,
			"accessToken":      accessToken,
			"refreshToken":     refreshToken,
			"accessExpiresAt":  tokenDoc.ExpiresAt,
			"refreshExpiresAt": tokenDoc.RefreshExpiresAt,
		},
	})
}
