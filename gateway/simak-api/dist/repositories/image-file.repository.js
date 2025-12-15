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
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const image_file_1 = require("../models/image-file");
const mapper_1 = require("../misc/mapper");
const image_file_domain_1 = require("../domain/image-file.domain");
let ImageFileRepository = class ImageFileRepository {
    imageFileModel;
    constructor(imageFileModel) {
        this.imageFileModel = imageFileModel;
    }
    async save(imageFile) {
        try {
            const collectionImageFile = new this.imageFileModel(imageFile);
            collectionImageFile.createdAt = (0, mongoose_2.now)();
            const colImageFile = await collectionImageFile.save();
            const data = mapper_1.Mapper.mapToDomain(image_file_domain_1.ImageFileDomain, colImageFile);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async update(oid, imageFile) {
        try {
            const collectionImageFile = await this.imageFileModel.findByIdAndUpdate({ _id: oid }, imageFile, {
                new: true,
            });
            const data = mapper_1.Mapper.mapToDomain(image_file_domain_1.ImageFileDomain, collectionImageFile);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async deleted(imageFile, oid) {
        try {
            const data = await this.imageFileModel.findByIdAndDelete({ _id: oid });
            return { result: imageFile, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findAll() {
        try {
            const imageFiles = await this.imageFileModel.find();
            const data = mapper_1.Mapper.mapToDomain(image_file_domain_1.ImageFileDomain, imageFiles);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async advanceFlter(condition) {
        try {
            const query = {};
            if (condition.fileName) {
                query.fileName = { $regex: condition.fileName, $options: 'i' };
            }
            const imageFiles = await this.imageFileModel.find(query);
            const data = mapper_1.Mapper.mapToDomain(image_file_domain_1.ImageFileDomain, imageFiles);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: null, err: error };
        }
    }
    async findById(oid) {
        try {
            const imageFile = await this.imageFileModel.findOne({ _id: oid });
            const data = mapper_1.Mapper.mapToDomain(image_file_domain_1.ImageFileDomain, imageFile);
            return { result: data, err: null };
        }
        catch (err) {
            return { result: null, err };
        }
    }
    async findCountByCriteria(condition) {
        try {
            const query = {};
            if (condition.fileName) {
                query.fileName = { $regex: condition.fileName, $options: 'i' };
            }
            const count = await this.imageFileModel.countDocuments(query);
            return { result: count, err: null };
        }
        catch (err) {
            return { result: 0, err };
        }
    }
    async findByCriteriaPage(condition, page, pageSize) {
        try {
            const query = {};
            if (condition.fileName) {
                query.fileName = { $regex: condition.fileName, $options: 'i' };
            }
            const imageFiles = await this.imageFileModel.find(query)
                .skip((page - 1) * pageSize)
                .limit(pageSize);
            const data = mapper_1.Mapper.mapToDomain(image_file_domain_1.ImageFileDomain, imageFiles);
            return { result: data, err: null };
        }
        catch (error) {
            return { result: [], err: error };
        }
    }
};
exports.ImageFileRepository = ImageFileRepository;
exports.ImageFileRepository = ImageFileRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(image_file_1.ImageFile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ImageFileRepository);
//# sourceMappingURL=image-file.repository.js.map