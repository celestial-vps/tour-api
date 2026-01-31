import { BankDomain } from '../domain/bank.domain'; 

export class BankVm {
    oid: string;
    bankCode: string;
    bankName: string;
    shortName: string;
    createdAt: Date;
    updatedAt?: Date;
}

// Function to map a single Bank entity to BankDto
export function toBankResponse(bank: BankDomain): BankVm {
    return {
        oid: bank.id,
        bankCode: bank.bankCode,
        bankName: bank.bankName,
        shortName: bank.shortName,
        createdAt: bank.createdAt,
        updatedAt: bank.updatedAt,
    };
}

// Function to map an array of Bank entities to an array of BankDto
export function toBankResponses(banks: BankDomain[]): BankVm[] {
    return banks.map(toBankResponse);
}
