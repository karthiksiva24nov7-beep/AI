const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  carrier: { type: String, default: 'Bluedart Logistics' },
  trackingNumber: { type: String, required: true },
  status: { type: String, enum: ['LABEL_CREATED', 'IN_TRANSIT', 'DELAYED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURN_TO_ORIGIN'], default: 'DELAYED' },
  delayDays: { type: Number, default: 4 }, // INC-4821 has 4 days delay
  originLocation: { type: String, default: 'Warehouse Hub - Mumbai' },
  destinationLocation: { type: String, default: 'Bengaluru South' },
  lastKnownLocation: { type: String, default: 'Transit Hub - Hyderabad (Stuck)' },
  estimatedDeliveryDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shipment', ShipmentSchema);
