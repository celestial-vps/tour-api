import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BankRepository } from '../repositories/bank.repository';
import { Bank } from '../models/bank.entity';
import { CreateBankDto, FilterBankDto, UpdateBankDto } from '../dtos/payload-bank-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { BankMapping, BankVm } from '../mappings/bank-vm';

@Injectable()
export class BankService {
  constructor(
    private readonly bankRepository: BankRepository,
    private readonly bankMapping: BankMapping,
    private readonly dataSource: DataSource,
  ) {}

  async create(bankdto: CreateBankDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const bank = new Bank();
      bank.bankCode = bankdto.bankCode;
      bank.bankName = bankdto.bankName;
      bank.shortName = bankdto.shortName;
      bank.createdBy = userOid;
      bank.createdAt = new Date();

      const savedBank = await this.bankRepository.save(bank, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedBank.oid, name: savedBank.bankName ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving bank: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(oid: string, bankdto: UpdateBankDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const bank = await this.bankRepository.findById(oid);
      if (!bank) throw new NotFoundException('Bank data not found');

      bank.bankCode = bankdto.bankCode;
      bank.bankName = bankdto.bankName;
      bank.shortName = bankdto.shortName;
      bank.lastModifiedBy = userOid;
      bank.updatedAt = new Date();

      const savedBank = await this.bankRepository.update(oid, bank, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedBank.oid, name: savedBank.bankName ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error updating bank: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const bank = await this.bankRepository.findById(oid);
      if (!bank) throw new NotFoundException('Bank data not found');

      await this.bankRepository.delete(oid, queryRunner); // <--- tambahkan await
      await queryRunner.commitTransaction();

      return { value: bank.oid, name: bank.bankName ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting bank: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<BankVm[]> {
    try {
      const banks = await this.bankRepository.findAll();
      return this.bankMapping.toBankResponses(banks);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching banks: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterBankDto): Promise<{ banks: BankVm[]; count: number }> {
    try {
      const { banks, count } = await this.bankRepository.findByCriteriaPage(page, pageSize, condition);
      return { banks: this.bankMapping.toBankResponses(banks), count };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching paginated banks: ' + error.message);
    }
  }

  async findById(oid: string): Promise<BankVm> {
    try {
      const bank = await this.bankRepository.findById(oid);
      if (!bank) throw new NotFoundException('Bank not found');
      return this.bankMapping.toBankResponse(bank);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching bank: ' + error.message);
    }
  }
}
