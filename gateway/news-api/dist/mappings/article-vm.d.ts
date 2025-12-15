import { NewsCategoryMapping, NewsCategoryVm } from './news-category-vm';
import { UserMapping, UserVm } from './user-vm';
import { Article } from '../models/article.entity';
export declare class ArticleVm {
    oid: string;
    title: string;
    slug: string;
    content: string;
    thumbnail?: string;
    author: UserVm;
    category: NewsCategoryVm;
    status: string;
    views: number;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class ArticleMapping {
    private readonly userMapping;
    private readonly categoryMapping;
    constructor(userMapping: UserMapping, categoryMapping: NewsCategoryMapping);
    toArticleResponse(article: Article): ArticleVm;
    toArticleResponses(articles: Article[]): ArticleVm[];
}
