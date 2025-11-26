// ViewModel for UserRole
export class UserRoleVm {
    constructor(
        public oid: string,
        public roleName: string,
        public targetType: string,
        public isAdministrative: boolean,
        public readState: boolean,
        public writeState: boolean,
        public createState: boolean,
        public deleteState: boolean,
        public navigateState: boolean,
        public createdAt: Date,
        public updatedAt?: Date
    ) {}
}

// Convert a single UserRole model to UserRoleVm
export  function toUserRoleResponse(userRole: any): UserRoleVm {
    return new UserRoleVm(
        userRole.oid,
        userRole.roleName,
        userRole.targetType,
        userRole.isAdministrative,
        userRole.readState,
        userRole.writeState,
        userRole.createState,
        userRole.deleteState,
        userRole.navigateState,
        userRole.createdAt,
        userRole.updatedAt
    );
}

// Convert multiple UserRole models to UserRoleVms
export  function toUserRoleResponses(userRoles: any[]): UserRoleVm[] {
    return userRoles.map(toUserRoleResponse);
}
