package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/services"
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
