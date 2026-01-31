import { BaseEntity } from './base/base';
import { Article } from './article.entity';
import { Tag } from './tag.entity';
export declare class ArticleTag extends BaseEntity {
    oid: string;
    article: Article;
    tag: Tag;
}
