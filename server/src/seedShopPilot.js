const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Supplier = require('./models/Supplier');
const Order = require('./models/Order');
const Task = require('./models/Task');
const Business = require('./models/Business');
const { getIsConnected } = require('./config/db');
const { memoryStore } = require('./services/tools/ShopPilotToolRegistry');

const seedShopPilotData = async () => {
  console.log('[ShopPilotSeed] Initializing realistic SME shop business data...');

  const businessData = {
    businessId: 'BIZ-DEFAULT',
    name: 'Metro Stationers & Electronics',
    businessType: 'Retail & Office Supplies',
    currency: 'INR',
    currencySymbol: '₹',
    taxRate: 18,
    lowStockThreshold: 10,
    autoPurchaseApprovalLimit: 10000,
    ownerEmail: 'owner@shoppilot.ai'
  };

  const products = [
    {
      productId: 'PROD-PAPER-A4',
      sku: 'SKU-PAPER-A4',
      name: 'A4 Copy Paper (500 Sheets)',
      category: 'Paper & Stationery',
      stockQuantity: 4, // LOW STOCK (min 10)
      minStock: 10,
      maxStock: 50,
      purchasePrice: 180,
      sellingPrice: 250,
      supplierId: 'SUP-001',
      supplierName: 'National Paper & Stationers',
      businessId: 'BIZ-DEFAULT'
    },
    {
      productId: 'PROD-PEN-BLUE',
      sku: 'SKU-PEN-BLUE',
      name: 'Blue Ballpoint Pens (Box of 50)',
      category: 'Paper & Stationery',
      stockQuantity: 7, // LOW STOCK (min 20)
      minStock: 20,
      maxStock: 100,
      purchasePrice: 350,
      sellingPrice: 499,
      supplierId: 'SUP-001',
      supplierName: 'National Paper & Stationers',
      businessId: 'BIZ-DEFAULT'
    },
    {
      productId: 'PROD-INK-BLACK',
      sku: 'SKU-INK-BLACK',
      name: 'Printer Ink Cartridge (Black HP-680)',
      category: 'Electronics & Accessories',
      stockQuantity: 2, // LOW STOCK (min 5)
      minStock: 5,
      maxStock: 20,
      purchasePrice: 850,
      sellingPrice: 1250,
      supplierId: 'SUP-002',
      supplierName: 'TechGear Electronics Wholesale',
      businessId: 'BIZ-DEFAULT'
    },
    {
      productId: 'PROD-LAPTOP-X1',
      sku: 'SKU-LAPTOP-X1',
      name: 'Enterprise UltraBook X1',
      category: 'Laptops & Computers',
      stockQuantity: 15,
      minStock: 5,
      maxStock: 30,
      purchasePrice: 42000,
      sellingPrice: 55000,
      supplierId: 'SUP-002',
      supplierName: 'TechGear Electronics Wholesale',
      businessId: 'BIZ-DEFAULT'
    },
    {
      productId: 'PROD-MOUSE-WIRELESS',
      sku: 'SKU-MOUSE-W',
      name: 'Wireless Ergonomic Optical Mouse',
      category: 'Electronics & Accessories',
      stockQuantity: 25,
      minStock: 10,
      maxStock: 60,
      purchasePrice: 450,
      sellingPrice: 799,
      supplierId: 'SUP-002',
      supplierName: 'TechGear Electronics Wholesale',
      businessId: 'BIZ-DEFAULT'
    }
  ];

  const customers = [
    {
      customerId: 'CUST-RahulSharma',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      address: 'Indiranagar 100ft Road, Bengaluru',
      totalPurchases: 145000,
      outstandingAmount: 0,
      businessId: 'BIZ-DEFAULT'
    },
    {
      customerId: 'CUST-PriyaPatel',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 98123 45678',
      address: 'MG Road Commercial Complex, Mumbai',
      totalPurchases: 68000,
      outstandingAmount: 1250,
      businessId: 'BIZ-DEFAULT'
    },
    {
      customerId: 'CUST-AlexRivera',
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      phone: '+91 97654 32109',
      address: 'Cyber City Tech Park, Gurgaon',
      totalPurchases: 250000,
      outstandingAmount: 0,
      businessId: 'BIZ-DEFAULT'
    }
  ];

  const suppliers = [
    {
      supplierId: 'SUP-001',
      name: 'National Paper & Stationers',
      contactPerson: 'Vikram Mehta',
      email: 'orders@nationalpaper.co.in',
      phone: '+91 98200 11223',
      address: 'Chawri Bazar Wholesale Market, New Delhi',
      categories: ['Paper & Stationery'],
      businessId: 'BIZ-DEFAULT'
    },
    {
      supplierId: 'SUP-002',
      name: 'TechGear Electronics Wholesale',
      contactPerson: 'Suresh Kumar',
      email: 'sales@techgeardistributors.com',
      phone: '+91 98440 99887',
      address: 'Lamington Road IT Hub, Mumbai',
      categories: ['Electronics & Accessories', 'Laptops & Computers'],
      businessId: 'BIZ-DEFAULT'
    }
  ];

  const orders = [
    {
      orderId: 'ORD-1024',
      orderNumber: '#1024',
      customerId: 'CUST-RahulSharma',
      customerName: 'Rahul Sharma',
      items: [{ productId: 'PROD-PAPER-A4', productName: 'A4 Copy Paper (500 Sheets)', quantity: 5, price: 250 }],
      totalAmount: 1250,
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      businessId: 'BIZ-DEFAULT',
      createdAt: new Date()
    },
    {
      orderId: 'ORD-1025',
      orderNumber: '#1025',
      customerId: 'CUST-PriyaPatel',
      customerName: 'Priya Patel',
      items: [{ productId: 'PROD-INK-BLACK', productName: 'Printer Ink Cartridge (Black HP-680)', quantity: 1, price: 1250 }],
      totalAmount: 1250,
      paymentStatus: 'UNPAID',
      orderStatus: 'PROCESSING',
      businessId: 'BIZ-DEFAULT',
      createdAt: new Date()
    }
  ];

  const tasks = [
    {
      taskId: 'TSK-101',
      title: 'Follow up with National Paper on A4 paper shipment',
      description: 'Check estimated arrival date for pending paper stock.',
      priority: 'HIGH',
      status: 'OPEN',
      assignedTo: 'Manager',
      createdByAgent: 'Inventory Agent',
      businessId: 'BIZ-DEFAULT'
    },
    {
      taskId: 'TSK-102',
      title: 'Send payment reminder to Priya Patel for Order #1025',
      description: 'Unpaid order #1025 amount ₹1,250 pending since yesterday.',
      priority: 'MEDIUM',
      status: 'OPEN',
      assignedTo: 'Manager',
      createdByAgent: 'Finance Agent',
      businessId: 'BIZ-DEFAULT'
    }
  ];

  // Populate Mongoose if connected
  if (getIsConnected()) {
    try {
      await Business.deleteMany({});
      await Product.deleteMany({});
      await Customer.deleteMany({});
      await Supplier.deleteMany({});
      await Order.deleteMany({});
      await Task.deleteMany({});

      await Business.create(businessData);
      await Product.insertMany(products);
      await Customer.insertMany(customers);
      await Supplier.insertMany(suppliers);
      await Order.insertMany(orders);
      await Task.insertMany(tasks);
      console.log('[ShopPilotSeed] MongoDB Seeded Successfully!');
    } catch (e) {
      console.warn('[ShopPilotSeed] MongoDB seed warning:', e.message);
    }
  }

  // Populate Memory Store
  products.forEach(p => memoryStore.products.set(p.productId, p));
  customers.forEach(c => memoryStore.customers.set(c.customerId, c));
  suppliers.forEach(s => memoryStore.suppliers.set(s.supplierId, s));
  orders.forEach(o => memoryStore.orders.set(o.orderId, o));
  tasks.forEach(t => memoryStore.tasks.set(t.taskId, t));

  console.log(`[ShopPilotSeed] Loaded ${products.length} products, ${customers.length} customers, ${orders.length} orders into Memory Engine.`);
};

module.exports = seedShopPilotData;
