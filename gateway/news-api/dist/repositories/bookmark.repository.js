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
exports.BookmarkRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bookmark_entity_1 = require("../models/bookmark.entity");
let BookmarkRepository = class BookmarkRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async save(bookmark, queryRunner) {
        try {
            return await queryRunner.manager.save(bookmark_entity_1.Bookmark, bookmark);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving bookmark: ' + error.message);
        }
    }
    async update(oid, bookmark, queryRunner) {
        try {
            const result = await queryRunner.manager.update(bookmark_entity_1.Bookmark, { oid }, bookmark);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Bookmark with OID ${oid} not found`);
            }
            return await queryRunner.manager.findOneOrFail(bookmark_entity_1.Bookmark, {
                where: { oid },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error updating bookmark: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            const result = await queryRunner.manager.softDelete(bookmark_entity_1.Bookmark, { oid });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Bookmark with OID ${oid} not found`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error deleting bookmark: ' + error.message);
        }
    }
    async findAll() {
        return this.repo.find();
    }
    async findById(oid) {
        const bookmark = await this.repo.findOne({
            where: { oid },
        });
        if (!bookmark) {
            throw new common_1.NotFoundException(`Bookmark with OID ${oid} not found`);
        }
        return bookmark;
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const where = this.buildFilter(condition);
        const [bookmarks, count] = await this.repo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { oid: 'ASC' },
        });
        return { bookmarks, count };
    }
    async findCountByCriteria(condition) {
        const where = this.buildFilter(condition);
        return this.repo.count({ where });
    }
    async advanceFilter(condition) {
        const where = this.buildFilter(condition);
        return this.repo.find({
            where,
            order: { oid: 'ASC' },
        });
    }
    buildFilter(condition) {
        const where = {};
        return where;
    }
};
exports.BookmarkRepository = BookmarkRepository;
exports.BookmarkRepository = BookmarkRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bookmark_entity_1.Bookmark)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BookmarkRepository);
//# sourceMappingURL=bookmark.repository.js.map