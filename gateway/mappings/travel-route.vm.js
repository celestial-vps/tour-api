// Mapping functions
async function toTravelRouteResponse(travelRoute) {  
    const response = {
        oid: travelRoute.oid,
        originOid: travelRoute.originOid,
        destinationOid: travelRoute.destinationOid,
        distanceKm: travelRoute.distanceKm,
        estimatedTime: travelRoute.estimatedTime,
        createdBy: travelRoute.createdBy,
        updatedAt: travelRoute.updatedAt
    };
    return response;
}

async function toTravelRouteResponses(travelRoutes) {
    const TravelRouteResponses = await Promise.all(travelRoutes.map(toTravelRouteResponse));
    return TravelRouteResponses;
}

// Export everything
module.exports = {
    toTravelRouteResponse,
    toTravelRouteResponses
};
