import { UserRole } from './user-role.entity';
import { BaseEntity } from './base/base';
export declare class User extends BaseEntity {
    oid: string;
    name: string;
    email: string;
    password: string;
    birthday?: Date;
    memberNumber?: string;
    androidToken?: string;
    expiredTime?: string;
    isActive?: boolean;
    activatedAt?: Date;
    role: UserRole;
    roleOid: string;
}
