// Mapping functions
async function toTravelBookingResponse(travelBooking) {  
    const response = {
        oid: travelBooking.oid,
        code: travelBooking.code,
        discountType: travelBooking.discountType,
        discountValue: travelBooking.discountValue,
        usageLimit: travelBooking.usageLimit,
        usedCount: travelBooking.usedCount,
        validFrom: travelBooking.validFrom,
        validUntil: travelBooking.validUntil,
        isActive: travelBooking.isActive,
        description: travelBooking.description,
        createdBy: travelBooking.createdBy,
        updatedAt: travelBooking.updatedAt
    };
    return response;
}

async function toTravelBookingResponses(travelBookings) {
    const TravelBookingResponses = await Promise.all(travelBookings.map(toTravelBookingResponse));
    return TravelBookingResponses;
}

// Export everything
module.exports = {
    toTravelBookingResponse,
    toTravelBookingResponses
};
