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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../models/user.entity");
let UserRepository = class UserRepository {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async save(user, queryRunner) {
        try {
            const savedUser = await queryRunner.manager.save(user);
            return savedUser;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving user: ' + error.message);
        }
    }
    async update(oid, user, queryRunner) {
        try {
            await this.userRepository.update(oid, user);
            return user;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error update user: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            await this.userRepository.softDelete({ oid });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving user: ' + error.message);
        }
    }
    async findAll() {
        return this.userRepository.find();
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        if (condition.email) {
            queryBuilder.andWhere('user.email LIKE :email', {
                email: `%${condition.email}%`,
            });
        }
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);
        try {
            const users = await queryBuilder.getMany();
            return users;
        }
        catch (error) {
            throw new common_1.NotFoundException('Error fetching users: ' + error.message);
        }
    }
    async findCountByCriteria(condition) {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        if (condition.email) {
            queryBuilder.andWhere('user.email LIKE :email', {
                email: `%${condition.email}%`,
            });
        }
        try {
            const count = await queryBuilder.getCount();
            return count;
        }
        catch (error) {
            throw new Error('Error fetching user count: ' + error.message);
        }
    }
    async advanceFilter(condition) {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        if (condition.email) {
            queryBuilder.andWhere('user.email LIKE :email', {
                email: `%${condition.email}%`,
            });
        }
        try {
            const users = await queryBuilder.getMany();
            return users;
        }
        catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const user = await this.userRepository.findOne({ where: { oid },
                relations: ['role'], });
            if (!user) {
                throw new common_1.NotFoundException(`User with OID ${oid} not found`);
            }
            return user;
        }
        catch (error) {
            throw new Error('Error fetching user: ' + error.message);
        }
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserRepository);
//# sourceMappingURL=user.repository.js.map