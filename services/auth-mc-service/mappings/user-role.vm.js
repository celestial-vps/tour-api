 
// Convert a single UserRole model to UserRoleVm
async function toUserRoleResponse(userRole) {
    const response = {
        oid: userRole._id,
        roleName: userRole.roleName,
        targetType: userRole.targetType,
        isAdministrative: userRole.isAdministrative,
        readState: userRole.readState,
        writeState: userRole.writeState,
        createState: userRole.createState,
        deleteState: userRole.deleteState,
        navigateState: userRole.navigateState,
        createdAt: userRole.createdAt,
        updatedAt: userRole.updatedAt
    };
    return response;
}

// Convert multiple UserRole models to UserRoleVm
async function toUserRoleResponses(userRoles) {
    const userRoleResponses = await Promise.all(userRoles.map(toUserRoleResponse));
    return userRoleResponses;
}

// Export everything
module.exports = {
    toUserRoleResponse,
    toUserRoleResponses
};