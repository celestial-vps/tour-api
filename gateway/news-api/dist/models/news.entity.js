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
exports.News = void 0;
const typeorm_1 = require("typeorm");
const news_category_entity_1 = require("./news-category.entity");
const image_file_entity_1 = require("./image-file.entity");
const base_1 = require("./base/base");
const news_image_detail_entity_1 = require("./news-image-detail.entity");
let News = class News extends base_1.BaseEntity {
    oid;
    newsCategory;
    title;
    content;
    summary;
    author;
    status;
    publishedAt;
    views;
    tags;
    language;
    image;
    images;
};
exports.News = News;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], News.prototype, "oid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => news_category_entity_1.NewsCategory, category => category.newss, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'categoryOid' }),
    __metadata("design:type", news_category_entity_1.NewsCategory)
], News.prototype, "newsCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], News.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], News.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], News.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], News.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'draft' }),
    __metadata("design:type", String)
], News.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], News.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], News.prototype, "views", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], News.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], News.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => image_file_entity_1.ImageFile, { cascade: true, eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'imageOid' }),
    __metadata("design:type", image_file_entity_1.ImageFile)
], News.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => news_image_detail_entity_1.NewsImageDetail, imageDetail => imageDetail.news, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], News.prototype, "images", void 0);
exports.News = News = __decorate([
    (0, typeorm_1.Entity)('news')
], News);
//# sourceMappingURL=news.entity.js.map