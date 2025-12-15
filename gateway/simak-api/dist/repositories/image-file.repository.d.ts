import { Model } from 'mongoose';
import { ImageFile, ImageFileDocument } from '../models/image-file';
import { IImageFileRepository } from '../repositories/iimage-file.repository';
import { FilterImageFileDto } from '../dtos/payload-image-file-dto';
import { ImageFileDomain } from '../domain/image-file.domain';
export declare class ImageFileRepository implements IImageFileRepository {
    private imageFileModel;
    constructor(imageFileModel: Model<ImageFileDocument>);
    save(imageFile: ImageFile): Promise<{
        result: ImageFileDomain | null;
        err: any;
    }>;
    update(oid: string, imageFile: ImageFileDomain): Promise<{
        result: ImageFileDomain | null;
        err: any;
    }>;
    deleted(imageFile: ImageFileDomain, oid: string): Promise<{
        result: ImageFileDomain | null;
        err: any;
    }>;
    findAll(): Promise<{
        result: ImageFileDomain[] | null;
        err: any;
    }>;
    advanceFlter(condition: FilterImageFileDto): Promise<{
        result: ImageFileDomain[] | null;
        err: any;
    }>;
    findById(oid: string): Promise<{
        result: ImageFileDomain | null;
        err: any;
    }>;
    findCountByCriteria(condition: FilterImageFileDto): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: FilterImageFileDto, page: number, pageSize: number): Promise<{
        result: ImageFileDomain[] | null;
        err: any;
    }>;
}
