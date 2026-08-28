const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { shopPilotTools, memoryStore } = require('../services/tools/ShopPilotToolRegistry');
const { protect } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');

// List Orders
router.get('/', protect, async (req, res) => {
  try {
    let orders = [];
    if (getIsConnected()) {
      orders = await Order.find({}).sort({ createdAt: -1 });
    }
    if (!orders.length) {
      orders = Array.from(memoryStore.orders.values());
    }
    res.json({ count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Order (Deducts stock automatically!)
router.post('/', protect, async (req, res) => {
  try {
    const orderRes = await shopPilotTools.executeTool('createOrder', req.body, 'API');
    res.status(201).json(orderRes.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Order
router.get('/:id', protect, async (req, res) => {
  try {
    const orderRes = await shopPilotTools.executeTool('getOrder', { orderId: req.params.id }, 'API');
    res.json(orderRes.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Order Status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const updRes = await shopPilotTools.executeTool('updateOrder', {
      orderId: req.params.id,
      orderStatus,
      paymentStatus
    }, 'API');
    res.json(updRes.result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
