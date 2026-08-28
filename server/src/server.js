const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('./config/db');
const seedData = require('./seed');
const seedShopPilotData = require('./seedShopPilot');

const authRoutes = require('./routes/auth.routes');
const shoppilotRoutes = require('./routes/shoppilot.routes');
const productRoutes = require('./routes/products.routes');
const orderRoutes = require('./routes/orders.routes');
const supplierRoutes = require('./routes/suppliers.routes');
const taskRoutes = require('./routes/tasks.routes');
const customerRoutes = require('./routes/customers.routes');
const incidentRoutes = require('./routes/incidents.routes');
const approvalRoutes = require('./routes/approvals.routes');
const agentRoutes = require('./routes/agents.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const settingsRoutes = require('./routes/settings.routes');
const commandRoutes = require('./routes/command.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// ShopPilot AI Core Routes
app.use('/api/shoppilot', shoppilotRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/customers', customerRoutes);

// Shared Legacy & Operational System Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/commands', commandRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'ShopPilot AI Enterprise Operations Platform',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  await seedData();
  await seedShopPilotData();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 SHOPPILOT AI SERVER RUNNING ON PORT ${PORT}`);
    console.log(`Tagline: "Your autonomous AI assistant for everyday business operations."`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });
};

startServer();
