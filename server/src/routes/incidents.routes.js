const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const AuditLog = require('../models/AuditLog');
const agentOrchestrator = require('../services/orchestrator/AgentOrchestrator');
const { protect } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');
const { memoryStore } = require('../services/tools/ToolRegistry');

// 1. GET ALL INCIDENTS (with filter & search)
router.get('/', protect, async (req, res) => {
  try {
    const { search, priority, status, category } = req.query;

    let incidents = [];
    if (getIsConnected()) {
      let query = {};
      if (priority) query.priority = priority;
      if (status) query.status = status;
      if (category) query.category = category;
      if (search) {
        query.$or = [
          { incidentId: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { customerName: { $regex: search, $options: 'i' } }
        ];
      }
      incidents = await Incident.find(query).sort({ createdAt: -1 });
    }

    if (!incidents.length) {
      incidents = Array.from(memoryStore.incidents.values());
      if (priority) incidents = incidents.filter(i => i.priority === priority);
      if (status) incidents = incidents.filter(i => i.status === status);
      if (category) incidents = incidents.filter(i => i.category === category);
      if (search) {
        const s = search.toLowerCase();
        incidents = incidents.filter(i => 
          i.incidentId.toLowerCase().includes(s) || 
          i.title.toLowerCase().includes(s) || 
          i.customerName.toLowerCase().includes(s)
        );
      }
    }

    res.json({ count: incidents.length, incidents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET INCIDENT DETAIL
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    let incident = null;

    if (getIsConnected()) {
      incident = await Incident.findOne({ incidentId: id });
    }

    if (!incident && memoryStore.incidents.has(id)) {
      incident = memoryStore.incidents.get(id);
    }

    if (!incident) {
      return res.status(404).json({ error: `Incident ${id} not found.` });
    }

    // Get audit log
    let audits = [];
    if (getIsConnected()) {
      audits = await AuditLog.find({ incidentId: id }).sort({ timestamp: 1 });
    }
    if (!audits.length) {
      audits = memoryStore.auditLogs.filter(a => a.incidentId === id);
    }

    res.json({ incident, audits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. CREATE INCIDENT
router.post('/', protect, async (req, res) => {
  try {
    const incidentData = {
      incidentId: req.body.incidentId || `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'DELIVERY_DELAY',
      priority: req.body.priority || 'HIGH',
      status: 'OPEN',
      customerId: req.body.customerId || 'CUST-RahulSharma',
      customerName: req.body.customerName || 'Rahul Sharma',
      orderId: req.body.orderId || '#4821',
      createdAt: new Date()
    };

    if (getIsConnected()) {
      await Incident.create(incidentData);
    }
    memoryStore.incidents.set(incidentData.incidentId, incidentData);

    res.status(201).json({ success: true, incident: incidentData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. AUTONOMOUS RESOLUTION TRIGGER
router.post('/:id/resolve', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { simulateFailure = false } = req.body;

    console.log(`[IncidentsRoute] Triggering Autonomous Resolution for ${id} (simulateFailure=${simulateFailure})`);

    const orchestrationResult = await agentOrchestrator.startOrchestration(id, { simulateFailure });
    res.json(orchestrationResult);
  } catch (err) {
    console.error('[IncidentsRoute] Error resolving incident:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
