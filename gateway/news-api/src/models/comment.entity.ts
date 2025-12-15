import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base';
import { Article } from './article.entity';
import { User } from './user.entity';


@Entity('comments')
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    oid: string;
    
    @ManyToOne(() => Article)
    @JoinColumn({ name: 'article_id' })
    article: Article;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
    status: 'pending' | 'approved' | 'rejected';
}
