import { ImageOwnerTypeEnum } from '../enums/image-owner-type.enum';
import { BaseEntity } from './base/base';
export declare class ImageFile extends BaseEntity {
    oid: string;
    fileName?: string;
    filePath?: string;
    fileMime?: string;
    fileUrl?: string;
    ownerType: ImageOwnerTypeEnum;
}
