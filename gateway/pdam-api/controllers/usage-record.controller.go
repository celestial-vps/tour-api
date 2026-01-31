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

type UsageRecordController struct {
	usageRecordService services.IUsageRecordService
}

func NewUsageRecordController(usageRecordService services.IUsageRecordService) IUsageRecordController {
	return &UsageRecordController{
		usageRecordService: usageRecordService,
	}
}

// Create UsageRecord
// @Summary  create usageRecord
// @Description create new usageRecord
// @Tags usageRecords
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param   usageRecord body  dtos.CreateUsageRecordDto true "usageRecord"
// @Router /usageRecord/create [post]
func (controller *UsageRecordController) Create(c *gin.Context) {
	var createUsageRecordDto dtos.CreateUsageRecordDto

	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	if err := c.ShouldBindJSON(&createUsageRecordDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	// Validate the struct
	validate := validator.New()
	if err := validate.Struct(createUsageRecordDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}

	// Panggil service dan tangani error
	usageRecordResponse, err := controller.usageRecordService.Create(c.Request.Context(), createUsageRecordDto, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(usageRecordResponse, 1)
	c.JSON(http.StatusOK, response)
}

// Update UsageRecord
// @Summary  update usageRecord by oid
// @Description update existing usageRecord
// @Tags usageRecords
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Param   usageRecord body  dtos.UpdateUsageRecordDto true "usageRecord"
// @Router /usageRecord/{oid} [put]
func (controller *UsageRecordController) Update(c *gin.Context) {
	oid := c.Param("oid")
	usageRecordUpdateRequest := dtos.UpdateUsageRecordDto{}
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	err = c.ShouldBindJSON(&usageRecordUpdateRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	validate := validator.New()
	err = validate.Struct(usageRecordUpdateRequest)
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
	usageRecordResponse, err := controller.usageRecordService.Update(c, usageRecordUpdateRequest, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(usageRecordResponse, 1)

	c.JSON(http.StatusOK, response)
}

// Delete UsageRecord
// @Summary  delete usageRecord
// @Description delete usageRecord by oid
// @Tags usageRecords
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /usageRecord/delete/{oid} [delete]
func (controller *UsageRecordController) Deleted(c *gin.Context) {
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
	usageRecord, err := controller.usageRecordService.Deleted(c, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	response := common.ResponseDeleteOk(usageRecord)

	c.JSON(http.StatusOK, response)
}

// Get All UsageRecord
// @Summary List existing usageRecords
// @Description Get all the existing usageRecords
// @Tags usageRecords
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Router /usageRecord [get]
func (controller *UsageRecordController) FindAll(c *gin.Context) {
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	usageRecords, err := controller.usageRecordService.FindAll(c, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	if usageRecords == nil {
		usageRecords = []mappings.UsageRecordVm{} // Assuming UsageRecord is your struct type
	}
	response := common.ResponseOk(usageRecords, 0)
	c.JSON(http.StatusOK, response)
}

// Get All UsageRecord
// @Summary List existing usageRecords
// @Description Get all the existing usageRecords
// @Tags usageRecords
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param   usageRecordDto body  dtos.FilterUsageRecordDto true "usageRecord"
// @Param   pageIndex    query     int  false  "page Index"  minimum(1)    maximum(10)
// @Param   pageSize    query     int  false  "page Size"  minimum(1)    maximum(10)
// @Router /usageRecord/q [post]
func (controller *UsageRecordController) Find(c *gin.Context) {
	pageIndexStr := c.Query("pageIndex")
	pageSizeStr := c.Query("pageSize")
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	var usageRecordDto dtos.FilterUsageRecordDto
	err = c.ShouldBindJSON(&usageRecordDto)
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

	usageRecords, count, err := controller.usageRecordService.FindPage(c, usageRecordDto, pageIndex, pageSize, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	if usageRecords == nil {
		usageRecords = []mappings.UsageRecordVm{} // Assuming UsageRecord is your struct type
	}
	pagging := gin.H{
		"page":      pageIndex,
		"size":      pageSize,
		"totalItem": count,
		"totalPage": (count + int64(pageSize) - 1) / int64(pageSize), // Correctly calculates total pages
	}
	response := common.ResponseOkWithPaggination(usageRecords, pagging, count)
	c.JSON(http.StatusOK, response)
}

// Find UsageRecord By Oid
// @Summary  find usageRecord by oid
// @Description update new usageRecord
// @Tags usageRecords
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /usageRecord/{oid} [get]
func (controller *UsageRecordController) FindById(c *gin.Context) {
	oid := c.Param("oid")
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}
	usageRecord, err := controller.usageRecordService.FindById(c, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	response := common.ResponseOk(usageRecord, 1)
	c.JSON(http.StatusOK, response)
}
