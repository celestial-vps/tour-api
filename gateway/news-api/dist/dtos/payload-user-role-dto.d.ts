import { PaginationInfo } from './base/pagination-info-dto';
export declare class FilterUserRoleDto {
    roleName: string;
    targetType: string;
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
export declare class ResponseUserRoleVm {
    oid: string;
    roleName: string;
    targetType: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class SuccessUserRoleResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseUserRoleVm[];
}
export declare class SuccessUserRoleObjectResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseUserRoleVm;
}
export declare class SuccessUserRolePaginatedResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    pagination: PaginationInfo;
    data: ResponseUserRoleVm[];
}
