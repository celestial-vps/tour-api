"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTokenVm = exports.UserRegisterVm = exports.UserVm = void 0;
exports.toUserResponse = toUserResponse;
exports.toUserRegisterResponse = toUserRegisterResponse;
exports.toUserTokenResponse = toUserTokenResponse;
exports.toUserResponses = toUserResponses;
const moment_1 = __importDefault(require("moment"));
class UserVm {
    oid;
    name;
    email;
    androidToken;
    isActive;
    activatedAt;
    userRole;
    createdAt;
    updatedAt;
    constructor(oid, name, email, androidToken, isActive, activatedAt, userRole, createdAt, updatedAt) {
        this.oid = oid;
        this.name = name;
        this.email = email;
        this.androidToken = androidToken;
        this.isActive = isActive;
        this.activatedAt = activatedAt;
        this.userRole = userRole;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.UserVm = UserVm;
class UserRegisterVm {
    oid;
    email;
    isActive;
    createdAt;
    updatedAt;
    constructor(oid, email, isActive, createdAt, updatedAt) {
        this.oid = oid;
        this.email = email;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.UserRegisterVm = UserRegisterVm;
class UserTokenVm {
    oid;
    email;
    token;
    refreshToken;
    isActive;
    createdAt;
    updatedAt;
    constructor(oid, email, token, refreshToken, isActive, createdAt, updatedAt) {
        this.oid = oid;
        this.email = email;
        this.token = token;
        this.refreshToken = refreshToken;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.UserTokenVm = UserTokenVm;
function toUserResponse(user) {
    return new UserVm(user.oid, user.name, user.email, user.androidToken, user.isActive, (0, moment_1.default)(user.activatedAt).format(), user.userRole, user.createdAt, user.updatedAt);
}
function toUserRegisterResponse(user) {
    return new UserRegisterVm(user.oid, user.email, user.isActive, user.createdAt, user.updatedAt);
}
function toUserTokenResponse(user, token, refreshToken) {
    return new UserTokenVm(user.oid, user.email, token, refreshToken, user.isActive, user.createdAt, user.updatedAt);
}
function toUserResponses(users) {
    return users.map(toUserResponse);
}
//# sourceMappingURL=user.vm.js.map