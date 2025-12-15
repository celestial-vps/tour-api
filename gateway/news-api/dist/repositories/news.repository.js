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
    newsRepository;
    constructor(newsRepository) {
        this.newsRepository = newsRepository;
    }
    async save(news, queryRunner) {
        try {
            const savedNews = await queryRunner.manager.save(news_entity_1.News, news);
            return savedNews;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving news: ' + error.message);
        }
    }
    async update(oid, news, queryRunner) {
        try {
            await this.newsRepository.update(oid, news);
            return news;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error update news: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            await this.newsRepository.softDelete({ oid });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving news: ' + error.message);
        }
    }
    async findAll() {
        return this.newsRepository.find();
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const queryBuilder = this.newsRepository.createQueryBuilder('news');
        if (condition.title) {
            queryBuilder.andWhere('news.title LIKE :title', {
                title: `%${condition.title}%`,
            });
        }
        if (condition.content) {
            queryBuilder.orWhere('news.content LIKE :content', {
                content: `%${condition.content}%`,
            });
        }
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);
        try {
            const [newss, count] = await queryBuilder.getManyAndCount();
            return { newss, count };
        }
        catch (error) {
            throw new common_1.NotFoundException('Error fetching newss: ' + error.message);
        }
    }
    async findCountByCriteria(condition) {
        const queryBuilder = this.newsRepository.createQueryBuilder('news');
        if (condition.title) {
            queryBuilder.andWhere('news.title LIKE :title', {
                title: `%${condition.title}%`,
            });
        }
        if (condition.content) {
            queryBuilder.orWhere('news.content LIKE :content', {
                content: `%${condition.content}%`,
            });
        }
        try {
            const count = await queryBuilder.getCount();
            return count;
        }
        catch (error) {
            throw new Error('Error fetching news count: ' + error.message);
        }
    }
    async advanceFilter(condition) {
        const queryBuilder = this.newsRepository.createQueryBuilder('news');
        if (condition.title) {
            queryBuilder.andWhere('news.title LIKE :title', {
                title: `%${condition.title}%`,
            });
        }
        if (condition.content) {
            queryBuilder.orWhere('news.content LIKE :content', {
                content: `%${condition.content}%`,
            });
        }
        try {
            const newss = await queryBuilder.getMany();
            return newss;
        }
        catch (error) {
            throw new Error('Error fetching newss: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const news = await this.newsRepository.findOne({ where: { oid } });
            if (!news) {
                throw new common_1.NotFoundException(`News with OID ${oid} not found`);
            }
            return news;
        }
        catch (error) {
            throw new Error('Error fetching news: ' + error.message);
        }
    }
};
exports.NewsRepository = NewsRepository;
exports.NewsRepository = NewsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(news_entity_1.News)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NewsRepository);
//# sourceMappingURL=news.repository.js.map