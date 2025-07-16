// Mapping functions
async function toTravelScheduleResponse(travelSchedule) {
    const response = {
        oid: travelSchedule.oid,
        routeOid: travelSchedule.routeOid,
        vehicleOid: travelSchedule.vehicleOid,
        driverOid: travelSchedule.driverOid,
        departureTime: travelSchedule.departureTime,
        arrivalTime: travelSchedule.arrivalTime,
        status: travelSchedule.status,
        createdBy: travelSchedule.createdBy,
        updatedAt: travelSchedule.updatedAt
    };
    if (travelSchedule.vehicle) {
        response.vehicle = travelSchedule.vehicle;
    }
    if (travelSchedule.driver) {
        response.driver = travelSchedule.driver;
    }
    if (travelSchedule.travelRoute ) {
        response.travelRoute  = travelSchedule.travelRoute ;
    }
    return response;
}

async function toTravelScheduleResponses(travelSchedules) {
    const TravelScheduleResponses = await Promise.all(travelSchedules.map(toTravelScheduleResponse));
    return TravelScheduleResponses;
}

// Export everything
module.exports = {
    toTravelScheduleResponse,
    toTravelScheduleResponses
};
