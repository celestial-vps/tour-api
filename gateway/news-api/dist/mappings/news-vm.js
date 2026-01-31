"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsMapping = exports.NewsVm = void 0;
const common_1 = require("@nestjs/common");
class NewsVm {
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
    createdAt;
    updatedAt;
}
exports.NewsVm = NewsVm;
let NewsMapping = class NewsMapping {
    toNewsResponse(News) {
        return {
            oid: News.oid,
            newsCategory: News.category ? News.category.categoryName ?? '' : '',
            title: News.title ?? '',
            content: News.content ?? '',
            summary: News.summary ?? '',
            author: News.author ?? '',
            status: News.status ?? '',
            publishedAt: News.publishedAt ?? new Date(0),
            views: News.views ?? '',
            tags: News.tags ?? '',
            language: News.language ?? '',
            createdAt: News.createdAt,
            updatedAt: News.updatedAt,
        };
    }
    toNewsResponses(Newss) {
        return Newss.map(News => this.toNewsResponse(News));
    }
};
exports.NewsMapping = NewsMapping;
exports.NewsMapping = NewsMapping = __decorate([
    (0, common_1.Injectable)()
], NewsMapping);
//# sourceMappingURL=news-vm.js.map