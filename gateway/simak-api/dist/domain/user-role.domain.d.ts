export declare class UserRoleDomain {
    id: string;
    roleName: string;
    targetType?: string;
    isAdministrative: boolean;
    readState: boolean;
    writeState: boolean;
    createState: boolean;
    deleteState: boolean;
    navigateState: boolean;
    description?: string;
    createdBy: string;
    createdAt: Date;
    lastModifiedBy?: string;
    updatedAt?: Date;
    deletedBy?: string;
    deletedAt?: Date;
}
