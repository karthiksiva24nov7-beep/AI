const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  businessId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  businessType: { type: String, default: 'Retail / SME Shop' },
  currency: { type: String, default: 'INR' },
  currencySymbol: { type: String, default: '₹' },
  taxRate: { type: Number, default: 18 },
  lowStockThreshold: { type: Number, default: 10 },
  autoPurchaseApprovalLimit: { type: Number, default: 10000 },
  ownerEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', BusinessSchema);
