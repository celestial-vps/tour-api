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
exports.ImageFileService = void 0;
const common_1 = require("@nestjs/common");
const image_file_1 = require("../models/image-file");
const image_file_repository_1 = require("../repositories/image-file.repository");
const image_file_vm_1 = require("../mappings/image-file.vm");
let ImageFileService = class ImageFileService {
    imageFileRepository;
    constructor(imageFileRepository) {
        this.imageFileRepository = imageFileRepository;
    }
    async create(file, createImageFileDto, userOid) {
        const now = new Date();
        try {
            const imageFile = new image_file_1.ImageFile();
            imageFile.fileName = file.originalname;
            imageFile.fileUrl = `/publics/${file.filename}`;
            imageFile.filePath = file.path;
            imageFile.fileMime = file.mimetype;
            const { result, err } = await this.imageFileRepository.save(imageFile);
            if (err) {
                return { imageFile: null, err };
            }
            const messageVm = {
                value: result ? result.id.toString() : '',
                name: result ? (result.fileName ?? '') : '',
            };
            return { imageFile: messageVm, err: null };
        }
        catch (err) {
            return { imageFile: null, err };
        }
    }
    async update(oid, updateImageFileDto, userOid) {
        try {
            const lastModifiedBy = userOid;
            let { result: resultFind, err: errFind } = await this.imageFileRepository.findById(oid);
            if (errFind != null) {
                return {
                    imageFile: null, err: errFind
                };
            }
            if (errFind != null) {
                return {
                    imageFile: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const now = new Date();
            if (resultFind == null) {
                return {
                    imageFile: null, err: {}
                };
            }
            resultFind.fileName = updateImageFileDto.fileName ?? resultFind.fileName;
            resultFind.fileUrl = updateImageFileDto.fileUrl ?? resultFind.fileUrl;
            resultFind.filePath = updateImageFileDto.filePath ?? resultFind.filePath;
            resultFind.fileMime = updateImageFileDto.fileMime ?? resultFind.fileMime;
            const { result, err } = await this.imageFileRepository.update(oid, resultFind);
            if (errFind != null) {
                return {
                    imageFile: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const imageFileVm = result ? (0, image_file_vm_1.toImageFileResponse)(result) : null;
            return { imageFile: imageFileVm, err: null };
        }
        catch (err) {
            return { imageFile: null, err };
        }
    }
    async deleted(oid, userOid) {
        try {
            const { result: resultFind, err: errFind } = await this.imageFileRepository.findById(oid);
            if (errFind != null) {
                return {
                    imageFile: null, err: errFind
                };
            }
            if (resultFind === null) {
                return {
                    imageFile: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                };
            }
            const { result, err } = await this.imageFileRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    imageFile: null, err: err
                };
            }
            const imageFileVm = result ? (0, image_file_vm_1.toImageFileResponse)(result) : null;
            return { imageFile: imageFileVm, err: null };
        }
        catch (err) {
            return { imageFile: null, err };
        }
    }
    async findAll() {
        try {
            const { result, err } = await this.imageFileRepository.findAll();
            if (err != null) {
                return {
                    imageFiles: null, err: err
                };
            }
            const imageFiles = result ? (0, image_file_vm_1.toImageFileResponses)(result) : null;
            return { imageFiles, err: null };
        }
        catch (err) {
            return { imageFiles: null, err };
        }
    }
    async findById(oid) {
        try {
            const { result, err } = await this.imageFileRepository.findById(oid);
            const imageFileVm = result ? (0, image_file_vm_1.toImageFileResponse)(result) : null;
            return { imageFile: imageFileVm, err: null };
        }
        catch (err) {
            return { imageFile: null, err };
        }
    }
    async findPage(condition, page, pageSize) {
        try {
            const { result: resultCount, err: errCount } = await this.imageFileRepository.findCountByCriteria(condition);
            if (errCount) {
                return { imageFiles: [], total: 0, err: errCount };
            }
            const { result, err } = await this.imageFileRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { imageFiles: [], total: 0, err };
            }
            const imageFileVm = result ? (0, image_file_vm_1.toImageFileResponses)(result) : [];
            return { imageFiles: imageFileVm, total: resultCount, err: err };
        }
        catch (err) {
            return { imageFiles: [], total: 0, err };
        }
    }
};
exports.ImageFileService = ImageFileService;
exports.ImageFileService = ImageFileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [image_file_repository_1.ImageFileRepository])
], ImageFileService);
//# sourceMappingURL=image-file.service.js.map