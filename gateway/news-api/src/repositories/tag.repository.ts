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
import { Tag } from '../models/tag.entity';
import { FilterTagDto } from '../dtos/payload-tag-dto';

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(Tag)
    private readonly repo: Repository<Tag>,
  ) {}

  /* =======================
   * WRITE (TRANSACTIONAL)
   * ======================= */

  async save(tag: Tag, queryRunner: QueryRunner): Promise<Tag> {
    try {
      return await queryRunner.manager.save(Tag, tag);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving tag: ' + error.message,
      );
    }
  }

  async update(
    oid: string,
    tag: Partial<Tag>,
    queryRunner: QueryRunner,
  ): Promise<Tag> {
    try {
      const result = await queryRunner.manager.update(
        Tag,
        { oid },
        tag,
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Tag with OID ${oid} not found`);
      }

      return await queryRunner.manager.findOneOrFail(Tag, {
        where: { oid },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating tag: ' + error.message,
      );
    }
  }

  async delete(oid: string, queryRunner: QueryRunner): Promise<void> {
    try {
      const result = await queryRunner.manager.softDelete(
        Tag,
        { oid },
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Tag with OID ${oid} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting tag: ' + error.message,
      );
    }
  }

  /* =======================
   * READ (NON TRANSACTION)
   * ======================= */

  async findAll(): Promise<Tag[]> {
    return this.repo.find();
  }

  async findById(oid: string): Promise<Tag> {
    const tag = await this.repo.findOne({
      where: { oid },
      // relations: { branches: true },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with OID ${oid} not found`);
    }

    return tag;
  }

  async findByCriteriaPage(
    page: number,
    pageSize: number,
    condition: FilterTagDto,
  ): Promise<{ tags: Tag[]; count: number }> {
    const where = this.buildFilter(condition);

    const [tags, count] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { name: 'ASC' },
    });

    return { tags, count };
  }

  async findCountByCriteria(
    condition: FilterTagDto,
  ): Promise<number> {
    const where = this.buildFilter(condition);
    return this.repo.count({ where });
  }

  async advanceFilter(
    condition: FilterTagDto,
  ): Promise<Tag[]> {
    const where = this.buildFilter(condition);

    return this.repo.find({
      where,
      order: { name: 'ASC' },
    });
  }

  /* =======================
   * PRIVATE HELPER
   * ======================= */

  private buildFilter(
    condition: FilterTagDto,
  ): FindOptionsWhere<Tag> {
    const where: FindOptionsWhere<Tag> = {};
 

    if (condition.name) {
      where.name = Like(`%${condition.name}%`);
    }

    return where;
  }
}
