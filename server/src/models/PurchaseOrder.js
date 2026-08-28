const mongoose = require('mongoose');

const PurchaseOrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitCost: { type: Number, required: true },
  totalCost: { type: Number, required: true }
});

const PurchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  supplierId: { type: String, required: true },
  supplierName: { type: String, required: true },
  items: [PurchaseOrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'RECEIVED', 'CANCELLED'], default: 'PENDING_APPROVAL' },
  requestedByAgent: { type: String, default: 'Supplier Agent' },
  reasoning: { type: String },
  businessId: { type: String, required: true, default: 'BIZ-DEFAULT' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
