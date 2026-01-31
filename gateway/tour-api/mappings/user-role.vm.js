// Mapping functions
async function toUserRoleResponse(userRole) {  
    const response = {
        oid: userRole.oid,
        roleName: userRole.roleName,
        targetType: userRole.targetType,
        isAdministrative: userRole.isAdministrative,
        readState: userRole.readState,
        writeState: userRole.writeState,
        createState: userRole.createState,
        deleteState: userRole.deleteState,
        navigateState: userRole.navigateState,
        createdBy: userRole.createdBy,
        updatedAt: userRole.updatedAt
    };
    return response;
}

async function toUserRoleResponses(userRoles) {
    const userRoleResponses = await Promise.all(userRoles.map(toUserRoleResponse));
    return userRoleResponses;
}

// Export everything
module.exports = {
    toUserRoleResponse,
    toUserRoleResponses
};
