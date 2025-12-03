async function toDiseaseResponse(disease) {
    return {
        oid: disease.oid,
        name: disease.name,
        description: disease.description,
        createdBy: disease.createdBy,
        createdAt: disease.createdAt,
        lastModifiedBy: disease.lastModifiedBy,
        updatedAt: disease.updatedAt
    };
}

async function toDiseaseResponses(diseases) {
    return await Promise.all(diseases.map(toDiseaseResponse));
}

module.exports = {
    toDiseaseResponse,
    toDiseaseResponses
};
