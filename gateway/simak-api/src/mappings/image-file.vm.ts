import { ImageFileDomain } from '../domain/image-file.domain';

export class ImageFileVm {
    oid: string;
    fileName: string;
    filePath: string;
    fileMime: string;
    fileUrl: string
    createdAt: Date;
    updatedAt?: Date;
}

// Function to map a single ImageFile entity to ImageFileDto
export function toImageFileResponse(imageFile: ImageFileDomain): ImageFileVm {
    return {
        oid: imageFile.id,
        fileName: imageFile.fileName ?? '',
        filePath: imageFile.filePath ?? '',
        fileMime: imageFile.fileMime ?? '',
        fileUrl: imageFile.fileUrl ?? '',
        createdAt: imageFile.createdAt,
        updatedAt: imageFile.updatedAt,
    };
}

// Function to map an array of ImageFile entities to an array of ImageFileDto
export function toImageFileResponses(imageFiles: ImageFileDomain[]): ImageFileVm[] {
    return imageFiles.map(toImageFileResponse);
}
