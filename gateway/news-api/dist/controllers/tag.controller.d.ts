import { TagService } from '../services/tag.service';
import { CreateTagDto, FilterTagDto, UpdateTagDto } from '../dtos/payload-tag-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class TagController {
    private readonly tagService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(tagService: TagService, responseService: ResponseService, auditTrailService: AuditTrailService);
    create(createTagDto: CreateTagDto, req: any): Promise<any>;
    update(oid: string, updateTagDto: UpdateTagDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterTagDto: FilterTagDto, req: any): Promise<any>;
}
