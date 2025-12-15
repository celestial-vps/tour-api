import { ImageFileDomain } from '../domain/image-file.domain';
export declare class ImageFileVm {
    oid: string;
    fileName: string;
    filePath: string;
    fileMime: string;
    fileUrl: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare function toImageFileResponse(imageFile: ImageFileDomain): ImageFileVm;
export declare function toImageFileResponses(imageFiles: ImageFileDomain[]): ImageFileVm[];
