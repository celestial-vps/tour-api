import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ArticleRepository } from '../repositories/article.repository';
import { Article } from '../models/article.entity';
import { CreateArticleDto, FilterArticleDto, UpdateArticleDto } from '../dtos/payload-article-dto';
import { DataSource, getConnection } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { ArticleMapping, ArticleVm } from '../mappings/article-vm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository, private readonly articleMapping: ArticleMapping, 
    private readonly dataSource: DataSource,
  ) { } 

  async create(articledto: CreateArticleDto, slugOid: string): Promise<MessageVm> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const article = new Article();
      article.title = articledto.title;
      article.slug = articledto.slug;
      article.createdBy = slugOid;
      article.createdAt = new Date();
      const savedArticle = await this.articleRepository.save(article, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedArticle.oid;
      messageVm.name = savedArticle.slug ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving article: ' + error.message);
    } finally {
      await queryRunner.release();
    }

  }

  async update(oid: string, articledto: UpdateArticleDto, slugOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const article = await this.articleRepository.findById(oid)
      if (!article) {
        throw new NotFoundException('Article data not found');
      }

      article.title = articledto.title;
      article.slug = articledto.slug;
      const savedArticle = await this.articleRepository.update(oid, article, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedArticle.oid;
      messageVm.name = savedArticle.slug ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error update article: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, slugOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const article = await this.articleRepository.findById(oid)
      if (!article) {
        throw new NotFoundException('Article data not found');
      }
      this.articleRepository.delete(oid, queryRunner)
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = article.oid;
      messageVm.name = article.slug ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error Delete article: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }


  async findAll(): Promise<ArticleVm[]> {
    try {
      const articles = await this.articleRepository.findAll();
      return this.articleMapping.toArticleResponses(articles);
    } catch (error) {
      throw new InternalServerErrorException('Error Find article: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterArticleDto):
    Promise<{ articles: ArticleVm[]; count: number }> {

    try { 
      const { articles, count } = await this.articleRepository.findByCriteriaPage(page, pageSize, condition); 
      const articleResponses = this.articleMapping.toArticleResponses(articles); 
      return { articles: articleResponses, count };

    } catch (error) {
      throw new InternalServerErrorException('Error Find article: ' + error.message);
    }
  }

  async findById(oid: string): Promise<ArticleVm> {
    try {
      const article = await this.articleRepository.findById(oid);
      return this.articleMapping.toArticleResponse(article);
    } catch (error) {
      throw new InternalServerErrorException('Error Find article: ' + error.message);
    }
  }

}
