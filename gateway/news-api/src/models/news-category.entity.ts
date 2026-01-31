import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base';
import { News } from './news.entity';

@Entity('news_categories')
export class NewsCategory extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    oid: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    categoryName?: string;

    @OneToMany(() => News, news => news.category)
    newss: News[];

}
