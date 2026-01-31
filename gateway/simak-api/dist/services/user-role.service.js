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
exports.UserRoleService = void 0;
const common_1 = require("@nestjs/common");
const user_role_1 = require("../models/user-role");
const user_role_vm_1 = require("../mappings/user-role.vm");
const user_role_repository_1 = require("../repositories/user-role.repository");
let UserRoleService = class UserRoleService {
    userRoleRepository;
    constructor(userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
    }
    async create(createUserRoleDto, userOid) {
        const now = new Date();
        try {
            const userRole = new user_role_1.UserRole();
            userRole.roleName = createUserRoleDto.roleName;
            userRole.targetType = createUserRoleDto.targetType;
            userRole.isAdministrative = createUserRoleDto.isAdministrative;
            userRole.readState = createUserRoleDto.readState;
            userRole.writeState = createUserRoleDto.writeState;
            userRole.createState = createUserRoleDto.createState;
            userRole.deleteState = createUserRoleDto.deleteState;
            userRole.navigateState = createUserRoleDto.navigateState;
            const { result, err } = await this.userRoleRepository.save(userRole);
            if (err) {
                return { userRole: null, err };
            }
            const messageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.roleName : '',
            };
            return { userRole: messageVm, err: null };
        }
        catch (err) {
            return { userRole: null, err };
        }
    }
    async update(oid, updateUserRoleDto, userOid) {
        try {
            const lastModifiedBy = userOid;
            let { result: resultFind, err: errFind } = await this.userRoleRepository.findById(oid);
            if (errFind != null) {
                return {
                    userRole: null, err: errFind
                };
            }
            if (errFind != null) {
                return {
                    userRole: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const now = new Date();
            if (resultFind == null) {
                return {
                    userRole: null, err: {}
                };
            }
            resultFind.roleName = updateUserRoleDto.roleName ?? resultFind.roleName;
            resultFind.targetType = updateUserRoleDto.targetType ?? resultFind.targetType;
            resultFind.isAdministrative = updateUserRoleDto.isAdministrative ?? resultFind.isAdministrative;
            resultFind.readState = updateUserRoleDto.readState ?? resultFind.readState;
            resultFind.writeState = updateUserRoleDto.writeState ?? resultFind.writeState;
            resultFind.createState = updateUserRoleDto.createState ?? resultFind.createState;
            resultFind.deleteState = updateUserRoleDto.deleteState ?? resultFind.deleteState;
            resultFind.navigateState = updateUserRoleDto.navigateState ?? resultFind.navigateState;
            const { result, err } = await this.userRoleRepository.update(oid, resultFind);
            if (errFind != null) {
                return {
                    userRole: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const userRoleVm = await (0, user_role_vm_1.toUserRoleResponse)(result);
            return { userRole: userRoleVm, err: null };
        }
        catch (err) {
            return { userRole: null, err };
        }
    }
    async deleted(oid, userOid) {
        try {
            const { result: resultFind, err: errFind } = await this.userRoleRepository.findById(oid);
            if (errFind != null) {
                return {
                    userRole: null, err: errFind
                };
            }
            if (resultFind === null) {
                return {
                    userRole: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const { result, err } = await this.userRoleRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    userRole: null, err: err
                };
            }
            const userRoleVm = await (0, user_role_vm_1.toUserRoleResponse)(result);
            return { userRole: userRoleVm, err: null };
        }
        catch (err) {
            return { userRole: null, err };
        }
    }
    async findAll() {
        try {
            const { result, err } = await this.userRoleRepository.findAll();
            if (err != null) {
                return {
                    userRoles: null, err: err
                };
            }
            const userRoles = await (0, user_role_vm_1.toUserRoleResponses)(result ?? []);
            return { userRoles, err: null };
        }
        catch (err) {
            return { userRoles: null, err };
        }
    }
    async findById(oid) {
        try {
            const { result, err } = await this.userRoleRepository.findById(oid);
            const userRoleVm = await (0, user_role_vm_1.toUserRoleResponse)(result);
            return { userRole: userRoleVm, err: null };
        }
        catch (err) {
            return { userRole: null, err };
        }
    }
    async findPage(condition, page, pageSize) {
        try {
            const { result: resultCount, err: errCount } = await this.userRoleRepository.findCountByCriteria(condition);
            if (errCount) {
                return { userRoles: [], total: 0, err: errCount };
            }
            const { result, err } = await this.userRoleRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { userRoles: [], total: 0, err };
            }
            const userRoleVm = await (0, user_role_vm_1.toUserRoleResponses)(result ?? []);
            return { userRoles: userRoleVm, total: resultCount, err: err };
        }
        catch (err) {
            return { userRoles: [], total: 0, err };
        }
    }
};
exports.UserRoleService = UserRoleService;
exports.UserRoleService = UserRoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_role_repository_1.UserRoleRepository])
], UserRoleService);
//# sourceMappingURL=user-role.service.js.map