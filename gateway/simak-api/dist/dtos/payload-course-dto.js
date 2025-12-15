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
exports.UpdateCourseDto = exports.CreateCourseDto = exports.FilterCourseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FilterCourseDto {
    courseCode;
    courseName;
}
exports.FilterCourseDto = FilterCourseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'IF101', description: 'Course code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterCourseDto.prototype, "courseCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Algorithms', description: 'Course name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterCourseDto.prototype, "courseName", void 0);
class CreateCourseDto {
    courseCode;
    courseName;
    credits;
}
exports.CreateCourseDto = CreateCourseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'IF101', description: 'Course code' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "courseCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Algorithms', description: 'Course name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "courseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Credits' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "credits", void 0);
class UpdateCourseDto extends CreateCourseDto {
}
exports.UpdateCourseDto = UpdateCourseDto;
//# sourceMappingURL=payload-course-dto.js.map