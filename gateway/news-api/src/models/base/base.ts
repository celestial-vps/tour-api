import { 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    DeleteDateColumn 
} from 'typeorm';

export abstract class BaseEntity {
    @Column({ type: 'text', nullable: true, default: null })
    description?: string;

    @Column({ type: 'uuid' })
    createdBy: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column({ type: 'uuid', nullable: true })
    lastModifiedBy?: string;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt?: Date;

    @Column({ type: 'uuid', nullable: true })
    deletedBy?: string;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;
}
