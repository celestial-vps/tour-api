"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bank_entity_1 = require("../models/bank.entity");
const bank_controller_1 = require("../controllers/bank.controller");
const bank_service_1 = require("../services/bank.service");
const bank_repository_1 = require("../repositories/bank.repository");
const build_response_1 = require("../common/build.response");
const bank_vm_1 = require("../mappings/bank-vm");
const user_module_1 = require("./user.module");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const audit_trail_module_1 = require("./audit-trail.module");
const request_handler_service_1 = require("../services/request-handler.service");
let BankModule = class BankModule {
};
exports.BankModule = BankModule;
exports.BankModule = BankModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([bank_entity_1.Bank]), user_module_1.UserModule, audit_trail_module_1.AuditTrailModule],
        controllers: [bank_controller_1.BankController],
        providers: [audit_trail_midleware_service_1.AuditTrailService, bank_service_1.BankService, request_handler_service_1.RequestHandlerService, build_response_1.ResponseService, bank_repository_1.BankRepository, bank_vm_1.BankMapping],
        exports: [audit_trail_midleware_service_1.AuditTrailService],
    })
], BankModule);
//# sourceMappingURL=bank.module.js.map