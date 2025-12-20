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
const user_role_repository_1 = require("../repositories/user-role.repository");
const user_role_entity_1 = require("../models/user-role.entity");
const typeorm_1 = require("typeorm");
const user_role_vm_1 = require("../mappings/user-role-vm");
let UserRoleService = class UserRoleService {
    userRoleRepository;
    userRoleMapping;
    dataSource;
    constructor(userRoleRepository, userRoleMapping, dataSource) {
        this.userRoleRepository = userRoleRepository;
        this.userRoleMapping = userRoleMapping;
        this.dataSource = dataSource;
    }
    async create(userRoledto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const userRole = new user_role_entity_1.UserRole();
            userRole.targetType = userRoledto.targetType;
            userRole.roleName = userRoledto.roleName;
            userRole.isAdministrative = userRoledto.isAdministrative;
            userRole.createdBy = userOid;
            userRole.createdAt = new Date();
            const savedUserRole = await this.userRoleRepository.save(userRole, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedUserRole.oid, name: savedUserRole.roleName ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving userRole: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(oid, userRoledto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const userRole = await this.userRoleRepository.findById(oid);
            if (!userRole)
                throw new common_1.NotFoundException('UserRole data not found');
            userRole.targetType = userRoledto.targetType;
            userRole.roleName = userRoledto.roleName;
            userRole.isAdministrative = userRoledto.isAdministrative;
            userRole.lastModifiedBy = userOid;
            userRole.updatedAt = new Date();
            const savedUserRole = await this.userRoleRepository.update(oid, userRole, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedUserRole.oid, name: savedUserRole.roleName ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error updating userRole: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const userRole = await this.userRoleRepository.findById(oid);
            if (!userRole)
                throw new common_1.NotFoundException('UserRole data not found');
            await this.userRoleRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            return { value: userRole.oid, name: userRole.roleName ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error deleting userRole: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const userRoles = await this.userRoleRepository.findAll();
            return this.userRoleMapping.toUserRoleResponses(userRoles);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching userRoles: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { userRoles, count } = await this.userRoleRepository.findByCriteriaPage(page, pageSize, condition);
            return { userRoles: this.userRoleMapping.toUserRoleResponses(userRoles), count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching paginated userRoles: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const userRole = await this.userRoleRepository.findById(oid);
            if (!userRole)
                throw new common_1.NotFoundException('UserRole not found');
            return this.userRoleMapping.toUserRoleResponse(userRole);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching userRole: ' + error.message);
        }
    }
};
exports.UserRoleService = UserRoleService;
exports.UserRoleService = UserRoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_role_repository_1.UserRoleRepository,
        user_role_vm_1.UserRoleMapping,
        typeorm_1.DataSource])
], UserRoleService);
//# sourceMappingURL=user-role.service.js.map