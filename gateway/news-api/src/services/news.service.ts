import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NewsRepository } from '../repositories/news.repository';
import { News } from '../models/news.entity';
import { CreateNewsDto, FilterNewsDto, UpdateNewsDto } from '../dtos/payload-news-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { NewsMapping, NewsVm } from '../mappings/news-vm';

@Injectable()
export class NewsService {
  constructor(private readonly newsRepository: NewsRepository, private readonly newsMapping: NewsMapping,
    private readonly dataSource: DataSource,
  ) { }

  async create(newsdto: CreateNewsDto, userOid: string): Promise<MessageVm> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const news = new News();
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
      const messageVm = new MessageVm();
      messageVm.value = savedNews.oid;
      messageVm.name = savedNews.title ?? '';
      return messageVm;
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
      const news = await this.newsRepository.findById(oid)
      if (!news) {
        throw new NotFoundException('News data not found');
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
      const messageVm = new MessageVm();
      messageVm.value = savedNews.oid;
      messageVm.name = savedNews.title ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error update news: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string,userOid:string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const news = await this.newsRepository.findById(oid)
      if (!news) {
        throw new NotFoundException('News data not found');
      }
      this.newsRepository.delete(oid, queryRunner)
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = news.oid;
      messageVm.name = news.title ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error Delete news: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<NewsVm[]> {
    try {
      const newss = await this.newsRepository.findAll();
      return this.newsMapping.toNewsResponses(newss);
    } catch (error) {
      throw new InternalServerErrorException('Error Find news: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterNewsDto):
    Promise<{ newss: NewsVm[]; count: number }> {

    try {
      const { newss, count } = await this.newsRepository.findByCriteriaPage(page, pageSize, condition);
      const newsResponses = this.newsMapping.toNewsResponses(newss);
      return { newss: newsResponses, count };
    } catch (error) {
      throw new InternalServerErrorException('Error Find news: ' + error.message);
    }
  }

  async findById(oid: string): Promise<NewsVm> {
    try {
      const news = await this.newsRepository.findById(oid);
      return this.newsMapping.toNewsResponse(news);
    } catch (error) {
      throw new InternalServerErrorException('Error Find news: ' + error.message);
    }
  }

}
