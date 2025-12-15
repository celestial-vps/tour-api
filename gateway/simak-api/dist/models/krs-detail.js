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
exports.KrsDetailSchema = exports.KrsDetail = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_1 = require("./base");
const krs_1 = require("./krs");
const course_1 = require("./course");
let KrsDetail = class KrsDetail extends base_1.Base {
    krsOid;
    course;
};
exports.KrsDetail = KrsDetail;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: krs_1.Krs.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], KrsDetail.prototype, "krsOid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: course_1.Course.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], KrsDetail.prototype, "course", void 0);
exports.KrsDetail = KrsDetail = __decorate([
    (0, mongoose_1.Schema)()
], KrsDetail);
exports.KrsDetailSchema = mongoose_1.SchemaFactory.createForClass(KrsDetail);
//# sourceMappingURL=krs-detail.js.map