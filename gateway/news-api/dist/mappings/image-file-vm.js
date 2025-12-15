"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageFileMapping = exports.ImageFileVm = void 0;
const common_1 = require("@nestjs/common");
class ImageFileVm {
    oid;
    fileUrl;
    fileName;
    filePath;
    fileMime;
}
exports.ImageFileVm = ImageFileVm;
let ImageFileMapping = class ImageFileMapping {
    toImageFileResponse(imageFile) {
        return {
            oid: imageFile.oid,
            fileUrl: imageFile.fileUrl ?? '',
            fileName: imageFile.fileName ?? '',
            filePath: imageFile.filePath ?? '',
            fileMime: imageFile.fileMime ?? '',
        };
    }
    toImageFileResponses(imageFiles) {
        return imageFiles.map(imageFile => this.toImageFileResponse(imageFile));
    }
};
exports.ImageFileMapping = ImageFileMapping;
exports.ImageFileMapping = ImageFileMapping = __decorate([
    (0, common_1.Injectable)()
], ImageFileMapping);
//# sourceMappingURL=image-file-vm.js.map