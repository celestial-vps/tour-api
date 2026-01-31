import { CreateImageFileDto, UpdateImageFileDto } from '../dtos/payload-image-file-dto';
import { IImageFileService } from '../services/iimage-file.service';
import { MessageVm } from '../mappings/message.vm';
import { ImageFileRepository } from '../repositories/image-file.repository';
import { ImageFileVm } from '../mappings/image-file.vm';
export declare class ImageFileService implements IImageFileService {
    private readonly imageFileRepository;
    constructor(imageFileRepository: ImageFileRepository);
    create(file: Express.Multer.File, createImageFileDto: CreateImageFileDto, userOid: string): Promise<{
        imageFile: MessageVm | null;
        err: any;
    }>;
    update(oid: string, updateImageFileDto: UpdateImageFileDto, userOid: string): Promise<{
        imageFile: ImageFileVm | null;
        err: any;
    }>;
    deleted(oid: string, userOid: string): Promise<{
        imageFile: ImageFileVm | null;
        err: any;
    }>;
    findAll(): Promise<{
        imageFiles: ImageFileVm[] | null;
        err: any;
    }>;
    findById(oid: string): Promise<{
        imageFile: ImageFileVm | null;
        err: any;
    }>;
    findPage(condition: any, page: number, pageSize: number): Promise<{
        imageFiles: ImageFileVm[];
        total: number;
        err: any;
    }>;
}
