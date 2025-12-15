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
exports.UpdateStudyResultDetailDto = exports.CreateStudyResultDetailDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateStudyResultDetailDto {
    studyResult;
    course;
    gradeLetter;
    gradePoint;
}
exports.CreateStudyResultDetailDto = CreateStudyResultDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'studyResultId', description: 'Study result ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudyResultDetailDto.prototype, "studyResult", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'courseId', description: 'Course ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudyResultDetailDto.prototype, "course", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A', description: 'Letter grade' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudyResultDetailDto.prototype, "gradeLetter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4.0, description: 'Grade point' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateStudyResultDetailDto.prototype, "gradePoint", void 0);
class UpdateStudyResultDetailDto extends CreateStudyResultDetailDto {
}
exports.UpdateStudyResultDetailDto = UpdateStudyResultDetailDto;
//# sourceMappingURL=payload-khs-detail-dto.js.map