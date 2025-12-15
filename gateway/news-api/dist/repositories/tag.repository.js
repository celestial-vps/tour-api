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
exports.TagRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tag_entity_1 = require("../models/tag.entity");
let TagRepository = class TagRepository {
    tagRepository;
    constructor(tagRepository) {
        this.tagRepository = tagRepository;
    }
    async save(tag, queryRunner) {
        try {
            const savedTag = await queryRunner.manager.save(tag_entity_1.Tag, tag);
            return savedTag;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving tag: ' + error.message);
        }
    }
    async update(oid, tag, queryRunner) {
        try {
            await this.tagRepository.update(oid, tag);
            return tag;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error update tag: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            await this.tagRepository.softDelete({ oid });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving tag: ' + error.message);
        }
    }
    async findAll() {
        return this.tagRepository.find();
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const queryBuilder = this.tagRepository.createQueryBuilder('tag');
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);
        try {
            const [tags, count] = await queryBuilder.getManyAndCount();
            return { tags, count };
        }
        catch (error) {
            throw new common_1.NotFoundException('Error fetching tags: ' + error.message);
        }
    }
    async findCountByCriteria(condition) {
        const queryBuilder = this.tagRepository.createQueryBuilder('tag');
        try {
            const count = await queryBuilder.getCount();
            return count;
        }
        catch (error) {
            throw new Error('Error fetching tag count: ' + error.message);
        }
    }
    async advanceFilter(condition) {
        const queryBuilder = this.tagRepository.createQueryBuilder('tag');
        try {
            const tags = await queryBuilder.getMany();
            return tags;
        }
        catch (error) {
            throw new Error('Error fetching tags: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const tag = await this.tagRepository.findOne({ where: { oid } });
            if (!tag) {
                throw new common_1.NotFoundException(`Tag with OID ${oid} not found`);
            }
            return tag;
        }
        catch (error) {
            throw new Error('Error fetching tag: ' + error.message);
        }
    }
};
exports.TagRepository = TagRepository;
exports.TagRepository = TagRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TagRepository);
//# sourceMappingURL=tag.repository.js.map