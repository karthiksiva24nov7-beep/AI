const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  supplierId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  contactPerson: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  categories: [{ type: String }],
  outstandingBalance: { type: Number, default: 0 },
  businessId: { type: String, required: true, default: 'BIZ-DEFAULT' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', SupplierSchema);
