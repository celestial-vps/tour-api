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
exports.UpdateImageFileDto = exports.CreateImageFileDto = exports.FilterImageFileDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const image_owner_type_enum_1 = require("../enums/image-owner-type.enum");
class FilterImageFileDto {
    fileName;
    fileUrl;
}
exports.FilterImageFileDto = FilterImageFileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'banner.png', description: 'Nama file yang ingin difilter' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterImageFileDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://cdn.domain.com/uploads/banner.png', description: 'URL file' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterImageFileDto.prototype, "fileUrl", void 0);
class CreateImageFileDto {
    file;
}
exports.CreateImageFileDto = CreateImageFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'File yang akan diupload',
    }),
    __metadata("design:type", Object)
], CreateImageFileDto.prototype, "file", void 0);
class UpdateImageFileDto {
    oid;
    fileName;
    fileUrl;
    filePath;
    fileMime;
    ownerType;
    lastUserId;
}
exports.UpdateImageFileDto = UpdateImageFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-image-1234', description: 'OID file yang akan diupdate' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateImageFileDto.prototype, "oid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'banner-new.png', description: 'Nama file baru (opsional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImageFileDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://cdn.domain.com/uploads/banner-new.png', description: 'URL file baru (opsional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImageFileDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/uploads/banner-new.png', description: 'Path file baru' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImageFileDto.prototype, "filePath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'image/jpeg', description: 'MIME type baru' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImageFileDto.prototype, "fileMime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tipe pemilik file', enum: image_owner_type_enum_1.ImageOwnerTypeEnum, example: image_owner_type_enum_1.ImageOwnerTypeEnum.USER }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.values(image_owner_type_enum_1.ImageOwnerTypeEnum)),
    __metadata("design:type", String)
], UpdateImageFileDto.prototype, "ownerType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'user-uuid-5678', description: 'UUID user yang terakhir mengubah' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateImageFileDto.prototype, "lastUserId", void 0);
//# sourceMappingURL=payload-image-file-dto.js.map