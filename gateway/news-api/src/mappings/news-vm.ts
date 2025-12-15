import { Injectable } from '@nestjs/common';
import { News } from '../models/news.entity';

export class NewsVm {
    oid: string;
    newsCategory: string;
    title: string;
    content: string;
    summary: string;
    author: string;
    status: string;
    publishedAt: Date;
    views: number;
    tags: string;
    language: string;
    createdAt: Date;
    updatedAt?: Date;
}

@Injectable()
export class NewsMapping {

    toNewsResponse(News: News): NewsVm {
        return {
            oid: News.oid,
            newsCategory: News.newsCategory ? News.newsCategory.categoryName ?? '' : '',
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

    toNewsResponses(Newss: News[]): NewsVm[] {
        return Newss.map(News => this.toNewsResponse(News));
    }

}
