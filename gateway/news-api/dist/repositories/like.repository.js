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
    likeRepository;
    constructor(likeRepository) {
        this.likeRepository = likeRepository;
    }
    async save(like, queryRunner) {
        try {
            const savedLike = await queryRunner.manager.save(like_entity_1.Like, like);
            return savedLike;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving like: ' + error.message);
        }
    }
    async update(oid, like, queryRunner) {
        try {
            await this.likeRepository.update(oid, like);
            return like;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error update like: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            await this.likeRepository.softDelete({ oid });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving like: ' + error.message);
        }
    }
    async findAll() {
        return this.likeRepository.find();
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const queryBuilder = this.likeRepository.createQueryBuilder('like');
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);
        try {
            const [likes, count] = await queryBuilder.getManyAndCount();
            return { likes, count };
        }
        catch (error) {
            throw new common_1.NotFoundException('Error fetching likes: ' + error.message);
        }
    }
    async findCountByCriteria(condition) {
        const queryBuilder = this.likeRepository.createQueryBuilder('like');
        try {
            const count = await queryBuilder.getCount();
            return count;
        }
        catch (error) {
            throw new Error('Error fetching like count: ' + error.message);
        }
    }
    async advanceFilter(condition) {
        const queryBuilder = this.likeRepository.createQueryBuilder('like');
        try {
            const likes = await queryBuilder.getMany();
            return likes;
        }
        catch (error) {
            throw new Error('Error fetching likes: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const like = await this.likeRepository.findOne({ where: { oid } });
            if (!like) {
                throw new common_1.NotFoundException(`Like with OID ${oid} not found`);
            }
            return like;
        }
        catch (error) {
            throw new Error('Error fetching like: ' + error.message);
        }
    }
};
exports.LikeRepository = LikeRepository;
exports.LikeRepository = LikeRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LikeRepository);
//# sourceMappingURL=like.repository.js.map