import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany 
} from 'typeorm'; 
import { User } from './user.entity'; 
import { BaseEntity } from './base/base';

@Entity('user_roles')
export class UserRole extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    oid: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    roleName: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    targetType?: string;

    @Column({ type: 'boolean', default: false })
    isAdministrative: boolean;

    @Column({ type: 'boolean', default: false })
    readState: boolean;

    @Column({ type: 'boolean', default: false })
    writeState: boolean;

    @Column({ type: 'boolean', default: false })
    createState: boolean;

    @Column({ type: 'boolean', default: false })
    deleteState: boolean;

    @Column({ type: 'boolean', default: false })
    navigateState: boolean;

    @OneToMany(() => User, user => user.role)
    users: User[];
}
