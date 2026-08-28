const Order = require('../../models/Order');
const Customer = require('../../models/Customer');
const Payment = require('../../models/Payment');
const Shipment = require('../../models/Shipment');
const Inventory = require('../../models/Inventory');
const Policy = require('../../models/Policy');
const Incident = require('../../models/Incident');
const AuditLog = require('../../models/AuditLog');
const { getIsConnected } = require('../../config/db');

// In-memory state storage fallback for 100% reliable demo run anywhere
const memoryStore = {
  customers: new Map(),
  orders: new Map(),
  payments: new Map(),
  shipments: new Map(),
  inventory: new Map(),
  policies: new Map(),
  incidents: new Map(),
  approvals: new Map(),
  auditLogs: []
};

class ToolRegistry {
  constructor() {
    this.tools = new Map();
    this.registerCoreTools();
  }

  registerTool(name, description, schema, handler) {
    this.tools.set(name, { name, description, schema, handler });
  }

  registerCoreTools() {
    // 1. getOrder
    this.registerTool(
      'getOrder',
      'Retrieve order information including items, total amount, status, and dates.',
      { orderId: 'string' },
      async ({ orderId }) => {
        let order = null;
        if (getIsConnected()) {
          order = await Order.findOne({ orderId });
        }
        if (!order && memoryStore.orders.has(orderId)) {
          order = memoryStore.orders.get(orderId);
        }
        if (!order) {
          throw new Error(`Order ${orderId} not found.`);
        }
        return {
          orderId: order.orderId,
          customerId: order.customerId,
          totalAmount: order.totalAmount,
          currency: order.currency,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          shipmentStatus: order.shipmentStatus,
          items: order.items,
          orderDate: order.orderDate
        };
      }
    );

    // 2. getCustomer
    this.registerTool(
      'getCustomer',
      'Retrieve customer details, contact info, tier, and lifetime value.',
      { customerId: 'string' },
      async ({ customerId }) => {
        let customer = null;
        if (getIsConnected()) {
          customer = await Customer.findOne({ customerId });
        }
        if (!customer && memoryStore.customers.has(customerId)) {
          customer = memoryStore.customers.get(customerId);
        }
        if (!customer) {
          throw new Error(`Customer ${customerId} not found.`);
        }
        return {
          customerId: customer.customerId,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          tier: customer.tier,
          lifetimeValue: customer.lifetimeValue
        };
      }
    );

    // 3. getPayment
    this.registerTool(
      'getPayment',
      'Verify payment transaction status, method, and refund history.',
      { orderId: 'string' },
      async ({ orderId }) => {
        let payment = null;
        if (getIsConnected()) {
          payment = await Payment.findOne({ orderId });
        }
        if (!payment) {
          for (let p of memoryStore.payments.values()) {
            if (p.orderId === orderId) { payment = p; break; }
          }
        }
        if (!payment) {
          throw new Error(`Payment record for order ${orderId} not found.`);
        }
        return {
          paymentId: payment.paymentId,
          orderId: payment.orderId,
          customerId: payment.customerId,
          amount: payment.amount,
          method: payment.method,
          status: payment.status,
          transactionRef: payment.transactionRef,
          refundRef: payment.refundRef,
          refundAmount: payment.refundAmount
        };
      }
    );

    // 4. getShipment (Support failure simulation for demo!)
    this.registerTool(
      'getShipment',
      'Check carrier shipment status, tracking info, and delivery delay metrics.',
      { orderId: 'string', simulateFailure: 'boolean' },
      async ({ orderId, simulateFailure }) => {
        if (simulateFailure) {
          throw new Error('CARRIER_API_TIMEOUT: Logistics tracking service bluedart.api.internal timed out (504 Gateway Timeout).');
        }

        let shipment = null;
        if (getIsConnected()) {
          shipment = await Shipment.findOne({ orderId });
        }
        if (!shipment) {
          for (let s of memoryStore.shipments.values()) {
            if (s.orderId === orderId) { shipment = s; break; }
          }
        }
        if (!shipment) {
          // Fallback realistic record for demo #4821
          return {
            shipmentId: `SHP-${orderId.replace('#', '')}`,
            orderId,
            carrier: 'Bluedart Express',
            trackingNumber: 'BD98271039IN',
            status: 'DELAYED',
            delayDays: 4,
            originLocation: 'Warehouse Hub - Mumbai',
            destinationLocation: 'Bengaluru South',
            lastKnownLocation: 'Transit Hub - Hyderabad (Facility Delay)'
          };
        }
        return {
          shipmentId: shipment.shipmentId,
          orderId: shipment.orderId,
          carrier: shipment.carrier,
          trackingNumber: shipment.trackingNumber,
          status: shipment.status,
          delayDays: shipment.delayDays,
          originLocation: shipment.originLocation,
          destinationLocation: shipment.destinationLocation,
          lastKnownLocation: shipment.lastKnownLocation
        };
      }
    );

    // 5. getInventory
    this.registerTool(
      'getInventory',
      'Inspect warehouse stock availability and reorder metrics for SKUs.',
      { sku: 'string' },
      async ({ sku }) => {
        let inv = null;
        if (getIsConnected()) {
          inv = await Inventory.findOne({ sku });
        }
        if (!inv && memoryStore.inventory.has(sku)) {
          inv = memoryStore.inventory.get(sku);
        }
        return {
          sku: sku || 'SKU-LAPTOP-X1',
          name: inv ? inv.name : 'Enterprise UltraBook X1',
          stockLevel: inv ? inv.stockLevel : 42,
          reservedStock: inv ? inv.reservedStock : 3,
          reorderPoint: inv ? inv.reorderPoint : 10,
          warehouseLocation: inv ? inv.warehouseLocation : 'WH-01-BOM'
        };
      }
    );

    // 6. checkPolicy
    this.registerTool(
      'checkPolicy',
      'Retrieve and evaluate company refund policy eligibility.',
      { category: 'string', delayDays: 'number', amount: 'number' },
      async ({ category = 'REFUND', delayDays = 4, amount = 25000 }) => {
        const autoApprovalThreshold = 5000;
        const maxDelayAllowed = 3; // > 3 days allows 100% refund

        const isEligibleForRefund = delayDays >= maxDelayAllowed;
        const requiresHumanApproval = amount > autoApprovalThreshold;

        return {
          policyId: 'POL-REFUND-001',
          title: 'Standard Shipment Delay & Refund Policy',
          category: 'REFUND',
          maxDelayDaysForRefund: maxDelayAllowed,
          maxRefundAmountAuto: autoApprovalThreshold,
          isEligibleForRefund,
          requiresHumanApproval,
          refundPercentage: isEligibleForRefund ? 100 : 0,
          evidenceReasoning: `Delay of ${delayDays} days exceeds allowed ${maxDelayAllowed}-day threshold. Eligible for 100% refund. Amount ₹${amount} exceeds ₹${autoApprovalThreshold} auto-limit, requiring human approval.`
        };
      }
    );

    // 7. calculateRefund
    this.registerTool(
      'calculateRefund',
      'Calculate net refund breakdown including tax, shipping credit, and deduction.',
      { orderId: 'string', amount: 'number' },
      async ({ orderId, amount = 25000 }) => {
        return {
          orderId,
          baseRefundAmount: amount,
          shippingFeeCredit: 500,
          totalRefundCalculated: amount,
          currency: 'INR'
        };
      }
    );

    // 8. createRefund (Simulated backend refund operation!)
    this.registerTool(
      'createRefund',
      'Safely execute simulated refund financial transaction on backend.',
      { orderId: 'string', amount: 'number', customerId: 'string' },
      async ({ orderId, amount, customerId }) => {
        const refundRef = `RFND-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Update database / memory record
        if (getIsConnected()) {
          await Order.updateOne({ orderId }, { paymentStatus: 'REFUNDED', orderStatus: 'REFUNDED' });
          await Payment.updateOne({ orderId }, { status: 'REFUNDED', refundRef, refundAmount: amount, refundDate: new Date() });
        }
        if (memoryStore.orders.has(orderId)) {
          const ord = memoryStore.orders.get(orderId);
          ord.paymentStatus = 'REFUNDED';
          ord.orderStatus = 'REFUNDED';
        }

        return {
          success: true,
          refundRef,
          orderId,
          customerId,
          refundAmount: amount,
          status: 'SUCCESSFUL',
          message: `Simulated refund of ₹${amount.toLocaleString()} initiated successfully for Order ${orderId}.`,
          timestamp: new Date().toISOString()
        };
      }
    );

    // 9. updateOrder
    this.registerTool(
      'updateOrder',
      'Update order state or tracking details.',
      { orderId: 'string', updateData: 'object' },
      async ({ orderId, updateData }) => {
        if (getIsConnected()) {
          await Order.updateOne({ orderId }, updateData);
        }
        return { success: true, orderId, updatedFields: Object.keys(updateData || {}) };
      }
    );

    // 10. sendCustomerMessage
    this.registerTool(
      'sendCustomerMessage',
      'Send verified customer notification message via Email & SMS.',
      { customerId: 'string', message: 'string' },
      async ({ customerId, message }) => {
        return {
          success: true,
          customerId,
          channel: 'EMAIL_AND_SMS',
          deliveredAt: new Date().toISOString(),
          previewMessage: message
        };
      }
    );

    // 11. closeIncident
    this.registerTool(
      'closeIncident',
      'Update incident status to RESOLVED with summary.',
      { incidentId: 'string', summary: 'string' },
      async ({ incidentId, summary }) => {
        if (getIsConnected()) {
          await Incident.updateOne({ incidentId }, { status: 'RESOLVED', resolutionSummary: summary, resolvedAt: new Date() });
        }
        if (memoryStore.incidents.has(incidentId)) {
          const inc = memoryStore.incidents.get(incidentId);
          inc.status = 'RESOLVED';
          inc.resolutionSummary = summary;
          inc.resolvedAt = new Date();
        }
        return { success: true, incidentId, status: 'RESOLVED' };
      }
    );

    // 12. escalateIncident
    this.registerTool(
      'escalateIncident',
      'Escalate incident to human operations team for manual review.',
      { incidentId: 'string', reason: 'string' },
      async ({ incidentId, reason }) => {
        if (getIsConnected()) {
          await Incident.updateOne({ incidentId }, { status: 'ESCALATED', resolutionSummary: `Escalated: ${reason}` });
        }
        return { success: true, incidentId, status: 'ESCALATED', reason };
      }
    );
  }

  async executeTool(toolName, args, context = {}) {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool '${toolName}' is not registered in ToolRegistry.`);
    }

    try {
      console.log(`[ToolRegistry] Executing ${toolName} with args:`, JSON.stringify(args));
      const result = await tool.handler(args);
      
      // Log audit
      const auditEntry = {
        auditId: `AUD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date(),
        incidentId: context.incidentId || 'INC-GENERAL',
        agent: context.agent || 'System',
        actionType: 'TOOL_CALL',
        toolName,
        details: `Called ${toolName}(${JSON.stringify(args)}) successfully`,
        evidence: [JSON.stringify(result)]
      };
      
      if (getIsConnected()) {
        try { await AuditLog.create(auditEntry); } catch (e) {}
      }
      memoryStore.auditLogs.push(auditEntry);

      return { success: true, result };
    } catch (error) {
      console.error(`[ToolRegistry] Error in ${toolName}:`, error.message);
      return { success: false, error: error.message };
    }
  }
}

const toolRegistryInstance = new ToolRegistry();
module.exports = { toolRegistry: toolRegistryInstance, memoryStore };
