import { BannerService } from '../services/banner.service';
import { CreateBannerDto, FilterBannerDto, UpdateBannerDto } from '../dtos/payload-banner-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class BannerController {
    private readonly bannerService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(bannerService: BannerService, responseService: ResponseService, auditTrailService: AuditTrailService);
    private handleRequest;
    create(createBannerDto: CreateBannerDto, req: any): Promise<any>;
    update(oid: string, updateBannerDto: UpdateBannerDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterBannerDto: FilterBannerDto, req: any): Promise<any>;
}
