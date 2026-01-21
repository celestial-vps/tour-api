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
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const news_repository_1 = require("../repositories/news.repository");
const news_entity_1 = require("../models/news.entity");
const typeorm_1 = require("typeorm");
const news_vm_1 = require("../mappings/news-vm");
const news_category_repository_1 = require("../repositories/news-category.repository");
const image_file_repository_1 = require("../repositories/image-file.repository");
let NewsService = class NewsService {
    newsRepository;
    newsCategoryRepository;
    imageFileRepository;
    newsMapping;
    dataSource;
    constructor(newsRepository, newsCategoryRepository, imageFileRepository, newsMapping, dataSource) {
        this.newsRepository = newsRepository;
        this.newsCategoryRepository = newsCategoryRepository;
        this.imageFileRepository = imageFileRepository;
        this.newsMapping = newsMapping;
        this.dataSource = dataSource;
    }
    async create(newsdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const news = new news_entity_1.News();
            news.category = await this.newsCategoryRepository.findById(newsdto.categoryOid);
            if (newsdto.imageOid) {
                news.image = await this.imageFileRepository.findById(newsdto.imageOid);
            }
            news.title = newsdto.title;
            news.content = newsdto.content;
            news.author = newsdto.author;
            news.status = newsdto.status;
            news.tags = newsdto.tags?.toString();
            news.language = newsdto.language;
            news.createdBy = userOid;
            news.createdAt = new Date();
            const savedNews = await this.newsRepository.save(news, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedNews.oid, name: savedNews.title ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving news: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(oid, newsdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const news = await this.newsRepository.findById(oid);
            if (!news)
                throw new common_1.NotFoundException('News data not found');
            news.title = newsdto.title;
            news.content = newsdto.content;
            news.lastModifiedBy = userOid;
            news.updatedAt = new Date();
            const savedNews = await this.newsRepository.update(oid, news, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedNews.oid, name: savedNews.title ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error updating news: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const news = await this.newsRepository.findById(oid);
            if (!news)
                throw new common_1.NotFoundException('News data not found');
            await this.newsRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            return { value: news.oid, name: news.title ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error deleting news: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const newss = await this.newsRepository.findAll();
            return this.newsMapping.toNewsResponses(newss);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching newss: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { newss, count } = await this.newsRepository.findByCriteriaPage(page, pageSize, condition);
            return { newss: this.newsMapping.toNewsResponses(newss), count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching paginated newss: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const news = await this.newsRepository.findById(oid);
            if (!news)
                throw new common_1.NotFoundException('News not found');
            return this.newsMapping.toNewsResponse(news);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching news: ' + error.message);
        }
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [news_repository_1.NewsRepository,
        news_category_repository_1.NewsCategoryRepository,
        image_file_repository_1.ImageFileRepository,
        news_vm_1.NewsMapping,
        typeorm_1.DataSource])
], NewsService);
//# sourceMappingURL=news.service.js.map