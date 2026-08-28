const express = require('express');
const router = express.Router();
const shopPilotOrchestrator = require('../services/agents/ShopPilotOrchestrator');
const { shopPilotTools, memoryStore } = require('../services/tools/ShopPilotToolRegistry');
const { protect } = require('../middleware/auth');
const seedShopPilotData = require('../seedShopPilot');

// Initialize SME Data on Startup
seedShopPilotData();

// 1. Main Autonomous AI Orchestration Endpoint
router.post('/orchestrate', protect, async (req, res) => {
  try {
    const { goal, context } = req.body;
    if (!goal) {
      return res.status(400).json({ error: 'Please provide a business goal prompt.' });
    }

    const execution = await shopPilotOrchestrator.processGoal(goal, context || {});
    res.json(execution);
  } catch (err) {
    console.error('[ShopPilotRoutes] Orchestration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Global AI Command Bar Query Parser
router.post('/command', protect, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Please provide a query prompt.' });
    }

    const execution = await shopPilotOrchestrator.processGoal(query);
    res.json(execution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Purchase Order Approval Endpoint
router.post('/approve-po', protect, async (req, res) => {
  try {
    const { items, supplierId = 'SUP-001', reasoning } = req.body;

    const poRes = await shopPilotTools.executeTool('createPurchaseOrder', {
      supplierId,
      items: items || [],
      reasoning: reasoning || 'Approved low stock purchase order recommendation'
    }, 'Action Agent');

    res.json({ success: true, message: 'Purchase order approved and created in database.', purchaseOrder: poRes.result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Audit Logs
router.get('/audit-logs', protect, async (req, res) => {
  try {
    res.json({ count: memoryStore.auditLogs.length, auditLogs: memoryStore.auditLogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
