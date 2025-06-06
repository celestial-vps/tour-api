// constants/hotelRoomFields.js

const HOTEL_ROOM_BASIC_FIELDS = [
  'room_id',
  'hotelOid',
  'room_type',
  'capacity',
  'price_per_night',
  'amenities',
  'status',
];

const HOTEL_ROOM_AUDIT_FIELDS = [
  'createdBy',
  'createdAt',
  'lastModifiedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt',
];

module.exports = {
  HOTEL_ROOM_BASIC_FIELDS,
  HOTEL_ROOM_AUDIT_FIELDS,
};
