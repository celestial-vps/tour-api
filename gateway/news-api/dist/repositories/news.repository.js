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
exports.NewsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const news_entity_1 = require("../models/news.entity");
let NewsRepository = class NewsRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async save(news, queryRunner) {
        try {
            return await queryRunner.manager.save(news_entity_1.News, news);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving news: ' + error.message);
        }
    }
    async update(oid, news, queryRunner) {
        try {
            const result = await queryRunner.manager.update(news_entity_1.News, { oid }, news);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`News with OID ${oid} not found`);
            }
            return await queryRunner.manager.findOneOrFail(news_entity_1.News, {
                where: { oid },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error updating news: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            const result = await queryRunner.manager.softDelete(news_entity_1.News, { oid });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`News with OID ${oid} not found`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error deleting news: ' + error.message);
        }
    }
    async findAll() {
        return this.repo.find();
    }
    async findById(oid) {
        const news = await this.repo.findOne({
            where: { oid },
        });
        if (!news) {
            throw new common_1.NotFoundException(`News with OID ${oid} not found`);
        }
        return news;
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const where = this.buildFilter(condition);
        const [newss, count] = await this.repo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { title: 'ASC' },
        });
        return { newss, count };
    }
    async findCountByCriteria(condition) {
        const where = this.buildFilter(condition);
        return this.repo.count({ where });
    }
    async advanceFilter(condition) {
        const where = this.buildFilter(condition);
        return this.repo.find({
            where,
            order: { title: 'ASC' },
        });
    }
    buildFilter(condition) {
        const where = {};
        if (condition.title) {
            where.title = (0, typeorm_2.Like)(`%${condition.title}%`);
        }
        return where;
    }
};
exports.NewsRepository = NewsRepository;
exports.NewsRepository = NewsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(news_entity_1.News)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NewsRepository);
//# sourceMappingURL=news.repository.js.map