import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm';
 
@Entity('image_files')
export class ImageFile {
  @PrimaryGeneratedColumn('uuid')
  oid: string;  // UUID primary key

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  fileName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  filePath?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  fileMime?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  fileUrl?: string;

  @Column({ type: 'text', nullable: true, default: null })
  description?: string;

  @Column('uuid')
  createdBy: string;

  @Column('timestamp')
  createdAt: Date;

  @Column('uuid', { nullable: true, default: null })
  lastModifiedBy: string | null;

  @Column('timestamp', { nullable: true })
  updatedAt?: Date;

  @Column('uuid', { nullable: true })
  deletedBy?: string;

  @DeleteDateColumn()
  deletedAt?: Date;  // Soft delete with DeleteDateColumn for TypeORM
}
