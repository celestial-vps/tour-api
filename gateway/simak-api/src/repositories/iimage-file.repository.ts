import { ImageFileDomain } from '../domain/image-file.domain';
import { ImageFile } from '../models/image-file';

export interface IImageFileRepository {
    save(imageFile: ImageFile): Promise<{ result: ImageFileDomain | null; err: any }>
    update(oid: string, imageFile: ImageFileDomain): Promise<{ result: ImageFileDomain | null; err: any }>;
    deleted(imageFile: ImageFileDomain, oid: string): Promise<{ result: ImageFileDomain | null; err: any }>;
    findAll(): Promise<{ result: ImageFileDomain[] | null; err: any }>;
    findById(oid: string): Promise<{ result: ImageFileDomain | null; err: any }>;
    advanceFlter(condition: any): Promise<{ result: ImageFileDomain[] | null; err: any }>;
    findCountByCriteria(condition: any): Promise<{ result: number | 0; err: any }>;
    findByCriteriaPage(condition: any, page: number, pageSize: number): Promise<{ result: ImageFileDomain[] | null; err: any }>;
}
