const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  amount: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['UNPAID', 'PAID', 'OVERDUE', 'CANCELLED'], default: 'UNPAID' },
  dueDate: { type: Date, required: true },
  businessId: { type: String, required: true, default: 'BIZ-DEFAULT' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
