// Mapping functions
async function toHotelRoomResponse(hotelRoom) {  
    const response = {
        oid: hotelRoom.oid,
        hotelOid: hotelRoom.hotelOid,
        roomType: hotelRoom.roomType,
        capacity: hotelRoom.capacity,
        pricePerNight: hotelRoom.pricePerNight,
        amenities: hotelRoom.amenities,
        status: hotelRoom.status,
        createdBy: hotelRoom.createdBy,
        updatedAt: hotelRoom.updatedAt
    };
    return response;
}

async function toHotelRoomResponses(hotelRooms) {
    const hotelRoomResponses = await Promise.all(hotelRooms.map(toHotelRoomResponse));
    return hotelRoomResponses;
}

// Export everything
module.exports = {
    toHotelRoomResponse,
    toHotelRoomResponses
};
