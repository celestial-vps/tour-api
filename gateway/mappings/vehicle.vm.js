// Mapping functions
async function toVehicleResponse(Vehicle) {  
    const response = {
        oid: Vehicle.oid,
        vehicleTypeOid: Vehicle.vehicleTypeOid,
        year: Vehicle.year,
        color: Vehicle.color,
        status: Vehicle.status,
        price_per_day: Vehicle.price_per_day,
        createdBy: Vehicle.createdBy,
        updatedAt: Vehicle.updatedAt
    };
    return response;
}

async function toVehicleResponses(Vehicles) {
    const VehicleResponses = await Promise.all(Vehicles.map(toVehicleResponse));
    return VehicleResponses;
}

// Export everything
module.exports = {
    toVehicleResponse,
    toVehicleResponses
};
