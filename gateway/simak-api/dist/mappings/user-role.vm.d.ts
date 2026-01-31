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
    updatedAt?: Date | undefined;
    constructor(oid: string, roleName: string, targetType: string, isAdministrative: boolean, readState: boolean, writeState: boolean, createState: boolean, deleteState: boolean, navigateState: boolean, createdAt: Date, updatedAt?: Date | undefined);
}
export declare function toUserRoleResponse(userRole: any): UserRoleVm;
export declare function toUserRoleResponses(userRoles: any[]): UserRoleVm[];
