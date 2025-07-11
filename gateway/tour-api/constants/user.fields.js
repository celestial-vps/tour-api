// constants/userFields.js

const USER_BASIC_FIELDS = [
  'oid',
  'email',
  'password',
  'androidToken',
  'expiredTime',
  'isActive',
  'activatedAt',
  'roleOid',
  'description',
];

const USER_AUDIT_FIELDS = [
  'createdAt',
  'updatedAt',
  'deletedAt',
];

module.exports = {
  USER_BASIC_FIELDS,
  USER_AUDIT_FIELDS,
};
