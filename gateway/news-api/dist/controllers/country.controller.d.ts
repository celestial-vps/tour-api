import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { GeoCacheCountryService } from '../services/geo-cache-country.service';
export declare class CountryController {
    private readonly geoCacheCountryService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(geoCacheCountryService: GeoCacheCountryService, responseService: ResponseService, auditTrailService: AuditTrailService);
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
}
