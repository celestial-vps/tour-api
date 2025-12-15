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
exports.UpdateNewsCategoryDto = exports.CreateNewsCategoryDto = exports.FilterNewsCategoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
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
//# sourceMappingURL=payload-news-category-dto.js.map