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
exports.TagRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tag_entity_1 = require("../models/tag.entity");
let TagRepository = class TagRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async save(tag, queryRunner) {
        try {
            return await queryRunner.manager.save(tag_entity_1.Tag, tag);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving tag: ' + error.message);
        }
    }
    async update(oid, tag, queryRunner) {
        try {
            const result = await queryRunner.manager.update(tag_entity_1.Tag, { oid }, tag);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Tag with OID ${oid} not found`);
            }
            return await queryRunner.manager.findOneOrFail(tag_entity_1.Tag, {
                where: { oid },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error updating tag: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            const result = await queryRunner.manager.softDelete(tag_entity_1.Tag, { oid });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Tag with OID ${oid} not found`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error deleting tag: ' + error.message);
        }
    }
    async findAll() {
        return this.repo.find();
    }
    async findById(oid) {
        const tag = await this.repo.findOne({
            where: { oid },
        });
        if (!tag) {
            throw new common_1.NotFoundException(`Tag with OID ${oid} not found`);
        }
        return tag;
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const where = this.buildFilter(condition);
        const [tags, count] = await this.repo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { name: 'ASC' },
        });
        return { tags, count };
    }
    async findCountByCriteria(condition) {
        const where = this.buildFilter(condition);
        return this.repo.count({ where });
    }
    async advanceFilter(condition) {
        const where = this.buildFilter(condition);
        return this.repo.find({
            where,
            order: { name: 'ASC' },
        });
    }
    buildFilter(condition) {
        const where = {};
        if (condition.name) {
            where.name = (0, typeorm_2.Like)(`%${condition.name}%`);
        }
        return where;
    }
};
exports.TagRepository = TagRepository;
exports.TagRepository = TagRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TagRepository);
//# sourceMappingURL=tag.repository.js.map