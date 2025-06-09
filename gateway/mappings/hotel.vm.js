async function toHotelResponse(hotel) {
  return {
    oid: hotel.oid,
    hotelName: hotel.hotelName,
    address: hotel.address,
    phone: hotel.phone,
    star_rating: hotel.star_rating,
    createdBy: hotel.createdBy,
    createdAt: hotel.createdAt,
    lastModifiedBy: hotel.lastModifiedBy,
    updatedAt: hotel.updatedAt,
    deletedBy: hotel.deletedBy,
    deletedAt: hotel.deletedAt,
    // Include rooms if eager loaded
    hotelRooms: hotel.hotelRooms
      ? await Promise.all(hotel.hotelRooms.map(room => ({
          room_id: room.room_id,
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
        })))
      : undefined,
  };
}

async function toHotelResponses(hotels) {
  return await Promise.all(hotels.map(toHotelResponse));
}

module.exports = {
  toHotelResponse,
  toHotelResponses,
};
