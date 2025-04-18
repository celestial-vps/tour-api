const { validationResult } = require('express-validator');

// Default response format
class DefaultResponse {
    constructor(resultCode, httpStatus, message, total, data) {
        this.resultCode = resultCode;
        this.httpStatus = httpStatus;
        this.message = message;
        this.total = total;
        this.data = data;
    }
}

// Utility functions
const responseOk = (data, total) => new DefaultResponse("200", "200", "success", total, data);
const responseDeleteOk = (data) => new DefaultResponse("200", "200", "success", 1, data);
const responseDataNotFound = (data) => new DefaultResponse("200", "200", "data not found", 0, data);
const responseInternalServerError = (data) => new DefaultResponse("40401", "404", "internal server error", 0, data);
const responseBadRequest = (error) => new DefaultResponse("400", "400", "bad_request", 0, error);
const responseUnauthorized = (error) => new DefaultResponse("401", "401", "unauthorized", 0, error);
const responseForm1Forbidden = (error) => new DefaultResponse("40300", "403", "missing_or_invalid_parameter", 0, error);
const responseFinValidatorError = (error) => new DefaultResponse("40300", "403", "missing_or_invalid_parameter", 0, error);
const responseErrorInserted = (error) => new DefaultResponse("500", "500", "error query", 1, error);
const responseErrorUpdate = (error) => new DefaultResponse("500", "500", "error query", 1, error);
const responseErrorDelete = (error) => new DefaultResponse("500", "500", "error query", 1, error);
const responseErrorGet = (error) => new DefaultResponse("500", "500", "error query", 1, error);

// Handle validation errors
const getErrorMsg = (fieldError) => {
    switch (fieldError.param) {
        case "required":
            return "This field is required";
        case "lte":
            return `Should be less than ${fieldError.value}`;
        case "gte":
            return `Should be greater than ${fieldError.value}`;
        default:
            return "Unknown error";
    }
};

// Utility function to handle errors and roll back transactions
const panicIfError = (err) => {
    if (err) {
        throw new Error(err);
    }
};

// Export utilities
module.exports = {
    responseOk,
    responseDeleteOk,
    responseDataNotFound,
    responseInternalServerError,
    responseBadRequest,
    responseUnauthorized,
    responseForm1Forbidden,
    responseFinValidatorError,
    responseErrorInserted,
    responseErrorUpdate,
    responseErrorDelete,
    responseErrorGet,
    getErrorMsg,
    panicIfError
};
