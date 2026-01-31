import { BankService } from '../services/bank.service';
import { CreateBankDto, FilterBankDto, UpdateBankDto } from '../dtos/payload-bank-dto';
import { RequestHandlerService } from '../services/request-handler.service';
export declare class BankController {
    private readonly bankService;
    private readonly requestHandler;
    constructor(bankService: BankService, requestHandler: RequestHandlerService);
    create(createBankDto: CreateBankDto, req: any): Promise<any>;
    update(oid: string, updateBankDto: UpdateBankDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterBankDto: FilterBankDto, req: any): Promise<any>;
}
