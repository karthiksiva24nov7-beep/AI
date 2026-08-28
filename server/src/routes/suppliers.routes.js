const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const PurchaseOrder = require('../models/PurchaseOrder');
const { shopPilotTools, memoryStore } = require('../services/tools/ShopPilotToolRegistry');
const { protect } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');

// List Suppliers
router.get('/', protect, async (req, res) => {
  try {
    let suppliers = [];
    if (getIsConnected()) {
      suppliers = await Supplier.find({});
    }
    if (!suppliers.length) {
      suppliers = Array.from(memoryStore.suppliers.values());
    }
    res.json({ count: suppliers.length, suppliers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List Purchase Orders
router.get('/purchase-orders', protect, async (req, res) => {
  try {
    let pos = [];
    if (getIsConnected()) {
      pos = await PurchaseOrder.find({}).sort({ createdAt: -1 });
    }
    if (!pos.length) {
      pos = Array.from(memoryStore.purchaseOrders.values());
    }
    res.json({ count: pos.length, purchaseOrders: pos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Purchase Order
router.post('/purchase-orders', protect, async (req, res) => {
  try {
    const poRes = await shopPilotTools.executeTool('createPurchaseOrder', req.body, 'API');
    res.status(201).json(poRes.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
