"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageFileSchema = exports.ImageFile = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const base_1 = require("./base");
let ImageFile = class ImageFile extends base_1.Base {
    fileName;
    filePath;
    fileMime;
    fileUrl;
};
exports.ImageFile = ImageFile;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ImageFile.prototype, "fileName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ImageFile.prototype, "filePath", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ImageFile.prototype, "fileMime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ImageFile.prototype, "fileUrl", void 0);
exports.ImageFile = ImageFile = __decorate([
    (0, mongoose_1.Schema)()
], ImageFile);
exports.ImageFileSchema = mongoose_1.SchemaFactory.createForClass(ImageFile);
//# sourceMappingURL=image-file.js.map