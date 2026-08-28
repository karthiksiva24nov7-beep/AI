const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const analyticsData = {
    overview: {
      activeIncidents: 24,
      resolvedToday: 187,
      autonomousResolutionRate: 94.7,
      humanEscalationRate: 5.3,
      avgResolutionTime: '3m 42s',
      agentSuccessRate: 96.2,
      retryRecoveryRate: 91.4
    },
    categoryBreakdown: [
      { category: 'Delivery Delay', count: 86, percentage: 46 },
      { category: 'Refund Request', count: 42, percentage: 22 },
      { category: 'Payment Failure', count: 28, percentage: 15 },
      { category: 'Inventory Shortage', count: 18, percentage: 10 },
      { category: 'Invoice Mismatch', count: 13, percentage: 7 }
    ],
    agentPerformance: [
      { agent: 'Planner Agent', successRate: 98.5, total: 412 },
      { agent: 'Order Agent', successRate: 99.2, total: 580 },
      { agent: 'Payment Agent', successRate: 99.7, total: 530 },
      { agent: 'Delivery Agent', successRate: 94.8, total: 490 },
      { agent: 'Policy Agent', successRate: 98.9, total: 450 },
      { agent: 'Decision Agent', successRate: 96.2, total: 410 },
      { agent: 'Verification Agent', successRate: 99.1, total: 385 }
    ]
  };

  res.json(analyticsData);
});

module.exports = router;
