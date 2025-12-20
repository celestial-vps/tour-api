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
exports.LikeRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const like_entity_1 = require("../models/like.entity");
let LikeRepository = class LikeRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async save(like, queryRunner) {
        try {
            return await queryRunner.manager.save(like_entity_1.LikeEntity, like);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Error saving like: ${error.message}`);
        }
    }
    async update(oid, payload, queryRunner) {
        try {
            const result = await queryRunner.manager.update(like_entity_1.LikeEntity, { oid }, payload);
            if (!result.affected) {
                throw new common_1.NotFoundException(`Like with OID ${oid} not found`);
            }
            return await queryRunner.manager.findOneOrFail(like_entity_1.LikeEntity, {
                where: { oid },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException(`Error updating like: ${error.message}`);
        }
    }
    async delete(oid, queryRunner) {
        try {
            const result = await queryRunner.manager.softDelete(like_entity_1.LikeEntity, { oid });
            if (!result.affected) {
                throw new common_1.NotFoundException(`Like with OID ${oid} not found`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException(`Error deleting like: ${error.message}`);
        }
    }
    async findAll() {
        return this.repo.find();
    }
    async findById(oid) {
        const like = await this.repo.findOne({
            where: { oid },
        });
        if (!like) {
            throw new common_1.NotFoundException(`Like with OID ${oid} not found`);
        }
        return like;
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const where = this.buildFilter(condition);
        const [likes, count] = await this.repo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { createdAt: 'DESC' },
        });
        return { likes, count };
    }
    async findCountByCriteria(condition) {
        return this.repo.count({
            where: this.buildFilter(condition),
        });
    }
    async advanceFilter(condition) {
        return this.repo.find({
            where: this.buildFilter(condition),
            order: { createdAt: 'DESC' },
        });
    }
    buildFilter(condition) {
        const where = {};
        return where;
    }
};
exports.LikeRepository = LikeRepository;
exports.LikeRepository = LikeRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(like_entity_1.LikeEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LikeRepository);
//# sourceMappingURL=like.repository.js.map