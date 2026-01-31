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
exports.SuccessNewsCategoryPaginatedResponseDto = exports.SuccessNewsCategoryObjectResponseDto = exports.SuccessNewsCategoryResponseDto = exports.ResponseNewsCategoryVm = exports.UpdateNewsCategoryDto = exports.CreateNewsCategoryDto = exports.FilterNewsCategoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const api_base_response_decorator_1 = require("./base/api-base-response.decorator");
const pagination_info_dto_1 = require("./base/pagination-info-dto");
class FilterNewsCategoryDto {
    categoryName;
}
exports.FilterNewsCategoryDto = FilterNewsCategoryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Technology',
        description: 'Filter kategori berdasarkan nama kategori'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterNewsCategoryDto.prototype, "categoryName", void 0);
class CreateNewsCategoryDto {
    categoryName;
}
exports.CreateNewsCategoryDto = CreateNewsCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Technology',
        description: 'Nama kategori yang ingin dibuat'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Category name tidak boleh kosong' }),
    __metadata("design:type", String)
], CreateNewsCategoryDto.prototype, "categoryName", void 0);
class UpdateNewsCategoryDto {
    categoryName;
}
exports.UpdateNewsCategoryDto = UpdateNewsCategoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Technology',
        description: 'Nama kategori yang akan diupdate'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Category name tidak boleh kosong' }),
    __metadata("design:type", String)
], UpdateNewsCategoryDto.prototype, "categoryName", void 0);
class ResponseNewsCategoryVm {
    oid;
    categoryName;
    createdAt;
    updatedAt;
}
exports.ResponseNewsCategoryVm = ResponseNewsCategoryVm;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'OID newsCategory' }),
    __metadata("design:type", String)
], ResponseNewsCategoryVm.prototype, "oid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B001', description: 'NewsCategory code' }),
    __metadata("design:type", String)
], ResponseNewsCategoryVm.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' }),
    __metadata("design:type", Date)
], ResponseNewsCategoryVm.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false }),
    __metadata("design:type", Date)
], ResponseNewsCategoryVm.prototype, "updatedAt", void 0);
class SuccessNewsCategoryResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data = [];
}
exports.SuccessNewsCategoryResponseDto = SuccessNewsCategoryResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNewsCategoryResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNewsCategoryResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNewsCategoryResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNewsCategoryResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseNewsCategoryVm], description: 'List of newsCategorys' }),
    __metadata("design:type", Array)
], SuccessNewsCategoryResponseDto.prototype, "data", void 0);
class SuccessNewsCategoryObjectResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data;
}
exports.SuccessNewsCategoryObjectResponseDto = SuccessNewsCategoryObjectResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNewsCategoryObjectResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNewsCategoryObjectResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNewsCategoryObjectResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNewsCategoryObjectResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ResponseNewsCategoryVm, description: 'NewsCategory object' }),
    __metadata("design:type", ResponseNewsCategoryVm)
], SuccessNewsCategoryObjectResponseDto.prototype, "data", void 0);
class SuccessNewsCategoryPaginatedResponseDto {
    resultCode;
    httpStatus;
    message;
    pagination;
    data;
}
exports.SuccessNewsCategoryPaginatedResponseDto = SuccessNewsCategoryPaginatedResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNewsCategoryPaginatedResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNewsCategoryPaginatedResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNewsCategoryPaginatedResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_info_dto_1.PaginationInfo }),
    __metadata("design:type", pagination_info_dto_1.PaginationInfo)
], SuccessNewsCategoryPaginatedResponseDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseNewsCategoryVm] }),
    __metadata("design:type", Array)
], SuccessNewsCategoryPaginatedResponseDto.prototype, "data", void 0);
//# sourceMappingURL=payload-news-category-dto.js.map