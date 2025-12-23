// src/modules/news/entities/image-file.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'; 
import { ImageOwnerTypeEnum } from '../enums/image-owner-type.enum';
import { BaseEntity } from './base/base';

@Entity('image_files')
export class ImageFile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  oid: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fileName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  filePath?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fileMime?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fileUrl?: string;

  @Column({ type: 'varchar', length: 50 })
  ownerType: ImageOwnerTypeEnum;
}
