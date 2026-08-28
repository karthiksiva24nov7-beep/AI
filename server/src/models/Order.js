const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // e.g. #4821 or ORD-4821
  customerId: { type: String, required: true },
  items: [{
    sku: String,
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true }, // e.g. 25000
  currency: { type: String, default: 'INR' },
  orderStatus: { type: String, enum: ['PLACED', 'PROCESSING', 'SHIPPED', 'DELAYED', 'DELIVERED', 'REFUNDED', 'CANCELLED'], default: 'DELAYED' },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'REFUNDED', 'FAILED'], default: 'PAID' },
  shipmentStatus: { type: String, enum: ['LABEL_CREATED', 'IN_TRANSIT', 'DELAYED', 'DELIVERED', 'RETURNED'], default: 'DELAYED' },
  orderDate: { type: Date, default: Date.now },
  deliveryDateEstimated: { type: Date },
  companyId: { type: String, default: 'COMP-DEFAULT' }
});

module.exports = mongoose.model('Order', OrderSchema);
