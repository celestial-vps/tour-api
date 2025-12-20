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
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async save(userRole, queryRunner) {
        try {
            return await queryRunner.manager.save(user_role_entity_1.UserRole, userRole);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving userRole: ' + error.message);
        }
    }
    async update(oid, userRole, queryRunner) {
        try {
            const result = await queryRunner.manager.update(user_role_entity_1.UserRole, { oid }, userRole);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`UserRole with OID ${oid} not found`);
            }
            return await queryRunner.manager.findOneOrFail(user_role_entity_1.UserRole, {
                where: { oid },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error updating userRole: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            const result = await queryRunner.manager.softDelete(user_role_entity_1.UserRole, { oid });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`UserRole with OID ${oid} not found`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error deleting userRole: ' + error.message);
        }
    }
    async findAll() {
        return this.repo.find();
    }
    async findById(oid) {
        const userRole = await this.repo.findOne({
            where: { oid },
        });
        if (!userRole) {
            throw new common_1.NotFoundException(`UserRole with OID ${oid} not found`);
        }
        return userRole;
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const where = this.buildFilter(condition);
        const [userRoles, count] = await this.repo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { roleName: 'ASC' },
        });
        return { userRoles, count };
    }
    async findCountByCriteria(condition) {
        const where = this.buildFilter(condition);
        return this.repo.count({ where });
    }
    async advanceFilter(condition) {
        const where = this.buildFilter(condition);
        return this.repo.find({
            where,
            order: { roleName: 'ASC' },
        });
    }
    buildFilter(condition) {
        const where = {};
        if (condition.targetType) {
            where.targetType = (0, typeorm_2.Like)(`%${condition.targetType}%`);
        }
        if (condition.roleName) {
            where.roleName = (0, typeorm_2.Like)(`%${condition.roleName}%`);
        }
        return where;
    }
};
exports.UserRoleRepository = UserRoleRepository;
exports.UserRoleRepository = UserRoleRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserRoleRepository);
//# sourceMappingURL=user-role.repository.js.map