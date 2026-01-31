export declare class FilterUserRoleDto {
    roleName: string;
}
export declare class PageUserRoleDto {
    roleName: string;
}
export declare class CreateUserRoleDto {
    roleName: string;
    targetType: string;
    isAdministrative: boolean;
    readState: boolean;
    writeState: boolean;
    createState: boolean;
    deleteState: boolean;
    navigateState: boolean;
}
export declare class UpdateUserRoleDto {
    roleName: string;
    targetType: string;
    isAdministrative: boolean;
    readState: boolean;
    writeState: boolean;
    createState: boolean;
    deleteState: boolean;
    navigateState: boolean;
}
