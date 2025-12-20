import { LikeService } from '../services/like.service';
import { CreateLikeDto, FilterLikeDto, UpdateLikeDto } from '../dtos/payload-like-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class LikeController {
    private readonly likeService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(likeService: LikeService, responseService: ResponseService, auditTrailService: AuditTrailService);
    private handleRequest;
    create(createLikeDto: CreateLikeDto, req: any): Promise<any>;
    update(oid: string, updateLikeDto: UpdateLikeDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterLikeDto: FilterLikeDto, req: any): Promise<any>;
}
