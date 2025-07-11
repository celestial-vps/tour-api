// constants/subdistrictFields.js

const SUBDISTRICT_BASIC_FIELDS = [
  'oid',
  'districtOid',
  'subDistrictName',
  'postalCode',
];

const SUBDISTRICT_AUDIT_FIELDS = [
  'createdBy',
  'lastModifiedBy',
  'deletedBy',
  'createdAt',
  'updatedAt',
  'deletedAt',
];

module.exports = {
  SUBDISTRICT_BASIC_FIELDS,
  SUBDISTRICT_AUDIT_FIELDS,
};
