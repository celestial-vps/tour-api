import { UserRole } from '../models/user-role.entity';
export declare class UserRoleVm {
    oid: string;
    roleName: string;
    targetType: string;
    isAdministrative: boolean;
    readState: boolean;
    writeState: boolean;
    createState: boolean;
    deleteState: boolean;
    navigateState: boolean;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class UserRoleMapping {
    toUserRoleResponse(userRole: UserRole): UserRoleVm;
    toUserRoleResponses(userRoles: UserRole[]): UserRoleVm[];
}
