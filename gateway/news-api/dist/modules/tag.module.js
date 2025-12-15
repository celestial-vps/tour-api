"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tag_entity_1 = require("../models/tag.entity");
const tag_controller_1 = require("../controllers/tag.controller");
const tag_service_1 = require("../services/tag.service");
const tag_repository_1 = require("../repositories/tag.repository");
const build_response_1 = require("../common/build.response");
const tag_vm_1 = require("../mappings/tag-vm");
const user_module_1 = require("./user.module");
const audit_trail_midleware_service_1 = require("../middleware/audit-trail/audit-trail-midleware-service");
const audit_trail_module_1 = require("./audit-trail.module");
let TagModule = class TagModule {
};
exports.TagModule = TagModule;
exports.TagModule = TagModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tag_entity_1.Tag]), user_module_1.UserModule, audit_trail_module_1.AuditTrailModule],
        controllers: [tag_controller_1.TagController],
        providers: [audit_trail_midleware_service_1.AuditTrailService, tag_service_1.TagService, build_response_1.ResponseService, tag_repository_1.TagRepository, tag_vm_1.TagMapping],
        exports: [audit_trail_midleware_service_1.AuditTrailService],
    })
], TagModule);
//# sourceMappingURL=tag.module.js.map