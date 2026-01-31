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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_role_1 = require("../models/user-role");
const mapper_1 = require("../misc/mapper");
const user_role_domain_1 = require("../domain/user-role.domain");
let UserRoleRepository = class UserRoleRepository {
    userRoleModel;
    constructor(userRoleModel) {
        this.userRoleModel = userRoleModel;
    }
    async save(userRole) {
        try {
            const collectionUserRole = new this.userRoleModel(userRole);
            collectionUserRole.createdAt = (0, mongoose_2.now)();
            const colUserRole = await collectionUserRole.save();
            const data = mapper_1.Mapper.mapToDomain(user_role_domain_1.UserRoleDomain, colUserRole);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async update(oid, userRole) {
        try {
            const collectionUserRole = await this.userRoleModel.findByIdAndUpdate({ _id: oid }, userRole, {
                new: true,
            });
            const data = mapper_1.Mapper.mapToDomain(user_role_domain_1.UserRoleDomain, collectionUserRole);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async deleted(userRole, oid) {
        try {
            const data = await this.userRoleModel.findByIdAndDelete({ _id: oid });
            return { result: userRole, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findAll() {
        try {
            const userRoles = await this.userRoleModel.find();
            const data = mapper_1.Mapper.mapToDomain(user_role_domain_1.UserRoleDomain, userRoles);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async advanceFlter(condition) {
        try {
            const query = {};
            if (condition.roleName) {
                query.roleName = { $regex: condition.roleName, $options: 'i' };
            }
            const userRoles = await this.userRoleModel.find(query);
            const data = mapper_1.Mapper.mapToDomain(user_role_domain_1.UserRoleDomain, userRoles);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: null, err: error };
        }
    }
    async findById(oid) {
        try {
            const userRole = await this.userRoleModel.findOne({ _id: oid });
            const data = mapper_1.Mapper.mapToDomain(user_role_domain_1.UserRoleDomain, userRole);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findCountByCriteria(condition) {
        try {
            const query = {};
            if (condition.roleName) {
                query.roleName = { $regex: condition.roleName, $options: 'i' };
            }
            const count = await this.userRoleModel.countDocuments(query);
            return { result: count, err: null };
        }
        catch (err) {
            return { result: 0, err };
        }
    }
    async findByCriteriaPage(condition, page, pageSize) {
        try {
            const query = {};
            if (condition.roleName) {
                query.roleName = { $regex: condition.roleName, $options: 'i' };
            }
            const userRoles = await this.userRoleModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = mapper_1.Mapper.mapToDomain(user_role_domain_1.UserRoleDomain, userRoles);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: [], err: error };
        }
    }
};
exports.UserRoleRepository = UserRoleRepository;
exports.UserRoleRepository = UserRoleRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_role_1.UserRole.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserRoleRepository);
//# sourceMappingURL=user-role.repository.js.map