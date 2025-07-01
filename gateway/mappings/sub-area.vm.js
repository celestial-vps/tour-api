// Mapping functions
async function toSubAreaResponse(subArea) {
    const response = {
        oid: subArea.oid,
        cityOid: subArea.cityOid,
        subAreaName: subArea.subAreaName,
        latitude: subArea.latitude,
        longitude: subArea.longitude,
        address: subArea.address,
        phoneNumber: subArea.phoneNumber,
        email: subArea.email,
        openingHour: subArea.openingHour,
        createdBy: subArea.createdBy,
        updatedAt: subArea.updatedAt
    };
    if (subArea.city) {
        response.city = subArea.city;
    }
    return response;
}

async function toSubAreaResponseMini(subArea) {
    const response = {
        oid: subArea.oid,
        subAreaName: subArea.subAreaName,
    };
    return response;
}

async function toSubAreaResponses(subAreas) {
    const SubAreaResponses = await Promise.all(subAreas.map(toSubAreaResponse));
    return SubAreaResponses;
}

// Export everything
module.exports = {
    toSubAreaResponse,
    toSubAreaResponses,
    toSubAreaResponseMini
};
