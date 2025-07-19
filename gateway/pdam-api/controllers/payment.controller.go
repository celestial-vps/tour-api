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

type PaymentController struct {
	paymentService services.IPaymentService
}

func NewPaymentController(paymentService services.IPaymentService) IPaymentController {
	return &PaymentController{
		paymentService: paymentService,
	}
}

// Create Payment
// @Summary  create payment
// @Description create new payment
// @Tags payments
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param   payment body  dtos.CreatePaymentDto true "payment"
// @Router /payment/create [post]
func (controller *PaymentController) Create(c *gin.Context) {
	var createPaymentDto dtos.CreatePaymentDto

	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	if err := c.ShouldBindJSON(&createPaymentDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	// Validate the struct
	validate := validator.New()
	if err := validate.Struct(createPaymentDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}

	// Panggil service dan tangani error
	paymentResponse, err := controller.paymentService.Create(c.Request.Context(), createPaymentDto, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(paymentResponse, 1)
	c.JSON(http.StatusOK, response)
}

// Update Payment
// @Summary  update payment by oid
// @Description update existing payment
// @Tags payments
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Param   payment body  dtos.UpdatePaymentDto true "payment"
// @Router /payment/{oid} [put]
func (controller *PaymentController) Update(c *gin.Context) {
	oid := c.Param("oid")
	paymentUpdateRequest := dtos.UpdatePaymentDto{}
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	err = c.ShouldBindJSON(&paymentUpdateRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	validate := validator.New()
	err = validate.Struct(paymentUpdateRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}

	// token := c.GetHeader("Authorization")
	// accessToken := strings.Replace(token, "Bearer ", "", 1)
	// marker, _ := middleware.NewJwt()
	// userJwt, err := marker.GetClaimsByOid(accessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	paymentResponse, err := controller.paymentService.Update(c, paymentUpdateRequest, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(paymentResponse, 1)

	c.JSON(http.StatusOK, response)
}

// Delete Payment
// @Summary  delete payment
// @Description delete payment by oid
// @Tags payments
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /payment/delete/{oid} [delete]
func (controller *PaymentController) Deleted(c *gin.Context) {
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
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	payment, err := controller.paymentService.Deleted(c, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	response := common.ResponseDeleteOk(payment)

	c.JSON(http.StatusOK, response)
}

// Get All Payment
// @Summary List existing payments
// @Description Get all the existing payments
// @Tags payments
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Router /payment [get]
func (controller *PaymentController) FindAll(c *gin.Context) {
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	payments, err := controller.paymentService.FindAll(c, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	if payments == nil {
		payments = []mappings.PaymentVm{} // Assuming Payment is your struct type
	}
	response := common.ResponseOk(payments, 0)
	c.JSON(http.StatusOK, response)
}

// Get All Payment
// @Summary List existing payments
// @Description Get all the existing payments
// @Tags payments
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param   paymentDto body  dtos.FilterPaymentDto true "payment"
// @Param   pageIndex    query     int  false  "page Index"  minimum(1)    maximum(10)
// @Param   pageSize    query     int  false  "page Size"  minimum(1)    maximum(10)
// @Router /payment/q [post]
func (controller *PaymentController) Find(c *gin.Context) {
	pageIndexStr := c.Query("pageIndex")
	pageSizeStr := c.Query("pageSize")
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	var paymentDto dtos.FilterPaymentDto
	err = c.ShouldBindJSON(&paymentDto)
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

	payments, count, err := controller.paymentService.FindPage(c, paymentDto, pageIndex, pageSize, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	if payments == nil {
		payments = []mappings.PaymentVm{} // Assuming Payment is your struct type
	}
	pagging := gin.H{
		"page":      pageIndex,
		"size":      pageSize,
		"totalItem": count,
		"totalPage": (count + int64(pageSize) - 1) / int64(pageSize), // Correctly calculates total pages
	}
	response := common.ResponseOkWithPaggination(payments, pagging, count)
	c.JSON(http.StatusOK, response)
}

// Find Payment By Oid
// @Summary  find payment by oid
// @Description update new payment
// @Tags payments
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /payment/{oid} [get]
func (controller *PaymentController) FindById(c *gin.Context) {
	oid := c.Param("oid")
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}
	payment, err := controller.paymentService.FindById(c, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	response := common.ResponseOk(payment, 1)
	c.JSON(http.StatusOK, response)
}
