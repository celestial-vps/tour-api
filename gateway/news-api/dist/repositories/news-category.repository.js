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
exports.NewsCategoryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const news_category_entity_1 = require("../models/news-category.entity");
let NewsCategoryRepository = class NewsCategoryRepository {
    newsCategoryRepository;
    constructor(newsCategoryRepository) {
        this.newsCategoryRepository = newsCategoryRepository;
    }
    async save(newsCategory, queryRunner) {
        try {
            const savedNewsCategory = await queryRunner.manager.save(news_category_entity_1.NewsCategory, newsCategory);
            return savedNewsCategory;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving newsCategory: ' + error.message);
        }
    }
    async update(oid, newsCategory, queryRunner) {
        try {
            await this.newsCategoryRepository.update(oid, newsCategory);
            return newsCategory;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error update newsCategory: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            await this.newsCategoryRepository.softDelete({ oid });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving newsCategory: ' + error.message);
        }
    }
    async findAll() {
        return this.newsCategoryRepository.find();
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const queryBuilder = this.newsCategoryRepository.createQueryBuilder('newsCategory');
        if (condition.categoryName) {
            queryBuilder.orWhere('newsCategory.categoryName LIKE :categoryName', {
                categoryName: `%${condition.categoryName}%`,
            });
        }
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);
        try {
            const [newsCategories, count] = await queryBuilder.getManyAndCount();
            return { newsCategories, count };
        }
        catch (error) {
            throw new common_1.NotFoundException('Error fetching newsCategories: ' + error.message);
        }
    }
    async findCountByCriteria(condition) {
        const queryBuilder = this.newsCategoryRepository.createQueryBuilder('newsCategory');
        if (condition.categoryName) {
            queryBuilder.orWhere('newsCategory.categoryName LIKE :categoryName', {
                categoryName: `%${condition.categoryName}%`,
            });
        }
        try {
            const count = await queryBuilder.getCount();
            return count;
        }
        catch (error) {
            throw new Error('Error fetching newsCategory count: ' + error.message);
        }
    }
    async advanceFilter(condition) {
        const queryBuilder = this.newsCategoryRepository.createQueryBuilder('newsCategory');
        if (condition.categoryName) {
            queryBuilder.orWhere('newsCategory.categoryName LIKE :categoryName', {
                categoryName: `%${condition.categoryName}%`,
            });
        }
        try {
            const newsCategories = await queryBuilder.getMany();
            return newsCategories;
        }
        catch (error) {
            throw new Error('Error fetching newsCategories: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const newsCategory = await this.newsCategoryRepository.findOne({ where: { oid } });
            if (!newsCategory) {
                throw new common_1.NotFoundException(`NewsCategory with OID ${oid} not found`);
            }
            return newsCategory;
        }
        catch (error) {
            throw new Error('Error fetching newsCategory: ' + error.message);
        }
    }
};
exports.NewsCategoryRepository = NewsCategoryRepository;
exports.NewsCategoryRepository = NewsCategoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(news_category_entity_1.NewsCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NewsCategoryRepository);
//# sourceMappingURL=news-category.repository.js.map