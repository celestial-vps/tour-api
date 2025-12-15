import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm';
import { News } from '../models/news.entity';
import { FilterNewsDto } from '../dtos/payload-news-dto';
 
@Injectable()
export class NewsRepository {
    constructor(
        @InjectRepository(News)
        private readonly newsRepository: Repository<News>,
    ) { }

    async save(news: News, queryRunner: QueryRunner): Promise<News> {
        try {
            const savedNews = await queryRunner.manager.save(News, news);
            return savedNews;
        } catch (error) {
            throw new InternalServerErrorException('Error saving news: ' + error.message);
        }
    }

    async update(oid: string, news: News, queryRunner: QueryRunner): Promise<News> {
        try {
            await this.newsRepository.update(oid, news)
            return news;
        } catch (error) {
            throw new InternalServerErrorException('Error update news: ' + error.message);
        }
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {
            await this.newsRepository.softDelete({ oid })
        } catch (error) {
            throw new InternalServerErrorException('Error saving news: ' + error.message);
        }
    }

    async findAll(): Promise<News[]> {
        return this.newsRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterNewsDto,
    ): Promise<{ newss: News[]; count: number }> {
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
        } catch (error) {
            throw new NotFoundException('Error fetching newss: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterNewsDto,
    ): Promise<number> {
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
        } catch (error) {
            throw new Error('Error fetching news count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterNewsDto,
    ): Promise<News[]> {
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
        } catch (error) {
            throw new Error('Error fetching newss: ' + error.message);
        }
    }

    async findById(oid: string): Promise<News> {
        try {
            const news = await this.newsRepository.findOne({ where: { oid } });
            if (!news) {
                throw new NotFoundException(`News with OID ${oid} not found`);
            }

            return news;
        } catch (error) {
            throw new Error('Error fetching news: ' + error.message);
        }
    }

}
