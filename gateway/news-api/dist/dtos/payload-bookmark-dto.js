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
exports.SuccessBookmarkPaginatedResponseDto = exports.SuccessBookmarkObjectResponseDto = exports.SuccessBookmarkResponseDto = exports.ResponseBookmarkVm = exports.UpdateBookmarkDto = exports.CreateBookmarkDto = exports.FilterBookmarkDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const api_base_response_decorator_1 = require("./base/api-base-response.decorator");
const pagination_info_dto_1 = require("./base/pagination-info-dto");
class FilterBookmarkDto {
    articleId;
    userId;
}
exports.FilterBookmarkDto = FilterBookmarkDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FilterBookmarkDto.prototype, "articleId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FilterBookmarkDto.prototype, "userId", void 0);
class CreateBookmarkDto {
    userId;
    articleId;
}
exports.CreateBookmarkDto = CreateBookmarkDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-user', description: 'User ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBookmarkDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-article', description: 'Article ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBookmarkDto.prototype, "articleId", void 0);
class UpdateBookmarkDto {
    userId;
    articleId;
}
exports.UpdateBookmarkDto = UpdateBookmarkDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateBookmarkDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateBookmarkDto.prototype, "articleId", void 0);
class ResponseBookmarkVm {
    oid;
    articleId;
    createdAt;
    updatedAt;
}
exports.ResponseBookmarkVm = ResponseBookmarkVm;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'OID bank' }),
    __metadata("design:type", String)
], ResponseBookmarkVm.prototype, "oid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B001', description: 'Bookmark code' }),
    __metadata("design:type", String)
], ResponseBookmarkVm.prototype, "articleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' }),
    __metadata("design:type", Date)
], ResponseBookmarkVm.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false }),
    __metadata("design:type", Date)
], ResponseBookmarkVm.prototype, "updatedAt", void 0);
class SuccessBookmarkResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data = [];
}
exports.SuccessBookmarkResponseDto = SuccessBookmarkResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessBookmarkResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessBookmarkResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessBookmarkResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessBookmarkResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseBookmarkVm], description: 'List of banks' }),
    __metadata("design:type", Array)
], SuccessBookmarkResponseDto.prototype, "data", void 0);
class SuccessBookmarkObjectResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data;
}
exports.SuccessBookmarkObjectResponseDto = SuccessBookmarkObjectResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessBookmarkObjectResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessBookmarkObjectResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessBookmarkObjectResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessBookmarkObjectResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ResponseBookmarkVm, description: 'Bookmark object' }),
    __metadata("design:type", ResponseBookmarkVm)
], SuccessBookmarkObjectResponseDto.prototype, "data", void 0);
class SuccessBookmarkPaginatedResponseDto {
    resultCode;
    httpStatus;
    message;
    pagination;
    data;
}
exports.SuccessBookmarkPaginatedResponseDto = SuccessBookmarkPaginatedResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessBookmarkPaginatedResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessBookmarkPaginatedResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessBookmarkPaginatedResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_info_dto_1.PaginationInfo }),
    __metadata("design:type", pagination_info_dto_1.PaginationInfo)
], SuccessBookmarkPaginatedResponseDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseBookmarkVm] }),
    __metadata("design:type", Array)
], SuccessBookmarkPaginatedResponseDto.prototype, "data", void 0);
//# sourceMappingURL=payload-bookmark-dto.js.map