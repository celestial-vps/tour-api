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
exports.LikeService = void 0;
const common_1 = require("@nestjs/common");
const like_repository_1 = require("../repositories/like.repository");
const like_entity_1 = require("../models/like.entity");
const typeorm_1 = require("typeorm");
const like_vm_1 = require("../mappings/like-vm");
let LikeService = class LikeService {
    likeRepository;
    likeMapping;
    dataSource;
    constructor(likeRepository, likeMapping, dataSource) {
        this.likeRepository = likeRepository;
        this.likeMapping = likeMapping;
        this.dataSource = dataSource;
    }
    async create(likedto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const like = new like_entity_1.LikeEntity();
            like.createdBy = userOid;
            like.createdAt = new Date();
            const savedLike = await this.likeRepository.save(like, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedLike.oid, name: savedLike.oid ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving like: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(oid, likedto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const like = await this.likeRepository.findById(oid);
            if (!like)
                throw new common_1.NotFoundException('Like data not found');
            like.lastModifiedBy = userOid;
            like.updatedAt = new Date();
            const savedLike = await this.likeRepository.update(oid, like, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedLike.oid, name: savedLike.oid ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error updating like: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const like = await this.likeRepository.findById(oid);
            if (!like)
                throw new common_1.NotFoundException('Like data not found');
            await this.likeRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            return { value: like.oid, name: like.oid ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error deleting like: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const likes = await this.likeRepository.findAll();
            return this.likeMapping.toLikeResponses(likes);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching likes: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { likes, count } = await this.likeRepository.findByCriteriaPage(page, pageSize, condition);
            return { likes: this.likeMapping.toLikeResponses(likes), count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching paginated likes: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const like = await this.likeRepository.findById(oid);
            if (!like)
                throw new common_1.NotFoundException('Like not found');
            return this.likeMapping.toLikeResponse(like);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching like: ' + error.message);
        }
    }
};
exports.LikeService = LikeService;
exports.LikeService = LikeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [like_repository_1.LikeRepository,
        like_vm_1.LikeMapping,
        typeorm_1.DataSource])
], LikeService);
//# sourceMappingURL=like.service.js.map