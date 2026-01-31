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

type TarifController struct {
	tarifService services.ITarifService
}

func NewTarifController(tarifService services.ITarifService) ITarifController {
	return &TarifController{
		tarifService: tarifService,
	}
}

// Create Tarif
// @Summary  create tarif
// @Description create new tarif
// @Tags tarifs
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param   tarif body  dtos.CreateTarifDto true "tarif"
// @Router /tarif/create [post]
func (controller *TarifController) Create(c *gin.Context) {
	var createTarifDto dtos.CreateTarifDto

	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	if err := c.ShouldBindJSON(&createTarifDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	// Validate the struct
	validate := validator.New()
	if err := validate.Struct(createTarifDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}

	// Panggil service dan tangani error
	tarifResponse, err := controller.tarifService.Create(c.Request.Context(), createTarifDto, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(tarifResponse, 1)
	c.JSON(http.StatusOK, response)
}

// Update Tarif
// @Summary  update tarif by oid
// @Description update existing tarif
// @Tags tarifs
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Param   tarif body  dtos.UpdateTarifDto true "tarif"
// @Router /tarif/{oid} [put]
func (controller *TarifController) Update(c *gin.Context) {
	oid := c.Param("oid")
	tarifUpdateRequest := dtos.UpdateTarifDto{}
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	err = c.ShouldBindJSON(&tarifUpdateRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	validate := validator.New()
	err = validate.Struct(tarifUpdateRequest)
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
	tarifResponse, err := controller.tarifService.Update(c, tarifUpdateRequest, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(tarifResponse, 1)

	c.JSON(http.StatusOK, response)
}

// Delete Tarif
// @Summary  delete tarif
// @Description delete tarif by oid
// @Tags tarifs
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /tarif/delete/{oid} [delete]
func (controller *TarifController) Deleted(c *gin.Context) {
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
	tarif, err := controller.tarifService.Deleted(c, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	response := common.ResponseDeleteOk(tarif)

	c.JSON(http.StatusOK, response)
}

// Get All Tarif
// @Summary List existing tarifs
// @Description Get all the existing tarifs
// @Tags tarifs
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Router /tarif [get]
func (controller *TarifController) FindAll(c *gin.Context) {
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	tarifs, err := controller.tarifService.FindAll(c, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	if tarifs == nil {
		tarifs = []mappings.TarifVm{} // Assuming Tarif is your struct type
	}
	response := common.ResponseOk(tarifs, 0)
	c.JSON(http.StatusOK, response)
}

// Get All Tarif
// @Summary List existing tarifs
// @Description Get all the existing tarifs
// @Tags tarifs
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param   tarifDto body  dtos.FilterTarifDto true "tarif"
// @Param   pageIndex    query     int  false  "page Index"  minimum(1)    maximum(10)
// @Param   pageSize    query     int  false  "page Size"  minimum(1)    maximum(10)
// @Router /tarif/q [post]
func (controller *TarifController) Find(c *gin.Context) {
	pageIndexStr := c.Query("pageIndex")
	pageSizeStr := c.Query("pageSize")
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	var tarifDto dtos.FilterTarifDto
	err = c.ShouldBindJSON(&tarifDto)
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

	tarifs, count, err := controller.tarifService.FindPage(c, tarifDto, pageIndex, pageSize, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	if tarifs == nil {
		tarifs = []mappings.TarifVm{} // Assuming Tarif is your struct type
	}
	pagging := gin.H{
		"page":      pageIndex,
		"size":      pageSize,
		"totalItem": count,
		"totalPage": (count + int64(pageSize) - 1) / int64(pageSize), // Correctly calculates total pages
	}
	response := common.ResponseOkWithPaggination(tarifs, pagging, count)
	c.JSON(http.StatusOK, response)
}

// Find Tarif By Oid
// @Summary  find tarif by oid
// @Description update new tarif
// @Tags tarifs
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /tarif/{oid} [get]
func (controller *TarifController) FindById(c *gin.Context) {
	oid := c.Param("oid")
	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}
	tarif, err := controller.tarifService.FindById(c, oid, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}
	response := common.ResponseOk(tarif, 1)
	c.JSON(http.StatusOK, response)
}
