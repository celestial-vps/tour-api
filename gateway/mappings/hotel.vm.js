// Mapping functions
async function toHotelResponse(hotel) {  
    const response = {
        oid: hotel.oid,
        hotelName: hotel.hotelName,
        address: hotel.address,
        phone: hotel.phone,
        starRating: hotel.starRating,
        createdBy: hotel.createdBy,
        updatedAt: hotel.updatedAt
    };
    return response;
}

async function toHotelResponses(hotels) {
    const hotelResponses = await Promise.all(hotels.map(toHotelResponse));
    return hotelResponses;
}

// Export everything
module.exports = {
    toHotelResponse,
    toHotelResponses
};
