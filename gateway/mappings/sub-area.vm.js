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
    return response;
}

async function toSubAreaResponses(subAreas) {
    const SubAreaResponses = await Promise.all(subAreas.map(toSubAreaResponse));
    return SubAreaResponses;
}

// Export everything
module.exports = {
    toSubAreaResponse,
    toSubAreaResponses
};
