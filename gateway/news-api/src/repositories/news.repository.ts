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
import { News } from '../models/news.entity';
import { FilterNewsDto } from '../dtos/payload-news-dto';

@Injectable()
export class NewsRepository {
  constructor(
    @InjectRepository(News)
    private readonly repo: Repository<News>,
  ) {}

  /* =======================
   * WRITE (TRANSACTIONAL)
   * ======================= */

  async save(news: News, queryRunner: QueryRunner): Promise<News> {
    try {
      return await queryRunner.manager.save(News, news);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving news: ' + error.message,
      );
    }
  }

  async update(
    oid: string,
    news: Partial<News>,
    queryRunner: QueryRunner,
  ): Promise<News> {
    try {
      const result = await queryRunner.manager.update(
        News,
        { oid },
        news,
      );

      if (result.affected === 0) {
        throw new NotFoundException(`News with OID ${oid} not found`);
      }

      return await queryRunner.manager.findOneOrFail(News, {
        where: { oid },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating news: ' + error.message,
      );
    }
  }

  async delete(oid: string, queryRunner: QueryRunner): Promise<void> {
    try {
      const result = await queryRunner.manager.softDelete(
        News,
        { oid },
      );

      if (result.affected === 0) {
        throw new NotFoundException(`News with OID ${oid} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting news: ' + error.message,
      );
    }
  }

  /* =======================
   * READ (NON TRANSACTION)
   * ======================= */

  async findAll(): Promise<News[]> {
    return this.repo.find();
  }

  async findById(oid: string): Promise<News> {
    const news = await this.repo.findOne({
      where: { oid },
      // relations: { branches: true },
    });

    if (!news) {
      throw new NotFoundException(`News with OID ${oid} not found`);
    }

    return news;
  }

  async findByCriteriaPage(
    page: number,
    pageSize: number,
    condition: FilterNewsDto,
  ): Promise<{ newss: News[]; count: number }> {
    const where = this.buildFilter(condition);

    const [newss, count] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { title: 'ASC' },
    });

    return { newss, count };
  }

  async findCountByCriteria(
    condition: FilterNewsDto,
  ): Promise<number> {
    const where = this.buildFilter(condition);
    return this.repo.count({ where });
  }

  async advanceFilter(
    condition: FilterNewsDto,
  ): Promise<News[]> {
    const where = this.buildFilter(condition);

    return this.repo.find({
      where,
      order: { title: 'ASC' },
    });
  }

  /* =======================
   * PRIVATE HELPER
   * ======================= */

  private buildFilter(
    condition: FilterNewsDto,
  ): FindOptionsWhere<News> {
    const where: FindOptionsWhere<News> = {};
 

    if (condition.title) {
      where.title = Like(`%${condition.title}%`);
    }

    return where;
  }
}
