import { NewsCategory } from './news-category.entity';
import { ImageFile } from './image-file.entity';
import { BaseEntity } from './base/base';
import { NewsImageDetail } from './news-image-detail.entity';
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
    images: NewsImageDetail[];
}
