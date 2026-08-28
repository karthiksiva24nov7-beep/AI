const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { shopPilotTools, memoryStore } = require('../services/tools/ShopPilotToolRegistry');
const { protect } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');

// List Products & Stock Status
router.get('/', protect, async (req, res) => {
  try {
    const invRes = await shopPilotTools.executeTool('getInventory', {}, 'API');
    res.json(invRes.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Product
router.post('/', protect, async (req, res) => {
  try {
    const prodRes = await shopPilotTools.executeTool('createProduct', req.body, 'API');
    res.status(201).json(prodRes.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adjust Stock
router.post('/:id/adjust-stock', protect, async (req, res) => {
  try {
    const { quantityDelta, reason } = req.body;
    const adjRes = await shopPilotTools.executeTool('adjustInventory', {
      productId: req.params.id,
      quantityDelta,
      reason
    }, 'API');
    res.json(adjRes.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
