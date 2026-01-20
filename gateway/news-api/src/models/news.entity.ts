// src/modules/news/entities/news.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
 
import { NewsCategory } from './news-category.entity'; // sesuaikan path
import { ImageFile } from './image-file.entity'; 
import { BaseEntity } from './base/base'; 
import { NewsImageDetail } from './news-image-detail.entity';

@Entity('news')
export class News extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  oid: string;

  @ManyToOne(() => NewsCategory, category => category.newss, { nullable: false })
  @JoinColumn({ name: 'categoryOid' })
  category: NewsCategory;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  summary?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  author?: string;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tags?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  language?: string;

  /** Gambar utama berita */
  @OneToOne(() => ImageFile, { cascade: true, eager: true, nullable: true })
  @JoinColumn({ name: 'imageOid' })
  image?: ImageFile;

  /** List gambar detail berita */
  @OneToMany(() => NewsImageDetail, imageDetail => imageDetail.news, { cascade: true, eager: true })
  images: NewsImageDetail[];
}
