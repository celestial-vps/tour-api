import { Model } from 'mongoose';
import { Bank, BankDocument } from '../models/bank';
import { IBankRepository } from '../repositories/ibank.repository';
import { FilterBankDto } from '../dtos/payload-bank-dto';
import { BankDomain } from '../domain/bank.domain';
export declare class BankRepository implements IBankRepository {
    private bankModel;
    constructor(bankModel: Model<BankDocument>);
    save(bank: Bank): Promise<{
        result: BankDomain | null;
        err: any;
    }>;
    update(oid: string, bank: BankDomain): Promise<{
        result: BankDomain | null;
        err: any;
    }>;
    deleted(bank: BankDomain, oid: string): Promise<{
        result: BankDomain | null;
        err: any;
    }>;
    findAll(): Promise<{
        result: BankDomain[] | null;
        err: any;
    }>;
    advanceFlter(condition: FilterBankDto): Promise<{
        result: BankDomain[] | null;
        err: any;
    }>;
    findById(oid: string): Promise<{
        result: BankDomain | null;
        err: any;
    }>;
    findCountByCriteria(condition: FilterBankDto): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: FilterBankDto, page: number, pageSize: number): Promise<{
        result: BankDomain[] | null;
        err: any;
    }>;
}
