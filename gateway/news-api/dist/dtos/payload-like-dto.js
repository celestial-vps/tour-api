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
exports.UpdateLikeDto = exports.CreateLikeDto = exports.FilterLikeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
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
//# sourceMappingURL=payload-like-dto.js.map