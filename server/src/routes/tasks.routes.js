const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { shopPilotTools, memoryStore } = require('../services/tools/ShopPilotToolRegistry');
const { protect } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');

// List Tasks
router.get('/', protect, async (req, res) => {
  try {
    let tasks = [];
    if (getIsConnected()) {
      tasks = await Task.find({}).sort({ createdAt: -1 });
    }
    if (!tasks.length) {
      tasks = Array.from(memoryStore.tasks.values());
    }
    res.json({ count: tasks.length, tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Task
router.post('/', protect, async (req, res) => {
  try {
    const taskRes = await shopPilotTools.executeTool('createTask', req.body, 'API');
    res.status(201).json(taskRes.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task Status
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const updRes = await shopPilotTools.executeTool('updateTask', { taskId: req.params.id, status }, 'API');
    res.json(updRes.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
