import { ArticleService } from '../services/article.service';
import { CreateArticleDto, FilterArticleDto, UpdateArticleDto } from '../dtos/payload-article-dto';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
export declare class ArticleController {
    private readonly articleService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(articleService: ArticleService, responseService: ResponseService, auditTrailService: AuditTrailService);
    private handleRequest;
    create(createArticleDto: CreateArticleDto, req: any): Promise<any>;
    update(oid: string, updateArticleDto: UpdateArticleDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterArticleDto: FilterArticleDto, req: any): Promise<any>;
}
