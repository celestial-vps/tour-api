import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base';
import { Article } from './article.entity';
import { Tag } from './tag.entity';

@Entity('article_tags')
export class ArticleTag extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    oid: string;

    @ManyToOne(() => Article)
    @JoinColumn({ name: 'article_id' })
    article: Article;

    @ManyToOne(() => Tag)
    @JoinColumn({ name: 'tag_id' })
    tag: Tag;
}
