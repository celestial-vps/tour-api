async function toMedicationResponse(medication) {
    const response =  {
        oid: medication.oid,
        name: medication.name,
        categoryOid : medication.categoryOid ,
        createdBy: medication.createdBy,
        createdAt: medication.createdAt,
        lastModifiedBy: medication.lastModifiedBy,
        updatedAt: medication.updatedAt
    };
     if (medication.categoryOid ) {
        response.category = {
            oid: medication.categoryOid ,
            categoryName: medication.categoryName
        };
    }
    return response;
}

async function toMedicationResponses(medications) {
    return await Promise.all(medications.map(toMedicationResponse));
}

module.exports = {
    toMedicationResponse,
    toMedicationResponses
};
