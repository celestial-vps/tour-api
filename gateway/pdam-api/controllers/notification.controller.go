package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/middleware"
	"github.com/pdam-api/go-pdam-api/services"
)

type NotificationController struct {
	nontificationService services.INotificationService
}

func NewNotificationController(nontificationService services.INotificationService) INotificationController {
	return &NotificationController{
		nontificationService: nontificationService,
	}
}

// Send multi Notification
// @Summary  send nontification
// @Description send new nontification
// @Tags nontifications
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param   nontification body  dtos.SendNotificationDto true "nontification"
// @Router /send-notification [post]
func (controller *NotificationController) SendAllNotification(c *gin.Context) {
	var sendNotificationDto dtos.SendNotificationDto

	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	if err := c.ShouldBindJSON(&sendNotificationDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	// Validate the struct
	validate := validator.New()
	if err := validate.Struct(sendNotificationDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}

	// Panggil service dan tangani error
	nontificationResponse, err := controller.nontificationService.SendAllNotification(c.Request.Context(), sendNotificationDto, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(nontificationResponse, 1)
	c.JSON(http.StatusOK, response)
}

// Send single Notification
// @Summary  send nontification by oid
// @Description send new nontification by oid
// @Tags nontifications
// @Accept  json
// @Produce  json
// @Success 200 {string} string	"ok"
// @Security ApiKeyAuth
// @Param   nontification body  dtos.SinggleNotificationDto true "nontification"
// @Router /send-notification/{oid} [post]
func (controller *NotificationController) SingleNotification(c *gin.Context) {
	var singgleNotificationDto dtos.SinggleNotificationDto

	userOid, err := middleware.GetUserOidFromContext(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, common.ResponseUnAuthorized(err.Error()))
		return
	}

	if err := c.ShouldBindJSON(&singgleNotificationDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseForm1Forbidden(err.Error()))
		return
	}

	// Validate the struct
	validate := validator.New()
	if err := validate.Struct(singgleNotificationDto); err != nil {
		c.JSON(http.StatusBadRequest, common.ResponseFinValidatorError(err.Error()))
		return
	}

	// Panggil service dan tangani error
	nontificationResponse, err := controller.nontificationService.SingleNotification(c.Request.Context(), singgleNotificationDto, userOid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, common.ResponseInternalServerError(err.Error()))
		return
	}

	response := common.ResponseOk(nontificationResponse, 1)
	c.JSON(http.StatusOK, response)
}
