async function toTreatmentResponse(treatment) {
    return {
        oid: treatment.oid,
        name: treatment.name,
        price: treatment.price,
        createdAt: treatment.createdAt,
        updatedAt: treatment.updatedAt
    };
}

async function toTreatmentResponses(treatments) {
    return await Promise.all(treatments.map(toTreatmentResponse));
}

module.exports = {
    toTreatmentResponse,
    toTreatmentResponses
};
