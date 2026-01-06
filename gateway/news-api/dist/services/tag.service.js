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
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const tag_repository_1 = require("../repositories/tag.repository");
const tag_entity_1 = require("../models/tag.entity");
const typeorm_1 = require("typeorm");
const tag_vm_1 = require("../mappings/tag-vm");
let TagService = class TagService {
    tagRepository;
    tagMapping;
    dataSource;
    constructor(tagRepository, tagMapping, dataSource) {
        this.tagRepository = tagRepository;
        this.tagMapping = tagMapping;
        this.dataSource = dataSource;
    }
    async create(tagdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const tag = new tag_entity_1.Tag();
            tag.name = tagdto.name;
            tag.slug = tagdto.slug;
            tag.createdBy = userOid;
            tag.createdAt = new Date();
            const savedTag = await this.tagRepository.save(tag, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedTag.oid, name: savedTag.name ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving tag: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(oid, tagdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const tag = await this.tagRepository.findById(oid);
            if (!tag)
                throw new common_1.NotFoundException('Tag data not found');
            tag.name = tagdto.name;
            tag.lastModifiedBy = userOid;
            tag.updatedAt = new Date();
            const savedTag = await this.tagRepository.update(oid, tag, queryRunner);
            await queryRunner.commitTransaction();
            return { value: savedTag.oid, name: savedTag.name ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error updating tag: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const tag = await this.tagRepository.findById(oid);
            if (!tag)
                throw new common_1.NotFoundException('Tag data not found');
            await this.tagRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            return { value: tag.oid, name: tag.name ?? '' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error deleting tag: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const tags = await this.tagRepository.findAll();
            return this.tagMapping.toTagResponses(tags);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching tags: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { tags, count } = await this.tagRepository.findByCriteriaPage(page, pageSize, condition);
            return { tags: this.tagMapping.toTagResponses(tags), count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching paginated tags: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const tag = await this.tagRepository.findById(oid);
            if (!tag)
                throw new common_1.NotFoundException('Tag not found');
            return this.tagMapping.toTagResponse(tag);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching tag: ' + error.message);
        }
    }
};
exports.TagService = TagService;
exports.TagService = TagService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tag_repository_1.TagRepository,
        tag_vm_1.TagMapping,
        typeorm_1.DataSource])
], TagService);
//# sourceMappingURL=tag.service.js.map