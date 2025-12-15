import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base';
import { Article } from './article.entity';

@Entity('banners')
export class Banner extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    oid: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 255 })
    image: string;

    @ManyToOne(() => Article, { nullable: true })
    @JoinColumn({ name: 'article_id' })
    article?: Article;
}
