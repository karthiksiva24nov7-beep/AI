const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect, authorize } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');

router.get('/', protect, async (req, res) => {
  try {
    let company = null;
    if (getIsConnected()) {
      company = await Company.findOne({ companyId: 'COMP-DEFAULT' });
    }

    if (!company) {
      company = {
        companyId: 'COMP-DEFAULT',
        name: 'ResolveFlow Enterprise Operations',
        domain: 'resolveflow.ai',
        riskThreshold: 5000,
        automationLevel: 'AUTONOMOUS',
        settings: {
          autoApprovalEnabled: true,
          retryMaxAttempts: 3,
          escalationEmail: 'ops-alerts@resolveflow.ai',
          notificationChannel: 'SLACK_AND_EMAIL'
        }
      };
    }

    res.json({ company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', protect, authorize('ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const { riskThreshold, automationLevel, name, settings } = req.body;

    if (getIsConnected()) {
      await Company.updateOne(
        { companyId: 'COMP-DEFAULT' },
        { riskThreshold, automationLevel, name, settings },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      message: 'Company settings updated successfully.',
      company: { companyId: 'COMP-DEFAULT', riskThreshold, automationLevel, name, settings }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
