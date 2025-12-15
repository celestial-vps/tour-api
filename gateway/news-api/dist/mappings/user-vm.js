"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapping = exports.UserVm = exports.UserTokenVm = void 0;
const common_1 = require("@nestjs/common");
class UserTokenVm {
    oid;
    email;
    token;
    refreshToken;
    isActive;
    activatedAt;
    createdAt;
    updatedAt;
}
exports.UserTokenVm = UserTokenVm;
class UserVm {
    oid;
    name;
    role;
    email;
    birthday;
    memberNumber;
    androidToken;
    expiredTime;
    isActive;
    activatedAt;
    createdAt;
    updatedAt;
}
exports.UserVm = UserVm;
let UserMapping = class UserMapping {
    toUserResponse(user) {
        return {
            oid: user.oid,
            name: user.name,
            email: user.email,
            role: user.role.roleName,
            birthday: user.birthday ? user.birthday.toISOString() : '',
            memberNumber: user.memberNumber ?? '',
            androidToken: user.androidToken ?? '',
            expiredTime: user.expiredTime ?? '',
            isActive: user.isActive ? 'Active' : 'Inactive',
            activatedAt: user.updatedAt ? user.updatedAt.toISOString() : '',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    toUserTokenResponse(user, token, refreshToken) {
        return {
            oid: user.oid,
            email: user.email,
            token: token,
            refreshToken: refreshToken,
            isActive: user.isActive ? 'Active' : 'Inactive',
            activatedAt: user.updatedAt ? user.updatedAt.toISOString() : '',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    toUserResponses(users) {
        return users.map(user => this.toUserResponse(user));
    }
};
exports.UserMapping = UserMapping;
exports.UserMapping = UserMapping = __decorate([
    (0, common_1.Injectable)()
], UserMapping);
//# sourceMappingURL=user-vm.js.map