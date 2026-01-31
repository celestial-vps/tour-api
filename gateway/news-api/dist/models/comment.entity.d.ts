import { BaseEntity } from './base/base';
import { Article } from './article.entity';
import { User } from './user.entity';
export declare class Comment extends BaseEntity {
    oid: string;
    article: Article;
    user: User;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
}
