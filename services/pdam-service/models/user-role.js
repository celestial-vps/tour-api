const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const BaseSchema = require('./base-schema');

const UserRoleSchema = new mongoose.Schema({
  oid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  roleName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  targetType: {
    type: String,
    required: true,
    maxlength: 50,
  },
  isAdministrative: {
    type: Boolean,
    required: true,
  },
  readState: {
    type: Boolean,
    default: false,
  },
  writeState: {
    type: Boolean,
    default: false,
  },
  createState: {
    type: Boolean,
    default: false,
  },
  deleteState: {
    type: Boolean,
    default: false,
  },
  navigateState: {
    type: Boolean,
    default: false,
  },
  lastModifiedBy: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Tambahkan audit trail fields (deletedBy, deletedAt, etc.)
UserRoleSchema.add(BaseSchema);

// Optional: jika ingin relasi virtual ke user
UserRoleSchema.virtual('users', {
  ref: 'User',
  localField: 'oid',
  foreignField: 'roleOid',
});

module.exports = mongoose.model('UserRole', UserRoleSchema);
