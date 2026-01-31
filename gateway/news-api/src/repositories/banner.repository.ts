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
import { Banner } from '../models/banner.entity';
import { FilterBannerDto } from '../dtos/payload-banner-dto';

@Injectable()
export class BannerRepository {
  constructor(
    @InjectRepository(Banner)
    private readonly repo: Repository<Banner>,
  ) {}

  /* =======================
   * WRITE (TRANSACTIONAL)
   * ======================= */

  async save(banner: Banner, queryRunner: QueryRunner): Promise<Banner> {
    try {
      return await queryRunner.manager.save(Banner, banner);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving banner: ' + error.message,
      );
    }
  }

  async update(
    oid: string,
    banner: Partial<Banner>,
    queryRunner: QueryRunner,
  ): Promise<Banner> {
    try {
      const result = await queryRunner.manager.update(
        Banner,
        { oid },
        banner,
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Banner with OID ${oid} not found`);
      }

      return await queryRunner.manager.findOneOrFail(Banner, {
        where: { oid },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating banner: ' + error.message,
      );
    }
  }

  async delete(oid: string, queryRunner: QueryRunner): Promise<void> {
    try {
      const result = await queryRunner.manager.softDelete(
        Banner,
        { oid },
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Banner with OID ${oid} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting banner: ' + error.message,
      );
    }
  }

  /* =======================
   * READ (NON TRANSACTION)
   * ======================= */

  async findAll(): Promise<Banner[]> {
    return this.repo.find();
  }

  async findById(oid: string): Promise<Banner> {
    const banner = await this.repo.findOne({
      where: { oid },
      // relations: { branches: true },
    });

    if (!banner) {
      throw new NotFoundException(`Banner with OID ${oid} not found`);
    }

    return banner;
  }

  async findByCriteriaPage(
    page: number,
    pageSize: number,
    condition: FilterBannerDto,
  ): Promise<{ banners: Banner[]; count: number }> {
    const where = this.buildFilter(condition);

    const [banners, count] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { title: 'ASC' },
    });

    return { banners, count };
  }

  async findCountByCriteria(
    condition: FilterBannerDto,
  ): Promise<number> {
    const where = this.buildFilter(condition);
    return this.repo.count({ where });
  }

  async advanceFilter(
    condition: FilterBannerDto,
  ): Promise<Banner[]> {
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
    condition: FilterBannerDto,
  ): FindOptionsWhere<Banner> {
    const where: FindOptionsWhere<Banner> = {};
 

    if (condition.title) {
      where.title = Like(`%${condition.title}%`);
    }

    return where;
  }
}
