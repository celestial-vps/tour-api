// Mapping functions
async function toHotelRoomResponse(HotelRoom) {  
    const response = {
        oid: HotelRoom.oid,
        hotelOid: HotelRoom.hotelOid,
        room_type: HotelRoom.room_type,
        capacity: HotelRoom.capacity,
        price_per_night: HotelRoom.price_per_night,
        amenities: HotelRoom.amenities,
        status: HotelRoom.status,
        createdBy: HotelRoom.createdBy,
        updatedAt: HotelRoom.updatedAt
    };
    return response;
}

async function toHotelRoomResponses(HotelRooms) {
    const HotelRoomResponses = await Promise.all(HotelRooms.map(toHotelRoomResponse));
    return HotelRoomResponses;
}

// Export everything
module.exports = {
    toHotelRoomResponse,
    toHotelRoomResponses
};
