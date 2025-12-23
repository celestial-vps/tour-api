import { TagService } from '../services/tag.service';
import { CreateTagDto, FilterTagDto, UpdateTagDto } from '../dtos/payload-tag-dto';
import { RequestHandlerService } from '../services/request-handler.service';
export declare class TagController {
    private readonly tagService;
    private readonly requestHandler;
    constructor(tagService: TagService, requestHandler: RequestHandlerService);
    create(createTagDto: CreateTagDto, req: any): Promise<any>;
    update(oid: string, updateTagDto: UpdateTagDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterTagDto: FilterTagDto, req: any): Promise<any>;
}
