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
exports.UpdateBookmarkDto = exports.CreateBookmarkDto = exports.FilterBookmarkDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
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
//# sourceMappingURL=payload-bookmark-dto.js.map