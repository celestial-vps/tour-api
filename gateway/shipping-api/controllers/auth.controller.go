package controllers

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"shipping-api/common"
	"shipping-api/dtos"
	"shipping-api/services"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	userService services.IUserService
}

func NewAuthController(authService services.IUserService) IAuthController {
	return &AuthController{
		userService: authService,
	}
}

// Get All Auth
// @Summary List existing auths
// @Description Get all the existing auths
// @Tags auths
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param   authDto body  dtos.LoginDto true "auth"
// @Router /auth/login [post]
func (controller *AuthController) Login(c *gin.Context) {
	var authDto dtos.LoginDto
	err := c.ShouldBindJSON(&authDto)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	user := controller.userService.Login(c, authDto)

	// err = misc.CheckPassword(authDto.Password, user.Password)
	// if err != nil {
	// 	panic(common.NewServerError(err.Error()))
	// }
	// marker, _ := middleware.NewJwt()
	// token, _ := marker.CreateToken(user.Email)
	// data := mappings.ToUserTokenResponse(user, token, "", "")
	response := common.ResponseOk(user, 1)
	c.JSON(http.StatusOK, response)

}

// Register
// @Summary  create user
// @Description create new user
// @Tags auths
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Param   user body  dtos.RegisterDto true "user"
// @Router /auth/register [post]
func (controller *AuthController) Register(c *gin.Context) {

	var userDto dtos.RegisterDto
	err := c.ShouldBindJSON(&userDto)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	userResponse := controller.userService.Register(c, userDto)

	response := common.ResponseOk(userResponse, 1)

	c.JSON(http.StatusOK, response)
}

// Refresh Token
// @Summary  create user
// @Description create new user
// @Tags auths
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Param   user body  dtos.RegisterDto true "user"
// @Router /auth/refresh-token [post]
func (controller *AuthController) RefreshToken(c *gin.Context) {
	// Get Authorization header
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		c.JSON(http.StatusUnauthorized, common.ResponseForm1Forbidden("Missing or malformed token"))
		return
	}

	// Extract the actual token
	accessToken := strings.TrimPrefix(authHeader, "Bearer ")

	// Parse and validate the token
	token, err := jwt.Parse(accessToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("Host")), nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, common.ResponseForm1Forbidden("Invalid or expired token"))
		return
	}

	// Extract claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, common.ResponseForm1Forbidden("Invalid token claims"))
		return
	}

	// Extract user info from claims
	userOid, oidOk := claims["userOid"].(string)
	username, nameOk := claims["username"].(string)

	if !oidOk || !nameOk {
		c.JSON(http.StatusUnauthorized, common.ResponseForm1Forbidden("Missing user data in token"))
		return
	}

	// // Create a new token (refresh it)
	// newToken, err := controller.jwtService.CreateToken(userOid, username)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, common.ResponseForm1Forbidden("Could not generate new token"))
	// 	return
	// }
	userResponse := controller.userService.RefreshToken(c, userOid, username)
	response := common.ResponseOk(userResponse, 1)
	c.JSON(http.StatusOK, response)
}
