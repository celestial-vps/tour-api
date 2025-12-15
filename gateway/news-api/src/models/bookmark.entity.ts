import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base';
import { User } from './user.entity';
import { Article } from './article.entity';


@Entity('bookmarks')
export class Bookmark extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    oid: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Article)
    @JoinColumn({ name: 'article_id' })
    article: Article;
}
