"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultResponseWithPagination = exports.DefaultResponse = void 0;
class DefaultResponse {
    resultCode;
    httpStatus;
    message;
    total;
    data;
    constructor(resultCode, httpStatus, message, total, data) {
        this.resultCode = resultCode;
        this.httpStatus = httpStatus;
        this.message = message;
        this.total = total;
        this.data = data;
    }
}
exports.DefaultResponse = DefaultResponse;
class DefaultResponseWithPagination {
    resultCode;
    httpStatus;
    message;
    pagination;
    data;
    constructor(resultCode, httpStatus, message, pagination, data) {
        this.resultCode = resultCode;
        this.httpStatus = httpStatus;
        this.message = message;
        this.pagination = pagination;
        this.data = data;
    }
}
exports.DefaultResponseWithPagination = DefaultResponseWithPagination;
//# sourceMappingURL=response.js.map