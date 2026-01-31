import { BankDomain } from '../domain/bank.domain';
import { Bank } from '../models/bank';
export interface IBankRepository {
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
    findById(oid: string): Promise<{
        result: BankDomain | null;
        err: any;
    }>;
    advanceFlter(condition: any): Promise<{
        result: BankDomain[] | null;
        err: any;
    }>;
    findCountByCriteria(condition: any): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: any, page: number, pageSize: number): Promise<{
        result: BankDomain[] | null;
        err: any;
    }>;
}
