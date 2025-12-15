import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';
import { BaseEntity } from './base/base';
import { ImageOwnerTypeEnum } from '../enums/image-owner-type.enum';
 
@Entity('image_files')
export class ImageFile extends BaseEntity{
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

  // @Column('uuid')
  // ownerId: string; 
}
