async function toMedicationResponse(medication) {
    return {
        oid: medication.oid,
        name: medication.name,
        description: medication.description,
        createdBy: medication.createdBy,
        createdAt: medication.createdAt,
        lastModifiedBy: medication.lastModifiedBy,
        updatedAt: medication.updatedAt
    };
}

async function toMedicationResponses(medications) {
    return await Promise.all(medications.map(toMedicationResponse));
}

module.exports = {
    toMedicationResponse,
    toMedicationResponses
};
