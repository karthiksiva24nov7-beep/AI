const express = require('express');
const router = express.Router();
const aiService = require('../services/ai/AIService');
const Incident = require('../models/Incident');
const { protect } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');
const { memoryStore } = require('../services/tools/ToolRegistry');

// 1. Natural Language Incident Creation Endpoint
router.post('/extract-incident', protect, async (req, res) => {
  try {
    const { promptText } = req.body;
    if (!promptText) {
      return res.status(400).json({ error: 'Please provide natural language text prompt.' });
    }

    console.log(`[CommandRoute] Extracting incident from prompt: "${promptText}"`);
    const extracted = await aiService.extractIncidentFromText(promptText);

    const incidentId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident = {
      incidentId,
      title: extracted.title || `Natural Language Exception: ${extracted.orderId}`,
      description: extracted.description || promptText,
      category: extracted.category || 'DELIVERY_DELAY',
      priority: extracted.priority || 'HIGH',
      status: 'OPEN',
      customerId: `CUST-${(extracted.customerName || 'RahulSharma').replace(/\s+/g, '')}`,
      customerName: extracted.customerName || 'Rahul Sharma',
      orderId: extracted.orderId || '#4821',
      assignedAgents: ['Planner', 'Order', 'Payment', 'Delivery', 'Policy', 'Decision', 'Action', 'Verification', 'Communication'],
      createdAt: new Date()
    };

    if (getIsConnected()) {
      await Incident.create(newIncident);
    }
    memoryStore.incidents.set(newIncident.incidentId, newIncident);

    res.status(201).json({
      success: true,
      extracted,
      incident: newIncident
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Global AI Command Bar Query Endpoint
router.post('/execute-command', protect, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Please provide a command query.' });
    }

    const commandResult = await aiService.parseNaturalLanguageCommand(query);
    res.json(commandResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
