import { BaseEntity } from './base/base';
import { Article } from './article.entity';
export declare class Banner extends BaseEntity {
    oid: string;
    title: string;
    image: string;
    article?: Article;
}
