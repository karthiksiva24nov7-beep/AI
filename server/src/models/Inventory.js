const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  stockLevel: { type: Number, default: 50 },
  reservedStock: { type: Number, default: 5 },
  reorderPoint: { type: Number, default: 10 },
  warehouseLocation: { type: String, default: 'WH-01-BOM' }
});

module.exports = mongoose.model('Inventory', InventorySchema);
