import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base';
import { Article } from './article.entity';
import { User } from './user.entity';

@Entity('likes')
export class LikeEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    oid: string;

    @ManyToOne(() => Article)
    @JoinColumn({ name: 'article_id' })
    article: Article;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
