import { QueryRunner } from 'typeorm'; 
import { FilterBankDto } from '../dtos/payload-bank-dto';
import { Bank } from '../models/bank.entity';

export interface IBankRepository {
    save(bank: Bank, queryRunner: QueryRunner): Promise<Bank>;
    update(oid: string, bank: Bank, queryRunner: QueryRunner): Promise<Bank>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<Bank[]>;
    findById(oid: string): Promise<Bank>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterBankDto): Promise<{ banks: Bank[]; count: number }>;
    findCountByCriteria(condition: FilterBankDto): Promise<number>;
    advanceFilter(condition: FilterBankDto): Promise<Bank[]>;
}
