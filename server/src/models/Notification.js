const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['LOW_STOCK', 'NEW_ORDER', 'PAYMENT_RECEIVED', 'PAYMENT_OVERDUE', 'PURCHASE_RECOMMENDATION', 'AI_ALERT'], default: 'AI_ALERT' },
  read: { type: Boolean, default: false },
  businessId: { type: String, required: true, default: 'BIZ-DEFAULT' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
