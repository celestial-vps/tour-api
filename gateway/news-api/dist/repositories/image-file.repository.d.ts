import { QueryRunner, Repository } from 'typeorm';
import { ImageFile } from '../models/image-file.entity';
import { FilterImageFileDto } from '../dtos/payload-image-file-dto';
export declare class ImageFileRepository {
    private readonly imageFileRepository;
    constructor(imageFileRepository: Repository<ImageFile>);
    save(imageFile: ImageFile, queryRunner: QueryRunner): Promise<ImageFile>;
    update(oid: string, imageFile: ImageFile, queryRunner: QueryRunner): Promise<ImageFile>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<ImageFile[]>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterImageFileDto): Promise<{
        imageFiles: ImageFile[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterImageFileDto): Promise<number>;
    advanceFilter(condition: FilterImageFileDto): Promise<ImageFile[]>;
    findById(oid: string): Promise<ImageFile>;
}
