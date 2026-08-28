const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { shopPilotTools, memoryStore } = require('../services/tools/ShopPilotToolRegistry');
const { protect } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');

// List Customers
router.get('/', protect, async (req, res) => {
  try {
    let customers = [];
    if (getIsConnected()) {
      customers = await Customer.find({});
    }
    if (!customers.length) {
      customers = Array.from(memoryStore.customers.values());
    }
    res.json({ count: customers.length, customers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Customer
router.post('/', protect, async (req, res) => {
  try {
    const custRes = await shopPilotTools.executeTool('createCustomer', req.body, 'API');
    res.status(201).json(custRes.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
