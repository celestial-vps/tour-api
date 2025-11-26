import moment from 'moment';
import { UserDomain } from '../domain/user.domain';
import { User } from '../models/user';
import { UserRoleDomain } from '../domain/user-role.domain';

// ViewModel for User
export class UserVm {
    constructor(
        public oid: string,
        public name: string,
        public email: string,        
        public androidToken: string,
        public isActive: boolean,
        public activatedAt: string,
        public userRole: UserRoleDomain,
        public createdAt: Date,
        public updatedAt?: Date
    ) { }
}

// ViewModel for User Register Response
export class UserRegisterVm {
    constructor(
        public oid: string,
        public email: string,
        public isActive: boolean,
        public createdAt: Date,
        public updatedAt?: Date
    ) { }
}

// ViewModel for User Token Response
export class UserTokenVm {
    constructor(
        public oid: string,
        public email: string,
        public token: string,
        public refreshToken: string,
        public isActive: boolean,
        public createdAt: Date,
        public updatedAt?: Date
    ) { }
}

// Mapping functions
export function toUserResponse(user: any): UserVm {
    return new UserVm(
        user.oid,
        user.name,
        user.email,  
        user.androidToken, 
        user.isActive,
        moment(user.activatedAt).format(),
        user.userRole,
        user.createdAt,
        user.updatedAt
    );
}

export function toUserRegisterResponse(user: any): UserRegisterVm {
    return new UserRegisterVm(
        user.oid,
        user.email,
        user.isActive,
        user.createdAt,
        user.updatedAt
    );
}

export function toUserTokenResponse(user: any, token: string, refreshToken: string): UserTokenVm {
    return new UserTokenVm(
        user.oid,
        user.email,
        token,
        refreshToken,
        user.isActive,
        user.createdAt,
        user.updatedAt
    );
}

export function toUserResponses(users: UserDomain[]): UserVm[] {
    return users.map(toUserResponse);
}
