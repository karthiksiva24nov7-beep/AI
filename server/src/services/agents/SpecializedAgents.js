const { toolRegistry } = require('../tools/ToolRegistry');
const aiService = require('../ai/AIService');

class PlannerAgent {
  async execute(goal, incidentDetails) {
    const plan = await aiService.createExecutionPlan(goal, incidentDetails);
    return {
      agent: 'Planner Agent',
      status: 'COMPLETED',
      plan
    };
  }
}

class OrderAgent {
  async execute(orderId, customerId, context = {}) {
    const orderRes = await toolRegistry.executeTool('getOrder', { orderId }, context);
    const custRes = await toolRegistry.executeTool('getCustomer', { customerId }, context);

    if (!orderRes.success) throw new Error(orderRes.error);
    if (!custRes.success) throw new Error(custRes.error);

    return {
      agent: 'Order Agent',
      status: 'COMPLETED',
      order: orderRes.result,
      customer: custRes.result
    };
  }
}

class PaymentAgent {
  async execute(orderId, context = {}) {
    const paymentRes = await toolRegistry.executeTool('getPayment', { orderId }, context);
    if (!paymentRes.success) throw new Error(paymentRes.error);

    return {
      agent: 'Payment Agent',
      status: 'COMPLETED',
      payment: paymentRes.result
    };
  }
}

class DeliveryAgent {
  async execute(orderId, simulateFailure = false, context = {}) {
    const deliveryRes = await toolRegistry.executeTool('getShipment', { orderId, simulateFailure }, context);
    if (!deliveryRes.success) {
      throw new Error(deliveryRes.error);
    }

    return {
      agent: 'Delivery Agent',
      status: 'COMPLETED',
      shipment: deliveryRes.result
    };
  }
}

class InventoryAgent {
  async execute(sku = 'SKU-LAPTOP-X1', context = {}) {
    const invRes = await toolRegistry.executeTool('getInventory', { sku }, context);
    if (!invRes.success) throw new Error(invRes.error);

    return {
      agent: 'Inventory Agent',
      status: 'COMPLETED',
      inventory: invRes.result
    };
  }
}

class PolicyAgent {
  async execute(category, delayDays, amount, context = {}) {
    const policyRes = await toolRegistry.executeTool('checkPolicy', { category, delayDays, amount }, context);
    if (!policyRes.success) throw new Error(policyRes.error);

    return {
      agent: 'Policy Agent',
      status: 'COMPLETED',
      policy: policyRes.result
    };
  }
}

class DecisionAgent {
  async execute(evidenceData) {
    const decision = await aiService.makeDecision(evidenceData);
    return {
      agent: 'Decision Agent',
      status: 'COMPLETED',
      decision
    };
  }
}

class ActionAgent {
  async execute(orderId, amount, customerId, riskThreshold = 5000, context = {}) {
    if (amount > riskThreshold && !context.humanApproved) {
      return {
        agent: 'Action Agent',
        status: 'WAITING_APPROVAL',
        requiresApproval: true,
        riskLevel: 'HIGH',
        amount,
        reason: `Refund amount of ₹${amount.toLocaleString()} exceeds automatic limit of ₹${riskThreshold.toLocaleString()}. Human approval required before financial execution.`
      };
    }

    const refundRes = await toolRegistry.executeTool('createRefund', { orderId, amount, customerId }, context);
    if (!refundRes.success) throw new Error(refundRes.error);

    return {
      agent: 'Action Agent',
      status: 'COMPLETED',
      requiresApproval: false,
      result: refundRes.result
    };
  }
}

class VerificationAgent {
  async execute(orderId, context = {}) {
    const paymentRes = await toolRegistry.executeTool('getPayment', { orderId }, context);
    if (!paymentRes.success) throw new Error(paymentRes.error);

    const verified = paymentRes.result.status === 'REFUNDED';
    return {
      agent: 'Verification Agent',
      status: 'COMPLETED',
      verified,
      details: verified 
        ? `Refund of ₹${paymentRes.result.refundAmount.toLocaleString()} verified successfully in backend. Payment state is REFUNDED.` 
        : `Refund status check returned ${paymentRes.result.status}`
    };
  }
}

class CommunicationAgent {
  async execute(customerName, orderId, refundAmount, resolutionDetails, customerId, context = {}) {
    const message = await aiService.generateCustomerMessage(customerName, orderId, refundAmount, resolutionDetails);
    const msgRes = await toolRegistry.executeTool('sendCustomerMessage', { customerId, message }, context);

    return {
      agent: 'Communication Agent',
      status: 'COMPLETED',
      message,
      sentResult: msgRes.result
    };
  }
}

module.exports = {
  PlannerAgent: new PlannerAgent(),
  OrderAgent: new OrderAgent(),
  PaymentAgent: new PaymentAgent(),
  DeliveryAgent: new DeliveryAgent(),
  InventoryAgent: new InventoryAgent(),
  PolicyAgent: new PolicyAgent(),
  DecisionAgent: new DecisionAgent(),
  ActionAgent: new ActionAgent(),
  VerificationAgent: new VerificationAgent(),
  CommunicationAgent: new CommunicationAgent()
};
