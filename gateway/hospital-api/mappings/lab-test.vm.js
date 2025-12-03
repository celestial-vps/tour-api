async function toLabTestResponse(labTest) {
    return {
        oid: labTest.oid,
        name: labTest.name,
        categoryOid: labTest.categoryOid,
        unit: labTest.unit,
        referenceValue: labTest.referenceValue,
        createdBy: labTest.createdBy,
        createdAt: labTest.createdAt,
        lastModifiedBy: labTest.lastModifiedBy,
        updatedAt: labTest.updatedAt
    };
}

async function toLabTestResponses(labTests) {
    return await Promise.all(labTests.map(toLabTestResponse));
}

module.exports = {
    toLabTestResponse,
    toLabTestResponses
};
