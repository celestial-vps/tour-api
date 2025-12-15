import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base';
import { User } from './user.entity';

@Entity('notifications')
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    oid: string;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'boolean', default: false })
    isRead: boolean;
}
