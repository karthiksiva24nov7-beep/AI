const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  customerId: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['CREDIT_CARD', 'UPI', 'NET_BANKING', 'WALLET'], default: 'UPI' },
  status: { type: String, enum: ['SUCCESS', 'REFUND_INITIATED', 'REFUNDED', 'FAILED'], default: 'SUCCESS' },
  transactionRef: { type: String },
  refundRef: { type: String, default: null },
  refundAmount: { type: Number, default: 0 },
  refundDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
