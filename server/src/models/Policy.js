const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  policyId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, enum: ['REFUND', 'SHIPPING', 'INVENTORY', 'PAYMENT', 'ESCALATION'], default: 'REFUND' },
  maxDelayDaysForRefund: { type: Number, default: 3 }, // >3 days delay qualifies for 100% refund
  maxRefundAmountAuto: { type: Number, default: 5000 },
  rules: [{ type: String }],
  description: { type: String },
  companyId: { type: String, default: 'COMP-DEFAULT' }
});

module.exports = mongoose.model('Policy', PolicySchema);
