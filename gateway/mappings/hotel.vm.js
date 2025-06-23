// Mapping functions
async function toHotelResponse(Hotel) {  
    const response = {
        oid: Hotel.oid,
        hotelName: Hotel.hotelName,
        address: Hotel.address,
        phone: Hotel.phone,
        starRating: Hotel.starRating,
        createdBy: Hotel.createdBy,
        updatedAt: Hotel.updatedAt
    };
    return response;
}

async function toHotelResponses(Hotels) {
    const HotelResponses = await Promise.all(Hotels.map(toHotelResponse));
    return HotelResponses;
}

// Export everything
module.exports = {
    toHotelResponse,
    toHotelResponses
};
