"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleModule = void 0;
const common_1 = require("@nestjs/common");
const build_response_1 = require("../common/build.response");
const user_role_repository_1 = require("../repositories/user-role.repository");
const user_role_service_1 = require("../services/user-role.service");
const user_role_1 = require("../models/user-role");
const mongoose_1 = require("@nestjs/mongoose");
const user_role_controller_1 = require("../controllers/user-role.controller");
const audit_trail_module_1 = require("./audit-trail.module");
const admin_role_guard_1 = require("../middleware/guards/admin-role.guard");
const user_module_1 = require("./user.module");
let UserRoleModule = class UserRoleModule {
};
exports.UserRoleModule = UserRoleModule;
exports.UserRoleModule = UserRoleModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: user_role_1.UserRole.name, schema: user_role_1.UserRoleSchema }]),
            user_module_1.UserModule, audit_trail_module_1.AuditTrailModule],
        controllers: [user_role_controller_1.UserRoleController],
        providers: [user_role_service_1.UserRoleService, build_response_1.ResponseService, user_role_repository_1.UserRoleRepository, admin_role_guard_1.AdminRoleGuard],
        exports: [user_role_repository_1.UserRoleRepository, admin_role_guard_1.AdminRoleGuard],
    })
], UserRoleModule);
//# sourceMappingURL=user-role.module.js.map