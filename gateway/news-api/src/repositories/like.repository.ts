import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  Like as ILike,
  QueryRunner,
  Repository,
} from 'typeorm';
import { LikeEntity } from '../models/like.entity';
import { FilterLikeDto } from '../dtos/payload-like-dto';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(LikeEntity)
    private readonly repo: Repository<LikeEntity>,
  ) {}

  /* =======================
   * WRITE (TRANSACTIONAL)
   * ======================= */

  async save(
    like: LikeEntity,
    queryRunner: QueryRunner,
  ): Promise<LikeEntity> {
    try {
      return await queryRunner.manager.save(LikeEntity, like);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error saving like: ${error.message}`,
      );
    }
  }

  async update(
    oid: string,
    payload: Partial<LikeEntity>,
    queryRunner: QueryRunner,
  ): Promise<LikeEntity> {
    try {
      const result = await queryRunner.manager.update(
        LikeEntity,
        { oid },
        payload,
      );

      if (!result.affected) {
        throw new NotFoundException(`Like with OID ${oid} not found`);
      }

      return await queryRunner.manager.findOneOrFail(LikeEntity, {
        where: { oid },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        `Error updating like: ${error.message}`,
      );
    }
  }

  async delete(
    oid: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    try {
      const result = await queryRunner.manager.softDelete(
        LikeEntity,
        { oid },
      );

      if (!result.affected) {
        throw new NotFoundException(`Like with OID ${oid} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        `Error deleting like: ${error.message}`,
      );
    }
  }

  /* =======================
   * READ (NON TRANSACTION)
   * ======================= */

  async findAll(): Promise<LikeEntity[]> {
    return this.repo.find();
  }

  async findById(oid: string): Promise<LikeEntity> {
    const like = await this.repo.findOne({
      where: { oid },
    });

    if (!like) {
      throw new NotFoundException(`Like with OID ${oid} not found`);
    }

    return like;
  }

  async findByCriteriaPage(
    page: number,
    pageSize: number,
    condition: FilterLikeDto,
  ): Promise<{ likes: LikeEntity[]; count: number }> {
    const where = this.buildFilter(condition);

    const [likes, count] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return { likes, count };
  }

  async findCountByCriteria(
    condition: FilterLikeDto,
  ): Promise<number> {
    return this.repo.count({
      where: this.buildFilter(condition),
    });
  }

  async advanceFilter(
    condition: FilterLikeDto,
  ): Promise<LikeEntity[]> {
    return this.repo.find({
      where: this.buildFilter(condition),
      order: { createdAt: 'DESC' },
    });
  }

  /* =======================
   * PRIVATE HELPER
   * ======================= */

  private buildFilter(
    condition: FilterLikeDto,
  ): FindOptionsWhere<LikeEntity> {
    const where: FindOptionsWhere<LikeEntity> = {};

    // if (condition?.title) {
    //   // NOTE: hanya berlaku kalau LikeEntity punya kolom "title"
    //   where['title'] = ILike(`%${condition.title}%`);
    // }

    return where;
  }
}
