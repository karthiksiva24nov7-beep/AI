const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  tier: { type: String, enum: ['STANDARD', 'VIP', 'ENTERPRISE'], default: 'STANDARD' },
  lifetimeValue: { type: Number, default: 0 },
  companyId: { type: String, default: 'COMP-DEFAULT' }
});

module.exports = mongoose.model('Customer', CustomerSchema);
