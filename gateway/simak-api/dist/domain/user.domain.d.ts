import { UserRoleDomain } from "./user-role.domain";
export declare class UserDomain {
    id: string;
    name: string;
    email: string;
    password: string;
    androidToken?: string;
    expiredTime?: string;
    isActive?: boolean;
    activatedAt?: Date;
    roleOid: string;
    userRole: UserRoleDomain;
    description?: string;
    createdBy: string;
    createdAt: Date;
    lastModifiedBy?: string;
    updatedAt?: Date;
    deletedBy?: string;
    deletedAt?: Date;
}
