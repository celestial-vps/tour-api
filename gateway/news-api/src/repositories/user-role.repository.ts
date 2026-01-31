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
import { UserRole } from '../models/user-role.entity';
import { FilterUserRoleDto } from '../dtos/payload-user-role-dto';

@Injectable()
export class UserRoleRepository {
  constructor(
    @InjectRepository(UserRole)
    private readonly repo: Repository<UserRole>,
  ) {}

  /* =======================
   * WRITE (TRANSACTIONAL)
   * ======================= */

  async save(userRole: UserRole, queryRunner: QueryRunner): Promise<UserRole> {
    try {
      return await queryRunner.manager.save(UserRole, userRole);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving userRole: ' + error.message,
      );
    }
  }

  async update(
    oid: string,
    userRole: Partial<UserRole>,
    queryRunner: QueryRunner,
  ): Promise<UserRole> {
    try {
      const result = await queryRunner.manager.update(
        UserRole,
        { oid },
        userRole,
      );

      if (result.affected === 0) {
        throw new NotFoundException(`UserRole with OID ${oid} not found`);
      }

      return await queryRunner.manager.findOneOrFail(UserRole, {
        where: { oid },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating userRole: ' + error.message,
      );
    }
  }

  async delete(oid: string, queryRunner: QueryRunner): Promise<void> {
    try {
      const result = await queryRunner.manager.softDelete(
        UserRole,
        { oid },
      );

      if (result.affected === 0) {
        throw new NotFoundException(`UserRole with OID ${oid} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting userRole: ' + error.message,
      );
    }
  }

  /* =======================
   * READ (NON TRANSACTION)
   * ======================= */

  async findAll(): Promise<UserRole[]> {
    return this.repo.find();
  }

  async findById(oid: string): Promise<UserRole> {
    const userRole = await this.repo.findOne({
      where: { oid },
      // relations: { branches: true },
    });

    if (!userRole) {
      throw new NotFoundException(`UserRole with OID ${oid} not found`);
    }

    return userRole;
  }

  async findByCriteriaPage(
    page: number,
    pageSize: number,
    condition: FilterUserRoleDto,
  ): Promise<{ userRoles: UserRole[]; count: number }> {
    const where = this.buildFilter(condition);

    const [userRoles, count] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { roleName: 'ASC' },
    });

    return { userRoles, count };
  }

  async findCountByCriteria(
    condition: FilterUserRoleDto,
  ): Promise<number> {
    const where = this.buildFilter(condition);
    return this.repo.count({ where });
  }

  async advanceFilter(
    condition: FilterUserRoleDto,
  ): Promise<UserRole[]> {
    const where = this.buildFilter(condition);

    return this.repo.find({
      where,
      order: { roleName: 'ASC' },
    });
  }

  /* =======================
   * PRIVATE HELPER
   * ======================= */

  private buildFilter(
    condition: FilterUserRoleDto,
  ): FindOptionsWhere<UserRole> {
    const where: FindOptionsWhere<UserRole> = {};

    if (condition.targetType) {
      where.targetType = Like(`%${condition.targetType}%`);
    }

    if (condition.roleName) {
      where.roleName = Like(`%${condition.roleName}%`);
    }

    return where;
  }
}
