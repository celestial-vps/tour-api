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
const message_vm_1 = require("../mappings/message-vm");
const news_vm_1 = require("../mappings/news-vm");
let NewsService = class NewsService {
    newsRepository;
    newsMapping;
    dataSource;
    constructor(newsRepository, newsMapping, dataSource) {
        this.newsRepository = newsRepository;
        this.newsMapping = newsMapping;
        this.dataSource = dataSource;
    }
    async create(newsdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const news = new news_entity_1.News();
            news.title = newsdto.title;
            news.content = newsdto.content;
            news.summary = newsdto.summary;
            news.author = newsdto.author;
            news.status = newsdto.status ? newsdto.status : 'draft';
            news.publishedAt = newsdto.publishedAt;
            news.views = newsdto.views ? newsdto.views : 0;
            news.tags = newsdto.tags;
            news.language = newsdto.language;
            news.createdBy = userOid;
            news.createdAt = new Date();
            const savedNews = await this.newsRepository.save(news, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedNews.oid;
            messageVm.name = savedNews.title ?? '';
            return messageVm;
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
            if (!news) {
                throw new common_1.NotFoundException('News data not found');
            }
            news.title = newsdto.title;
            news.content = newsdto.content;
            news.summary = newsdto.summary;
            news.author = newsdto.author;
            news.status = newsdto.status ? newsdto.status : news.status;
            news.publishedAt = newsdto.publishedAt;
            news.views = newsdto.views ? newsdto.views : news.views;
            news.tags = newsdto.tags;
            news.language = newsdto.language;
            const savedNews = await this.newsRepository.update(oid, news, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedNews.oid;
            messageVm.name = savedNews.title ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error update news: ' + error.message);
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
            if (!news) {
                throw new common_1.NotFoundException('News data not found');
            }
            this.newsRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = news.oid;
            messageVm.name = news.title ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error Delete news: ' + error.message);
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
            throw new common_1.InternalServerErrorException('Error Find news: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { newss, count } = await this.newsRepository.findByCriteriaPage(page, pageSize, condition);
            const newsResponses = this.newsMapping.toNewsResponses(newss);
            return { newss: newsResponses, count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find news: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const news = await this.newsRepository.findById(oid);
            return this.newsMapping.toNewsResponse(news);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find news: ' + error.message);
        }
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [news_repository_1.NewsRepository, news_vm_1.NewsMapping,
        typeorm_1.DataSource])
], NewsService);
//# sourceMappingURL=news.service.js.map