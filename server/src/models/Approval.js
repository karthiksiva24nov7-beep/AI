const mongoose = require('mongoose');

const ApprovalSchema = new mongoose.Schema({
  approvalId: { type: String, required: true, unique: true },
  incidentId: { type: String, required: true },
  executionId: { type: String, required: true },
  recommendedAction: { type: String, required: true },
  amount: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'HIGH' },
  reason: { type: String, required: true },
  confidence: { type: Number, required: true },
  evidence: [{ type: String }],
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  requestedByAgent: { type: String, default: 'Decision Agent' },
  reviewedBy: { type: String, default: null },
  reviewedAt: { type: Date, default: null },
  comments: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Approval', ApprovalSchema);
