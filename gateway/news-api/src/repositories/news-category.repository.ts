import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm'; 
import { NewsCategory } from '../models/news-category.entity';
import { FilterNewsCategoryDto } from '../dtos/payload-news-category-dto';
 
@Injectable()
export class NewsCategoryRepository {
    constructor(
        @InjectRepository(NewsCategory)
        private readonly newsCategoryRepository: Repository<NewsCategory>,
    ) { }

    async save(newsCategory: NewsCategory, queryRunner: QueryRunner): Promise<NewsCategory> {
        try {
            const savedNewsCategory = await queryRunner.manager.save(NewsCategory, newsCategory);
            return savedNewsCategory;
        } catch (error) {
            throw new InternalServerErrorException('Error saving newsCategory: ' + error.message);
        }
    }

    async update(oid: string, newsCategory: NewsCategory, queryRunner: QueryRunner): Promise<NewsCategory> {
        try {
            await this.newsCategoryRepository.update(oid, newsCategory)
            return newsCategory;
        } catch (error) {
            throw new InternalServerErrorException('Error update newsCategory: ' + error.message);
        }
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {
            await this.newsCategoryRepository.softDelete({ oid })
        } catch (error) {
            throw new InternalServerErrorException('Error saving newsCategory: ' + error.message);
        }
    }

    async findAll(): Promise<NewsCategory[]> {
        return this.newsCategoryRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterNewsCategoryDto,
    ): Promise<{ newsCategories: NewsCategory[]; count: number }> {
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
        } catch (error) {
            throw new NotFoundException('Error fetching newsCategories: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterNewsCategoryDto,
    ): Promise<number> {
        const queryBuilder = this.newsCategoryRepository.createQueryBuilder('newsCategory');
 
        if (condition.categoryName) {
            queryBuilder.orWhere('newsCategory.categoryName LIKE :categoryName', {
                categoryName: `%${condition.categoryName}%`,
            });
        }
        try {
            const count = await queryBuilder.getCount();
            return count;
        } catch (error) {
            throw new Error('Error fetching newsCategory count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterNewsCategoryDto,
    ): Promise<NewsCategory[]> {
        const queryBuilder = this.newsCategoryRepository.createQueryBuilder('newsCategory');

        if (condition.categoryName) {
            queryBuilder.orWhere('newsCategory.categoryName LIKE :categoryName', {
                categoryName: `%${condition.categoryName}%`,
            });
        }
        try {
            const newsCategories = await queryBuilder.getMany();
            return newsCategories;
        } catch (error) {
            throw new Error('Error fetching newsCategories: ' + error.message);
        }
    }

    async findById(oid: string): Promise<NewsCategory> {
        try {
            const newsCategory = await this.newsCategoryRepository.findOne({ where: { oid } });
            if (!newsCategory) {
                throw new NotFoundException(`NewsCategory with OID ${oid} not found`);
            }

            return newsCategory;
        } catch (error) {
            throw new Error('Error fetching newsCategory: ' + error.message);
        }
    }


}
