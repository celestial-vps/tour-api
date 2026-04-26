"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseService = void 0;
const common_1 = require("@nestjs/common");
const response_1 = require("./response");
let ResponseService = class ResponseService {
    responseOk(data, total) {
        return new response_1.DefaultResponse("200", 200, "success", total, data);
    }
    responseOkWithPagination(data, pagination) {
        return new response_1.DefaultResponseWithPagination("200", 200, "success", pagination, data);
    }
    responseDeleteOk(data) {
        return new response_1.DefaultResponse("200", 200, "success", 1, data);
    }
    responseDataNotFound(data) {
        return new response_1.DefaultResponse("200", 200, "data not found", 0, data);
    }
    responseInternalServerError(data) {
        return new response_1.DefaultResponse("40401", 404, "Not Found", 0, data);
    }
    responseBadRequest(error) {
        return new response_1.DefaultResponse("400", 400, "bad_request", 0, error);
    }
    responseUnauthorized(error) {
        return new response_1.DefaultResponse("401", 401, "unauthorized", 0, error);
    }
    responseForm1Forbidden(error) {
        return new response_1.DefaultResponse("40300", 403, "missing_or_invalid_parameter", 0, error);
    }
    responseFinValidatorError(error) {
        return new response_1.DefaultResponse("40300", 403, "missing_or_invalid_parameter", 0, error);
    }
    responseErrorInserted(error) {
        return new response_1.DefaultResponse("500", 500, "internal server error", 1, error);
    }
    responseErrorUpdate(error) {
        return new response_1.DefaultResponse("500", 500, "internal server error", 1, error);
    }
    responseErrorDelete(error) {
        return new response_1.DefaultResponse("500", 500, "internal server error", 1, error);
    }
    responseErrorGet(error) {
        return new response_1.DefaultResponse("500", 500, "internal server error", 1, error);
    }
    responseError(error) {
        const statusCode = error || 500;
        if (statusCode === 500) {
            return new response_1.DefaultResponse("500", 500, "Internal server error", 1, "Internal server error");
        }
        else if (statusCode === 404) {
            return new response_1.DefaultResponse("404", 404, "Record Not found", 1, "Record Not found");
        }
        else {
            return new response_1.DefaultResponse("400", 400, "Bad request", 1, "Bad request");
        }
    }
};
exports.ResponseService = ResponseService;
exports.ResponseService = ResponseService = __decorate([
    (0, common_1.Injectable)()
], ResponseService);
//# sourceMappingURL=build.response.js.map