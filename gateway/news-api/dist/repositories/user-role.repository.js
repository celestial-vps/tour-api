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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_role_entity_1 = require("../models/user-role.entity");
let UserRoleRepository = class UserRoleRepository {
    userRoleRepository;
    constructor(userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
    }
    async save(userRole, queryRunner) {
        try {
            const savedUserRole = await queryRunner.manager.save(userRole);
            return savedUserRole;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving userRole: ' + error.message);
        }
    }
    async update(oid, userRole, queryRunner) {
        try {
            await this.userRoleRepository.update(oid, userRole);
            return userRole;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error update userRole: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            await this.userRoleRepository.softDelete({ oid });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving userRole: ' + error.message);
        }
    }
    async findAll() {
        return this.userRoleRepository.find();
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const queryBuilder = this.userRoleRepository.createQueryBuilder('userRole');
        if (condition.roleName) {
            queryBuilder.andWhere('userRole.roleName LIKE :roleName', {
                roleName: `%${condition.roleName}%`,
            });
        }
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);
        try {
            const [userRoles, count] = await queryBuilder.getManyAndCount();
            return { userRoles, count };
        }
        catch (error) {
            throw new common_1.NotFoundException('Error fetching userRoles: ' + error.message);
        }
    }
    async findCountByCriteria(condition) {
        const queryBuilder = this.userRoleRepository.createQueryBuilder('userRole');
        if (condition.roleName) {
            queryBuilder.andWhere('userRole.roleName LIKE :roleName', {
                roleName: `%${condition.roleName}%`,
            });
        }
        try {
            const count = await queryBuilder.getCount();
            return count;
        }
        catch (error) {
            throw new Error('Error fetching userRole count: ' + error.message);
        }
    }
    async advanceFilter(condition) {
        const queryBuilder = this.userRoleRepository.createQueryBuilder('userRole');
        if (condition.roleName) {
            queryBuilder.andWhere('userRole.roleName LIKE :roleName', {
                roleName: `%${condition.roleName}%`,
            });
        }
        try {
            const userRoles = await queryBuilder.getMany();
            return userRoles;
        }
        catch (error) {
            throw new Error('Error fetching userRoles: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const userRole = await this.userRoleRepository.findOne({ where: { oid } });
            if (!userRole) {
                throw new common_1.NotFoundException(`UserRole with OID ${oid} not found`);
            }
            return userRole;
        }
        catch (error) {
            throw new Error('Error fetching userRole: ' + error.message);
        }
    }
};
exports.UserRoleRepository = UserRoleRepository;
exports.UserRoleRepository = UserRoleRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserRoleRepository);
//# sourceMappingURL=user-role.repository.js.map