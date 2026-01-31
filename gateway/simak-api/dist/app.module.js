"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const bank_module_1 = require("./modules/bank.module");
const auth_module_1 = require("./modules/auth.module");
const configuration_1 = __importDefault(require("./config/configuration"));
const course_module_1 = require("./modules/course.module");
const teacher_module_1 = require("./modules/teacher.module");
const student_module_1 = require("./modules/student.module");
const krs_module_1 = require("./modules/krs.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV}`,
                load: [configuration_1.default],
            }),
            mongoose_1.MongooseModule.forRoot('mongodb://localhost:27017/simakdb'), auth_module_1.AuthModule,
            bank_module_1.BankModule, course_module_1.CourseModule, student_module_1.StudentModule,
            teacher_module_1.TeacherModule,
            krs_module_1.KrsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map