// Response Classes
class DefaultResponse {
	constructor(resultCode, httpStatus, message, total = 0, data = null) {
		this.resultCode = resultCode;
		this.httpStatus = httpStatus;
		this.message = message;
		this.total = total;
		this.data = data;
	}
}

class PaginatedResponse {
	constructor(resultCode, httpStatus, message, total, data, pageIndex, pageSize) {
		this.resultCode = resultCode;
		this.httpStatus = httpStatus;
		this.message = message;
		this.pagination = {
			page: pageIndex,
			size: pageSize,
			total: total,
			totalPages: Math.ceil(total / pageSize),
		};
		this.data = data;
	}
}

// Pure Response Builders (No Express Involved)
const responseOk = (data, total = 1) =>
	new DefaultResponse("200", 200, "Success", total, data);

const responseDeleteOk = (data) =>
	new DefaultResponse("200", 200, "Deleted successfully", 1, data);

const responseDataNotFound = () =>
	new DefaultResponse("200", 200, "Data not found", 0, null);

const responseBadRequest = (error) =>
	new DefaultResponse("400", 400, "Bad Request", 0, { error });

const responseUnauthorized = (error) =>
	new DefaultResponse("401", 401, "Unauthorized", 0, { error });

const responseForbidden = (error) =>
	new DefaultResponse("403", 403, "Forbidden", 0, { error });

const responseValidationError = (error) =>
	new DefaultResponse("422", 422, "Validation Error", 0, { error });

const responseInternalServerError = (error) =>
	new DefaultResponse("500", 500, "Internal Server Error", 0, { error });

const responseQueryError = (error, action = "query") =>
	new DefaultResponse("500", 500, `Error during ${action}`, 0, { error });

const responsePagination = (data, total, pageIndex, pageSize) =>
	new PaginatedResponse("200", 200, "Success", total, data, pageIndex, pageSize);



// Express-Aware Send Helpers
const createOk = (res, data, total = 1) => res.status(201).json(responseOk(data, total));
const updateOk = (res, data, total = 1) => res.status(200).json(responseOk(data, total));
const sendDeleteOk = (res, data) => res.status(200).json(responseDeleteOk(data));
const findOk = (res, data, total = 1) => res.status(200).json(responseOk(data, total));
const sendDataNotFound = (res) => res.status(200).json(responseDataNotFound());
const sendBadRequest = (res, error) => res.status(400).json(responseBadRequest(error));
const sendUnauthorized = (res, error) => res.status(401).json(responseUnauthorized(error));
const sendForbidden = (res, error) => res.status(403).json(responseForbidden(error));
const sendValidationError = (res, error) => res.status(422).json(responseValidationError(error));
const sendInternalServerError = (res, error) => res.status(500).json(responseInternalServerError(error));
const sendQueryError = (res, error, action = "query") => res.status(500).json(responseQueryError(error, action));
const sendPagination = (res, data, total, pageIndex, pageSize) =>
	res.status(200).json(responsePagination(data, total, pageIndex, pageSize));

// Validation Error Helper
const getErrorMsg = (fieldError) => {
	switch (fieldError.msg) {
		case "required":
			return `${fieldError.param} is required`;
		case "lte":
			return `${fieldError.param} must be less than or equal to ${fieldError.value}`;
		case "gte":
			return `${fieldError.param} must be greater than or equal to ${fieldError.value}`;
		default:
			return fieldError.msg || "Validation error";
	}
};

// Panic on error utility
const panicIfError = (error) => {
	if (error) throw new Error(error);
};

// Export all
module.exports = {
	// Response builders (JSON only)
	responseOk,
	responseDeleteOk,
	responseDataNotFound,
	responseBadRequest,
	responseUnauthorized,
	responseForbidden,
	responseValidationError,
	responseInternalServerError,
	responseQueryError,
	responsePagination,

	// Express-integrated send helpers
	createOk,updateOk,findOk,
	sendDeleteOk,
	sendDataNotFound,
	sendBadRequest,
	sendUnauthorized,
	sendForbidden,
	sendValidationError,
	sendInternalServerError,
	sendQueryError,
	sendPagination,

	// Utilities
	getErrorMsg,
	panicIfError,
};
