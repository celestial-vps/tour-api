import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base/base';
 
@Entity('banks')
export class Bank extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    oid: string;

    @Column({ type: 'varchar', length: 10, unique: true })
    bankCode: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    bankName?: string;

    @Column({ type: 'varchar', length: 4, nullable: true })
    shortName?: string;
}
