import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NewsRepository } from '../repositories/news.repository';
import { News } from '../models/news.entity';
import { CreateNewsDto, FilterNewsDto, UpdateNewsDto } from '../dtos/payload-news-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { NewsMapping, NewsVm } from '../mappings/news-vm';
import { NewsCategoryRepository } from '../repositories/news-category.repository';

@Injectable()
export class NewsService {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly newsCategoryRepository: NewsCategoryRepository,
    private readonly newsMapping: NewsMapping,
    private readonly dataSource: DataSource,
  ) { }

  async create(newsdto: CreateNewsDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const news = new News();
      // news.newsCode = newsdto.newsCode;
      news.category = await this.newsCategoryRepository.findById(newsdto.categoryOid);
       
      news.title = newsdto.title;
      news.content = newsdto.content;
      news.createdBy = userOid;
      news.createdAt = new Date();

      const savedNews = await this.newsRepository.save(news, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedNews.oid, name: savedNews.title ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving news: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(oid: string, newsdto: UpdateNewsDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const news = await this.newsRepository.findById(oid);
      if (!news) throw new NotFoundException('News data not found');

      // news.newsCode = newsdto.newsCode;
      news.title = newsdto.title;
      news.content = newsdto.content;
      news.lastModifiedBy = userOid;
      news.updatedAt = new Date();

      const savedNews = await this.newsRepository.update(oid, news, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedNews.oid, name: savedNews.title ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error updating news: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const news = await this.newsRepository.findById(oid);
      if (!news) throw new NotFoundException('News data not found');

      await this.newsRepository.delete(oid, queryRunner); // <--- tambahkan await
      await queryRunner.commitTransaction();

      return { value: news.oid, name: news.title ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting news: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<NewsVm[]> {
    try {
      const newss = await this.newsRepository.findAll();
      return this.newsMapping.toNewsResponses(newss);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching newss: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterNewsDto): Promise<{ newss: NewsVm[]; count: number }> {
    try {
      const { newss, count } = await this.newsRepository.findByCriteriaPage(page, pageSize, condition);
      return { newss: this.newsMapping.toNewsResponses(newss), count };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching paginated newss: ' + error.message);
    }
  }

  async findById(oid: string): Promise<NewsVm> {
    try {
      const news = await this.newsRepository.findById(oid);
      if (!news) throw new NotFoundException('News not found');
      return this.newsMapping.toNewsResponse(news);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching news: ' + error.message);
    }
  }
}
