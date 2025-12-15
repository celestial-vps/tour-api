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
exports.KhsDetailSchema = exports.KhsDetail = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_1 = require("./base");
const course_1 = require("./course");
const khs_1 = require("./khs");
let KhsDetail = class KhsDetail extends base_1.Base {
    studyResult;
    course;
    gradeLetter;
    gradePoint;
};
exports.KhsDetail = KhsDetail;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: khs_1.Khs.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], KhsDetail.prototype, "studyResult", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: course_1.Course.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], KhsDetail.prototype, "course", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], KhsDetail.prototype, "gradeLetter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], KhsDetail.prototype, "gradePoint", void 0);
exports.KhsDetail = KhsDetail = __decorate([
    (0, mongoose_1.Schema)()
], KhsDetail);
exports.KhsDetailSchema = mongoose_1.SchemaFactory.createForClass(KhsDetail);
//# sourceMappingURL=khs-detail.js.map