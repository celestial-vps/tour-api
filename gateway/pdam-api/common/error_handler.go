package common

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func ErrorHandler(c *gin.Context, err interface{}) {

	if NotFoundErrors(c, err) {
		return
	}

	if ValidationErrors(c, err) {
		return
	}

	InternalServerError(c, err)
}

func ValidationErrors(c *gin.Context, err interface{}) bool {
	exception, ok := err.(validator.ValidationErrors)
	if ok {
		response := ResponseFinValidatorError(exception.Error)
		c.JSON(http.StatusForbidden, response)
		return true
	} else {
		return false
	}
}

func NotFoundErrors(c *gin.Context, err interface{}) bool {
	exception, ok := err.(NotFoundError)
	if ok {
		response := ResponseOkDataNotFound(exception.Error)
		c.JSON(http.StatusNotFound, response)
		return true
	} else {
		return false
	}
}

func AuthorizationErrors(c *gin.Context, err interface{}) bool {
	exception, ok := err.(NotFoundError)
	if ok {
		response := ResponseOkDataNotFound(exception.Error)
		c.JSON(http.StatusUnauthorized, response)
		return true
	} else {
		return false
	}
}

func InternalServerError(c *gin.Context, err interface{}) {
	response := ResponseInternalServerError(err)
	c.JSON(http.StatusInternalServerError, response)
}
