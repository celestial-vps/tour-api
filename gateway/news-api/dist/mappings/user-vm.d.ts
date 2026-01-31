import { User } from '../models/user.entity';
export declare class UserTokenVm {
    oid: string;
    email: string;
    token: string;
    refreshToken: string;
    isActive: string;
    activatedAt: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class UserVm {
    oid: string;
    name: string;
    role: string;
    email: string;
    birthday: string;
    memberNumber: string;
    androidToken: string;
    expiredTime: string;
    isActive: string;
    activatedAt: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class UserMapping {
    toUserResponse(user: User): UserVm;
    toUserTokenResponse(user: User, token: string, refreshToken: string): UserTokenVm;
    toUserResponses(users: User[]): UserVm[];
}
