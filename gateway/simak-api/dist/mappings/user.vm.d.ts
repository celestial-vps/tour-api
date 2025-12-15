import { UserDomain } from '../domain/user.domain';
import { UserRoleDomain } from '../domain/user-role.domain';
export declare class UserVm {
    oid: string;
    name: string;
    email: string;
    androidToken: string;
    isActive: boolean;
    activatedAt: string;
    userRole: UserRoleDomain;
    createdAt: Date;
    updatedAt?: Date | undefined;
    constructor(oid: string, name: string, email: string, androidToken: string, isActive: boolean, activatedAt: string, userRole: UserRoleDomain, createdAt: Date, updatedAt?: Date | undefined);
}
export declare class UserRegisterVm {
    oid: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date | undefined;
    constructor(oid: string, email: string, isActive: boolean, createdAt: Date, updatedAt?: Date | undefined);
}
export declare class UserTokenVm {
    oid: string;
    email: string;
    token: string;
    refreshToken: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date | undefined;
    constructor(oid: string, email: string, token: string, refreshToken: string, isActive: boolean, createdAt: Date, updatedAt?: Date | undefined);
}
export declare function toUserResponse(user: any): UserVm;
export declare function toUserRegisterResponse(user: any): UserRegisterVm;
export declare function toUserTokenResponse(user: any, token: string, refreshToken: string): UserTokenVm;
export declare function toUserResponses(users: UserDomain[]): UserVm[];
