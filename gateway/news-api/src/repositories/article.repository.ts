import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm';
import { Article } from '../models/article.entity';
import { CreateArticleDto, FilterArticleDto, UpdateArticleDto } from '../dtos/payload-article-dto';

@Injectable()
export class ArticleRepository {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
    ) { }

    async save(article: Article, queryRunner: QueryRunner): Promise<Article> {
        try {
            const savedArticle = await queryRunner.manager.save(Article, article);
            return savedArticle;
        } catch (error) {
            throw new InternalServerErrorException('Error saving article: ' + error.message);
        }
    }

    async update(oid: string, article: Article, queryRunner: QueryRunner): Promise<Article> {
        try {
            await this.articleRepository.update(oid, article)
            return article;
        } catch (error) {
            throw new InternalServerErrorException('Error update article: ' + error.message);
        }
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {
            await this.articleRepository.softDelete({ oid })
        } catch (error) {
            throw new InternalServerErrorException('Error saving article: ' + error.message);
        }
    }

    async findAll(): Promise<Article[]> {
        return this.articleRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterArticleDto,
    ): Promise<{ articles: Article[]; count: number }> {
        // Initialize the query builder
        const queryBuilder = this.articleRepository.createQueryBuilder('article');

        // Apply filters based on the condition
        if (condition.title) {
            queryBuilder.andWhere('article.title LIKE :title', {
                title: `%${condition.title}%`,
            });
        } 
        // Apply pagination
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);

        // Execute the query and return results
        try {
            const [articles, count] = await queryBuilder.getManyAndCount();
            return { articles, count };
        } catch (error) {
            throw new NotFoundException('Error fetching articles: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterArticleDto,
    ): Promise<number> {
        // Initialize the query builder
        const queryBuilder = this.articleRepository.createQueryBuilder('article');

        // Apply filters based on the condition
        if (condition.title) {
            queryBuilder.andWhere('article.title LIKE :title', {
                title: `%${condition.title}%`,
            });
        }
     

        // Count total records matching the condition
        try {
            const count = await queryBuilder.getCount();
            return count;
        } catch (error) {
            throw new Error('Error fetching article count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterArticleDto,
    ): Promise<Article[]> {
        // Initialize the query builder
        const queryBuilder = this.articleRepository.createQueryBuilder('article');

        // Apply filters based on the condition
        if (condition.title) {
            queryBuilder.andWhere('article.title LIKE :title', {
                title: `%${condition.title}%`,
            });
        }
     

        // Execute the query to retrieve the matching records
        try {
            const articles = await queryBuilder.getMany();
            return articles;
        } catch (error) {
            throw new Error('Error fetching articles: ' + error.message);
        }
    }

    async findById(oid: string): Promise<Article> {
        try {
            // Try to find the article by the given OID
            const article = await this.articleRepository.findOne({ where: { oid } });

            // If no article is found, throw a NotFoundException
            if (!article) {
                throw new NotFoundException(`Article with OID ${oid} not found`);
            }

            return article;
        } catch (error) {
            // You can throw any custom error here or handle the error differently
            throw new Error('Error fetching article: ' + error.message);
        }
    }


}
