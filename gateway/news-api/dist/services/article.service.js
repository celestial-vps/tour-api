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
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const article_repository_1 = require("../repositories/article.repository");
const article_entity_1 = require("../models/article.entity");
const typeorm_1 = require("typeorm");
const message_vm_1 = require("../mappings/message-vm");
const article_vm_1 = require("../mappings/article-vm");
let ArticleService = class ArticleService {
    articleRepository;
    articleMapping;
    dataSource;
    constructor(articleRepository, articleMapping, dataSource) {
        this.articleRepository = articleRepository;
        this.articleMapping = articleMapping;
        this.dataSource = dataSource;
    }
    async create(articledto, slugOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const article = new article_entity_1.Article();
            article.title = articledto.title;
            article.slug = articledto.slug;
            article.createdBy = slugOid;
            article.createdAt = new Date();
            const savedArticle = await this.articleRepository.save(article, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedArticle.oid;
            messageVm.name = savedArticle.slug ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving article: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(oid, articledto, slugOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const article = await this.articleRepository.findById(oid);
            if (!article) {
                throw new common_1.NotFoundException('Article data not found');
            }
            article.title = articledto.title;
            article.slug = articledto.slug;
            const savedArticle = await this.articleRepository.update(oid, article, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedArticle.oid;
            messageVm.name = savedArticle.slug ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error update article: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, slugOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const article = await this.articleRepository.findById(oid);
            if (!article) {
                throw new common_1.NotFoundException('Article data not found');
            }
            this.articleRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = article.oid;
            messageVm.name = article.slug ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error Delete article: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const articles = await this.articleRepository.findAll();
            return this.articleMapping.toArticleResponses(articles);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find article: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { articles, count } = await this.articleRepository.findByCriteriaPage(page, pageSize, condition);
            const articleResponses = this.articleMapping.toArticleResponses(articles);
            return { articles: articleResponses, count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find article: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const article = await this.articleRepository.findById(oid);
            return this.articleMapping.toArticleResponse(article);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find article: ' + error.message);
        }
    }
};
exports.ArticleService = ArticleService;
exports.ArticleService = ArticleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [article_repository_1.ArticleRepository, article_vm_1.ArticleMapping,
        typeorm_1.DataSource])
], ArticleService);
//# sourceMappingURL=article.service.js.map