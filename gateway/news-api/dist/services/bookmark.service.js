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
exports.BookmarkService = void 0;
const common_1 = require("@nestjs/common");
const bookmark_repository_1 = require("../repositories/bookmark.repository");
const bookmark_entity_1 = require("../models/bookmark.entity");
const typeorm_1 = require("typeorm");
const message_vm_1 = require("../mappings/message-vm");
const bookmark_vm_1 = require("../mappings/bookmark-vm");
let BookmarkService = class BookmarkService {
    bookmarkRepository;
    bookmarkMapping;
    dataSource;
    constructor(bookmarkRepository, bookmarkMapping, dataSource) {
        this.bookmarkRepository = bookmarkRepository;
        this.bookmarkMapping = bookmarkMapping;
        this.dataSource = dataSource;
    }
    async create(bookmarkdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const bookmark = new bookmark_entity_1.Bookmark();
            bookmark.article = { oid: bookmarkdto.articleId };
            bookmark.createdBy = userOid;
            bookmark.createdAt = new Date();
            const savedBookmark = await this.bookmarkRepository.save(bookmark, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedBookmark.oid;
            messageVm.name = savedBookmark.article ? savedBookmark.article.oid : '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error saving bookmark: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(oid, bookmarkdto, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const bookmark = await this.bookmarkRepository.findById(oid);
            if (!bookmark) {
                throw new common_1.NotFoundException('Bookmark data not found');
            }
            bookmark.article = { oid: bookmarkdto.articleId };
            const savedBookmark = await this.bookmarkRepository.update(oid, bookmark, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = savedBookmark.oid;
            messageVm.name = savedBookmark.article ? savedBookmark.article.oid : '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error update bookmark: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleted(oid, userOid) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const bookmark = await this.bookmarkRepository.findById(oid);
            if (!bookmark) {
                throw new common_1.NotFoundException('Bookmark data not found');
            }
            this.bookmarkRepository.delete(oid, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new message_vm_1.MessageVm();
            messageVm.value = bookmark.oid;
            messageVm.name = bookmark.article ? bookmark.article.oid : '';
            return messageVm;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException('Error Delete bookmark: ' + error.message);
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        try {
            const bookmarks = await this.bookmarkRepository.findAll();
            return this.bookmarkMapping.toBookmarkResponses(bookmarks);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find bookmark: ' + error.message);
        }
    }
    async findPage(page, pageSize, condition) {
        try {
            const { bookmarks, count } = await this.bookmarkRepository.findByCriteriaPage(page, pageSize, condition);
            const bookmarkResponses = this.bookmarkMapping.toBookmarkResponses(bookmarks);
            return { bookmarks: bookmarkResponses, count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find bookmark: ' + error.message);
        }
    }
    async findById(oid) {
        try {
            const bookmark = await this.bookmarkRepository.findById(oid);
            return this.bookmarkMapping.toBookmarkResponse(bookmark);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error Find bookmark: ' + error.message);
        }
    }
};
exports.BookmarkService = BookmarkService;
exports.BookmarkService = BookmarkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bookmark_repository_1.BookmarkRepository, bookmark_vm_1.BookmarkMapping,
        typeorm_1.DataSource])
], BookmarkService);
//# sourceMappingURL=bookmark.service.js.map