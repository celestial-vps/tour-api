import { BookmarkService } from '../services/bookmark.service';
import { CreateBookmarkDto, FilterBookmarkDto, UpdateBookmarkDto } from '../dtos/payload-bookmark-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class BookmarkController {
    private readonly bookmarkService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(bookmarkService: BookmarkService, responseService: ResponseService, auditTrailService: AuditTrailService);
    private handleRequest;
    create(createBookmarkDto: CreateBookmarkDto, req: any): Promise<any>;
    update(oid: string, updateBookmarkDto: UpdateBookmarkDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterBookmarkDto: FilterBookmarkDto, req: any): Promise<any>;
}
