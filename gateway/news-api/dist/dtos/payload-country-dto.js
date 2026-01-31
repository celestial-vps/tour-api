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
exports.FilterCountryDto = exports.ParamsCountryDto = exports.UpdateCountryDto = exports.CreateCountryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
class CreateCountryDto {
    countryCode;
    countryName;
    countryCurrency;
}
exports.CreateCountryDto = CreateCountryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ID', description: 'Kode negara (ISO 3166-1 alpha-2)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Indonesia', description: 'Nama negara' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "countryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'IDR', description: 'Mata uang negara' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "countryCurrency", void 0);
class UpdateCountryDto extends (0, mapped_types_1.PartialType)(CreateCountryDto) {
}
exports.UpdateCountryDto = UpdateCountryDto;
class ParamsCountryDto {
    oid;
}
exports.ParamsCountryDto = ParamsCountryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'f22a32d8-2f11-4b78-a263-c9b199ecad0c', description: 'OID negara' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ParamsCountryDto.prototype, "oid", void 0);
class FilterCountryDto {
    countryCode;
    countryName;
    countryCurrency;
    pageIndex;
    pageSize;
    sortBy;
    sortOrder;
}
exports.FilterCountryDto = FilterCountryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ID', description: 'Filter berdasarkan kode negara' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterCountryDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Indonesia', description: 'Filter berdasarkan nama negara' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterCountryDto.prototype, "countryName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'IDR', description: 'Filter berdasarkan mata uang' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterCountryDto.prototype, "countryCurrency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Halaman ke berapa (pageIndex)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FilterCountryDto.prototype, "pageIndex", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, description: 'Jumlah data per halaman (pageSize)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FilterCountryDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'countryName', description: 'Kolom untuk sort', enum: ['countryCode', 'countryName', 'countryCurrency'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['countryCode', 'countryName', 'countryCurrency']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterCountryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'asc', description: 'Urutan sort', enum: ['asc', 'desc'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['asc', 'desc']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterCountryDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=payload-country-dto.js.map