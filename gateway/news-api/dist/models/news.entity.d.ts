import { BaseEntity } from './base/base';
import { NewsCategory } from './news-category.entity';
import { ImageFile } from './image-file.entity';
export declare class News extends BaseEntity {
    oid: string;
    newsCategory: NewsCategory;
    title: string;
    content: string;
    summary?: string;
    author?: string;
    status: string;
    publishedAt?: Date;
    views: number;
    tags?: string;
    language?: string;
    image?: ImageFile;
}
