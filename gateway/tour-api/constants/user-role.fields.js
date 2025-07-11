const USER_ROLE_BASIC_FIELDS = ['oid', 'roleName', 'targetType', 'isAdministrative', 'readState', 'writeState', 'createState', 'deleteState', 'navigateState'];

const USER_ROLE_AUDIT_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'];

module.exports = {
  USER_ROLE_BASIC_FIELDS,
  USER_ROLE_AUDIT_FIELDS,
};
