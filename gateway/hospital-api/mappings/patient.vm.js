async function toPatientResponse(patient) {
    return {
        oid: patient.oid,
        fullName: patient.fullName,
        gender: patient.gender,
        birthDate: patient.birthDate,
        phone: patient.phone,
        address: patient.address,
        createdBy: patient.createdBy,
        createdAt: patient.createdAt,
        lastModifiedBy: patient.lastModifiedBy,
        updatedAt: patient.updatedAt
    };
}

async function toPatientResponses(patients) {
    return await Promise.all(patients.map(toPatientResponse));
}

module.exports = {
    toPatientResponse,
    toPatientResponses
};
