import { NewsCategoryService } from '../services/news-category.service';
import { CreateNewsCategoryDto, FilterNewsCategoryDto, UpdateNewsCategoryDto } from '../dtos/payload-news-category-dto';
import { RequestHandlerService } from '../services/request-handler.service';
export declare class NewsCategoryController {
    private readonly newsCategoryService;
    private readonly requestHandler;
    constructor(newsCategoryService: NewsCategoryService, requestHandler: RequestHandlerService);
    create(createNewsCategoryDto: CreateNewsCategoryDto, req: any): Promise<any>;
    update(oid: string, updateNewsCategoryDto: UpdateNewsCategoryDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterNewsCategoryDto: FilterNewsCategoryDto, req: any): Promise<any>;
}
