const { toSubAreaResponseMini } = require('./sub-area.vm')
// Mapping functions
async function toTravelRouteResponse(travelRoute) {
    const response = {
        oid: travelRoute.oid,
        originSubAreaOid : travelRoute.originSubAreaOid ,
        destinationSubAreaOid : travelRoute.destinationSubAreaOid ,
        distanceKm: travelRoute.distanceKm,
        estimatedTime: travelRoute.estimatedTime,
        createdBy: travelRoute.createdBy,
        updatedAt: travelRoute.updatedAt
    };
    if (travelRoute.originSubArea) {
        response.originSubArea = await toSubAreaResponseMini(travelRoute.originSubArea);
    }
    if (travelRoute.destinationSubArea) {
        response.destinationSubArea = await toSubAreaResponseMini(travelRoute.destinationSubArea);
    }
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
