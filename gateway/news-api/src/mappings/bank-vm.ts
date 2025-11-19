import { Injectable } from '@nestjs/common';
import { Bank } from '../models/bank.entity';
 
export class BankVm {
  oid: string;
  bankCode: string;
  bankName: string;
  shortName: string;
  createdAt: Date;
  updatedAt?: Date;
}

@Injectable()
export class BankMapping {

  // Method to map a single Bank entity to BankVm
  toBankResponse(bank: Bank): BankVm {
    return {
      oid: bank.oid,
      bankCode: bank.bankCode,
      bankName: bank.bankName ?? '',
      shortName: bank.shortName ?? '',
      createdAt: bank.createdAt,
      updatedAt: bank.updatedAt,  // Make sure the entity has these fields, they can be nullable
    };
  }

  // Method to map an array of Bank entities to BankVm[]
  toBankResponses(banks: Bank[]): BankVm[] {
    return banks.map(bank => this.toBankResponse(bank));
  }

}
