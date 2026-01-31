import { News } from '../models/news.entity';
export declare class NewsVm {
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
export declare class NewsMapping {
    toNewsResponse(News: News): NewsVm;
    toNewsResponses(Newss: News[]): NewsVm[];
}
