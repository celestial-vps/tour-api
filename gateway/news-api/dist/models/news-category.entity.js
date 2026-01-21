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
exports.NewsCategory = void 0;
const typeorm_1 = require("typeorm");
const base_1 = require("./base/base");
const news_entity_1 = require("./news.entity");
let NewsCategory = class NewsCategory extends base_1.BaseEntity {
    oid;
    categoryName;
    newss;
};
exports.NewsCategory = NewsCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NewsCategory.prototype, "oid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 40, nullable: true }),
    __metadata("design:type", String)
], NewsCategory.prototype, "categoryName", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => news_entity_1.News, news => news.category),
    __metadata("design:type", Array)
], NewsCategory.prototype, "newss", void 0);
exports.NewsCategory = NewsCategory = __decorate([
    (0, typeorm_1.Entity)('news_categories')
], NewsCategory);
//# sourceMappingURL=news-category.entity.js.map