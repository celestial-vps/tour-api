import { Injectable } from '@nestjs/common';
import { User } from '../models/user.entity'; // Make sure the path is correct

export class UserTokenVm {
  oid: string;
  email: string;
  token: string;
  refreshToken: string;
  isActive: string;
  activatedAt: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class UserVm {
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

@Injectable()
export class UserMapping {

  // Method to map a single User entity to UserVm
  toUserResponse(user: User): UserVm {
    return {
      oid: user.oid,
      name: user.name,
      email: user.email,
      role: user.role.roleName,
      birthday: user.birthday ? user.birthday.toISOString() : '',
      memberNumber: user.memberNumber ?? '',
      androidToken: user.androidToken ?? '',
      expiredTime: user.expiredTime ?? '',
      isActive: user.isActive ? 'Active' : 'Inactive',
      activatedAt: user.updatedAt ? user.updatedAt.toISOString() : '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,  // Make sure the entity has these fields, they can be nullable
    };
  }

  toUserTokenResponse(user: User, token: string, refreshToken: string): UserTokenVm {
    return {
      oid: user.oid,
      email: user.email,
      token: token,
      refreshToken: refreshToken,
      isActive: user.isActive ? 'Active' : 'Inactive',
      activatedAt: user.updatedAt ? user.updatedAt.toISOString() : '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,  // Make sure the entity has these fields, they can be nullable
    };
  }

  // Method to map an array of User entities to UserVm[]
  toUserResponses(users: User[]): UserVm[] {
    return users.map(user => this.toUserResponse(user));
  }

}
