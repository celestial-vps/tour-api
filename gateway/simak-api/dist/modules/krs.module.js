"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KrsModule = void 0;
const common_1 = require("@nestjs/common");
const krs_controller_1 = require("../controllers/krs.controller");
const krs_service_1 = require("../services/krs.service");
const krs_repository_1 = require("../repositories/krs.repository");
const build_response_1 = require("../common/build.response");
const user_module_1 = require("./user.module");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const audit_trail_module_1 = require("./audit-trail.module");
const mongoose_1 = require("@nestjs/mongoose");
const krs_1 = require("../models/krs");
let KrsModule = class KrsModule {
};
exports.KrsModule = KrsModule;
exports.KrsModule = KrsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: krs_1.Krs.name, schema: krs_1.KrsSchema }]), audit_trail_module_1.AuditTrailModule, user_module_1.UserModule],
        controllers: [krs_controller_1.KrsController],
        providers: [audit_trail_midleware_service_1.AuditTrailService, krs_service_1.KrsService, build_response_1.ResponseService, krs_repository_1.KrsRepository],
        exports: [audit_trail_midleware_service_1.AuditTrailService],
    })
], KrsModule);
//# sourceMappingURL=krs.module.js.map