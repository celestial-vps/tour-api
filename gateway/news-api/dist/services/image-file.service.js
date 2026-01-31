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
const image_file_repository_1 = require("../repositories/image-file.repository");
const image_file_entity_1 = require("../models/image-file.entity");
const typeorm_1 = require("typeorm");
const message_vm_1 = require("../mappings/message-vm");
const image_file_vm_1 = require("../mappings/image-file-vm");
const image_owner_type_enum_1 = require("../enums/image-owner-type.enum");
let ImageFileService = class ImageFileService {
    imageFileRepository;
    imageFileMapping;
    dataSource;
    constructor(imageFileRepository, imageFileMapping, dataSource) {
        this.imageFileRepository = imageFileRepository;
        this.imageFileMapping = imageFileMapping;
        this.dataSource = dataSource;
    }
    async create(file, imageFiledto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const imageFile = new image_file_entity_1.ImageFile();
            imageFile.fileName = file.originalname;
            imageFile.fileUrl = `/publics/${file.filename}`;
            imageFile.filePath = file.path;
            imageFile.fileMime = file.mimetype;
            imageFile.ownerType = image_owner_type_enum_1.ImageOwnerTypeEnum.NEWS;
            imageFile.createdBy = userOid;
            imageFile.createdAt = new Date();
            const savedImageFile = await this.imageFileRepository.save(imageFile, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedImageFile.oid;
            messageVm.name = savedImageFile.fileUrl ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving imageFile: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(oid, imageFiledto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const imageFile = await this.imageFileRepository.findById(oid);
            if (!imageFile) {
                throw new common_1.NotFoundException('ImageFile data not found');
            }
            imageFile.fileName = imageFiledto.fileName;
            imageFile.fileUrl = imageFiledto.fileUrl;
            imageFile.filePath = imageFiledto.filePath;
            imageFile.fileMime = imageFiledto.fileMime;
            imageFile.ownerType = image_owner_type_enum_1.ImageOwnerTypeEnum.NEWS;
            const savedImageFile = await this.imageFileRepository.update(oid, imageFile, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedImageFile.oid;
            messageVm.name = savedImageFile.fileUrl ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error update imageFile: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const imageFile = await this.imageFileRepository.findById(oid);
            if (!imageFile) {
                throw new common_1.NotFoundException('ImageFile data not found');
            }
            this.imageFileRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = imageFile.oid;
            messageVm.name = imageFile.fileUrl ?? '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error Delete imageFile: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const imageFiles = await this.imageFileRepository.findAll();
            return this.imageFileMapping.toImageFileResponses(imageFiles);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find imageFile: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { imageFiles, count } = await this.imageFileRepository.findByCriteriaPage(page, pageSize, condition);
            const imageFileResponses = this.imageFileMapping.toImageFileResponses(imageFiles);
            return { imageFiles: imageFileResponses, count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find imageFile: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const imageFile = await this.imageFileRepository.findById(oid);
            return this.imageFileMapping.toImageFileResponse(imageFile);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find imageFile: ' + error.message);
        }
    }
};
exports.ImageFileService = ImageFileService;
exports.ImageFileService = ImageFileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [image_file_repository_1.ImageFileRepository, image_file_vm_1.ImageFileMapping,
        typeorm_1.DataSource])
], ImageFileService);
//# sourceMappingURL=image-file.service.js.map