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
exports.SuccessBannerPaginatedResponseDto = exports.SuccessBannerObjectResponseDto = exports.SuccessBannerResponseDto = exports.ResponseBannerVm = exports.UpdateBannerDto = exports.CreateBannerDto = exports.FilterBannerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pagination_info_dto_1 = require("./base/pagination-info-dto");
const api_base_response_decorator_1 = require("./base/api-base-response.decorator");
class FilterBannerDto {
    title;
}
exports.FilterBannerDto = FilterBannerDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterBannerDto.prototype, "title", void 0);
class CreateBannerDto {
    title;
    image;
    articleId;
}
exports.CreateBannerDto = CreateBannerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Big Sale', description: 'Banner title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'banner.jpg', description: 'Banner image' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-article', description: 'Optional article ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "articleId", void 0);
class UpdateBannerDto {
    title;
    image;
    articleId;
}
exports.UpdateBannerDto = UpdateBannerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateBannerDto.prototype, "articleId", void 0);
class ResponseBannerVm {
    oid;
    title;
    createdAt;
    updatedAt;
}
exports.ResponseBannerVm = ResponseBannerVm;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'OID bank' }),
    __metadata("design:type", String)
], ResponseBannerVm.prototype, "oid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B001', description: 'Banner code' }),
    __metadata("design:type", String)
], ResponseBannerVm.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' }),
    __metadata("design:type", Date)
], ResponseBannerVm.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false }),
    __metadata("design:type", Date)
], ResponseBannerVm.prototype, "updatedAt", void 0);
class SuccessBannerResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data = [];
}
exports.SuccessBannerResponseDto = SuccessBannerResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessBannerResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessBannerResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessBannerResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessBannerResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseBannerVm], description: 'List of banks' }),
    __metadata("design:type", Array)
], SuccessBannerResponseDto.prototype, "data", void 0);
class SuccessBannerObjectResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data;
}
exports.SuccessBannerObjectResponseDto = SuccessBannerObjectResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessBannerObjectResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessBannerObjectResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessBannerObjectResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessBannerObjectResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ResponseBannerVm, description: 'Banner object' }),
    __metadata("design:type", ResponseBannerVm)
], SuccessBannerObjectResponseDto.prototype, "data", void 0);
class SuccessBannerPaginatedResponseDto {
    resultCode;
    httpStatus;
    message;
    pagination;
    data;
}
exports.SuccessBannerPaginatedResponseDto = SuccessBannerPaginatedResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessBannerPaginatedResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessBannerPaginatedResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessBannerPaginatedResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_info_dto_1.PaginationInfo }),
    __metadata("design:type", pagination_info_dto_1.PaginationInfo)
], SuccessBannerPaginatedResponseDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseBannerVm] }),
    __metadata("design:type", Array)
], SuccessBannerPaginatedResponseDto.prototype, "data", void 0);
//# sourceMappingURL=payload-banner-dto.js.map