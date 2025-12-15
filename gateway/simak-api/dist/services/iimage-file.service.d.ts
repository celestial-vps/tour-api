import { CreateImageFileDto, UpdateImageFileDto } from "../dtos/payload-image-file-dto";
import { ImageFileVm } from "../mappings/image-file.vm";
import { MessageVm } from "../mappings/message.vm";
export interface IImageFileService {
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
