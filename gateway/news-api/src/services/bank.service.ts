import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BankRepository } from '../repositories/bank.repository';
import { Bank } from '../models/bank.entity';
import { CreateBankDto, FilterBankDto, UpdateBankDto } from '../dtos/payload-bank-dto';
import { DataSource, getConnection } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { BankMapping, BankVm } from '../mappings/bank-vm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BankService {
  constructor(private readonly bankRepository: BankRepository, private readonly bankMapping: BankMapping,
    // private configService: ConfigService,
    private readonly dataSource: DataSource,
  ) { }


  // getEnvVariable() {
  //   try {
  //     return this.configService.get<number>('port')

  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

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
      const messageVm = new MessageVm();
      messageVm.value = savedBank.oid;
      messageVm.name = savedBank.bankName ?? '';
      return messageVm;
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
      const bank = await this.bankRepository.findById(oid)
      if (!bank) {
        throw new NotFoundException('Bank data not found');
      }

      bank.bankCode = bankdto.bankCode;
      bank.bankName = bankdto.bankName;
      bank.shortName = bankdto.shortName;
      const savedBank = await this.bankRepository.update(oid, bank, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedBank.oid;
      messageVm.name = savedBank.bankName ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error update bank: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const bank = await this.bankRepository.findById(oid)
      if (!bank) {
        throw new NotFoundException('Bank data not found');
      }
      this.bankRepository.delete(oid, queryRunner)
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = bank.oid;
      messageVm.name = bank.bankName ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error Delete bank: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }


  async findAll(): Promise<BankVm[]> {
    try {
      const banks = await this.bankRepository.findAll();
      return this.bankMapping.toBankResponses(banks);
    } catch (error) {
      throw new InternalServerErrorException('Error Find bank: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterBankDto):
    Promise<{ banks: BankVm[]; count: number }> {

    try {
      // Get the banks and count from the repository
      const { banks, count } = await this.bankRepository.findByCriteriaPage(page, pageSize, condition);

      // Map the banks to BankVm
      const bankResponses = this.bankMapping.toBankResponses(banks);

      // Return the transformed data and count
      return { banks: bankResponses, count };

    } catch (error) {
      throw new InternalServerErrorException('Error Find bank: ' + error.message);
    }
  }

  async findById(oid: string): Promise<BankVm> {
    try {
      const bank = await this.bankRepository.findById(oid);
      return this.bankMapping.toBankResponse(bank);
    } catch (error) {
      throw new InternalServerErrorException('Error Find bank: ' + error.message);
    }
  }

}
