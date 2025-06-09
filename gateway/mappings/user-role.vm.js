const moment = require('moment');

// Convert a single UserRole model to UserRoleVm
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
        createdAt: userRole.createdAt,
        updatedAt: userRole.updatedAt
    };
    return response;
};

// Convert multiple UserRole models to UserRoleVm
const toUserRoleResponses = (userRoles) => {
    return userRoles.map(userRole => toUserRoleResponse(userRole));
};

module.exports = {
    toUserRoleResponse,
    toUserRoleResponses
};
