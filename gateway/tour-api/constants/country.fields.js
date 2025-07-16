const COUNTRY_BASIC_FIELDS = [
  'oid',
  'countryCode',
  'countryName',
  'countryCurrency',
];

const COUNTRY_AUDIT_FIELDS = [
  'createdAt',
  'lastModifiedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt',
];

module.exports = {
  COUNTRY_BASIC_FIELDS,
  COUNTRY_AUDIT_FIELDS,
};
