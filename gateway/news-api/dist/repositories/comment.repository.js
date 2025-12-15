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
    commentRepository;
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async save(comment, queryRunner) {
        try {
            const savedComment = await queryRunner.manager.save(comment_entity_1.Comment, comment);
            return savedComment;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving comment: ' + error.message);
        }
    }
    async update(oid, comment, queryRunner) {
        try {
            await this.commentRepository.update(oid, comment);
            return comment;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error update comment: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            await this.commentRepository.softDelete({ oid });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving comment: ' + error.message);
        }
    }
    async findAll() {
        return this.commentRepository.find();
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const queryBuilder = this.commentRepository.createQueryBuilder('comment');
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);
        try {
            const [comments, count] = await queryBuilder.getManyAndCount();
            return { comments, count };
        }
        catch (error) {
            throw new common_1.NotFoundException('Error fetching comments: ' + error.message);
        }
    }
    async findCountByCriteria(condition) {
        const queryBuilder = this.commentRepository.createQueryBuilder('comment');
        try {
            const count = await queryBuilder.getCount();
            return count;
        }
        catch (error) {
            throw new Error('Error fetching comment count: ' + error.message);
        }
    }
    async advanceFilter(condition) {
        const queryBuilder = this.commentRepository.createQueryBuilder('comment');
        try {
            const comments = await queryBuilder.getMany();
            return comments;
        }
        catch (error) {
            throw new Error('Error fetching comments: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const comment = await this.commentRepository.findOne({ where: { oid } });
            if (!comment) {
                throw new common_1.NotFoundException(`Comment with OID ${oid} not found`);
            }
            return comment;
        }
        catch (error) {
            throw new Error('Error fetching comment: ' + error.message);
        }
    }
};
exports.CommentRepository = CommentRepository;
exports.CommentRepository = CommentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CommentRepository);
//# sourceMappingURL=comment.repository.js.map