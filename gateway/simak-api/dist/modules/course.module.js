"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModule = void 0;
const common_1 = require("@nestjs/common");
const course_controller_1 = require("../controllers/course.controller");
const course_service_1 = require("../services/course.service");
const course_repository_1 = require("../repositories/course.repository");
const build_response_1 = require("../common/build.response");
const user_module_1 = require("./user.module");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const audit_trail_module_1 = require("./audit-trail.module");
const mongoose_1 = require("@nestjs/mongoose");
const course_1 = require("../models/course");
let CourseModule = class CourseModule {
};
exports.CourseModule = CourseModule;
exports.CourseModule = CourseModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: course_1.Course.name, schema: course_1.CourseSchema }]), audit_trail_module_1.AuditTrailModule, user_module_1.UserModule],
        controllers: [course_controller_1.CourseController],
        providers: [audit_trail_midleware_service_1.AuditTrailService, course_service_1.CourseService, build_response_1.ResponseService, course_repository_1.CourseRepository],
        exports: [audit_trail_midleware_service_1.AuditTrailService],
    })
], CourseModule);
//# sourceMappingURL=course.module.js.map