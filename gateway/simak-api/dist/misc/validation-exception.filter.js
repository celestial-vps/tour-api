"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const build_response_1 = require("../common/build.response");
let ValidationExceptionFilter = class ValidationExceptionFilter {
    responseService;
    constructor(responseService) {
        this.responseService = responseService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        let message;
        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        }
        else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
            message = exceptionResponse.message || 'Unknown error';
        }
        else {
            message = 'Unknown error';
        }
        const customResponse = this.responseService.responseForm1Forbidden(message);
        response.status(status).json(customResponse);
    }
};
exports.ValidationExceptionFilter = ValidationExceptionFilter;
exports.ValidationExceptionFilter = ValidationExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException),
    __metadata("design:paramtypes", [build_response_1.ResponseService])
], ValidationExceptionFilter);
//# sourceMappingURL=validation-exception.filter.js.map