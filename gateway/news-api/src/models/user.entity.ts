import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn 
} from 'typeorm'; 
import { UserRole } from './user-role.entity';
import { BaseEntity } from './base/base';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    oid: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 150 })
    password: string;

    @Column({ type: 'timestamp', nullable: true })
    birthday?: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    memberNumber?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    androidToken?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    expiredTime?: string;

    @Column({ type: 'boolean', nullable: true, default: true })
    isActive?: boolean;

    @Column({ type: 'timestamp', nullable: true })
    activatedAt?: Date;

    @ManyToOne(() => UserRole, role => role.users)
    @JoinColumn({ name: 'roleOid' })
    role: UserRole;

    @Column({ type: 'uuid' })
    roleOid: string;
}
