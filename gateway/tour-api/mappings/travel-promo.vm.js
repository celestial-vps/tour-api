// Mapping functions
async function toTravelPromoResponse(travelPromo) {  
    const response = {
        oid: travelPromo.oid,
        code: travelPromo.code,
        discountType: travelPromo.discountType,
        discountValue: travelPromo.discountValue,
        usageLimit: travelPromo.usageLimit,
        usedCount: travelPromo.usedCount,
        validFrom: travelPromo.validFrom,
        validUntil: travelPromo.validUntil,
        isActive: travelPromo.isActive,
        description: travelPromo.description,
        createdBy: travelPromo.createdBy,
        updatedAt: travelPromo.updatedAt
    };
    return response;
}

async function toTravelPromoResponses(travelPromos) {
    const TravelPromoResponses = await Promise.all(travelPromos.map(toTravelPromoResponse));
    return TravelPromoResponses;
}

// Export everything
module.exports = {
    toTravelPromoResponse,
    toTravelPromoResponses
};
