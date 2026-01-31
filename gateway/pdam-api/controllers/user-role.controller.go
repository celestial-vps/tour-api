package controllers

import (
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

type UserRoleController struct {
	userRoleService services.IUserRoleService
}

func NewUserRoleController(userRoleService services.IUserRoleService) IUserRoleController {
	return &UserRoleController{
		userRoleService: userRoleService,
	}
}

// Create UserRole
// @Summary  create userRole
// @Description create new userRole
// @Tags userRoles
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param   userRole body  dtos.CreateUserRoleDto true "userRole"
// @Router /user-role/create [post]
func (controller *UserRoleController) Create(c *gin.Context) {
	var createUserRoleDto dtos.CreateUserRoleDto
	if err := c.ShouldBindJSON(&createUserRoleDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	// Validate the struct
	validate := validator.New()
	err := validate.Struct(createUserRoleDto)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}
	token := c.GetHeader("Authorization")
	accessToken := strings.Replace(token, "Bearer ", "", 1)
	marker, _ := middleware.NewJwt()
	userJwt, err := marker.GetClaimsByOid(accessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	userRoleResponse := controller.userRoleService.Create(c, createUserRoleDto, userJwt.UserOid)
	response := common.ResponseOk(userRoleResponse, 1)
	c.JSON(http.StatusOK, response)
}

// Update UserRole
// @Summary  update userRole by oid
// @Description update existing userRole
// @Tags userRoles
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Param   userRole body  dtos.UpdateUserRoleDto true "userRole"
// @Router /user-role/{oid} [put]
func (controller *UserRoleController) Update(c *gin.Context) {
	oid := c.Param("oid")
	userRoleUpdateRequest := dtos.UpdateUserRoleDto{}
	err := c.ShouldBindJSON(&userRoleUpdateRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	validate := validator.New()
	err = validate.Struct(userRoleUpdateRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}
	token := c.GetHeader("Authorization")
	accessToken := strings.Replace(token, "Bearer ", "", 1)
	marker, _ := middleware.NewJwt()
	userJwt, err := marker.GetClaimsByOid(accessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	userRoleResponse := controller.userRoleService.Update(c, userRoleUpdateRequest, oid, userJwt.UserOid)
	response := common.ResponseOk(userRoleResponse, 1)

	c.JSON(http.StatusOK, response)
}

// Delete UserRole
// @Summary  delete userRole
// @Description delete userRole by oid
// @Tags userRoles
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /user-role/delete/{oid} [delete]
func (controller *UserRoleController) Deleted(c *gin.Context) {
	oid := c.Param("oid")
	token := c.GetHeader("Authorization")
	accessToken := strings.Replace(token, "Bearer ", "", 1)
	marker, _ := middleware.NewJwt()
	userJwt, err := marker.GetClaimsByOid(accessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	userRole := controller.userRoleService.Deleted(c, oid, userJwt.UserOid)
	response := common.ResponseDeleteOk(userRole)

	c.JSON(http.StatusOK, response)
}

// Get All UserRole
// @Summary List existing userRoles
// @Description Get all the existing userRoles
// @Tags userRoles
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Router /user-role [get]
func (controller *UserRoleController) FindAll(c *gin.Context) {
	userRoles := controller.userRoleService.FindAll(c)
	if userRoles == nil {
		userRoles = []mappings.UserRoleVm{} // Assuming Customer is your struct type
	}
	response := common.ResponseOk(userRoles, 0)
	c.JSON(http.StatusOK, response)
}

// Get All UserRole
// @Summary List existing userRoles
// @Description Get all the existing userRoles
// @Tags userRoles
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param   userRoleDto body  dtos.FilterUserRoleDto true "userRole"
// @Param   pageIndex    query     int  false  "page Index"  minimum(1)    maximum(10)
// @Param   pageSize    query     int  false  "page Size"  minimum(1)    maximum(10)
// @Router /user-role/q [post]
func (controller *UserRoleController) Find(c *gin.Context) {
	pageIndexStr := c.Query("pageIndex")
	pageSizeStr := c.Query("pageSize")

	var userRoleDto dtos.FilterUserRoleDto
	err := c.ShouldBindJSON(&userRoleDto)
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

	userRoles, count := controller.userRoleService.FindPage(c, userRoleDto, pageIndex, pageSize)
	if userRoles == nil {
		userRoles = []mappings.UserRoleVm{} // Assuming Customer is your struct type
	}
	pagging := gin.H{
		"page":      pageIndex,
		"size":      pageSize,
		"totalItem": count,
		"totalPage": (count + int64(pageSize) - 1) / int64(pageSize), // Correctly calculates total pages
	}
	response := common.ResponseOkWithPaggination(userRoles, pagging, count)
	c.JSON(http.StatusOK, response)
}

// Find UserRole By Oid
// @Summary  find userRole by oid
// @Description update new userRole
// @Tags userRoles
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /user-role/{oid} [get]
func (controller *UserRoleController) FindById(c *gin.Context) {
	oid := c.Param("oid")
	userRole := controller.userRoleService.FindById(c, oid)
	response := common.ResponseOk(userRole, 1)
	c.JSON(http.StatusOK, response)
}
