const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating UUIDs

const bankSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
 
  bankName: {
    type: String,
    maxlength: 40,
    default: null,
  },
  shortName: {
    type: String,
    maxlength: 4,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
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
    required: false,
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
  collection: 'banks', // Specify the collection name
  timestamps: false, // Disable automatic timestamps (createdAt, updatedAt)
});

// Create the model
const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;