const TRAVEL_BOOKING_BASIC_FIELDS = ['oid', 'code', 'discountType', 'discountValue', 'usageLimit', 'usedCount', 'validFrom', 'validUntil', 'isActive', 'description'];

const TRAVEL_BOOKING_AUDIT_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'];

module.exports = {
  TRAVEL_BOOKING_BASIC_FIELDS,
  TRAVEL_BOOKING_AUDIT_FIELDS,
};
