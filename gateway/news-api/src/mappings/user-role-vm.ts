import { Injectable } from '@nestjs/common';
import { UserRole } from '../models/user-role.entity'; // Make sure the path is correct

export class UserRoleVm {
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

@Injectable()
export class UserRoleMapping {

  // Method to map a single UserRole entity to UserRoleVm
  toUserRoleResponse(userRole: UserRole): UserRoleVm {
    return {
      oid: userRole.oid,
      roleName: userRole.roleName,
      targetType: userRole.targetType ?? '',
      isAdministrative: userRole.isAdministrative,
      readState: userRole.readState,
      writeState: userRole.writeState,
      createState: userRole.createState,
      deleteState: userRole.deleteState,
      navigateState: userRole.navigateState,
      createdAt: userRole.createdAt,
      updatedAt: userRole.updatedAt, // Make sure the entity has these fields, they can be nullable
    };
  }

  // Method to map an array of UserRole entities to UserRoleVm[]
  toUserRoleResponses(userRoles: UserRole[]): UserRoleVm[] {
    return userRoles.map(userRole => this.toUserRoleResponse(userRole));
  }
}
