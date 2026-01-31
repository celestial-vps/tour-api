// src/modules/news/entities/news-image-detail.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { News } from './news.entity';
import { ImageFile } from './image-file.entity';
import { BaseEntity } from './base/base';

@Entity('news_image_detail')
export class NewsImageDetail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  oid: string;

  @Column({ type: 'varchar', length: 50 })
  role: 'cover' | 'thumbnail' | 'gallery';

  @OneToOne(() => ImageFile, { cascade: true, eager: true, nullable: false })
  @JoinColumn({ name: 'imageOid' })
  image: ImageFile;

  @ManyToOne(() => News, news => news.images, { nullable: false })
  @JoinColumn({ name: 'newsOid' })
  news: News;
}
