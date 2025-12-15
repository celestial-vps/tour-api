import { ImageFileRepository } from '../repositories/image-file.repository';
import { CreateImageFileDto, FilterImageFileDto, UpdateImageFileDto } from '../dtos/payload-image-file-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { ImageFileMapping, ImageFileVm } from '../mappings/image-file-vm';
export declare class ImageFileService {
    private readonly imageFileRepository;
    private readonly imageFileMapping;
    private readonly dataSource;
    constructor(imageFileRepository: ImageFileRepository, imageFileMapping: ImageFileMapping, dataSource: DataSource);
    create(file: Express.Multer.File, imageFiledto: CreateImageFileDto, userOid: string): Promise<MessageVm>;
    update(oid: string, imageFiledto: UpdateImageFileDto, userOid: string): Promise<MessageVm>;
    deleted(oid: string, userOid: string): Promise<MessageVm>;
    findAll(): Promise<ImageFileVm[]>;
    findPage(page: number, pageSize: number, condition: FilterImageFileDto): Promise<{
        imageFiles: ImageFileVm[];
        count: number;
    }>;
    findById(oid: string): Promise<ImageFileVm>;
}
