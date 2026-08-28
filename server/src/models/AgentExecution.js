const mongoose = require('mongoose');

const AgentExecutionSchema = new mongoose.Schema({
  executionId: { type: String, required: true, unique: true },
  incidentId: { type: String, required: true },
  goal: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['PLANNING', 'RUNNING', 'WAITING_APPROVAL', 'REPLANNING', 'RETRYING', 'COMPLETED', 'FAILED'], 
    default: 'PLANNING' 
  },
  taskGraph: [{
    taskId: String,
    agent: String,
    action: String,
    dependencies: [String],
    status: { type: String, enum: ['WAITING', 'RUNNING', 'COMPLETED', 'FAILED', 'RETRYING', 'BLOCKED'], default: 'WAITING' },
    output: mongoose.Schema.Types.Mixed,
    error: String,
    startTime: Date,
    endTime: Date
  }],
  toolCalls: [{
    toolName: String,
    agent: String,
    args: mongoose.Schema.Types.Mixed,
    result: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
  }],
  logs: [{
    timestamp: { type: Date, default: Date.now },
    agent: String,
    message: String,
    level: { type: String, enum: ['INFO', 'WARN', 'ERROR', 'SUCCESS'], default: 'INFO' }
  }],
  decision: {
    recommendation: String,
    confidence: Number,
    summary: String,
    evidence: [String]
  },
  verification: {
    verified: Boolean,
    details: String
  },
  failureRecoveryAttempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AgentExecution', AgentExecutionSchema);
