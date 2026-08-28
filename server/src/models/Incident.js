const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  incidentId: { type: String, required: true, unique: true }, // e.g. INC-4821
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['DELIVERY_DELAY', 'REFUND_REQUEST', 'PAYMENT_FAILURE', 'INVENTORY_SHORTAGE', 'INVOICE_MISMATCH', 'CUSTOMER_COMPLAINT'], 
    default: 'DELIVERY_DELAY' 
  },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  status: { 
    type: String, 
    enum: ['OPEN', 'IN_PROGRESS', 'PENDING_APPROVAL', 'RESOLVED', 'REJECTED', 'ESCALATED'], 
    default: 'OPEN' 
  },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  orderId: { type: String, required: true },
  assignedAgents: [{ type: String }],
  resolutionSummary: { type: String, default: '' },
  confidenceScore: { type: Number, default: 0 },
  requiresApproval: { type: Boolean, default: false },
  approvalId: { type: String, default: null },
  executionPlan: { type: Array, default: [] },
  customerResponse: { type: String, default: '' },
  companyId: { type: String, default: 'COMP-DEFAULT' },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Incident', IncidentSchema);
