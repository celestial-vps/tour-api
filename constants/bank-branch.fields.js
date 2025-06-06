// constants/bankBranchFields.js

const BANK_BRANCH_BASIC_FIELDS = [
  'oid',
  'bankOid',
  'branchName',
  'bankAddress',
];

const BANK_BRANCH_AUDIT_FIELDS = [
  'createdBy',
  'createdAt',
  'lastModifiedBy',
  'updatedAt',
  'deletedBy',
  'deletedAt',
];

module.exports = {
  BANK_BRANCH_BASIC_FIELDS,
  BANK_BRANCH_AUDIT_FIELDS,
};
