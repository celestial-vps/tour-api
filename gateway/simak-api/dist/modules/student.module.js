"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModule = void 0;
const common_1 = require("@nestjs/common");
const student_controller_1 = require("../controllers/student.controller");
const student_service_1 = require("../services/student.service");
const student_repository_1 = require("../repositories/student.repository");
const build_response_1 = require("../common/build.response");
const user_module_1 = require("./user.module");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const audit_trail_module_1 = require("./audit-trail.module");
const mongoose_1 = require("@nestjs/mongoose");
const student_1 = require("../models/student");
let StudentModule = class StudentModule {
};
exports.StudentModule = StudentModule;
exports.StudentModule = StudentModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: student_1.Student.name, schema: student_1.StudentSchema }]), audit_trail_module_1.AuditTrailModule, user_module_1.UserModule],
        controllers: [student_controller_1.StudentController],
        providers: [audit_trail_midleware_service_1.AuditTrailService, student_service_1.StudentService, build_response_1.ResponseService, student_repository_1.StudentRepository],
        exports: [audit_trail_midleware_service_1.AuditTrailService],
    })
], StudentModule);
//# sourceMappingURL=student.module.js.map