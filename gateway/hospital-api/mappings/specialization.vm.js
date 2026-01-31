async function toSpecializationResponse(specialization) {
    return {
        oid: specialization.oid,
        name: specialization.name,
        description: specialization.description,
        createdAt: specialization.createdAt,
        updatedAt: specialization.updatedAt
    };
}

async function toSpecializationResponses(specializations) {
    return await Promise.all(specializations.map(toSpecializationResponse));
}

module.exports = {
    toSpecializationResponse,
    toSpecializationResponses
};
