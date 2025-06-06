async function toHotelRoomResponse(room) {
  return {
    room_id: room.room_id,
    hotelOid: room.hotelOid,
    room_type: room.room_type,
    capacity: room.capacity,
    price_per_night: room.price_per_night,
    amenities: room.amenities,
    status: room.status,
    createdBy: room.createdBy,
    createdAt: room.createdAt,
    lastModifiedBy: room.lastModifiedBy,
    updatedAt: room.updatedAt,
    deletedBy: room.deletedBy,
    deletedAt: room.deletedAt,
    // Optional: include hotel info if eager-loaded
    hotel: room.hotel ? {
      oid: room.hotel.oid,
      hotelName: room.hotel.hotelName, // Adjust according to your Hotel model's attributes
    } : undefined,
  };
}

async function toHotelRoomResponses(rooms) {
  return await Promise.all(rooms.map(toHotelRoomResponse));
}

module.exports = {
  toHotelRoomResponse,
  toHotelRoomResponses,
};
