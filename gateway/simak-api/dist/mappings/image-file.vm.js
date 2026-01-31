"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageFileVm = void 0;
exports.toImageFileResponse = toImageFileResponse;
exports.toImageFileResponses = toImageFileResponses;
class ImageFileVm {
    oid;
    fileName;
    filePath;
    fileMime;
    fileUrl;
    createdAt;
    updatedAt;
}
exports.ImageFileVm = ImageFileVm;
function toImageFileResponse(imageFile) {
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
function toImageFileResponses(imageFiles) {
    return imageFiles.map(toImageFileResponse);
}
//# sourceMappingURL=image-file.vm.js.map