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
exports.SuccessLikePaginatedResponseDto = exports.SuccessLikeObjectResponseDto = exports.SuccessLikeResponseDto = exports.ResponseLikeVm = exports.UpdateLikeDto = exports.CreateLikeDto = exports.FilterLikeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const api_base_response_decorator_1 = require("./base/api-base-response.decorator");
const pagination_info_dto_1 = require("./base/pagination-info-dto");
class FilterLikeDto {
    articleId;
    userId;
}
exports.FilterLikeDto = FilterLikeDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FilterLikeDto.prototype, "articleId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FilterLikeDto.prototype, "userId", void 0);
class CreateLikeDto {
    articleId;
    userId;
}
exports.CreateLikeDto = CreateLikeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-article', description: 'Article ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLikeDto.prototype, "articleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-user', description: 'User ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLikeDto.prototype, "userId", void 0);
class UpdateLikeDto {
    articleId;
    userId;
}
exports.UpdateLikeDto = UpdateLikeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-article', description: 'Article ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateLikeDto.prototype, "articleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-user', description: 'User ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateLikeDto.prototype, "userId", void 0);
class ResponseLikeVm {
    oid;
    articleId;
    shortName;
    createdAt;
    updatedAt;
}
exports.ResponseLikeVm = ResponseLikeVm;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'OID bank' }),
    __metadata("design:type", String)
], ResponseLikeVm.prototype, "oid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B001', description: 'Like code' }),
    __metadata("design:type", String)
], ResponseLikeVm.prototype, "articleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mandiri', description: 'Short name' }),
    __metadata("design:type", String)
], ResponseLikeVm.prototype, "shortName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' }),
    __metadata("design:type", Date)
], ResponseLikeVm.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false }),
    __metadata("design:type", Date)
], ResponseLikeVm.prototype, "updatedAt", void 0);
class SuccessLikeResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data = [];
}
exports.SuccessLikeResponseDto = SuccessLikeResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessLikeResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessLikeResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessLikeResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessLikeResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseLikeVm], description: 'List of banks' }),
    __metadata("design:type", Array)
], SuccessLikeResponseDto.prototype, "data", void 0);
class SuccessLikeObjectResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data;
}
exports.SuccessLikeObjectResponseDto = SuccessLikeObjectResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessLikeObjectResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessLikeObjectResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessLikeObjectResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessLikeObjectResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ResponseLikeVm, description: 'Like object' }),
    __metadata("design:type", ResponseLikeVm)
], SuccessLikeObjectResponseDto.prototype, "data", void 0);
class SuccessLikePaginatedResponseDto {
    resultCode;
    httpStatus;
    message;
    pagination;
    data;
}
exports.SuccessLikePaginatedResponseDto = SuccessLikePaginatedResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessLikePaginatedResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessLikePaginatedResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessLikePaginatedResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_info_dto_1.PaginationInfo }),
    __metadata("design:type", pagination_info_dto_1.PaginationInfo)
], SuccessLikePaginatedResponseDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseLikeVm] }),
    __metadata("design:type", Array)
], SuccessLikePaginatedResponseDto.prototype, "data", void 0);
//# sourceMappingURL=payload-like-dto.js.map