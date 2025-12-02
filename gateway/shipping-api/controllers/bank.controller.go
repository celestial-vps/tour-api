package controllers

import (
	"net/http"
	"strconv"
	"strings"

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
// @Security ApiKeyAuth
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
	err := validate.Struct(createBankDto)
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
	bankResponse := controller.bankService.Create(c, createBankDto, userJwt.UserOid)
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
	bankUpdateRequest := dtos.UpdateBankDto{}
	err := c.ShouldBindJSON(&bankUpdateRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	validate := validator.New()
	err = validate.Struct(bankUpdateRequest)
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
	bankResponse := controller.bankService.Update(c, bankUpdateRequest, oid, userJwt.UserOid)
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

	token := c.GetHeader("Authorization")
	accessToken := strings.Replace(token, "Bearer ", "", 1)
	marker, _ := middleware.NewJwt()
	userJwt, err := marker.GetClaimsByOid(accessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	//
	bank := controller.bankService.Deleted(c, oid, userJwt.UserOid)
	response := common.ResponseDeleteOk(bank)

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
	banks := controller.bankService.FindAll(c)
	if banks == nil {
		banks = []mappings.BankVm{} // Assuming Bank is your struct type
	}
	response := common.ResponseOk(banks, 0)
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
	pageIndexStr := c.Query("pageIndex")
	pageSizeStr := c.Query("pageSize")

	var bankDto dtos.FilterBankDto
	err := c.ShouldBindJSON(&bankDto)
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

	banks, count := controller.bankService.FindPage(c, bankDto, pageIndex, pageSize)
	if banks == nil {
		banks = []mappings.BankVm{} // Assuming Bank is your struct type
	}
	// pagging := common.Pagination{
	// 	"page":pageIndex,
	// 	"size":pageSize,
	// 	"totalItem":count,
	// 	"totalPage":len(banks),
	// }
	pagging := gin.H{
		"page":      pageIndex,
		"size":      pageSize,
		"totalItem": count,
		"totalPage": (count + int64(pageSize) - 1) / int64(pageSize), // Correctly calculates total pages
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
	banks := controller.bankService.FindAllRedis(c)
	if banks == nil {
		banks = []mappings.BankVm{} // Assuming Bank is your struct type
	}
	response := common.ResponseOk(banks, 0)
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
	bank := controller.bankService.FindById(c, oid)
	response := common.ResponseOk(bank, 1)
	c.JSON(http.StatusOK, response)
}
