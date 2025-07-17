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

type WaterMeterController struct {
	waterMeterService services.IWaterMeterService
}

func NewWaterMeterController(waterMeterService services.IWaterMeterService) IWaterMeterController {
	return &WaterMeterController{
		waterMeterService: waterMeterService,
	}
}

// Create WaterMeter
// @Summary  create waterMeter
// @Description create new waterMeter
// @Tags waterMeters
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param   waterMeter body  dtos.CreateWaterMeterDto true "waterMeter"
// @Router /waterMeter/create [post]
func (controller *WaterMeterController) Create(c *gin.Context) {
	var createWaterMeterDto dtos.CreateWaterMeterDto

	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	if err := c.ShouldBindJSON(&createWaterMeterDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	// Validate the struct
	validate := validator.New()
	if err := validate.Struct(createWaterMeterDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}

	// Panggil service dan tangani error
	waterMeterResponse, err := controller.waterMeterService.Create(c.Request.Context(), createWaterMeterDto, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(waterMeterResponse, 1)
	c.JSON(http.StatusOK, response)
}

// Update WaterMeter
// @Summary  update waterMeter by oid
// @Description update existing waterMeter
// @Tags waterMeters
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Param   waterMeter body  dtos.UpdateWaterMeterDto true "waterMeter"
// @Router /waterMeter/{oid} [put]
func (controller *WaterMeterController) Update(c *gin.Context) {
	oid := c.Param("oid")
	waterMeterUpdateRequest := dtos.UpdateWaterMeterDto{}
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	err = c.ShouldBindJSON(&waterMeterUpdateRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	validate := validator.New()
	err = validate.Struct(waterMeterUpdateRequest)
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
	waterMeterResponse, err := controller.waterMeterService.Update(c, waterMeterUpdateRequest, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(waterMeterResponse, 1)

	c.JSON(http.StatusOK, response)
}

// Delete WaterMeter
// @Summary  delete waterMeter
// @Description delete waterMeter by oid
// @Tags waterMeters
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /waterMeter/delete/{oid} [delete]
func (controller *WaterMeterController) Deleted(c *gin.Context) {
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
	waterMeter, err := controller.waterMeterService.Deleted(c, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	response := common.ResponseDeleteOk(waterMeter)

	c.JSON(http.StatusOK, response)
}

// Get All WaterMeter
// @Summary List existing waterMeters
// @Description Get all the existing waterMeters
// @Tags waterMeters
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Router /waterMeter [get]
func (controller *WaterMeterController) FindAll(c *gin.Context) {
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	waterMeters, err := controller.waterMeterService.FindAll(c, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	if waterMeters == nil {
		waterMeters = []mappings.WaterMeterVm{} // Assuming WaterMeter is your struct type
	}
	response := common.ResponseOk(waterMeters, 0)
	c.JSON(http.StatusOK, response)
}

// Get All WaterMeter
// @Summary List existing waterMeters
// @Description Get all the existing waterMeters
// @Tags waterMeters
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param   waterMeterDto body  dtos.FilterWaterMeterDto true "waterMeter"
// @Param   pageIndex    query     int  false  "page Index"  minimum(1)    maximum(10)
// @Param   pageSize    query     int  false  "page Size"  minimum(1)    maximum(10)
// @Router /waterMeter/q [post]
func (controller *WaterMeterController) Find(c *gin.Context) {
	pageIndexStr := c.Query("pageIndex")
	pageSizeStr := c.Query("pageSize")
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	var waterMeterDto dtos.FilterWaterMeterDto
	err = c.ShouldBindJSON(&waterMeterDto)
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

	waterMeters, count, err := controller.waterMeterService.FindPage(c, waterMeterDto, pageIndex, pageSize, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	if waterMeters == nil {
		waterMeters = []mappings.WaterMeterVm{} // Assuming WaterMeter is your struct type
	}
	pagging := gin.H{
		"page":      pageIndex,
		"size":      pageSize,
		"totalItem": count,
		"totalPage": (count + int64(pageSize) - 1) / int64(pageSize), // Correctly calculates total pages
	}
	response := common.ResponseOkWithPaggination(waterMeters, pagging, count)
	c.JSON(http.StatusOK, response)
}

// Find WaterMeter By Oid
// @Summary  find waterMeter by oid
// @Description update new waterMeter
// @Tags waterMeters
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /waterMeter/{oid} [get]
func (controller *WaterMeterController) FindById(c *gin.Context) {
	oid := c.Param("oid")
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}
	waterMeter, err := controller.waterMeterService.FindById(c, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	response := common.ResponseOk(waterMeter, 1)
	c.JSON(http.StatusOK, response)
}
