import { Injectable } from '@nestjs/common';
import { ImageFile } from '../models/image-file.entity';
 
// DTO for the image file response
export class ImageFileVm {
  oid: string;
  fileUrl: string;
  fileName: string;
}

@Injectable()
export class ImageFileMapping {

  // Method to map a single ImageFile entity to ImageFileResponse
  async toImageFileResponse(imageFile: ImageFile): Promise<ImageFileVm> {
    const response: ImageFileVm = {
      oid: imageFile.oid,
      fileUrl: imageFile.fileUrl ?? '',
      fileName: imageFile.fileName ?? '',
    };

    return response;
  }

  // Method to map an array of ImageFile entities to ImageFileResponse[]
  async toImageFileResponses(imageFiles: ImageFile[]): Promise<ImageFileVm[]> {
    return await Promise.all(imageFiles.map(imageFile => this.toImageFileResponse(imageFile)));
  }
}
