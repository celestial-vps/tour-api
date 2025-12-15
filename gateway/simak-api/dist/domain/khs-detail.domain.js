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
exports.KhsDetailDomain = void 0;
const class_transformer_1 = require("class-transformer");
const mapper_1 = require("../misc/mapper");
class KhsDetailDomain {
    id;
    studyResult;
    course;
    gradeLetter;
    gradePoint;
    createdBy;
    createdAt;
    lastModifiedBy;
    updatedAt;
    deletedBy;
    deletedAt;
}
exports.KhsDetailDomain = KhsDetailDomain;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)((params) => params.obj._id ? String(params.obj._id) : (0, mapper_1.ObjectIdToString)(params)),
    __metadata("design:type", String)
], KhsDetailDomain.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], KhsDetailDomain.prototype, "studyResult", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], KhsDetailDomain.prototype, "course", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], KhsDetailDomain.prototype, "gradeLetter", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], KhsDetailDomain.prototype, "gradePoint", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], KhsDetailDomain.prototype, "createdBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], KhsDetailDomain.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], KhsDetailDomain.prototype, "lastModifiedBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], KhsDetailDomain.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], KhsDetailDomain.prototype, "deletedBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], KhsDetailDomain.prototype, "deletedAt", void 0);
//# sourceMappingURL=khs-detail.domain.js.map