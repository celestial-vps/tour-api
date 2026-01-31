import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  Like,
  QueryRunner,
  Repository,
} from 'typeorm';
import { Article } from '../models/article.entity';
import { FilterArticleDto } from '../dtos/payload-article-dto';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(Article)
    private readonly repo: Repository<Article>,
  ) {}

  /* =======================
   * WRITE (TRANSACTIONAL)
   * ======================= */

  async save(article: Article, queryRunner: QueryRunner): Promise<Article> {
    try {
      return await queryRunner.manager.save(Article, article);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving article: ' + error.message,
      );
    }
  }

  async update(
    oid: string,
    article: Partial<Article>,
    queryRunner: QueryRunner,
  ): Promise<Article> {
    try {
      const result = await queryRunner.manager.update(
        Article,
        { oid },
        article,
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Article with OID ${oid} not found`);
      }

      return await queryRunner.manager.findOneOrFail(Article, {
        where: { oid },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating article: ' + error.message,
      );
    }
  }

  async delete(oid: string, queryRunner: QueryRunner): Promise<void> {
    try {
      const result = await queryRunner.manager.softDelete(
        Article,
        { oid },
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Article with OID ${oid} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting article: ' + error.message,
      );
    }
  }

  /* =======================
   * READ (NON TRANSACTION)
   * ======================= */

  async findAll(): Promise<Article[]> {
    return this.repo.find();
  }

  async findById(oid: string): Promise<Article> {
    const article = await this.repo.findOne({
      where: { oid },
      // relations: { branches: true },
    });

    if (!article) {
      throw new NotFoundException(`Article with OID ${oid} not found`);
    }

    return article;
  }

  async findByCriteriaPage(
    page: number,
    pageSize: number,
    condition: FilterArticleDto,
  ): Promise<{ articles: Article[]; count: number }> {
    const where = this.buildFilter(condition);

    const [articles, count] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { content: 'ASC' },
    });

    return { articles, count };
  }

  async findCountByCriteria(
    condition: FilterArticleDto,
  ): Promise<number> {
    const where = this.buildFilter(condition);
    return this.repo.count({ where });
  }

  async advanceFilter(
    condition: FilterArticleDto,
  ): Promise<Article[]> {
    const where = this.buildFilter(condition);

    return this.repo.find({
      where,
      order: { content: 'ASC' },
    });
  }

  /* =======================
   * PRIVATE HELPER
   * ======================= */

  private buildFilter(
    condition: FilterArticleDto,
  ): FindOptionsWhere<Article> {
    const where: FindOptionsWhere<Article> = {};

    if (condition.title) {
      where.title = Like(`%${condition.title}%`);
    }

    if (condition.content) {
      where.content = Like(`%${condition.content}%`);
    }

    return where;
  }
}
