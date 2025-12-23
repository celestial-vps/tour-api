import { KrsService } from '../services/krs.service';
import { CreateKrsDto, FilterKrsDto, UpdateKrsDto } from '../dtos/payload-krs-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class KrsController {
    private readonly krsService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(krsService: KrsService, responseService: ResponseService, auditTrailService: AuditTrailService);
    create(createKrsDto: CreateKrsDto, req: any): Promise<any>;
    update(oid: string, updateKrsDto: UpdateKrsDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterKrsDto: FilterKrsDto, req: any): Promise<any>;
}
