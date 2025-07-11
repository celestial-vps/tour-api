const mongoose = require('mongoose');
const BaseSchema = require('./base-schema');

const billSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  prevMeter: { type: Number, required: true },
  currentMeter: { type: Number, required: true },
  usage: { type: Number, required: true },
  ratePerM3: { type: Number, required: true },
  totalBill: { type: Number, required: true },
  paid: { type: Boolean, default: false }
});

billSchema.add(BaseSchema);

module.exports = mongoose.model('Bill', billSchema);
