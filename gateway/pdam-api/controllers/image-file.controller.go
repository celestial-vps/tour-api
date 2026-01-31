package controllers

import (
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
	"github.com/pdam-api/go-pdam-api/middleware"
	"github.com/pdam-api/go-pdam-api/services"
)

type ImageFileController struct {
	imageFileService services.IImageFileService
}

func NewImageFileController(imageFileService services.IImageFileService) IImageFileController {
	return &ImageFileController{
		imageFileService: imageFileService,
	}
}

// Create ImageFile
// @Summary  create imageFile
// @Description create new imageFile
// @Tags imageFiles
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param   imageFile body  dtos.CreateImageFileDto true "imageFile"
// @Router /image-file/create [post]
func (controller *ImageFileController) Create(c *gin.Context) {
	file, err := c.FormFile("file")
	mimeType := strings.Split(file.Filename, ".")

	if err != nil {
		panic(err)
	}
	user := c.PostForm("user")

	filePath := "public/" + uuid.New().String() + "." + mimeType[1] // file.Filename

	c.SaveUploadedFile(file, filePath)
	// url := "http://localhost:5000/" + filePath
	url := os.Getenv("Host") + "/" + filePath
	createImageFileDto := dtos.CreateImageFileDto{
		FileName:     file.Filename,
		FileUrl:      url,
		UserInserted: user,
	}
	token := c.GetHeader("Authorization")
	accessToken := strings.Replace(token, "Bearer ", "", 1)
	marker, _ := middleware.NewJwt()
	userJwt, err := marker.GetClaimsByOid(accessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	imageFileResponse := controller.imageFileService.Create(c, createImageFileDto, userJwt.UserOid)
	response := common.ResponseOk(imageFileResponse, 1)

	c.JSON(http.StatusOK, response)
}

// Update ImageFile
// @Summary  update imageFile by oid
// @Description update existing imageFile
// @Tags imageFiles
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Param   imageFile body  dtos.UpdateImageFileDto true "imageFile"
// @Router /image-file/{oid} [put]
func (controller *ImageFileController) Update(c *gin.Context) {
	oid := c.Param("oid")
	imageFileUpdateRequest := dtos.UpdateImageFileDto{}
	err := c.ShouldBindJSON(&imageFileUpdateRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	imageFileUpdateRequest.Oid = oid
	token := c.GetHeader("Authorization")
	accessToken := strings.Replace(token, "Bearer ", "", 1)
	marker, _ := middleware.NewJwt()
	userJwt, err := marker.GetClaimsByOid(accessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	imageFileResponse := controller.imageFileService.Update(c, imageFileUpdateRequest, oid, userJwt.UserOid)
	response := common.ResponseOk(imageFileResponse, 1)

	c.JSON(http.StatusOK, response)
}

// Delete ImageFile
// @Summary  delete imageFile
// @Description delete imageFile by oid
// @Tags imageFiles
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /image-file/delete/{oid} [delete]
func (controller *ImageFileController) Deleted(c *gin.Context) {
	oid := c.Param("oid")
	token := c.GetHeader("Authorization")
	accessToken := strings.Replace(token, "Bearer ", "", 1)
	marker, _ := middleware.NewJwt()
	userJwt, err := marker.GetClaimsByOid(accessToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}
	imageFile := controller.imageFileService.Deleted(c, oid, userJwt.UserOid)
	response := common.ResponseDeleteOk(imageFile)

	c.JSON(http.StatusOK, response)
}

// Find ImageFile By Oid
// @Summary  find imageFile by oid
// @Description update new imageFile
// @Tags imageFiles
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param oid path string true  "oid"
// @Router /image-file/{oid} [get]
func (controller *ImageFileController) FindById(c *gin.Context) {
	oid := c.Param("oid")
	imageFile := controller.imageFileService.FindById(c, oid)
	response := common.ResponseOk(imageFile, 1)
	c.JSON(http.StatusOK, response)
}

// Get All ImageFile
// @Summary List existing imageFiles
// @Description Get all the existing imageFiles
// @Tags imageFiles
// @Accept  json
// @Produce  json
// @Success 200 {object} common.DefaultResponse	"ok"
// @Security ApiKeyAuth
// @Param   imageFileDto body  dtos.CreateImageFileDto true "imageFile"
// @Param   pageIndex    query     int  false  "page Index"  minimum(1)    maximum(10)
// @Param   pageSize    query     int  false  "page Size"  minimum(1)    maximum(10)
// @Router /image-file/q [post]
func (controller *ImageFileController) Find(c *gin.Context) {
	pageIndexStr := c.Query("pageIndex")
	pageSizeStr := c.Query("pageSize")

	var imageFileDto dtos.FilterImageFileDto
	err := c.ShouldBindJSON(&imageFileDto)
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

	imageFiles, count := controller.imageFileService.FindPage(c, imageFileDto, pageIndex, pageSize)
	if imageFiles == nil {
		imageFiles = []mappings.ImageFileVm{} // Assuming Customer is your struct type
	}
	pagging := gin.H{
		"page":      pageIndex,
		"size":      pageSize,
		"totalItem": count,
		"totalPage": (count + int64(pageSize) - 1) / int64(pageSize), // Correctly calculates total pages
	}
	response := common.ResponseOkWithPaggination(imageFiles, pagging, count)
	c.JSON(http.StatusOK, response)
}
