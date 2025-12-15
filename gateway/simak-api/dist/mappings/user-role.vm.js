"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleVm = void 0;
exports.toUserRoleResponse = toUserRoleResponse;
exports.toUserRoleResponses = toUserRoleResponses;
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
    constructor(oid, roleName, targetType, isAdministrative, readState, writeState, createState, deleteState, navigateState, createdAt, updatedAt) {
        this.oid = oid;
        this.roleName = roleName;
        this.targetType = targetType;
        this.isAdministrative = isAdministrative;
        this.readState = readState;
        this.writeState = writeState;
        this.createState = createState;
        this.deleteState = deleteState;
        this.navigateState = navigateState;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.UserRoleVm = UserRoleVm;
function toUserRoleResponse(userRole) {
    return new UserRoleVm(userRole.oid, userRole.roleName, userRole.targetType, userRole.isAdministrative, userRole.readState, userRole.writeState, userRole.createState, userRole.deleteState, userRole.navigateState, userRole.createdAt, userRole.updatedAt);
}
function toUserRoleResponses(userRoles) {
    return userRoles.map(toUserRoleResponse);
}
//# sourceMappingURL=user-role.vm.js.map