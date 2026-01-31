import { BankDomain } from '../domain/bank.domain';
export declare class BankVm {
    oid: string;
    bankCode: string;
    bankName: string;
    shortName: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare function toBankResponse(bank: BankDomain): BankVm;
export declare function toBankResponses(banks: BankDomain[]): BankVm[];
