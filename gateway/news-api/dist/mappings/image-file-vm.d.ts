import { ImageFile } from '../models/image-file.entity';
export declare class ImageFileVm {
    oid: string;
    fileUrl: string;
    fileName: string;
    filePath: string;
    fileMime: string;
}
export declare class ImageFileMapping {
    toImageFileResponse(imageFile: ImageFile): ImageFileVm;
    toImageFileResponses(imageFiles: ImageFile[]): ImageFileVm[];
}
