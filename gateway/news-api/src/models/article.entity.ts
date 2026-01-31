import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base';
import { User } from './user.entity';
import { NewsCategory } from './news-category.entity';

@Entity('articles')
export class Article extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    oid: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    thumbnail?: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'author_id' })
    author: User;

    @ManyToOne(() => NewsCategory)
    @JoinColumn({ name: 'category_id' })
    newsCategory: NewsCategory;

    @Column({ type: 'enum', enum: ['draft', 'published', 'deleted'], default: 'draft' })
    status: 'draft' | 'published' | 'deleted';

    @Column({ type: 'int', default: 0 })
    views: number;
}
