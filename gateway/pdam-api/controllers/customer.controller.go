package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
	"github.com/pdam-api/go-pdam-api/middleware"
	"github.com/pdam-api/go-pdam-api/services"
)

type CustomerController struct {
	customerService services.ICustomerService
}

func NewCustomerController(customerService services.ICustomerService) ICustomerController {
	return &CustomerController{
		customerService: customerService,
	}
}

// Create Customer
// @Summary  create customer
// @Description create new customer
// @Tags customers
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param   customer body  dtos.CreateCustomerDto true "customer"
// @Router /customer/create [post]
func (controller *CustomerController) Create(c *gin.Context) {
	var createCustomerDto dtos.CreateCustomerDto

	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	if err := c.ShouldBindJSON(&createCustomerDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	// Validate the struct
	validate := validator.New()
	if err := validate.Struct(createCustomerDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}

	// Panggil service dan tangani error
	customerResponse, err := controller.customerService.Create(c.Request.Context(), createCustomerDto, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(customerResponse, 1)
	c.JSON(http.StatusOK, response)
}

// Update Customer
// @Summary  update customer by oid
// @Description update existing customer
// @Tags customers
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Param   customer body  dtos.UpdateCustomerDto true "customer"
// @Router /customer/{oid} [put]
func (controller *CustomerController) Update(c *gin.Context) {
	oid := c.Param("oid")
	customerUpdateRequest := dtos.UpdateCustomerDto{}
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	err = c.ShouldBindJSON(&customerUpdateRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	validate := validator.New()
	err = validate.Struct(customerUpdateRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}

	// token := c.GetHeader("Authorization")
	// accessToken := strings.Replace(token, "Bearer ", "", 1)
	// marker, _ := middleware.NewJwt()
	// userJwt, err := marker.GetClaimsByOid(accessToken)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
	// 	return
	// }
	customerResponse, err := controller.customerService.Update(c, customerUpdateRequest, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(customerResponse, 1)

	c.JSON(http.StatusOK, response)
}

// Delete Customer
// @Summary  delete customer
// @Description delete customer by oid
// @Tags customers
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /customer/delete/{oid} [delete]
func (controller *CustomerController) Deleted(c *gin.Context) {
	oid := c.Param("oid")
	// token := c.GetHeader("Authorization")
	// accessToken := strings.Replace(token, "Bearer ", "", 1)
	// marker, _ := middleware.NewJwt()
	// userJwt, err := marker.GetClaimsByOid(accessToken)
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
	// 	return
	// }
	customer, err := controller.customerService.Deleted(c, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	response := common.ResponseDeleteOk(customer)

	c.JSON(http.StatusOK, response)
}

// Get All Customer
// @Summary List existing customers
// @Description Get all the existing customers
// @Tags customers
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Router /customer [get]
func (controller *CustomerController) FindAll(c *gin.Context) {
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	customers, err := controller.customerService.FindAll(c, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	if customers == nil {
		customers = []mappings.CustomerVm{} // Assuming Customer is your struct type
	}
	response := common.ResponseOk(customers, 0)
	c.JSON(http.StatusOK, response)
}

// Get All Customer
// @Summary List existing customers
// @Description Get all the existing customers
// @Tags customers
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param   customerDto body  dtos.FilterCustomerDto true "customer"
// @Param   pageIndex    query     int  false  "page Index"  minimum(1)    maximum(10)
// @Param   pageSize    query     int  false  "page Size"  minimum(1)    maximum(10)
// @Router /customer/q [post]
func (controller *CustomerController) Find(c *gin.Context) {
	pageIndexStr := c.Query("pageIndex")
	pageSizeStr := c.Query("pageSize")
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	var customerDto dtos.FilterCustomerDto
	err = c.ShouldBindJSON(&customerDto)
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

	customers, count, err := controller.customerService.FindPage(c, customerDto, pageIndex, pageSize, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	if customers == nil {
		customers = []mappings.CustomerVm{} // Assuming Customer is your struct type
	}
	pagging := gin.H{
		"page":      pageIndex,
		"size":      pageSize,
		"totalItem": count,
		"totalPage": (count + int64(pageSize) - 1) / int64(pageSize), // Correctly calculates total pages
	}
	response := common.ResponseOkWithPaggination(customers, pagging, count)
	c.JSON(http.StatusOK, response)
}

// Get All Customer
// @Summary List existing customers
// @Description Get all the existing customers
// @Tags customers
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param   customerDto body  dtos.FilterCustomerDto true "customer"
// @Router /customer/q [post]
func (controller *CustomerController) FindAdvance(c *gin.Context) {
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	var customerDto dtos.FilterCustomerDto
	err = c.ShouldBindJSON(&customerDto)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	customers, err := controller.customerService.FindAdvance(c, customerDto, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	if customers == nil {
		customers = []mappings.CustomerVm{} // Assuming Customer is your struct type
	}

	// response := common.ResponseOkWithPaggination(customers,  count)
	response := common.ResponseOk(customers, int64(len(customers)))
	c.JSON(http.StatusOK, response)
}

// Find Customer By Oid
// @Summary  find customer by oid
// @Description update new customer
// @Tags customers
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /customer/{oid} [get]
func (controller *CustomerController) FindById(c *gin.Context) {
	oid := c.Param("oid")
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}
	customer, err := controller.customerService.FindById(c, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	response := common.ResponseOk(customer, 1)
	c.JSON(http.StatusOK, response)
}
