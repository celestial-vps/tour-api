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
exports.SuccessNotificationPaginatedResponseDto = exports.SuccessNotificationObjectResponseDto = exports.SuccessNotificationResponseDto = exports.ResponseNotificationVm = exports.UpdateNotificationDto = exports.CreateNotificationDto = exports.FilterNotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const api_base_response_decorator_1 = require("./base/api-base-response.decorator");
const pagination_info_dto_1 = require("./base/pagination-info-dto");
class FilterNotificationDto {
    title;
    isRead;
}
exports.FilterNotificationDto = FilterNotificationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FilterNotificationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FilterNotificationDto.prototype, "isRead", void 0);
class CreateNotificationDto {
    userId;
    title;
    message;
    isRead;
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-user', description: 'User ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New Article', description: 'Notification title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A new article has been published', description: 'Notification message' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateNotificationDto.prototype, "isRead", void 0);
class UpdateNotificationDto {
    title;
    message;
    isRead;
}
exports.UpdateNotificationDto = UpdateNotificationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationDto.prototype, "isRead", void 0);
class ResponseNotificationVm {
    oid;
    title;
    message;
    isRead;
    createdAt;
    updatedAt;
}
exports.ResponseNotificationVm = ResponseNotificationVm;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'OID bank' }),
    __metadata("design:type", String)
], ResponseNotificationVm.prototype, "oid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B001', description: 'Notification code' }),
    __metadata("design:type", String)
], ResponseNotificationVm.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Notification Mandiri', description: 'Notification name' }),
    __metadata("design:type", String)
], ResponseNotificationVm.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mandiri', description: 'Short name' }),
    __metadata("design:type", String)
], ResponseNotificationVm.prototype, "isRead", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' }),
    __metadata("design:type", Date)
], ResponseNotificationVm.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false }),
    __metadata("design:type", Date)
], ResponseNotificationVm.prototype, "updatedAt", void 0);
class SuccessNotificationResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data = [];
}
exports.SuccessNotificationResponseDto = SuccessNotificationResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNotificationResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNotificationResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNotificationResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNotificationResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseNotificationVm], description: 'List of banks' }),
    __metadata("design:type", Array)
], SuccessNotificationResponseDto.prototype, "data", void 0);
class SuccessNotificationObjectResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data;
}
exports.SuccessNotificationObjectResponseDto = SuccessNotificationObjectResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNotificationObjectResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNotificationObjectResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNotificationObjectResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNotificationObjectResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ResponseNotificationVm, description: 'Notification object' }),
    __metadata("design:type", ResponseNotificationVm)
], SuccessNotificationObjectResponseDto.prototype, "data", void 0);
class SuccessNotificationPaginatedResponseDto {
    resultCode;
    httpStatus;
    message;
    pagination;
    data;
}
exports.SuccessNotificationPaginatedResponseDto = SuccessNotificationPaginatedResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNotificationPaginatedResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNotificationPaginatedResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNotificationPaginatedResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_info_dto_1.PaginationInfo }),
    __metadata("design:type", pagination_info_dto_1.PaginationInfo)
], SuccessNotificationPaginatedResponseDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseNotificationVm] }),
    __metadata("design:type", Array)
], SuccessNotificationPaginatedResponseDto.prototype, "data", void 0);
//# sourceMappingURL=payload-notification-dto.js.map