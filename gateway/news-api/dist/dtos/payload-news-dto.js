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
exports.SuccessNewsPaginatedResponseDto = exports.SuccessNewsObjectResponseDto = exports.SuccessNewsResponseDto = exports.ResponseNewsVm = exports.UpdateNewsDto = exports.CreateNewsDto = exports.NewsDetailDto = exports.FilterNewsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const api_base_response_decorator_1 = require("./base/api-base-response.decorator");
const pagination_info_dto_1 = require("./base/pagination-info-dto");
const class_transformer_1 = require("class-transformer");
class FilterNewsDto {
    title;
    content;
}
exports.FilterNewsDto = FilterNewsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Breaking News', description: 'Filter berita berdasarkan judul (title) yang mengandung kata ini' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterNewsDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Isi lengkap berita...', description: 'Filter berita berdasarkan konten (content) yang mengandung kata ini' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterNewsDto.prototype, "content", void 0);
class NewsDetailDto {
    imageOid;
    newsOid;
    role;
}
exports.NewsDetailDto = NewsDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-category', description: 'OID kategori berita' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], NewsDetailDto.prototype, "imageOid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-category', description: 'OID kategori berita' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], NewsDetailDto.prototype, "newsOid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'draft', description: 'Status berita', enum: ['draft', 'published', 'archived'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['cover', 'thumbnail', 'gallery']),
    __metadata("design:type", String)
], NewsDetailDto.prototype, "role", void 0);
class CreateNewsDto {
    title;
    content;
    summary;
    author;
    imageOid;
    categoryOid;
    status;
    publishedAt;
    tags;
    views;
    language;
    nwsDetails;
}
exports.CreateNewsDto = CreateNewsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Breaking News', description: 'Judul berita' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Isi lengkap berita...', description: 'Konten berita' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Ringkasan berita', description: 'Ringkasan berita' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'John Doe', description: 'Penulis berita' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-image', description: 'OID gambar utama berita' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "imageOid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-category', description: 'OID kategori berita' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "categoryOid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'draft', description: 'Status berita', enum: ['draft', 'published', 'archived'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['draft', 'published', 'archived']),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-11-20T12:00:00Z', description: 'Tanggal publikasi berita' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateNewsDto.prototype, "publishedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ['tech', 'ai'],
        description: 'Tags berita',
        type: [String]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateNewsDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, description: 'Tags berita' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateNewsDto.prototype, "views", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'en', description: 'Bahasa berita' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [NewsDetailDto],
        description: 'Detail gambar berita',
        example: [{ imageOid: 'uuid-image', newsOid: 'uuid-news', role: 'cover' }]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => NewsDetailDto),
    __metadata("design:type", Array)
], CreateNewsDto.prototype, "nwsDetails", void 0);
class UpdateNewsDto {
    title;
    content;
    summary;
    author;
    imageOid;
    categoryOid;
    status;
    publishedAt;
    tags;
    views;
    language;
}
exports.UpdateNewsDto = UpdateNewsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Breaking News', description: 'Judul berita' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateNewsDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Isi lengkap berita...', description: 'Konten berita' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateNewsDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Ringkasan berita', description: 'Ringkasan berita' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNewsDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'John Doe', description: 'Penulis berita' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNewsDto.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-image', description: 'OID gambar utama berita' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNewsDto.prototype, "imageOid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-category', description: 'OID kategori berita' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateNewsDto.prototype, "categoryOid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'draft', description: 'Status berita', enum: ['draft', 'published', 'archived'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['draft', 'published', 'archived']),
    __metadata("design:type", String)
], UpdateNewsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-11-20T12:00:00Z', description: 'Tanggal publikasi berita' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateNewsDto.prototype, "publishedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'tech,ai', description: 'Tags berita' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNewsDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, description: 'Tags berita' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateNewsDto.prototype, "views", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'en', description: 'Bahasa berita' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateNewsDto.prototype, "language", void 0);
class ResponseNewsVm {
    oid;
    title;
    content;
    summary;
    createdAt;
    updatedAt;
}
exports.ResponseNewsVm = ResponseNewsVm;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'OID bank' }),
    __metadata("design:type", String)
], ResponseNewsVm.prototype, "oid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B001', description: 'News code' }),
    __metadata("design:type", String)
], ResponseNewsVm.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'News Mandiri', description: 'News name' }),
    __metadata("design:type", String)
], ResponseNewsVm.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mandiri', description: 'Short name' }),
    __metadata("design:type", String)
], ResponseNewsVm.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' }),
    __metadata("design:type", Date)
], ResponseNewsVm.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false }),
    __metadata("design:type", Date)
], ResponseNewsVm.prototype, "updatedAt", void 0);
class SuccessNewsResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data = [];
}
exports.SuccessNewsResponseDto = SuccessNewsResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNewsResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNewsResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNewsResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNewsResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseNewsVm], description: 'List of banks' }),
    __metadata("design:type", Array)
], SuccessNewsResponseDto.prototype, "data", void 0);
class SuccessNewsObjectResponseDto {
    resultCode;
    httpStatus;
    message;
    total;
    data;
}
exports.SuccessNewsObjectResponseDto = SuccessNewsObjectResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNewsObjectResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNewsObjectResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNewsObjectResponseDto.prototype, "message", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNewsObjectResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ResponseNewsVm, description: 'News object' }),
    __metadata("design:type", ResponseNewsVm)
], SuccessNewsObjectResponseDto.prototype, "data", void 0);
class SuccessNewsPaginatedResponseDto {
    resultCode;
    httpStatus;
    message;
    pagination;
    data;
}
exports.SuccessNewsPaginatedResponseDto = SuccessNewsPaginatedResponseDto;
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNewsPaginatedResponseDto.prototype, "resultCode", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", Number)
], SuccessNewsPaginatedResponseDto.prototype, "httpStatus", void 0);
__decorate([
    (0, api_base_response_decorator_1.ApiBaseResponseProps)(),
    __metadata("design:type", String)
], SuccessNewsPaginatedResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: pagination_info_dto_1.PaginationInfo }),
    __metadata("design:type", pagination_info_dto_1.PaginationInfo)
], SuccessNewsPaginatedResponseDto.prototype, "pagination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ResponseNewsVm] }),
    __metadata("design:type", Array)
], SuccessNewsPaginatedResponseDto.prototype, "data", void 0);
//# sourceMappingURL=payload-news-dto.js.map