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
exports.CommentRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("../models/comment.entity");
let CommentRepository = class CommentRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async save(comment, queryRunner) {
        try {
            return await queryRunner.manager.save(comment_entity_1.Comment, comment);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving comment: ' + error.message);
        }
    }
    async update(oid, comment, queryRunner) {
        try {
            const result = await queryRunner.manager.update(comment_entity_1.Comment, { oid }, comment);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Comment with OID ${oid} not found`);
            }
            return await queryRunner.manager.findOneOrFail(comment_entity_1.Comment, {
                where: { oid },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error updating comment: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            const result = await queryRunner.manager.softDelete(comment_entity_1.Comment, { oid });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Comment with OID ${oid} not found`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error deleting comment: ' + error.message);
        }
    }
    async findAll() {
        return this.repo.find();
    }
    async findById(oid) {
        const comment = await this.repo.findOne({
            where: { oid },
        });
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with OID ${oid} not found`);
        }
        return comment;
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const where = this.buildFilter(condition);
        const [comments, count] = await this.repo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { oid: 'ASC' },
        });
        return { comments, count };
    }
    async findCountByCriteria(condition) {
        const where = this.buildFilter(condition);
        return this.repo.count({ where });
    }
    async advanceFilter(condition) {
        const where = this.buildFilter(condition);
        return this.repo.find({
            where,
            order: { oid: 'ASC' },
        });
    }
    buildFilter(condition) {
        const where = {};
        return where;
    }
};
exports.CommentRepository = CommentRepository;
exports.CommentRepository = CommentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CommentRepository);
//# sourceMappingURL=comment.repository.js.map