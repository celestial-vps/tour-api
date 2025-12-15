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
exports.UpdateArticleDto = exports.CreateArticleDto = exports.FilterArticleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FilterArticleDto {
    title;
    authorId;
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
], FilterArticleDto.prototype, "authorId", void 0);
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
//# sourceMappingURL=payload-article-dto.js.map