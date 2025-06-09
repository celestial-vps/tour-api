// constants/customerFields.js

const CUSTOMER_BASIC_FIELDS = [
  'oid',
  'customerName',
  'customerPhone',
  'customerEmail',
  'customerPostalCode',
  'bankOid',
  // 'subDistrictOid', // Uncomment if this field exists on the model
];

const CUSTOMER_AUDIT_FIELDS = [
  'createdBy',
  'createdAt',
  'lastModifiedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt',
];

module.exports = {
  CUSTOMER_BASIC_FIELDS,
  CUSTOMER_AUDIT_FIELDS,
};
