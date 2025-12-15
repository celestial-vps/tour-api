import { User } from './user.entity';
import { BaseEntity } from './base/base';
export declare class UserRole extends BaseEntity {
    oid: string;
    roleName: string;
    targetType?: string;
    isAdministrative: boolean;
    readState: boolean;
    writeState: boolean;
    createState: boolean;
    deleteState: boolean;
    navigateState: boolean;
    users: User[];
}
