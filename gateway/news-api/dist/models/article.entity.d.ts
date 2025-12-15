import { BaseEntity } from './base/base';
import { User } from './user.entity';
import { NewsCategory } from './news-category.entity';
export declare class Article extends BaseEntity {
    oid: string;
    title: string;
    slug: string;
    content: string;
    thumbnail?: string;
    author: User;
    newsCategory: NewsCategory;
    status: 'draft' | 'published' | 'deleted';
    views: number;
}
