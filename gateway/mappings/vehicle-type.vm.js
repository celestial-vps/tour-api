// Mapping functions
async function toVehicleTypeResponse(VehicleType) {  
    const response = {
        oid: VehicleType.oid,
        typeName: VehicleType.typeName,
        createdBy: VehicleType.createdBy,
        updatedAt: VehicleType.updatedAt
    };
    return response;
}

async function toVehicleTypeResponses(VehicleTypes) {
    const VehicleTypeResponses = await Promise.all(VehicleTypes.map(toVehicleTypeResponse));
    return VehicleTypeResponses;
}

// Export everything
module.exports = {
    toVehicleTypeResponse,
    toVehicleTypeResponses
};
