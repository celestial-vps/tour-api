import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ArticleRepository } from '../repositories/article.repository';
import { Article } from '../models/article.entity';
import { CreateArticleDto, FilterArticleDto, UpdateArticleDto } from '../dtos/payload-article-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { ArticleMapping, ArticleVm } from '../mappings/article-vm';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleMapping: ArticleMapping,
    private readonly dataSource: DataSource,
  ) {}

  async create(articledto: CreateArticleDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const article = new Article();
      article.content = articledto.content;
      article.title = articledto.title;
      article.slug = articledto.slug;
      article.createdBy = userOid;
      article.createdAt = new Date();

      const savedArticle = await this.articleRepository.save(article, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedArticle.oid, name: savedArticle.title ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving article: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(oid: string, articledto: UpdateArticleDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const article = await this.articleRepository.findById(oid);
      if (!article) throw new NotFoundException('Article data not found');

      article.content = articledto.content;
      article.title = articledto.title;
      article.slug = articledto.slug;
      article.lastModifiedBy = userOid;
      article.updatedAt = new Date();

      const savedArticle = await this.articleRepository.update(oid, article, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedArticle.oid, name: savedArticle.title ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error updating article: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const article = await this.articleRepository.findById(oid);
      if (!article) throw new NotFoundException('Article data not found');

      await this.articleRepository.delete(oid, queryRunner); // <--- tambahkan await
      await queryRunner.commitTransaction();

      return { value: article.oid, name: article.title ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting article: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<ArticleVm[]> {
    try {
      const articles = await this.articleRepository.findAll();
      return this.articleMapping.toArticleResponses(articles);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching articles: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterArticleDto): Promise<{ articles: ArticleVm[]; count: number }> {
    try {
      const { articles, count } = await this.articleRepository.findByCriteriaPage(page, pageSize, condition);
      return { articles: this.articleMapping.toArticleResponses(articles), count };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching paginated articles: ' + error.message);
    }
  }

  async findById(oid: string): Promise<ArticleVm> {
    try {
      const article = await this.articleRepository.findById(oid);
      if (!article) throw new NotFoundException('Article not found');
      return this.articleMapping.toArticleResponse(article);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching article: ' + error.message);
    }
  }
}
