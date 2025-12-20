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
exports.SuccessArticlePaginatedResponseDto = exports.SuccessArticleObjectResponseDto = exports.SuccessArticleResponseDto = exports.ResponseArticleVm = exports.UpdateArticleDto = exports.CreateArticleDto = exports.FilterArticleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const api_base_response_decorator_1 = require("./base/api-base-response.decorator");
const pagination_info_dto_1 = require("./base/pagination-info-dto");
class FilterArticleDto {
    title;
    content;
    categoryId;
    status;
}
exports.FilterArticleDto = FilterArticleDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterArticleDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FilterArticleDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FilterArticleDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['draft', 'published', 'deleted']),
    __metadata("design:type", String)
], FilterArticleDto.prototype, "status", void 0);
class CreateArticleDto {
    title;
    slug;
    content;
    thumbnail;
    authorId;
    categoryId;
    status;
}
exports.CreateArticleDto = CreateArticleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Breaking News', description: 'Article title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'breaking-news', description: 'Slug for URL' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Article content here...', description: 'Content of the article' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'thumbnail.jpg', description: 'Thumbnail image' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-author', description: 'Author ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "authorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-category', description: 'Category ID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'draft', description: 'Status of article' }),
    (0, class_validator_1.IsEnum)(['draft', 'published', 'deleted']),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "status", void 0);
class UpdateArticleDto {
    title;
    slug;
    content;
    thumbnail;
    authorId;
    categoryId;
    status;
}
exports.UpdateArticleDto = UpdateArticleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateArticleDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateArticleDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateArticleDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateArticleDto.prototype, "thumbnail", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateArticleDto.prototype, "authorId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateArticleDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['draft', 'published', 'deleted']),
    __metadata("design:type", String)
], UpdateArticleDto.prototype, "status", void 0);
class ResponseArticleVm {
    oid;
    title;
    createdAt;
    updatedAt;
}
exports.ResponseArticleVm = ResponseArticleVm;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'OID bank' }),
    __metadata("design:type", String)
], ResponseArticleVm.prototype, "oid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B001', description: 'Article code' }),
    __metadata("design:type", String)
], ResponseArticleVm.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' }),
    __metadata("design:type", Date)
], ResponseArticleVm.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false }),
    __metadata("design:type", Date)
], ResponseArticleVm.prototype, "updatedAt", void 0);
class SuccessArticleResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data = [];
}
exports.SuccessArticleResponseDto = SuccessArticleResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessArticleResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessArticleResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessArticleResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessArticleResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseArticleVm], description: 'List of banks' }),
    __metadata("design:type", Array)
], SuccessArticleResponseDto.prototype, "data", void 0);
class SuccessArticleObjectResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data;
}
exports.SuccessArticleObjectResponseDto = SuccessArticleObjectResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessArticleObjectResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessArticleObjectResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessArticleObjectResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessArticleObjectResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ResponseArticleVm, description: 'Article object' }),
    __metadata("design:type", ResponseArticleVm)
], SuccessArticleObjectResponseDto.prototype, "data", void 0);
class SuccessArticlePaginatedResponseDto {
    resultCode;
    httpStatus;
    message;
    pagination;
    data;
}
exports.SuccessArticlePaginatedResponseDto = SuccessArticlePaginatedResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessArticlePaginatedResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessArticlePaginatedResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessArticlePaginatedResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_info_dto_1.PaginationInfo }),
    __metadata("design:type", pagination_info_dto_1.PaginationInfo)
], SuccessArticlePaginatedResponseDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseArticleVm] }),
    __metadata("design:type", Array)
], SuccessArticlePaginatedResponseDto.prototype, "data", void 0);
//# sourceMappingURL=payload-article-dto.js.map