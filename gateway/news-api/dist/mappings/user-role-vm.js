"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleMapping = exports.UserRoleVm = void 0;
const common_1 = require("@nestjs/common");
class UserRoleVm {
    oid;
    roleName;
    targetType;
    isAdministrative;
    readState;
    writeState;
    createState;
    deleteState;
    navigateState;
    createdAt;
    updatedAt;
}
exports.UserRoleVm = UserRoleVm;
let UserRoleMapping = class UserRoleMapping {
    toUserRoleResponse(userRole) {
        return {
            oid: userRole.oid,
            roleName: userRole.roleName,
            targetType: userRole.targetType ?? '',
            isAdministrative: userRole.isAdministrative,
            readState: userRole.readState,
            writeState: userRole.writeState,
            createState: userRole.createState,
            deleteState: userRole.deleteState,
            navigateState: userRole.navigateState,
            createdAt: userRole.createdAt,
            updatedAt: userRole.updatedAt,
        };
    }
    toUserRoleResponses(userRoles) {
        return userRoles.map(userRole => this.toUserRoleResponse(userRole));
    }
};
exports.UserRoleMapping = UserRoleMapping;
exports.UserRoleMapping = UserRoleMapping = __decorate([
    (0, common_1.Injectable)()
], UserRoleMapping);
//# sourceMappingURL=user-role-vm.js.map