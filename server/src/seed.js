const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Company = require('./models/Company');
const Incident = require('./models/Incident');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const Payment = require('./models/Payment');
const Shipment = require('./models/Shipment');
const Inventory = require('./models/Inventory');
const Policy = require('./models/Policy');
const { memoryStore } = require('./services/tools/ToolRegistry');
const { getIsConnected } = require('./config/db');

const seedData = async () => {
  try {
    const connected = getIsConnected();

    // 1. Company
    const company = {
      companyId: 'COMP-DEFAULT',
      name: 'ResolveFlow Enterprise Operations',
      domain: 'resolveflow.ai',
      riskThreshold: 5000,
      automationLevel: 'AUTONOMOUS',
      settings: { autoApprovalEnabled: true, retryMaxAttempts: 3, escalationEmail: 'ops@resolveflow.ai' }
    };

    // 2. Admin User
    const adminUser = {
      name: 'Alex Rivera',
      email: 'admin@resolveflow.ai',
      password: 'password123',
      role: 'ADMIN',
      companyId: 'COMP-DEFAULT'
    };

    // 3. Customers
    const customers = [
      { customerId: 'CUST-RahulSharma', name: 'Rahul Sharma', email: 'rahul.sharma@example.com', phone: '+91 98765 43210', tier: 'VIP', lifetimeValue: 145000 },
      { customerId: 'CUST-PriyaPatel', name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 98123 45678', tier: 'ENTERPRISE', lifetimeValue: 320000 },
      { customerId: 'CUST-AmitVerma', name: 'Amit Verma', email: 'amit.v@example.com', phone: '+91 99887 76655', tier: 'STANDARD', lifetimeValue: 28000 },
      { customerId: 'CUST-SnehaReddy', name: 'Sneha Reddy', email: 'sneha.r@example.com', phone: '+91 97654 32109', tier: 'VIP', lifetimeValue: 98000 },
      { customerId: 'CUST-VikramSingh', name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 91234 56789', tier: 'STANDARD', lifetimeValue: 15000 }
    ];

    // 4. Orders
    const orders = [
      {
        orderId: '#4821',
        customerId: 'CUST-RahulSharma',
        items: [{ sku: 'SKU-LAPTOP-X1', name: 'Enterprise UltraBook X1', quantity: 1, price: 25000 }],
        totalAmount: 25000,
        currency: 'INR',
        orderStatus: 'DELAYED',
        paymentStatus: 'PAID',
        shipmentStatus: 'DELAYED',
        orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        orderId: '#4822',
        customerId: 'CUST-PriyaPatel',
        items: [{ sku: 'SKU-MONITOR-4K', name: 'UltraWide 4K Monitor', quantity: 2, price: 34000 }],
        totalAmount: 68000,
        currency: 'INR',
        orderStatus: 'PROCESSING',
        paymentStatus: 'PAID',
        shipmentStatus: 'IN_TRANSIT'
      },
      {
        orderId: '#4823',
        customerId: 'CUST-AmitVerma',
        items: [{ sku: 'SKU-KEYBOARD-MECH', name: 'Pro Wireless Mechanical Keyboard', quantity: 1, price: 4500 }],
        totalAmount: 4500,
        currency: 'INR',
        orderStatus: 'DELAYED',
        paymentStatus: 'PAID',
        shipmentStatus: 'DELAYED'
      }
    ];

    // 5. Payments
    const payments = [
      { paymentId: 'PAY-4821', orderId: '#4821', customerId: 'CUST-RahulSharma', amount: 25000, method: 'UPI', status: 'SUCCESS', transactionRef: 'TXN-UPI-98230192' },
      { paymentId: 'PAY-4822', orderId: '#4822', customerId: 'CUST-PriyaPatel', amount: 68000, method: 'CREDIT_CARD', status: 'SUCCESS', transactionRef: 'TXN-CC-11029384' },
      { paymentId: 'PAY-4823', orderId: '#4823', customerId: 'CUST-AmitVerma', amount: 4500, method: 'NET_BANKING', status: 'SUCCESS', transactionRef: 'TXN-NB-77263541' }
    ];

    // 6. Shipments
    const shipments = [
      {
        shipmentId: 'SHP-4821',
        orderId: '#4821',
        carrier: 'Bluedart Logistics',
        trackingNumber: 'BD98271039IN',
        status: 'DELAYED',
        delayDays: 4,
        originLocation: 'Warehouse Hub - Mumbai',
        destinationLocation: 'Bengaluru South',
        lastKnownLocation: 'Transit Hub - Hyderabad (Stuck)'
      },
      {
        shipmentId: 'SHP-4823',
        orderId: '#4823',
        carrier: 'Delhivery Express',
        trackingNumber: 'DEL8819203IN',
        status: 'DELAYED',
        delayDays: 5,
        originLocation: 'Warehouse Hub - Delhi',
        destinationLocation: 'Pune East',
        lastKnownLocation: 'Hub - Mumbai'
      }
    ];

    // 7. Inventory
    const inventoryItems = [
      { sku: 'SKU-LAPTOP-X1', name: 'Enterprise UltraBook X1', stockLevel: 42, reservedStock: 3, reorderPoint: 10, warehouseLocation: 'WH-01-BOM' },
      { sku: 'SKU-MONITOR-4K', name: 'UltraWide 4K Monitor', stockLevel: 18, reservedStock: 2, reorderPoint: 5, warehouseLocation: 'WH-02-DEL' },
      { sku: 'SKU-KEYBOARD-MECH', name: 'Pro Wireless Mechanical Keyboard', stockLevel: 120, reservedStock: 12, reorderPoint: 20, warehouseLocation: 'WH-01-BOM' }
    ];

    // 8. Policies
    const policies = [
      {
        policyId: 'POL-REFUND-001',
        title: 'Standard Delivery Delay Refund Policy',
        category: 'REFUND',
        maxDelayDaysForRefund: 3,
        maxRefundAmountAuto: 5000,
        rules: [
          'Order delayed > 3 days is eligible for 100% full refund.',
          'Refunds > ₹5,000 require human operator confirmation.',
          'Automatic customer notification email and SMS upon approval.'
        ],
        description: 'Governs customer eligibility for delayed shipment refunds.'
      }
    ];

    // 9. Incidents
    const incidents = [
      {
        incidentId: 'INC-4821',
        title: 'Delayed Order #4821 - Customer Requesting Refund',
        description: 'Order #4821 has been delayed for 4 days and the customer wants a refund.',
        category: 'DELIVERY_DELAY',
        priority: 'HIGH',
        status: 'OPEN',
        customerId: 'CUST-RahulSharma',
        customerName: 'Rahul Sharma',
        orderId: '#4821',
        assignedAgents: ['Planner', 'Order', 'Payment', 'Delivery', 'Policy', 'Decision', 'Action', 'Verification', 'Communication']
      },
      {
        incidentId: 'INC-4822',
        title: 'High-Value Display Order Shipping Exception',
        description: 'Shipment #SHP-4822 delayed in transit; customer tier: ENTERPRISE.',
        category: 'DELIVERY_DELAY',
        priority: 'CRITICAL',
        status: 'OPEN',
        customerId: 'CUST-PriyaPatel',
        customerName: 'Priya Patel',
        orderId: '#4822',
        assignedAgents: ['Planner', 'Order', 'Delivery', 'Decision']
      },
      {
        incidentId: 'INC-4823',
        title: 'Keyboard Delivery Exceeded SLA Threshold',
        description: 'Order #4823 delayed 5 days. Eligible for auto-refund under ₹5,000.',
        category: 'REFUND_REQUEST',
        priority: 'MEDIUM',
        status: 'OPEN',
        customerId: 'CUST-AmitVerma',
        customerName: 'Amit Verma',
        orderId: '#4823',
        assignedAgents: ['Planner', 'Order', 'Policy', 'Action']
      },
      {
        incidentId: 'INC-4820',
        title: 'Payment Gateway Double Charge Reconciliation',
        description: 'Duplicate transaction detected on Payment gateway #PAY-4820.',
        category: 'PAYMENT_FAILURE',
        priority: 'HIGH',
        status: 'RESOLVED',
        customerId: 'CUST-SnehaReddy',
        customerName: 'Sneha Reddy',
        orderId: '#4820',
        resolutionSummary: 'Duplicate transaction refunded automatically via Payment Agent.',
        confidenceScore: 98
      }
    ];

    // Populate Mongo if connected (only if database is empty or explicit seed command)
    if (connected) {
      try {
        const existingCount = await Company.countDocuments();
        if (existingCount === 0 || process.argv.includes('--force')) {
          await Company.deleteMany({});
          await User.deleteMany({});
          await Customer.deleteMany({});
          await Order.deleteMany({});
          await Payment.deleteMany({});
          await Shipment.deleteMany({});
          await Inventory.deleteMany({});
          await Policy.deleteMany({});
          await Incident.deleteMany({});

          await Company.create(company);
          await User.create(adminUser);
          await Customer.insertMany(customers);
          await Order.insertMany(orders);
          await Payment.insertMany(payments);
          await Shipment.insertMany(shipments);
          await Inventory.insertMany(inventoryItems);
          await Policy.insertMany(policies);
          await Incident.insertMany(incidents);
          console.log('Seed: Initial demo dataset populated in MongoDB Atlas!');
        } else {
          console.log('Seed Notice: Database already populated in MongoDB. Preserving existing production data.');
        }
      } catch (e) {
        console.warn('Seed Mongo Insert Error:', e.message);
      }
    }

    // Populate memoryStore always
    customers.forEach(c => memoryStore.customers.set(c.customerId, c));
    orders.forEach(o => memoryStore.orders.set(o.orderId, o));
    payments.forEach(p => memoryStore.payments.set(p.paymentId, p));
    shipments.forEach(s => memoryStore.shipments.set(s.shipmentId, s));
    inventoryItems.forEach(i => memoryStore.inventory.set(i.sku, i));
    policies.forEach(pol => memoryStore.policies.set(pol.policyId, pol));
    incidents.forEach(inc => memoryStore.incidents.set(inc.incidentId, inc));

    console.log(`Seed: Loaded ${memoryStore.incidents.size} incidents, ${memoryStore.orders.size} orders into ResolveFlow Memory Engine.`);

  } catch (err) {
    console.error('Seed Error:', err);
  }
};

module.exports = seedData;
