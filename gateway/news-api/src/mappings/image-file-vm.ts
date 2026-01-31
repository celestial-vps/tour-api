import { Injectable } from '@nestjs/common';
import { ImageFile } from '../models/image-file.entity';

// DTO for the image file response
export class ImageFileVm {
  oid: string;
  fileUrl: string;
  fileName: string;
  filePath: string;
  fileMime: string;
}

@Injectable()
export class ImageFileMapping {

  // Method to map a single ImageFile entity to ImageFileResponse
   toImageFileResponse(imageFile: ImageFile): ImageFileVm {
    return {
      oid: imageFile.oid,
      fileUrl: imageFile.fileUrl ?? '',
      fileName: imageFile.fileName ?? '',
      filePath: imageFile.filePath ?? '',
      fileMime: imageFile.fileMime ?? '',
    };
 
  }

  // Method to map an array of ImageFile entities to ImageFileResponse[]
   toImageFileResponses(imageFiles: ImageFile[]): ImageFileVm[] {
    return   imageFiles.map(imageFile => this.toImageFileResponse(imageFile));
  }
}
