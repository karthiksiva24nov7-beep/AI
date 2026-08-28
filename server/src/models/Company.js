const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  companyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  domain: { type: String, default: 'company.com' },
  riskThreshold: { type: Number, default: 5000 }, // Refund <= ₹5000 is auto, > ₹5000 needs approval
  automationLevel: { 
    type: String, 
    enum: ['MANUAL', 'ASSISTED', 'AUTONOMOUS'], 
    default: 'AUTONOMOUS' 
  },
  settings: {
    autoApprovalEnabled: { type: Boolean, default: true },
    retryMaxAttempts: { type: Number, default: 3 },
    escalationEmail: { type: String, default: 'ops@company.com' },
    notificationChannel: { type: String, default: 'SLACK_AND_EMAIL' }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);
