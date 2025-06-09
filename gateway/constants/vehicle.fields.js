// constants/vehicleFields.js

const VEHICLE_BASIC_FIELDS = [
  'oid',
  'vehicleTypeOid',
  'year',
  'color',
  'status',
  'price_per_day',
];

const VEHICLE_AUDIT_FIELDS = [
  'createdBy',
  'createdAt',
  'lastModifiedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt',
];

module.exports = {
  VEHICLE_BASIC_FIELDS,
  VEHICLE_AUDIT_FIELDS,
};
