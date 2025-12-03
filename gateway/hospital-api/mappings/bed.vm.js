// Mapping functions
async function toBedResponse(bed) {
    const response = {
        oid: bed.oid,
        name: bed.name,
        roomOid: bed.roomOid,
        status: bed.status,
        createdBy: bed.createdBy,
        createdAt: bed.createdAt,
        lastModifiedBy: bed.lastModifiedBy,
        updatedAt: bed.updatedAt
    };
    return response;
}

async function toBedResponses(beds) {
    const bedResponses = await Promise.all(beds.map(toBedResponse));
    return bedResponses;
}

module.exports = {
    toBedResponse,
    toBedResponses
};
