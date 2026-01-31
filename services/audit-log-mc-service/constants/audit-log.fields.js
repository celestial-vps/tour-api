const AUDITLOG_BASIC_FIELDS = [
  'oid',
  'bankCode',
  'bankName',
];

const AUDITLOG_AUDIT_FIELDS = [
  'createdAt',
  'lastModifiedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt',
];

module.exports = {
  AUDITLOG_BASIC_FIELDS,
  AUDITLOG_AUDIT_FIELDS,
};
