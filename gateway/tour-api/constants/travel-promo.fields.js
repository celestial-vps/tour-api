const TRAVEL_PROMO_BASIC_FIELDS = ['oid', 'code', 'discountType', 'discountValue', 'usageLimit', 'usedCount', 'validFrom', 'validUntil', 'isActive', 'description'];

const TRAVEL_PROMO_AUDIT_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'];

module.exports = {
  TRAVEL_PROMO_BASIC_FIELDS,
  TRAVEL_PROMO_AUDIT_FIELDS,
};
