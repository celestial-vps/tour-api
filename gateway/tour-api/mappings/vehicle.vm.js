const { VehicleType } = require("../models");
const { toVehicleTypeResponseMini } = require("./vehicle-type.vm")
// Mapping functions
async function toVehicleResponse(vehicle) {
    const response = {
        oid: vehicle.oid,
        vehicleTypeOid: vehicle.vehicleTypeOid,
        year: vehicle.year,
        color: vehicle.color,
        seatCapacity: vehicle.seatCapacity,
        licensePlate: vehicle.licensePlate,
        status: vehicle.status,
        pricePerDay: vehicle.pricePerDay,
        createdBy: vehicle.createdBy,
        updatedAt: vehicle.updatedAt
    };
    if (vehicle.vehicleType) {
        response.vehicleType = await toVehicleTypeResponseMini(vehicle.vehicleType);
    }
    return response;
}

async function toVehicleResponses(vehicles) {
    const vehicleResponses = await Promise.all(vehicles.map(toVehicleResponse));
    return vehicleResponses;
}

// Export everything
module.exports = {
    toVehicleResponse,
    toVehicleResponses
};
