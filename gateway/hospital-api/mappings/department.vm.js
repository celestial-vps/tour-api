// Mapping functions
async function toDepartmentResponse(department) {
    const response = {
        oid: department.oid,
        name: department.name,
        createdBy: department.createdBy,
        createdAt: department.createdAt,
        lastModifiedBy: department.lastModifiedBy,
        updatedAt: department.updatedAt
    };
    return response;
}

async function toDepartmentResponses(departments) {
    const departmentResponses = await Promise.all(departments.map(toDepartmentResponse));
    return departmentResponses;
}

module.exports = {
    toDepartmentResponse,
    toDepartmentResponses
};
