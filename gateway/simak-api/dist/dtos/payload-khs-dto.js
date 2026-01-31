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
exports.UpdateStudyResultDto = exports.CreateStudyResultDto = exports.FilterStudyResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FilterStudyResultDto {
    student;
    semester;
}
exports.FilterStudyResultDto = FilterStudyResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'studentId', description: 'Student ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterStudyResultDto.prototype, "student", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Semester' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FilterStudyResultDto.prototype, "semester", void 0);
class CreateStudyResultDto {
    student;
    semester;
    academicYear;
}
exports.CreateStudyResultDto = CreateStudyResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'studentId', description: 'Student ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudyResultDto.prototype, "student", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Semester' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateStudyResultDto.prototype, "semester", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024/2025', description: 'Academic year' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudyResultDto.prototype, "academicYear", void 0);
class UpdateStudyResultDto extends CreateStudyResultDto {
}
exports.UpdateStudyResultDto = UpdateStudyResultDto;
//# sourceMappingURL=payload-khs-dto.js.map