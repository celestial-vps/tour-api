import { BaseEntity } from './base/base';
import { User } from './user.entity';
import { Article } from './article.entity';
export declare class Bookmark extends BaseEntity {
    oid: string;
    user: User;
    article: Article;
}
