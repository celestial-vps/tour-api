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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageFileRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const image_file_entity_1 = require("../models/image-file.entity");
let ImageFileRepository = class ImageFileRepository {
    imageFileRepository;
    constructor(imageFileRepository) {
        this.imageFileRepository = imageFileRepository;
    }
    async save(imageFile, queryRunner) {
        try {
            const savedImageFile = await queryRunner.manager.save(image_file_entity_1.ImageFile, imageFile);
            return savedImageFile;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving imageFile: ' + error.message);
        }
    }
    async update(oid, imageFile, queryRunner) {
        try {
            await this.imageFileRepository.update(oid, imageFile);
            return imageFile;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error update imageFile: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            await this.imageFileRepository.softDelete({ oid });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving imageFile: ' + error.message);
        }
    }
    async findAll() {
        return this.imageFileRepository.find();
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const queryBuilder = this.imageFileRepository.createQueryBuilder('imageFile');
        if (condition.fileName) {
            queryBuilder.andWhere('imageFile.fileName LIKE :fileName', {
                fileName: `%${condition.fileName}%`,
            });
        }
        if (condition.fileUrl) {
            queryBuilder.orWhere('imageFile.fileUrl LIKE :fileUrl', {
                fileUrl: `%${condition.fileUrl}%`,
            });
        }
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);
        try {
            const [imageFiles, count] = await queryBuilder.getManyAndCount();
            return { imageFiles, count };
        }
        catch (error) {
            throw new common_1.NotFoundException('Error fetching imageFiles: ' + error.message);
        }
    }
    async findCountByCriteria(condition) {
        const queryBuilder = this.imageFileRepository.createQueryBuilder('imageFile');
        if (condition.fileName) {
            queryBuilder.andWhere('imageFile.fileName LIKE :fileName', {
                fileName: `%${condition.fileName}%`,
            });
        }
        if (condition.fileUrl) {
            queryBuilder.orWhere('imageFile.fileUrl LIKE :fileUrl', {
                fileUrl: `%${condition.fileUrl}%`,
            });
        }
        try {
            const count = await queryBuilder.getCount();
            return count;
        }
        catch (error) {
            throw new Error('Error fetching imageFile count: ' + error.message);
        }
    }
    async advanceFilter(condition) {
        const queryBuilder = this.imageFileRepository.createQueryBuilder('imageFile');
        if (condition.fileName) {
            queryBuilder.andWhere('imageFile.fileName LIKE :fileName', {
                fileName: `%${condition.fileName}%`,
            });
        }
        if (condition.fileUrl) {
            queryBuilder.orWhere('imageFile.fileUrl LIKE :fileUrl', {
                fileUrl: `%${condition.fileUrl}%`,
            });
        }
        try {
            const imageFiles = await queryBuilder.getMany();
            return imageFiles;
        }
        catch (error) {
            throw new Error('Error fetching imageFiles: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const imageFile = await this.imageFileRepository.findOne({ where: { oid } });
            if (!imageFile) {
                throw new common_1.NotFoundException(`ImageFile with OID ${oid} not found`);
            }
            return imageFile;
        }
        catch (error) {
            throw new Error('Error fetching imageFile: ' + error.message);
        }
    }
};
exports.ImageFileRepository = ImageFileRepository;
exports.ImageFileRepository = ImageFileRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(image_file_entity_1.ImageFile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ImageFileRepository);
//# sourceMappingURL=image-file.repository.js.map