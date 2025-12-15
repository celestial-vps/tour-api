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
exports.NewsCategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const message_vm_1 = require("../mappings/message-vm");
const news_category_entity_1 = require("../models/news-category.entity");
const news_category_repository_1 = require("../repositories/news-category.repository");
const news_category_vm_1 = require("../mappings/news-category-vm");
let NewsCategoryService = class NewsCategoryService {
    newsCategoryRepository;
    newsCategoryMapping;
    dataSource;
    constructor(newsCategoryRepository, newsCategoryMapping, dataSource) {
        this.newsCategoryRepository = newsCategoryRepository;
        this.newsCategoryMapping = newsCategoryMapping;
        this.dataSource = dataSource;
    }
    async create(newsCategorydto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newsCategory = new news_category_entity_1.NewsCategory();
            newsCategory.categoryName = newsCategorydto.categoryName;
            newsCategory.createdBy = userOid;
            newsCategory.createdAt = new Date();
            const savedNewsCategory = await this.newsCategoryRepository.save(newsCategory, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedNewsCategory.oid;
            messageVm.name = savedNewsCategory.categoryName ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving newsCategory: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(oid, newsCategorydto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newsCategory = await this.newsCategoryRepository.findById(oid);
            if (!newsCategory) {
                throw new common_1.NotFoundException('NewsCategory data not found');
            }
            newsCategory.categoryName = newsCategorydto.categoryName;
            const savedNewsCategory = await this.newsCategoryRepository.update(oid, newsCategory, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedNewsCategory.oid;
            messageVm.name = savedNewsCategory.categoryName ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error update newsCategory: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newsCategory = await this.newsCategoryRepository.findById(oid);
            if (!newsCategory) {
                throw new common_1.NotFoundException('NewsCategory data not found');
            }
            this.newsCategoryRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = newsCategory.oid;
            messageVm.name = newsCategory.categoryName ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error Delete newsCategory: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const newsCategories = await this.newsCategoryRepository.findAll();
            return this.newsCategoryMapping.toNewsCategoryResponses(newsCategories);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find newsCategory: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { newsCategories, count } = await this.newsCategoryRepository.findByCriteriaPage(page, pageSize, condition);
            const newsCategoryResponses = this.newsCategoryMapping.toNewsCategoryResponses(newsCategories);
            return { newsCategories: newsCategoryResponses, count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find newsCategory: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const newsCategory = await this.newsCategoryRepository.findById(oid);
            return this.newsCategoryMapping.toNewsCategoryResponse(newsCategory);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find newsCategory: ' + error.message);
        }
    }
};
exports.NewsCategoryService = NewsCategoryService;
exports.NewsCategoryService = NewsCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [news_category_repository_1.NewsCategoryRepository, news_category_vm_1.NewsCategoryMapping,
        typeorm_1.DataSource])
], NewsCategoryService);
//# sourceMappingURL=news-category.service.js.map