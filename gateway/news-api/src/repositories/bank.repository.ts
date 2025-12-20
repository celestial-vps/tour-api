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
import { Bank } from '../models/bank.entity';
import { FilterBankDto } from '../dtos/payload-bank-dto';

@Injectable()
export class BankRepository {
  constructor(
    @InjectRepository(Bank)
    private readonly repo: Repository<Bank>,
  ) {}

  /* =======================
   * WRITE (TRANSACTIONAL)
   * ======================= */

  async save(bank: Bank, queryRunner: QueryRunner): Promise<Bank> {
    try {
      return await queryRunner.manager.save(Bank, bank);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving bank: ' + error.message,
      );
    }
  }

  async update(
    oid: string,
    bank: Partial<Bank>,
    queryRunner: QueryRunner,
  ): Promise<Bank> {
    try {
      const result = await queryRunner.manager.update(
        Bank,
        { oid },
        bank,
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Bank with OID ${oid} not found`);
      }

      return await queryRunner.manager.findOneOrFail(Bank, {
        where: { oid },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating bank: ' + error.message,
      );
    }
  }

  async delete(oid: string, queryRunner: QueryRunner): Promise<void> {
    try {
      const result = await queryRunner.manager.softDelete(
        Bank,
        { oid },
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Bank with OID ${oid} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting bank: ' + error.message,
      );
    }
  }

  /* =======================
   * READ (NON TRANSACTION)
   * ======================= */

  async findAll(): Promise<Bank[]> {
    return this.repo.find();
  }

  async findById(oid: string): Promise<Bank> {
    const bank = await this.repo.findOne({
      where: { oid },
      // relations: { branches: true },
    });

    if (!bank) {
      throw new NotFoundException(`Bank with OID ${oid} not found`);
    }

    return bank;
  }

  async findByCriteriaPage(
    page: number,
    pageSize: number,
    condition: FilterBankDto,
  ): Promise<{ banks: Bank[]; count: number }> {
    const where = this.buildFilter(condition);

    const [banks, count] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { bankName: 'ASC' },
    });

    return { banks, count };
  }

  async findCountByCriteria(
    condition: FilterBankDto,
  ): Promise<number> {
    const where = this.buildFilter(condition);
    return this.repo.count({ where });
  }

  async advanceFilter(
    condition: FilterBankDto,
  ): Promise<Bank[]> {
    const where = this.buildFilter(condition);

    return this.repo.find({
      where,
      order: { bankName: 'ASC' },
    });
  }

  /* =======================
   * PRIVATE HELPER
   * ======================= */

  private buildFilter(
    condition: FilterBankDto,
  ): FindOptionsWhere<Bank> {
    const where: FindOptionsWhere<Bank> = {};

    if (condition.bankCode) {
      where.bankCode = Like(`%${condition.bankCode}%`);
    }

    if (condition.bankName) {
      where.bankName = Like(`%${condition.bankName}%`);
    }

    return where;
  }
}
