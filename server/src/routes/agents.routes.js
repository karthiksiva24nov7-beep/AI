const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const agentsList = [
    { name: 'Planner Agent', role: 'Task Decomposition & Dependency Mapping', status: 'ACTIVE', successRate: '98.5%', totalTasks: 412, avgTime: '1.2s', failureRate: '1.5%' },
    { name: 'Order Agent', role: 'Order Telemetry & Customer Profiling', status: 'ACTIVE', successRate: '99.2%', totalTasks: 580, avgTime: '0.8s', failureRate: '0.8%' },
    { name: 'Payment Agent', role: 'Payment Verification & Financial Audit', status: 'ACTIVE', successRate: '99.7%', totalTasks: 530, avgTime: '0.9s', failureRate: '0.3%' },
    { name: 'Delivery Agent', role: 'Logistics Tracking & Delay Telemetry', status: 'ACTIVE', successRate: '94.8%', totalTasks: 490, avgTime: '2.4s', failureRate: '5.2%' },
    { name: 'Inventory Agent', role: 'Warehouse Stock & SKU Availability', status: 'ACTIVE', successRate: '99.5%', totalTasks: 380, avgTime: '0.7s', failureRate: '0.5%' },
    { name: 'Policy Agent', role: 'Business SLA & Refund Eligibility Check', status: 'ACTIVE', successRate: '98.9%', totalTasks: 450, avgTime: '1.1s', failureRate: '1.1%' },
    { name: 'Decision Agent', role: 'Multi-Evidence Synthesis & Recommendation', status: 'ACTIVE', successRate: '96.2%', totalTasks: 410, avgTime: '1.8s', failureRate: '3.8%' },
    { name: 'Action Agent', role: 'Safe Tool Execution & Risk Enforcement', status: 'ACTIVE', successRate: '97.8%', totalTasks: 390, avgTime: '1.5s', failureRate: '2.2%' },
    { name: 'Verification Agent', role: 'Outcome Validation & State Audit', status: 'ACTIVE', successRate: '99.1%', totalTasks: 385, avgTime: '0.9s', failureRate: '0.9%' },
    { name: 'Communication Agent', role: 'Customer Response Synthesis & Dispatch', status: 'ACTIVE', successRate: '99.4%', totalTasks: 395, avgTime: '1.4s', failureRate: '0.6%' }
  ];

  res.json({ agents: agentsList });
});

module.exports = router;
