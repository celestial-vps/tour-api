const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const BaseSchema = require('./base-schema');

const UserSchema = new mongoose.Schema({
  oid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
  },
  androidToken: {
    type: String,
    maxlength: 255,
    default: null,
  },
  expiredTime: {
    type: String,
    maxlength: 50,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: null,
  },
  activatedAt: {
    type: Date,
    default: null,
  },
  roleOid: {
    type: String,
    default: null,
    ref: 'UserRole',
  },
  description: {
    type: String,
    default: null,
  },
  lastModifiedBy: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Tambahkan audit trail fields
UserSchema.add(BaseSchema);

module.exports = mongoose.model('User', UserSchema);
