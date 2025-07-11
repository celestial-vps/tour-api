// models/BaseSchema.js
const mongoose = require('mongoose');

const baseOptions = {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
};

const BaseSchema = new mongoose.Schema({
  createdBy: { type: String, default: null },
  lastModifiedBy: { type: String, default: null },
  deletedBy: { type: String, default: null },
  deletedAt: { type: Date, default: null },
}, baseOptions);

module.exports = BaseSchema;
