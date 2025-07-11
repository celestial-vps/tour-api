const mongoose = require('mongoose');
const BaseSchema = require('./base-schema');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  meterNumber: { type: String, required: true, unique: true },
  category: { type: String, enum: ['A', 'B', 'C'], required: true },

  phone: { type: String, default: null },
  email: { type: String, default: null },
  status: { type: String, enum: ['aktif', 'nonaktif', 'blokir'], default: 'aktif' },
  installationDate: { type: Date, default: null },
  region: { type: String, default: null },
  note: { type: String, default: null },
  location: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  }
});

// Tambahkan audit trail fields
customerSchema.add(BaseSchema);

module.exports = mongoose.model('Customer', customerSchema);
