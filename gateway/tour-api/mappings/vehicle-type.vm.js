// Mapping functions
async function toVehicleTypeResponse(vehicleType) {  
    const response = {
        oid: vehicleType.oid,
        typeName: vehicleType.typeName,
        createdBy: vehicleType.createdBy,
        updatedAt: vehicleType.updatedAt
    };
    return response;
}

async function toVehicleTypeResponseMini(vehicleType) {  
    const response = {
        oid: vehicleType.oid,
        typeName: vehicleType.typeName,
    };
    return response;
}

async function toVehicleTypeResponses(vehicleTypes) {
    const vehicleTypeResponses = await Promise.all(vehicleTypes.map(toVehicleTypeResponse));
    return vehicleTypeResponses;
}

// Export everything
module.exports = {
    toVehicleTypeResponse,
    toVehicleTypeResponses,
    toVehicleTypeResponseMini
};
