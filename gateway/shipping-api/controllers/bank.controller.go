package controllers

import (
	"net/http"
	"strconv"

	"shipping-api/common"
	"shipping-api/dtos"
	"shipping-api/mappings"
	"shipping-api/middleware"
	"shipping-api/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type BankController struct {
	bankService services.IBankService
}

func NewBankController(bankService services.IBankService) IBankController {
	return &BankController{
		bankService: bankService,
	}
}

// Create Bank
// @Summary  create bank
// @Description create new bank
// @Tags banks
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security BearerAuth
// @Param   bank body  dtos.CreateBankDto true "bank"
// @Router /bank/create [post]
func (controller *BankController) Create(c *gin.Context) {
	var createBankDto dtos.CreateBankDto
	if err := c.ShouldBindJSON(&createBankDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	// Validate the struct
	validate := validator.New()
	if err := validate.Struct(createBankDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}

	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	// Panggil service
	bankResponse, err := controller.bankService.Create(c, createBankDto, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(bankResponse, 1)
	c.JSON(http.StatusOK, response)
}

// Update Bank
// @Summary  update bank by oid
// @Description update existing bank
// @Tags banks
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Param   bank body  dtos.UpdateBankDto true "bank"
// @Router /bank/{oid} [put]
func (controller *BankController) Update(c *gin.Context) {
	oid := c.Param("oid")
	var bankUpdateRequest dtos.UpdateBankDto
	if err := c.ShouldBindJSON(&bankUpdateRequest); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	// Validate the struct
	validate := validator.New()
	if err := validate.Struct(bankUpdateRequest); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}

	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	// Panggil service
	bankResponse, err := controller.bankService.Update(c, bankUpdateRequest, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(bankResponse, 1)
	c.JSON(http.StatusOK, response)
}

// Delete Bank
// @Summary  delete bank
// @Description delete bank by oid
// @Tags banks
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /bank/delete/{oid} [delete]
func (controller *BankController) Deleted(c *gin.Context) {
	oid := c.Param("oid")

	// Ambil userOid dari token
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}
	// Panggil service
	bankResponse, err := controller.bankService.Deleted(c, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseDeleteOk(bankResponse)
	c.JSON(http.StatusOK, response)
}

// Get All Bank
// @Summary List existing banks
// @Description Get all the existing banks
// @Tags banks
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Router /bank [get]
func (controller *BankController) FindAll(c *gin.Context) {
	banks, err := controller.bankService.FindAll(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	if banks == nil {
		banks = []mappings.BankVm{}
	}

	response := common.ResponseOk(banks, int64(len(banks)))
	c.JSON(http.StatusOK, response)
}

// Get All Bank
// @Summary List existing banks
// @Description Get all the existing banks
// @Tags banks
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param   bankDto body  dtos.FilterBankDto true "bank"
// @Param   pageIndex    query     int  false  "page Index"  minimum(1)    maximum(10)
// @Param   pageSize    query     int  false  "page Size"  minimum(1)    maximum(10)
// @Router /bank/q [post]
func (controller *BankController) Find(c *gin.Context) {
	// Ambil query params
	pageIndexStr := c.DefaultQuery("pageIndex", "0")
	pageSizeStr := c.DefaultQuery("pageSize", "10")

	var err error
	pageIndex, err := strconv.Atoi(pageIndexStr)
	if err != nil || pageIndex < 0 {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden("Invalid pageIndex format"))
		return
	}

	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize <= 0 {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden("Invalid pageSize format"))
		return
	}

	// Ambil filter dari query params (misal: ?bankName=abc)
	var bankDto dtos.FilterBankDto
	if err := c.BindQuery(&bankDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden("Invalid filter parameters"))
		return
	}

	// Panggil service
	banks, count, err := controller.bankService.FindPage(c, bankDto, pageIndex, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	if banks == nil {
		banks = []mappings.BankVm{}
	}

	// Hitung total pages
	totalPages := (count + int64(pageSize) - 1) / int64(pageSize)

	pagging := gin.H{
		"page":      pageIndex,
		"size":      pageSize,
		"totalItem": count,
		"totalPage": totalPages,
	}

	response := common.ResponseOkWithPaggination(banks, pagging, count)
	c.JSON(http.StatusOK, response)
}

// Get All Bank Redish
// @Summary List existing banks in redis
// @Description Get all the existing banks in redis
// @Tags banks
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param   bankDto body  dtos.FilterBankDto true "bank"
// @Param   pageIndex    query     int  false  "page Index"  minimum(1)    maximum(10)
// @Param   pageSize    query     int  false  "page Size"  minimum(1)    maximum(10)
// @Router /bank/q [post]
func (controller *BankController) FindRedis(c *gin.Context) {
	banks, err := controller.bankService.FindAllRedis(c)
	if err != nil {
		if err.Error() == "bank data not found in Redis: redis: nil" {
			banks = []mappings.BankVm{} // Jika Redis kosong, return empty slice
		} else {
			c.JSON(http.StatusInternalServerError, common.ResponseForm1Forbidden(err.Error()))
			return
		}
	}

	response := common.ResponseOk(banks, int64(len(banks)))
	c.JSON(http.StatusOK, response)
}

// Find Bank By Oid
// @Summary  find bank by oid
// @Description update new bank
// @Tags banks
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /bank/{oid} [get]

func (controller *BankController) FindById(c *gin.Context) {
	oid := c.Param("oid")
	bank, err := controller.bankService.FindById(c, oid)
	if err != nil {
		c.JSON(http.StatusNotFound, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	response := common.ResponseOk(bank, 1)
	c.JSON(http.StatusOK, response)
}
