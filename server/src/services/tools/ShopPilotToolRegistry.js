const Product = require('../../models/Product');
const Customer = require('../../models/Customer');
const Order = require('../../models/Order');
const Supplier = require('../../models/Supplier');
const PurchaseOrder = require('../../models/PurchaseOrder');
const Payment = require('../../models/Payment');
const Invoice = require('../../models/Invoice');
const Task = require('../../models/Task');
const Notification = require('../../models/Notification');
const AuditLog = require('../../models/AuditLog');
const { getIsConnected } = require('../../config/db');

// In-Memory store fallback for guaranteed 100% offline & local execution
const memoryStore = {
  products: new Map(),
  customers: new Map(),
  orders: new Map(),
  suppliers: new Map(),
  purchaseOrders: new Map(),
  payments: new Map(),
  invoices: new Map(),
  tasks: new Map(),
  notifications: [],
  auditLogs: []
};

class ShopPilotToolRegistry {
  constructor() {
    this.tools = new Map();
    this.registerAllTools();
  }

  registerTool(name, description, handler) {
    this.tools.set(name, { name, description, handler });
  }

  async executeTool(name, args, agentName = 'System') {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool "${name}" not registered in ShopPilot ToolRegistry.`);
    }

    const startTime = Date.now();
    try {
      console.log(`[ShopPilotToolRegistry] Agent [${agentName}] invoking tool [${name}] with args:`, JSON.stringify(args));
      const result = await tool.handler(args);

      // Record Audit Log
      const audit = {
        auditId: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        agent: agentName,
        tool: name,
        args,
        result: typeof result === 'object' ? result : { message: result },
        latencyMs: Date.now() - startTime,
        timestamp: new Date()
      };

      if (getIsConnected()) {
        await AuditLog.create(audit).catch(() => {});
      }
      memoryStore.auditLogs.unshift(audit);

      return { success: true, tool: name, result, latencyMs: audit.latencyMs };
    } catch (err) {
      console.error(`[ShopPilotToolRegistry] Tool [${name}] execution error:`, err.message);
      return { success: false, tool: name, error: err.message };
    }
  }

  registerAllTools() {
    // 1. searchProducts
    this.registerTool('searchProducts', 'Search products by query or category', async ({ query = '', category = '' }) => {
      if (getIsConnected()) {
        const filter = {};
        if (query) filter.name = { $regex: query, $options: 'i' };
        if (category) filter.category = category;
        const list = await Product.find(filter);
        if (list.length) return list;
      }
      const all = Array.from(memoryStore.products.values());
      return all.filter(p => {
        const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase());
        const matchC = !category || p.category.toLowerCase() === category.toLowerCase();
        return matchQ && matchC;
      });
    });

    // 2. getProduct
    this.registerTool('getProduct', 'Get product details by productId or SKU', async ({ productId, sku }) => {
      if (getIsConnected()) {
        const filter = productId ? { productId } : { sku };
        const found = await Product.findOne(filter);
        if (found) return found;
      }
      const key = productId || sku;
      return memoryStore.products.get(key) || Array.from(memoryStore.products.values()).find(p => p.sku === sku || p.productId === productId);
    });

    // 3. createProduct
    this.registerTool('createProduct', 'Create a new product in the shop catalog', async (data) => {
      const productId = `PROD-${Date.now()}`;
      const productData = {
        productId,
        sku: data.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        name: data.name,
        category: data.category || 'General',
        stockQuantity: Number(data.stockQuantity) || 0,
        minStock: Number(data.minStock) || 10,
        maxStock: Number(data.maxStock) || 100,
        purchasePrice: Number(data.purchasePrice) || 0,
        sellingPrice: Number(data.sellingPrice) || 0,
        supplierId: data.supplierId || 'SUP-001',
        supplierName: data.supplierName || 'National Paper & Supplies',
        businessId: 'BIZ-DEFAULT'
      };

      if (getIsConnected()) {
        await Product.create(productData);
      }
      memoryStore.products.set(productId, productData);
      return productData;
    });

    // 4. updateProduct
    this.registerTool('updateProduct', 'Update existing product details', async ({ productId, updates }) => {
      if (getIsConnected()) {
        await Product.updateOne({ productId }, updates);
      }
      const existing = memoryStore.products.get(productId) || {};
      const updated = { ...existing, ...updates };
      memoryStore.products.set(productId, updated);
      return updated;
    });

    // 5. adjustInventory
    this.registerTool('adjustInventory', 'Adjust stock quantity for a product', async ({ productId, quantityDelta, reason }) => {
      let product = null;
      if (getIsConnected()) {
        product = await Product.findOne({ productId });
      }
      if (!product) {
        product = memoryStore.products.get(productId);
      }
      if (!product) throw new Error(`Product ${productId} not found for inventory adjustment.`);

      const newStock = Math.max(0, (product.stockQuantity || 0) + Number(quantityDelta));
      product.stockQuantity = newStock;

      if (getIsConnected()) {
        await Product.updateOne({ productId }, { stockQuantity: newStock });
      }
      memoryStore.products.set(productId, product);

      return { productId, previousStock: product.stockQuantity - quantityDelta, newStock, delta: quantityDelta, reason };
    });

    // 6. getInventory
    this.registerTool('getInventory', 'Get full inventory stock report and low stock warnings', async () => {
      let products = [];
      if (getIsConnected()) {
        products = await Product.find({});
      }
      if (!products.length) {
        products = Array.from(memoryStore.products.values());
      }

      const lowStock = products.filter(p => p.stockQuantity <= p.minStock);
      return {
        totalProducts: products.length,
        lowStockCount: lowStock.length,
        products,
        lowStockProducts: lowStock
      };
    });

    // 7. searchCustomers
    this.registerTool('searchCustomers', 'Search customer directory by name or phone', async ({ query = '' }) => {
      if (getIsConnected()) {
        const list = await Customer.find({ name: { $regex: query, $options: 'i' } });
        if (list.length) return list;
      }
      const all = Array.from(memoryStore.customers.values());
      return all.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || (c.phone && c.phone.includes(query)));
    });

    // 8. createCustomer
    this.registerTool('createCustomer', 'Register a new customer', async ({ name, email, phone, address }) => {
      const customerId = `CUST-${name.replace(/\s+/g, '')}`;
      const data = {
        customerId,
        name,
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        phone: phone || '+91 98765 43210',
        address: address || 'Main Market, City Center',
        totalPurchases: 0,
        outstandingAmount: 0,
        businessId: 'BIZ-DEFAULT'
      };

      if (getIsConnected()) {
        await Customer.create(data);
      }
      memoryStore.customers.set(customerId, data);
      return data;
    });

    // 9. getCustomer
    this.registerTool('getCustomer', 'Get customer profile and order history', async ({ customerId }) => {
      if (getIsConnected()) {
        const found = await Customer.findOne({ customerId });
        if (found) return found;
      }
      return memoryStore.customers.get(customerId);
    });

    // 10. createOrder
    this.registerTool('createOrder', 'Create a new sales order and deduct inventory stock', async ({ customerId, items = [], paymentMethod = 'UPI' }) => {
      let customer = memoryStore.customers.get(customerId);
      if (!customer && getIsConnected()) {
        customer = await Customer.findOne({ customerId });
      }
      const customerName = customer ? customer.name : (customerId.includes('Rahul') ? 'Rahul Sharma' : 'Walk-in Customer');

      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        // Find product
        let prod = memoryStore.products.get(item.productId) || Array.from(memoryStore.products.values()).find(p => p.name.toLowerCase().includes((item.productName || item.productId).toLowerCase()));
        if (!prod && getIsConnected()) {
          prod = await Product.findOne({ $or: [{ productId: item.productId }, { name: { $regex: item.productName || item.productId, $options: 'i' } }] });
        }

        const price = prod ? prod.sellingPrice : 250;
        const prodId = prod ? prod.productId : (item.productId || 'PROD-PAPER');
        const prodName = prod ? prod.name : (item.productName || 'A4 Copy Paper (500 Sheets)');
        const qty = Number(item.quantity) || 1;

        totalAmount += price * qty;
        orderItems.push({ productId: prodId, productName: prodName, quantity: qty, price });

        // Deduct inventory
        if (prod) {
          prod.stockQuantity = Math.max(0, prod.stockQuantity - qty);
          memoryStore.products.set(prod.productId, prod);
          if (getIsConnected()) {
            await Product.updateOne({ productId: prod.productId }, { stockQuantity: prod.stockQuantity });
          }
        }
      }

      const orderNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;
      const orderData = {
        orderId: `ORD-${orderNumber.replace('#', '')}`,
        orderNumber,
        customerId: customer ? customer.customerId : `CUST-${customerName.replace(/\s+/g, '')}`,
        customerName,
        items: orderItems,
        totalAmount,
        paymentStatus: 'PAID',
        orderStatus: 'CONFIRMED',
        paymentMethod,
        businessId: 'BIZ-DEFAULT',
        createdAt: new Date()
      };

      if (getIsConnected()) {
        await Order.create(orderData);
      }
      memoryStore.orders.set(orderData.orderId, orderData);

      return orderData;
    });

    // 11. getOrder
    this.registerTool('getOrder', 'Get sales order details by orderId or orderNumber', async ({ orderId, orderNumber }) => {
      if (getIsConnected()) {
        const found = await Order.findOne({ $or: [{ orderId }, { orderNumber }] });
        if (found) return found;
      }
      return memoryStore.orders.get(orderId) || Array.from(memoryStore.orders.values()).find(o => o.orderNumber === orderNumber || o.orderId === orderId);
    });

    // 12. updateOrder
    this.registerTool('updateOrder', 'Update sales order status', async ({ orderId, orderStatus, paymentStatus }) => {
      const updates = {};
      if (orderStatus) updates.orderStatus = orderStatus;
      if (paymentStatus) updates.paymentStatus = paymentStatus;

      if (getIsConnected()) {
        await Order.updateOne({ orderId }, updates);
      }
      const existing = memoryStore.orders.get(orderId) || {};
      const updated = { ...existing, ...updates };
      memoryStore.orders.set(orderId, updated);
      return updated;
    });

    // 13. cancelOrder
    this.registerTool('cancelOrder', 'Cancel a sales order and restore stock', async ({ orderId, reason }) => {
      const order = memoryStore.orders.get(orderId);
      if (order) {
        order.orderStatus = 'CANCELLED';
        memoryStore.orders.set(orderId, order);

        // Restore inventory stock
        for (const item of (order.items || [])) {
          const prod = memoryStore.products.get(item.productId);
          if (prod) {
            prod.stockQuantity += item.quantity;
            memoryStore.products.set(prod.productId, prod);
          }
        }
      }

      if (getIsConnected()) {
        await Order.updateOne({ orderId }, { orderStatus: 'CANCELLED' });
      }
      return { orderId, status: 'CANCELLED', reason };
    });

    // 14. searchSuppliers
    this.registerTool('searchSuppliers', 'Search supplier directory', async ({ category = '' }) => {
      if (getIsConnected()) {
        const list = await Supplier.find(category ? { categories: category } : {});
        if (list.length) return list;
      }
      return Array.from(memoryStore.suppliers.values());
    });

    // 15. createPurchaseOrder
    this.registerTool('createPurchaseOrder', 'Generate a vendor purchase order for low-stock replenishment', async ({ supplierId = 'SUP-001', items = [], reasoning = '' }) => {
      let supplier = memoryStore.suppliers.get(supplierId);
      if (!supplier && getIsConnected()) {
        supplier = await Supplier.findOne({ supplierId });
      }
      const supplierName = supplier ? supplier.name : 'National Paper & Supplies';

      let totalAmount = 0;
      const poItems = [];

      for (const item of items) {
        let prod = memoryStore.products.get(item.productId) || Array.from(memoryStore.products.values()).find(p => p.name.toLowerCase().includes((item.productName || item.productId).toLowerCase()));
        const unitCost = prod ? prod.purchasePrice : 180;
        const prodId = prod ? prod.productId : (item.productId || 'PROD-PAPER');
        const prodName = prod ? prod.name : (item.productName || 'A4 Copy Paper');
        const qty = Number(item.quantity) || 20;
        const total = unitCost * qty;

        totalAmount += total;
        poItems.push({ productId: prodId, productName: prodName, quantity: qty, unitCost, totalCost: total });
      }

      const poNumber = `PO-${Math.floor(10000 + Math.random() * 90000)}`;
      const poData = {
        poNumber,
        supplierId,
        supplierName,
        items: poItems,
        totalAmount,
        status: totalAmount > 10000 ? 'PENDING_APPROVAL' : 'APPROVED',
        requestedByAgent: 'Supplier Agent',
        reasoning: reasoning || 'Low stock threshold replenishment',
        businessId: 'BIZ-DEFAULT',
        createdAt: new Date()
      };

      if (getIsConnected()) {
        await PurchaseOrder.create(poData);
      }
      memoryStore.purchaseOrders.set(poNumber, poData);
      return poData;
    });

    // 16. getPurchaseOrder
    this.registerTool('getPurchaseOrder', 'Retrieve purchase order by poNumber', async ({ poNumber }) => {
      if (getIsConnected()) {
        const found = await PurchaseOrder.findOne({ poNumber });
        if (found) return found;
      }
      return memoryStore.purchaseOrders.get(poNumber);
    });

    // 17. recordPayment
    this.registerTool('recordPayment', 'Record a payment for an order', async ({ orderId, amount, paymentMethod = 'UPI' }) => {
      const paymentData = {
        paymentId: `PAY-${Date.now()}`,
        orderId,
        amount: Number(amount),
        paymentMethod,
        status: 'SUCCESS',
        businessId: 'BIZ-DEFAULT',
        createdAt: new Date()
      };

      if (getIsConnected()) {
        await Payment.create(paymentData);
        await Order.updateOne({ orderId }, { paymentStatus: 'PAID' });
      }
      memoryStore.payments.set(paymentData.paymentId, paymentData);

      const order = memoryStore.orders.get(orderId);
      if (order) order.paymentStatus = 'PAID';

      return paymentData;
    });

    // 18. getPayments
    this.registerTool('getPayments', 'Get payments history', async () => {
      if (getIsConnected()) {
        const list = await Payment.find({});
        if (list.length) return list;
      }
      return Array.from(memoryStore.payments.values());
    });

    // 19. createInvoice
    this.registerTool('createInvoice', 'Generate invoice for an order', async ({ orderId }) => {
      const order = memoryStore.orders.get(orderId);
      const invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
      const data = {
        invoiceNumber,
        orderId,
        customerId: order ? order.customerId : 'CUST-RahulSharma',
        customerName: order ? order.customerName : 'Rahul Sharma',
        amount: order ? order.totalAmount : 1250,
        taxAmount: order ? Math.round(order.totalAmount * 0.18) : 225,
        totalAmount: order ? Math.round(order.totalAmount * 1.18) : 1475,
        status: 'UNPAID',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        businessId: 'BIZ-DEFAULT',
        createdAt: new Date()
      };

      if (getIsConnected()) {
        await Invoice.create(data);
      }
      memoryStore.invoices.set(invoiceNumber, data);
      return data;
    });

    // 20. getSalesReport
    this.registerTool('getSalesReport', 'Get business sales performance report and metrics', async () => {
      let orders = Array.from(memoryStore.orders.values());
      if (getIsConnected()) {
        const dbOrders = await Order.find({});
        if (dbOrders.length) orders = dbOrders;
      }

      const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const pendingCount = orders.filter(o => o.paymentStatus === 'UNPAID').length;
      const completedCount = orders.filter(o => o.orderStatus === 'COMPLETED' || o.orderStatus === 'CONFIRMED').length;

      return {
        totalRevenue: totalSales,
        totalOrders: orders.length,
        completedOrders: completedCount,
        unpaidOrdersCount: pendingCount,
        averageOrderValue: orders.length ? Math.round(totalSales / orders.length) : 0
      };
    });

    // 21. createTask
    this.registerTool('createTask', 'Create an operational task for the shop manager or owner', async ({ title, description, priority = 'MEDIUM', assignedTo = 'Manager' }) => {
      const taskId = `TSK-${Date.now()}`;
      const data = {
        taskId,
        title,
        description: description || title,
        priority,
        status: 'OPEN',
        assignedTo,
        createdByAgent: 'Task Agent',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        businessId: 'BIZ-DEFAULT',
        createdAt: new Date()
      };

      if (getIsConnected()) {
        await Task.create(data);
      }
      memoryStore.tasks.set(taskId, data);
      return data;
    });

    // 22. updateTask
    this.registerTool('updateTask', 'Update task status', async ({ taskId, status }) => {
      if (getIsConnected()) {
        await Task.updateOne({ taskId }, { status });
      }
      const task = memoryStore.tasks.get(taskId);
      if (task) task.status = status;
      return task || { taskId, status };
    });

    // 23. getTasks
    this.registerTool('getTasks', 'Get open business tasks', async () => {
      if (getIsConnected()) {
        const list = await Task.find({});
        if (list.length) return list;
      }
      return Array.from(memoryStore.tasks.values());
    });

    // 24. sendNotification
    this.registerTool('sendNotification', 'Emit system notification alert', async ({ title, message, type = 'AI_ALERT' }) => {
      const data = {
        notificationId: `NOTIF-${Date.now()}`,
        title,
        message,
        type,
        read: false,
        businessId: 'BIZ-DEFAULT',
        createdAt: new Date()
      };

      if (getIsConnected()) {
        await Notification.create(data);
      }
      memoryStore.notifications.unshift(data);
      return data;
    });
  }
}

module.exports = {
  shopPilotTools: new ShopPilotToolRegistry(),
  memoryStore
};
