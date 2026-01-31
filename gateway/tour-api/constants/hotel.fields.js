// constants/hotelFields.js

const HOTEL_BASIC_FIELDS = [
  'oid',
  'hotelName',
  'address',
  'phone',
  'starRating',
];

const HOTEL_AUDIT_FIELDS = [
  'createdBy',
  'createdAt',
  'lastModifiedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt',
];

module.exports = {
  HOTEL_BASIC_FIELDS,
  HOTEL_AUDIT_FIELDS,
};
