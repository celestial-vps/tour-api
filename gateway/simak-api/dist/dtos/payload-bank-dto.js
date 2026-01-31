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
exports.UpdateBankDto = exports.CreateBankDto = exports.FilterBankDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FilterBankDto {
    bankCode;
    bankName;
}
exports.FilterBankDto = FilterBankDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B001', description: 'Bank code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterBankDto.prototype, "bankCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Bank', description: 'Bank name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterBankDto.prototype, "bankName", void 0);
class CreateBankDto {
    bankCode;
    bankName;
    shortName;
}
exports.CreateBankDto = CreateBankDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B001', description: 'Bank code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBankDto.prototype, "bankCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Bank', description: 'Bank name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBankDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MB', description: 'Short name of bank' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBankDto.prototype, "shortName", void 0);
class UpdateBankDto {
    bankCode;
    bankName;
    shortName;
}
exports.UpdateBankDto = UpdateBankDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B001', description: 'Bank code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateBankDto.prototype, "bankCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Bank', description: 'Bank name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateBankDto.prototype, "bankName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MB', description: 'Short name of bank' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateBankDto.prototype, "shortName", void 0);
//# sourceMappingURL=payload-bank-dto.js.map