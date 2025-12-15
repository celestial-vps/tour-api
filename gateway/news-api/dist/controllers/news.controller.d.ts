import { NewsService } from '../services/news.service';
import { CreateNewsDto, FilterNewsDto, UpdateNewsDto } from '../dtos/payload-news-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class NewsController {
    private readonly newsService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(newsService: NewsService, responseService: ResponseService, auditTrailService: AuditTrailService);
    create(createNewsDto: CreateNewsDto, req: any): Promise<any>;
    update(oid: string, updateNewsDto: UpdateNewsDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterNewsDto: FilterNewsDto, req: any): Promise<any>;
}
