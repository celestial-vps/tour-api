import { CommentService } from '../services/comment.service';
import { CreateCommentDto, FilterCommentDto, UpdateCommentDto } from '../dtos/payload-comment-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class CommentController {
    private readonly commentService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(commentService: CommentService, responseService: ResponseService, auditTrailService: AuditTrailService);
    private handleRequest;
    create(createCommentDto: CreateCommentDto, req: any): Promise<any>;
    update(oid: string, updateCommentDto: UpdateCommentDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterCommentDto: FilterCommentDto, req: any): Promise<any>;
}
