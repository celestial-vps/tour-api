"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_1 = require("../models/user");
const user_vm_1 = require("../mappings/user.vm");
const user_repository_1 = require("../repositories/user.repository");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto, userOid) {
        const now = new Date();
        try {
            const user = new user_1.User();
            user.name = createUserDto.name;
            user.email = createUserDto.email;
            user.password = createUserDto.password;
            user.androidToken = createUserDto.androidToken;
            user.isActive = createUserDto.isActive;
            user.roleOid = createUserDto.roleOid;
            user.activatedAt = createUserDto.activatedAt
                ? new Date(createUserDto.activatedAt)
                : undefined;
            const { result, err } = await this.userRepository.save(user);
            if (err) {
                return { user: null, err };
            }
            const messageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.email : '',
            };
            return { user: messageVm, err: null };
        }
        catch (err) {
            return { user: null, err };
        }
    }
    async update(updateUserDto, oid, userOid) {
        try {
            const lastModifiedBy = userOid;
            let { result: resultFind, err: errFind } = await this.userRepository.findById(oid);
            if (errFind != null) {
                return {
                    user: null, err: errFind
                };
            }
            if (errFind != null) {
                return {
                    user: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const now = new Date();
            if (resultFind == null) {
                return {
                    user: null, err: {}
                };
            }
            resultFind.name = updateUserDto.name ?? resultFind.name;
            resultFind.email = updateUserDto.email ?? resultFind.email;
            resultFind.password = updateUserDto.password ?? resultFind.password;
            resultFind.androidToken = updateUserDto.androidToken ?? resultFind.androidToken;
            resultFind.isActive = updateUserDto.isActive ?? resultFind.isActive;
            resultFind.roleOid = updateUserDto.roleOid ?? resultFind.roleOid;
            resultFind.activatedAt = updateUserDto.activatedAt
                ? new Date(updateUserDto.activatedAt)
                : resultFind.activatedAt;
            const { result, err } = await this.userRepository.update(oid, resultFind);
            if (errFind != null) {
                return {
                    user: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const userVm = await (0, user_vm_1.toUserResponse)(result);
            return { user: userVm, err: null };
        }
        catch (err) {
            return { user: null, err };
        }
    }
    async deleted(oid, userOid) {
        try {
            const { result: resultFind, err: errFind } = await this.userRepository.findById(oid);
            if (errFind != null) {
                return {
                    user: null, err: errFind
                };
            }
            if (resultFind === null) {
                return {
                    user: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const { result, err } = await this.userRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    user: null, err: err
                };
            }
            const userVm = await (0, user_vm_1.toUserResponse)(result);
            return { user: userVm, err: null };
        }
        catch (err) {
            return { user: null, err };
        }
    }
    async findAll() {
        try {
            const { result, err } = await this.userRepository.findAll();
            if (err != null) {
                return {
                    users: null, err: err
                };
            }
            const users = (0, user_vm_1.toUserResponses)(result ?? []);
            return { users, err: null };
        }
        catch (err) {
            return { users: null, err };
        }
    }
    async findById(oid) {
        try {
            const { result, err } = await this.userRepository.findById(oid);
            const userVm = await (0, user_vm_1.toUserResponse)(result);
            return { user: userVm, err: null };
        }
        catch (err) {
            return { user: null, err };
        }
    }
    async findPage(condition, page, pageSize) {
        try {
            const { result: resultCount, err: errCount } = await this.userRepository.findCountByCriteria(condition);
            if (errCount) {
                return { users: [], total: 0, err: errCount };
            }
            const { result, err } = await this.userRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { users: [], total: 0, err };
            }
            const userVm = (0, user_vm_1.toUserResponses)(result ?? []);
            return { users: userVm, total: resultCount, err: err };
        }
        catch (err) {
            return {
                users: [], total: 0, err
            };
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map