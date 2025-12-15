import { BankRepository } from '../repositories/bank.repository';
import { CreateBankDto, FilterBankDto, UpdateBankDto } from '../dtos/payload-bank-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { BankMapping, BankVm } from '../mappings/bank-vm';
export declare class BankService {
    private readonly bankRepository;
    private readonly bankMapping;
    private readonly dataSource;
    constructor(bankRepository: BankRepository, bankMapping: BankMapping, dataSource: DataSource);
    create(bankdto: CreateBankDto, userOid: string): Promise<MessageVm>;
    update(oid: string, bankdto: UpdateBankDto, userOid: string): Promise<MessageVm>;
    deleted(oid: string, userOid: string): Promise<MessageVm>;
    findAll(): Promise<BankVm[]>;
    findPage(page: number, pageSize: number, condition: FilterBankDto): Promise<{
        banks: BankVm[];
        count: number;
    }>;
    findById(oid: string): Promise<BankVm>;
}
