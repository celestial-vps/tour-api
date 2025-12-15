async function toPatientLabTestResponse(labTest) {
    return {
        oid: labTest.oid,
        patientOid: labTest.patientOid,
        labTestOid: labTest.labTestOid,
        result: labTest.result,
        unit: labTest.unit,
        normalRange: labTest.normalRange,
        createdAt: labTest.createdAt,
        updatedAt: labTest.updatedAt
    };
}

async function toPatientLabTestResponses(labTests) {
    return await Promise.all(labTests.map(toPatientLabTestResponse));
}

module.exports = {
    toPatientLabTestResponse,
    toPatientLabTestResponses
};
