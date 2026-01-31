import { NewsService } from '../services/news.service';
import { CreateNewsDto, FilterNewsDto, UpdateNewsDto } from '../dtos/payload-news-dto';
import { RequestHandlerService } from '../services/request-handler.service';
export declare class NewsController {
    private readonly newsService;
    private readonly requestHandler;
    constructor(newsService: NewsService, requestHandler: RequestHandlerService);
    create(createNewsDto: CreateNewsDto, req: any): Promise<any>;
    update(oid: string, updateNewsDto: UpdateNewsDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterNewsDto: FilterNewsDto, req: any): Promise<any>;
}
