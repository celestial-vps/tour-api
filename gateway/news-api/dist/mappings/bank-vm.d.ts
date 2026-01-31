import { Bank } from '../models/bank.entity';
export declare class BankVm {
    oid: string;
    bankCode: string;
    bankName: string;
    shortName: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class BankMapping {
    toBankResponse(bank: Bank): BankVm;
    toBankResponses(banks: Bank[]): BankVm[];
}
