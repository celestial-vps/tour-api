const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Kalau perlu UUID, tapi di contoh ini saya pakai ObjectId

const imageSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // Otomatis generate ObjectId
  },

  url: {
    type: String,
    required: true,
  },

  altText: {
    type: String,
    maxlength: 100,
    default: null,
  },

  fileType: {
    type: String,
    maxlength: 30,
    default: null,
  },

  sizeInKB: {
    type: Number,
    default: null,
  },

  uploadedBy: {
    type: String, // Bisa juga ObjectId, tapi saya buat string sesuai contoh
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
  collection: 'images',
  timestamps: false, // kita handle manual createdAt & updatedAt
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
