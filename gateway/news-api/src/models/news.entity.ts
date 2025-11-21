import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base';
import { NewsCategory } from './news-category.entity'; 
import { ImageFile } from './image-file.entity';

@Entity('news')
export class News extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  oid: string;

  @ManyToOne(() => NewsCategory, newsCategory => newsCategory.newss)
  @JoinColumn({ name: 'categoryOid' })
  newsCategory: NewsCategory;

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
}
