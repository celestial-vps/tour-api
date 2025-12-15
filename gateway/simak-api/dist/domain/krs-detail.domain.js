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
exports.KrsDetailDomain = void 0;
const class_transformer_1 = require("class-transformer");
const mapper_1 = require("../misc/mapper");
class KrsDetailDomain {
    id;
    studyPlan;
    course;
    createdBy;
    createdAt;
    lastModifiedBy;
    updatedAt;
    deletedBy;
    deletedAt;
}
exports.KrsDetailDomain = KrsDetailDomain;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)((params) => params.obj._id ? String(params.obj._id) : (0, mapper_1.ObjectIdToString)(params)),
    __metadata("design:type", String)
], KrsDetailDomain.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], KrsDetailDomain.prototype, "studyPlan", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], KrsDetailDomain.prototype, "course", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], KrsDetailDomain.prototype, "createdBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], KrsDetailDomain.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], KrsDetailDomain.prototype, "lastModifiedBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], KrsDetailDomain.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], KrsDetailDomain.prototype, "deletedBy", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], KrsDetailDomain.prototype, "deletedAt", void 0);
//# sourceMappingURL=krs-detail.domain.js.map