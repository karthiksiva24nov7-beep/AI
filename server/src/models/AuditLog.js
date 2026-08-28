const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  auditId: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
  incidentId: { type: String, required: true },
  agent: { type: String, required: true },
  actionType: { type: String, required: true }, // e.g. TOOL_CALL, DECISION, ACTION_EXECUTION, HUMAN_APPROVAL, VERIFICATION
  toolName: { type: String, default: null },
  details: { type: String, required: true },
  evidence: [{ type: String }],
  immutable: { type: Boolean, default: true }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
