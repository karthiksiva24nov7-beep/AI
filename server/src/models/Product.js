const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  stockQuantity: { type: Number, required: true, default: 0 },
  minStock: { type: Number, default: 10 },
  maxStock: { type: Number, default: 100 },
  purchasePrice: { type: Number, required: true, default: 0 },
  sellingPrice: { type: Number, required: true, default: 0 },
  supplierId: { type: String, default: 'SUP-001' },
  supplierName: { type: String, default: 'National Paper & Supplies' },
  businessId: { type: String, required: true, default: 'BIZ-DEFAULT' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
