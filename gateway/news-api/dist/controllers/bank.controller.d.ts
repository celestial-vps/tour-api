import { BankService } from '../services/bank.service';
import { CreateBankDto, FilterBankDto, UpdateBankDto } from '../dtos/payload-bank-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class BankController {
    private readonly bankService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(bankService: BankService, responseService: ResponseService, auditTrailService: AuditTrailService);
    create(createBankDto: CreateBankDto, req: any): Promise<any>;
    update(oid: string, updateBankDto: UpdateBankDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterBankDto: FilterBankDto, req: any): Promise<any>;
}
