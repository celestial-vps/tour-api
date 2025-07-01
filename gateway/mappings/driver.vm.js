// Mapping functions
async function toDriverResponse(driver) {  
    const response = {
        oid: driver.oid,
        userOid: driver.userOid,
        licenseNumber: driver.licenseNumber,
        licenseExpiry: driver.licenseExpiry,
        vehicleOid: driver.vehicleOid,
        status: driver.status,
        hiredAt: driver.hiredAt,
        terminatedAt: driver.terminatedAt,
        ratingAvg: driver.ratingAvg,
        totalTrips: driver.totalTrips,
        createdBy: driver.createdBy,
        updatedAt: driver.updatedAt
    };
    return response;
}

async function toDriverResponses(drivers) {
    const DriverResponses = await Promise.all(drivers.map(toDriverResponse));
    return DriverResponses;
}

// Export everything
module.exports = {
    toDriverResponse,
    toDriverResponses
};
