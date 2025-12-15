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
    bookmarkRepository;
    constructor(bookmarkRepository) {
        this.bookmarkRepository = bookmarkRepository;
    }
    async save(bookmark, queryRunner) {
        try {
            const savedBookmark = await queryRunner.manager.save(bookmark_entity_1.Bookmark, bookmark);
            return savedBookmark;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving bookmark: ' + error.message);
        }
    }
    async update(oid, bookmark, queryRunner) {
        try {
            await this.bookmarkRepository.update(oid, bookmark);
            return bookmark;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error update bookmark: ' + error.message);
        }
    }
    async delete(oid, queryRunner) {
        try {
            await this.bookmarkRepository.softDelete({ oid });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error saving bookmark: ' + error.message);
        }
    }
    async findAll() {
        return this.bookmarkRepository.find();
    }
    async findByCriteriaPage(page, pageSize, condition) {
        const queryBuilder = this.bookmarkRepository.createQueryBuilder('bookmark');
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);
        try {
            const [bookmarks, count] = await queryBuilder.getManyAndCount();
            return { bookmarks, count };
        }
        catch (error) {
            throw new common_1.NotFoundException('Error fetching bookmarks: ' + error.message);
        }
    }
    async findCountByCriteria(condition) {
        const queryBuilder = this.bookmarkRepository.createQueryBuilder('bookmark');
        try {
            const count = await queryBuilder.getCount();
            return count;
        }
        catch (error) {
            throw new Error('Error fetching bookmark count: ' + error.message);
        }
    }
    async advanceFilter(condition) {
        const queryBuilder = this.bookmarkRepository.createQueryBuilder('bookmark');
        try {
            const bookmarks = await queryBuilder.getMany();
            return bookmarks;
        }
        catch (error) {
            throw new Error('Error fetching bookmarks: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const bookmark = await this.bookmarkRepository.findOne({ where: { oid } });
            if (!bookmark) {
                throw new common_1.NotFoundException(`Bookmark with OID ${oid} not found`);
            }
            return bookmark;
        }
        catch (error) {
            throw new Error('Error fetching bookmark: ' + error.message);
        }
    }
};
exports.BookmarkRepository = BookmarkRepository;
exports.BookmarkRepository = BookmarkRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bookmark_entity_1.Bookmark)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BookmarkRepository);
//# sourceMappingURL=bookmark.repository.js.map