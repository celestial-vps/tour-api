import { ImageFileService } from '../services/image-file.service';
import { ResponseService } from '../common/build.response';
import { AuditTrailService } from '../middleware/audit-trail/audit-trail-midleware-service';
import { CreateImageFileDto, FilterImageFileDto, UpdateImageFileDto } from '../dtos/payload-image-file-dto';
export declare class ImageFileController {
    private readonly imageFileService;
    private readonly responseService;
    private readonly auditTrailService;
    constructor(imageFileService: ImageFileService, responseService: ResponseService, auditTrailService: AuditTrailService);
    create(file: Express.Multer.File, createImageFileDto: CreateImageFileDto, req: any): Promise<any>;
    update(oid: string, updateImageFileDto: UpdateImageFileDto, req: any): Promise<any>;
    deleted(oid: string, req: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(oid: string, req: any): Promise<any>;
    find(pageIndex: number | undefined, pageSize: number | undefined, filterImageFileDto: FilterImageFileDto, req: any): Promise<any>;
}
