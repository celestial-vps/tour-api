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
exports.KrsSchema = exports.Krs = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_1 = require("./base");
const student_1 = require("./student");
let Krs = class Krs extends base_1.Base {
    student;
    semester;
    academicYear;
};
exports.Krs = Krs;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: student_1.Student.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Krs.prototype, "student", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Krs.prototype, "semester", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Krs.prototype, "academicYear", void 0);
exports.Krs = Krs = __decorate([
    (0, mongoose_1.Schema)()
], Krs);
exports.KrsSchema = mongoose_1.SchemaFactory.createForClass(Krs);
//# sourceMappingURL=krs.js.map