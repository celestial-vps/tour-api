import { QueryRunner, Repository } from 'typeorm';
import { Bank } from '../models/bank.entity';
import { FilterBankDto } from '../dtos/payload-bank-dto';
export declare class BankRepository {
    private readonly repo;
    constructor(repo: Repository<Bank>);
    save(bank: Bank, queryRunner: QueryRunner): Promise<Bank>;
    update(oid: string, bank: Partial<Bank>, queryRunner: QueryRunner): Promise<Bank>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<Bank[]>;
    findById(oid: string): Promise<Bank>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterBankDto): Promise<{
        banks: Bank[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterBankDto): Promise<number>;
    advanceFilter(condition: FilterBankDto): Promise<Bank[]>;
    private buildFilter;
}
