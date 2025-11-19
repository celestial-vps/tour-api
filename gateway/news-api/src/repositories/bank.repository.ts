import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm';
import { Bank } from '../models/bank.entity';
import { CreateBankDto, FilterBankDto, UpdateBankDto } from '../dtos/payload-bank-dto';

@Injectable()
export class BankRepository {
    constructor(
        @InjectRepository(Bank)
        private readonly bankRepository: Repository<Bank>,
    ) { }

    async save(bank: Bank, queryRunner: QueryRunner): Promise<Bank> {
        try {
            const savedBank = await queryRunner.manager.save(Bank, bank);
            return savedBank;
        } catch (error) {
            throw new InternalServerErrorException('Error saving bank: ' + error.message);
        }
    }

    async update(oid: string, bank: Bank, queryRunner: QueryRunner): Promise<Bank> {
        try {
            await this.bankRepository.update(oid, bank)
            return bank;
        } catch (error) {
            throw new InternalServerErrorException('Error update bank: ' + error.message);
        }
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {
            await this.bankRepository.softDelete({ oid })
        } catch (error) {
            throw new InternalServerErrorException('Error saving bank: ' + error.message);
        }
    }

    async findAll(): Promise<Bank[]> {
        return this.bankRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterBankDto,
    ): Promise<{ banks: Bank[]; count: number }> {
        // Initialize the query builder
        const queryBuilder = this.bankRepository.createQueryBuilder('bank');

        // Apply filters based on the condition
        if (condition.bankCode) {
            queryBuilder.andWhere('bank.bankCode LIKE :bankCode', {
                bankCode: `%${condition.bankCode}%`,
            });
        }
        if (condition.bankName) {
            queryBuilder.orWhere('bank.bankName LIKE :bankName', {
                bankName: `%${condition.bankName}%`,
            });
        }

        // Apply pagination
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);

        // Execute the query and return results
        try {
            const [banks, count] = await queryBuilder.getManyAndCount();
            return { banks, count };
        } catch (error) {
            throw new NotFoundException('Error fetching banks: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterBankDto,
    ): Promise<number> {
        // Initialize the query builder
        const queryBuilder = this.bankRepository.createQueryBuilder('bank');

        // Apply filters based on the condition
        if (condition.bankCode) {
            queryBuilder.andWhere('bank.bankCode LIKE :bankCode', {
                bankCode: `%${condition.bankCode}%`,
            });
        }
        if (condition.bankName) {
            queryBuilder.orWhere('bank.bankName LIKE :bankName', {
                bankName: `%${condition.bankName}%`,
            });
        }

        // Count total records matching the condition
        try {
            const count = await queryBuilder.getCount();
            return count;
        } catch (error) {
            throw new Error('Error fetching bank count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterBankDto,
    ): Promise<Bank[]> {
        // Initialize the query builder
        const queryBuilder = this.bankRepository.createQueryBuilder('bank');

        // Apply filters based on the condition
        if (condition.bankCode) {
            queryBuilder.andWhere('bank.bankCode LIKE :bankCode', {
                bankCode: `%${condition.bankCode}%`,
            });
        }
        if (condition.bankName) {
            queryBuilder.orWhere('bank.bankName LIKE :bankName', {
                bankName: `%${condition.bankName}%`,
            });
        }

        // Execute the query to retrieve the matching records
        try {
            const banks = await queryBuilder.getMany();
            return banks;
        } catch (error) {
            throw new Error('Error fetching banks: ' + error.message);
        }
    }

    async findById(oid: string): Promise<Bank> {
        try {
            // Try to find the bank by the given OID
            const bank = await this.bankRepository.findOne({ where: { oid } });

            // If no bank is found, throw a NotFoundException
            if (!bank) {
                throw new NotFoundException(`Bank with OID ${oid} not found`);
            }

            return bank;
        } catch (error) {
            // You can throw any custom error here or handle the error differently
            throw new Error('Error fetching bank: ' + error.message);
        }
    }


}
