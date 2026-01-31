// Mapping functions
async function toBedResponse(bed) {
    const response = {
        oid: bed.oid,
        bedNumber: bed.bedNumber,
        roomOid: bed.roomOid,
        status: bed.status,
        createdBy: bed.createdBy,
        createdAt: bed.createdAt,
        lastModifiedBy: bed.lastModifiedBy,
        updatedAt: bed.updatedAt
    };
    if (bed.roomOid) {
        response.room = {
            oid: bed.roomOid,
            roomName: bed.name 
        };
    }
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
