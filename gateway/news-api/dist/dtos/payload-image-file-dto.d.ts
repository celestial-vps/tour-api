import { ImageOwnerTypeEnum } from '../enums/image-owner-type.enum';
export declare class FilterImageFileDto {
    fileName?: string;
    fileUrl?: string;
}
export declare class CreateImageFileDto {
    file: any;
}
export declare class UpdateImageFileDto {
    oid: string;
    fileName?: string;
    fileUrl?: string;
    filePath?: string;
    fileMime?: string;
    ownerType: ImageOwnerTypeEnum;
    lastUserId?: string;
}
