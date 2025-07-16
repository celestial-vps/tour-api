package controllers

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
	"github.com/pdam-api/go-pdam-api/middleware"
	"github.com/pdam-api/go-pdam-api/services"
)

type UserController struct {
	userService services.IUserService
}

func NewUserController(userService services.IUserService) IUserController {
	return &UserController{
		userService: userService,
	}
}

// Create User
// @Summary  create user
// @Description create new user
// @Tags users
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param   user body  dtos.CreateUserDto true "user"
// @Router /user/create [post]
func (controller *UserController) Create(c *gin.Context) {
	var createUserDto dtos.CreateUserDto
	if err := c.ShouldBindJSON(&createUserDto); err != nil {
		var ve validator.ValidationErrors
		if errors.As(err, &ve) {
			out := make([]common.ErrorMsg, len(ve))
			for i, fe := range ve {
				out[i] = common.ErrorMsg{Field: fe.Field(), Message: common.GetErrorMsg(fe)}
			}
			c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(out))
		}
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}
	// token := c.GetHeader("Authorization")
	// id := ""
	// if token == "" {
	// 	accessToken := strings.Replace(token, "Bearer ", "", 1)
	// 	marker, _ := middleware.NewJwt()
	// 	userJwt, err := marker.GetClaimsByOid(accessToken)
	// 	if err != nil {
	// 		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
	// 		return
	// 	}
	// 	id = userJwt.UserOid
	// }
	token := c.GetHeader("Authorization")
	accessToken := strings.Replace(token, "Bearer ", "", 1)
	marker, _ := middleware.NewJwt()
	userJwt, err := marker.GetClaimsByOid(accessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	userResponse := controller.userService.Create(c, createUserDto, userJwt.UserOid)

	response := common.ResponseOk(userResponse, 1)
	c.JSON(http.StatusOK, response)
}

// Update User
// @Summary  update user by oid
// @Description update existing user
// @Tags users
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Param   user body  dtos.UpdateUserDto true "user"
// @Router /user/{oid} [put]
func (controller *UserController) Update(c *gin.Context) {
	oid := c.Param("oid")
	userUpdateRequest := dtos.UpdateUserDto{}
	err := c.ShouldBindJSON(&userUpdateRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	token := c.GetHeader("Authorization")
	accessToken := strings.Replace(token, "Bearer ", "", 1)
	marker, _ := middleware.NewJwt()
	userJwt, err := marker.GetClaimsByOid(accessToken)

	userResponse := controller.userService.Update(c, userUpdateRequest, oid, userJwt.UserOid)
	response := common.ResponseOk(userResponse, 1)

	c.JSON(http.StatusOK, response)
}

// Delete User
// @Summary  delete user
// @Description delete user by oid
// @Tags users
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /user/delete/{oid} [delete]
func (controller *UserController) Deleted(c *gin.Context) {
	oid := c.Param("oid")
	token := c.GetHeader("Authorization")
	accessToken := strings.Replace(token, "Bearer ", "", 1)
	marker, _ := middleware.NewJwt()
	userJwt, err := marker.GetClaimsByOid(accessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	user := controller.userService.Deleted(c, oid, userJwt.UserOid)
	response := common.ResponseDeleteOk(user)

	c.JSON(http.StatusOK, response)
}

// Get All User
// @Summary List existing users
// @Description Get all the existing users
// @Tags users
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Router /user [get]
func (controller *UserController) FindAll(c *gin.Context) {
	users := controller.userService.FindAll(c)
	if users == nil {
		users = []mappings.UserVm{} // Assuming Customer is your struct type
	}
	response := common.ResponseOk(users, 0)
	c.JSON(http.StatusOK, response)
}

// Get All User
// @Summary List existing users
// @Description Get all the existing users
// @Tags users
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param   userDto body  dtos.FilterUserDto true "user"
// @Param   pageIndex    query     int  false  "page Index"  minimum(1)    maximum(10)
// @Param   pageSize    query     int  false  "page Size"  minimum(1)    maximum(10)
// @Router /user/q [post]
func (controller *UserController) Find(c *gin.Context) {
	pageIndexStr := c.Query("pageIndex")
	pageSizeStr := c.Query("pageSize")

	var userDto dtos.FilterUserDto
	err := c.ShouldBindJSON(&userDto)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	var pageIndex, pageSize int
	if pageIndexStr != "" {
		pageIndex, err = strconv.Atoi(pageIndexStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden("Invalid pageIndex format"))
			return
		}
	} else {
		pageIndex = 0 // Default pageIndex if not provided
	}

	if pageSizeStr != "" {
		pageSize, err = strconv.Atoi(pageSizeStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden("Invalid pageSize format"))
			return
		}
	} else {
		pageSize = 10 // Default pageSize if not provided
	}

	users, count := controller.userService.FindPage(c, userDto, pageIndex, pageSize)
	if users == nil {
		users = []mappings.UserVm{} // Assuming Customer is your struct type
	}
	pagging := gin.H{
		"page":      pageIndex,
		"size":      pageSize,
		"totalItem": count,
		"totalPage": (count + int64(pageSize) - 1) / int64(pageSize), // Correctly calculates total pages
	}
	response := common.ResponseOkWithPaggination(users, pagging, count)
	c.JSON(http.StatusOK, response)
}

// Find User By Oid
// @Summary  find user by oid
// @Description update new user
// @Tags users
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /user/{oid} [get]
func (controller *UserController) FindById(c *gin.Context) {
	oid := c.Param("oid")
	user := controller.userService.FindById(c, oid)
	response := common.ResponseOk(user, 1)
	c.JSON(http.StatusOK, response)
}
