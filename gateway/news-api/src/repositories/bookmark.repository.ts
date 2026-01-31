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
import { Bookmark } from '../models/bookmark.entity';
import { FilterBookmarkDto } from '../dtos/payload-bookmark-dto';

@Injectable()
export class BookmarkRepository {
  constructor(
    @InjectRepository(Bookmark)
    private readonly repo: Repository<Bookmark>,
  ) {}

  /* =======================
   * WRITE (TRANSACTIONAL)
   * ======================= */

  async save(bookmark: Bookmark, queryRunner: QueryRunner): Promise<Bookmark> {
    try {
      return await queryRunner.manager.save(Bookmark, bookmark);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving bookmark: ' + error.message,
      );
    }
  }

  async update(
    oid: string,
    bookmark: Partial<Bookmark>,
    queryRunner: QueryRunner,
  ): Promise<Bookmark> {
    try {
      const result = await queryRunner.manager.update(
        Bookmark,
        { oid },
        bookmark,
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Bookmark with OID ${oid} not found`);
      }

      return await queryRunner.manager.findOneOrFail(Bookmark, {
        where: { oid },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating bookmark: ' + error.message,
      );
    }
  }

  async delete(oid: string, queryRunner: QueryRunner): Promise<void> {
    try {
      const result = await queryRunner.manager.softDelete(
        Bookmark,
        { oid },
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Bookmark with OID ${oid} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting bookmark: ' + error.message,
      );
    }
  }

  /* =======================
   * READ (NON TRANSACTION)
   * ======================= */

  async findAll(): Promise<Bookmark[]> {
    return this.repo.find();
  }

  async findById(oid: string): Promise<Bookmark> {
    const bookmark = await this.repo.findOne({
      where: { oid },
      // relations: { branches: true },
    });

    if (!bookmark) {
      throw new NotFoundException(`Bookmark with OID ${oid} not found`);
    }

    return bookmark;
  }

  async findByCriteriaPage(
    page: number,
    pageSize: number,
    condition: FilterBookmarkDto,
  ): Promise<{ bookmarks: Bookmark[]; count: number }> {
    const where = this.buildFilter(condition);

    const [bookmarks, count] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { oid: 'ASC' },
    });

    return { bookmarks, count };
  }

  async findCountByCriteria(
    condition: FilterBookmarkDto,
  ): Promise<number> {
    const where = this.buildFilter(condition);
    return this.repo.count({ where });
  }

  async advanceFilter(
    condition: FilterBookmarkDto,
  ): Promise<Bookmark[]> {
    const where = this.buildFilter(condition);

    return this.repo.find({
      where,
      order: { oid: 'ASC' },
    });
  }

  /* =======================
   * PRIVATE HELPER
   * ======================= */

  private buildFilter(
    condition: FilterBookmarkDto,
  ): FindOptionsWhere<Bookmark> {
    const where: FindOptionsWhere<Bookmark> = {};
 

    // if (condition.title) {
    //   where.title = Like(`%${condition.title}%`);
    // }

    return where;
  }
}
