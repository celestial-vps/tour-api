import { CreateBankDto, FilterBankDto, UpdateBankDto } from "../dtos/payload-bank-dto";
import { BankVm } from "../mappings/bank.vm";
import { MessageVm } from "../mappings/message.vm";

export interface IBankService {
  create(createBankDto: CreateBankDto, userOid: string): Promise<{ bank: MessageVm | null, err: any }>;
  update(oid: string,updateBankDto: UpdateBankDto,  userOid: string): Promise<{ bank: BankVm | null; err: any }>;
  deleted(oid: string, userOid: string): Promise<{ bank: BankVm | null; err: any }>;
  findAll(): Promise<{ banks: BankVm[] | null; err: any }>;
  findById(oid: string): Promise<{ bank: BankVm | null; err: any }>;
  findPage( page: number, pageSize: number,condition: FilterBankDto): Promise<{ banks: BankVm[], total: number, err: any  }>;  
}
