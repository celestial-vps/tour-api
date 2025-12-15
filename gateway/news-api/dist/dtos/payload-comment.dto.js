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
exports.UpdateCommentDto = exports.CreateCommentDto = exports.FilterCommentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FilterCommentDto {
    articleId;
    userId;
    status;
}
exports.FilterCommentDto = FilterCommentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FilterCommentDto.prototype, "articleId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FilterCommentDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['pending', 'approved', 'rejected']),
    __metadata("design:type", String)
], FilterCommentDto.prototype, "status", void 0);
class CreateCommentDto {
    articleId;
    userId;
    content;
    status;
}
exports.CreateCommentDto = CreateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-article', description: 'ID of the article' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "articleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-user', description: 'ID of the user' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'This is a comment', description: 'Comment content' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'pending', description: 'Status of the comment' }),
    (0, class_validator_1.IsEnum)(['pending', 'approved', 'rejected']),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "status", void 0);
class UpdateCommentDto {
    articleId;
    content;
    status;
}
exports.UpdateCommentDto = UpdateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-article', description: 'ID of the article' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateCommentDto.prototype, "articleId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateCommentDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['pending', 'approved', 'rejected']),
    __metadata("design:type", String)
], UpdateCommentDto.prototype, "status", void 0);
//# sourceMappingURL=payload-comment.dto.js.map