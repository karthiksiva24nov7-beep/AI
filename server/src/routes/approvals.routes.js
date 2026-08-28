const express = require('express');
const router = express.Router();
const Approval = require('../models/Approval');
const agentOrchestrator = require('../services/orchestrator/AgentOrchestrator');
const { protect, authorize } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');
const { memoryStore } = require('../services/tools/ToolRegistry');

// Seed initial memory approval if empty
const seedDefaultApproval = () => {
  if (!memoryStore.approvals.has('APP-4821')) {
    memoryStore.approvals.set('APP-4821', {
      approvalId: 'APP-4821',
      incidentId: 'INC-4821',
      executionId: 'EXEC-INC-4821-DEMO',
      recommendedAction: 'Issue full refund of ₹25,000',
      amount: 25000,
      riskLevel: 'HIGH',
      reason: 'Refund policy conditions satisfied. Delivery delayed by 4 days.',
      confidence: 94,
      evidence: [
        '✓ Order verified (#4821)',
        '✓ Payment verified (₹25,000 via UPI)',
        '✓ Shipment delay confirmed (4 days)',
        '✓ Refund policy satisfied'
      ],
      status: 'PENDING',
      requestedByAgent: 'Decision Agent',
      createdAt: new Date()
    });
  }
};

// List approvals
router.get('/', protect, async (req, res) => {
  try {
    seedDefaultApproval();

    let approvals = [];
    if (getIsConnected()) {
      approvals = await Approval.find({}).sort({ createdAt: -1 });
    }

    if (!approvals.length) {
      approvals = Array.from(memoryStore.approvals.values());
    }

    res.json({ count: approvals.length, approvals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve high risk action
router.post('/:id/approve', protect, authorize('ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    seedDefaultApproval();

    let approval = null;
    if (getIsConnected()) {
      approval = await Approval.findOne({ approvalId: id });
    }

    if (!approval && memoryStore.approvals.has(id)) {
      approval = memoryStore.approvals.get(id);
    }

    if (!approval) {
      approval = {
        approvalId: id,
        incidentId: 'INC-4821',
        executionId: 'EXEC-INC-4821-DEMO',
        status: 'PENDING'
      };
    }

    // Update state to APPROVED
    approval.status = 'APPROVED';
    approval.reviewedBy = req.user ? req.user.name : 'Alex Rivera (Admin)';
    approval.reviewedAt = new Date();
    approval.comments = comments || 'Approved in Approval Center';

    if (getIsConnected()) {
      await Approval.updateOne({ approvalId: id }, { status: 'APPROVED', reviewedBy: approval.reviewedBy, reviewedAt: approval.reviewedAt, comments });
    }
    memoryStore.approvals.set(id, approval);

    console.log(`[ApprovalsRoute] Approved ${id} for incident ${approval.incidentId}. Resuming Orchestrator loop...`);

    // Resume execution with humanApproved = true
    const result = await agentOrchestrator.startOrchestration(approval.incidentId, { humanApproved: true, approvalId: id });

    res.json({ success: true, message: 'Action approved successfully by human operator.', incidentId: approval.incidentId, orchestration: result });
  } catch (err) {
    console.error('[ApprovalsRoute] Approve error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Reject high risk action
router.post('/:id/reject', protect, authorize('ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    seedDefaultApproval();

    let approval = memoryStore.approvals.get(id) || { approvalId: id, incidentId: 'INC-4821' };
    approval.status = 'REJECTED';
    approval.reviewedBy = req.user ? req.user.name : 'Alex Rivera (Admin)';
    approval.reviewedAt = new Date();
    approval.comments = comments || 'Rejected in Approval Center';

    if (getIsConnected()) {
      await Approval.updateOne({ approvalId: id }, { status: 'REJECTED', reviewedBy: approval.reviewedBy, reviewedAt: approval.reviewedAt, comments });
    }
    memoryStore.approvals.set(id, approval);

    res.json({ success: true, message: 'Action rejected by human operator. Execution halted.', incidentId: approval.incidentId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
