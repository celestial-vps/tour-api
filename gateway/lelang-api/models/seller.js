const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const sellerSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },

  userId: {
    type: String,
    required: true,     // ID user/profile dari service lain
  },

  storeName: {
    type: String,
    maxlength: 100,
    default: null,
  },

  storeDescription: {
    type: String,
    default: null,
  },

  phone: {
    type: String,
    maxlength: 20,
    default: null,
  },

  nationalId: {
    type: String,
    maxlength: 30,
    default: null,       // Nomor KTP / paspor
  },

  bankAccountNumber: {
    type: String,
    maxlength: 50,
    default: null,
  },

  bankAccountName: {
    type: String,
    maxlength: 100,
    default: null,
  },

  sellerStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'banned'],
    default: 'pending',
  },

  // audit fields (exactly like your structure)
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  lastModifiedBy: {
    type: String,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedBy: {
    type: String,
    default: null,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  collection: 'sellers',
  timestamps: false,
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
