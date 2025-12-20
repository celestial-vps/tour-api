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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const comment_repository_1 = require("../repositories/comment.repository");
const comment_entity_1 = require("../models/comment.entity");
const typeorm_1 = require("typeorm");
const comment_vm_1 = require("../mappings/comment-vm");
let CommentService = class CommentService {
    commentRepository;
    commentMapping;
    dataSource;
    constructor(commentRepository, commentMapping, dataSource) {
        this.commentRepository = commentRepository;
        this.commentMapping = commentMapping;
        this.dataSource = dataSource;
    }
    async create(commentdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const comment = new comment_entity_1.Comment();
            comment.content = commentdto.content;
            comment.createdBy = userOid;
            comment.createdAt = new Date();
            const savedComment = await this.commentRepository.save(comment, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedComment.oid, name: savedComment.content ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving comment: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(oid, commentdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const comment = await this.commentRepository.findById(oid);
            if (!comment)
                throw new common_1.NotFoundException('Comment data not found');
            comment.content = commentdto.content;
            comment.lastModifiedBy = userOid;
            comment.updatedAt = new Date();
            const savedComment = await this.commentRepository.update(oid, comment, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedComment.oid, name: savedComment.content ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error updating comment: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const comment = await this.commentRepository.findById(oid);
            if (!comment)
                throw new common_1.NotFoundException('Comment data not found');
            await this.commentRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            return { value: comment.oid, name: comment.content ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error deleting comment: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const comments = await this.commentRepository.findAll();
            return this.commentMapping.toCommentResponses(comments);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching comments: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { comments, count } = await this.commentRepository.findByCriteriaPage(page, pageSize, condition);
            return { comments: this.commentMapping.toCommentResponses(comments), count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching paginated comments: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const comment = await this.commentRepository.findById(oid);
            if (!comment)
                throw new common_1.NotFoundException('Comment not found');
            return this.commentMapping.toCommentResponse(comment);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching comment: ' + error.message);
        }
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [comment_repository_1.CommentRepository,
        comment_vm_1.CommentMapping,
        typeorm_1.DataSource])
], CommentService);
//# sourceMappingURL=comment.service.js.map