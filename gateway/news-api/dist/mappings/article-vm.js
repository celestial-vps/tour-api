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
exports.ArticleMapping = exports.ArticleVm = void 0;
const common_1 = require("@nestjs/common");
const news_category_vm_1 = require("./news-category-vm");
const user_vm_1 = require("./user-vm");
class ArticleVm {
    oid;
    title;
    slug;
    content;
    thumbnail;
    author;
    category;
    status;
    views;
    createdAt;
    updatedAt;
}
exports.ArticleVm = ArticleVm;
let ArticleMapping = class ArticleMapping {
    userMapping;
    categoryMapping;
    constructor(userMapping, categoryMapping) {
        this.userMapping = userMapping;
        this.categoryMapping = categoryMapping;
    }
    toArticleResponse(article) {
        return {
            oid: article.oid,
            title: article.title,
            slug: article.slug,
            content: article.content,
            thumbnail: article.thumbnail ?? '',
            author: this.userMapping.toUserResponse(article.author),
            category: this.categoryMapping.toNewsCategoryResponse(article.newsCategory),
            status: article.status,
            views: article.views,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
        };
    }
    toArticleResponses(articles) {
        return articles.map(article => this.toArticleResponse(article));
    }
};
exports.ArticleMapping = ArticleMapping;
exports.ArticleMapping = ArticleMapping = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_vm_1.UserMapping,
        news_category_vm_1.NewsCategoryMapping])
], ArticleMapping);
//# sourceMappingURL=article-vm.js.map