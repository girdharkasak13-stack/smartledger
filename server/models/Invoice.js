const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    default: 'General',
  },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);