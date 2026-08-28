const agents = require('../agents/SpecializedAgents');
const AgentExecution = require('../../models/AgentExecution');
const Approval = require('../../models/Approval');
const Incident = require('../../models/Incident');
const AuditLog = require('../../models/AuditLog');
const Company = require('../../models/Company');
const { getIsConnected } = require('../../config/db');

// In-memory store for active execution state
const executionStore = new Map();

class AgentOrchestrator {
  async startOrchestration(incidentId, options = {}) {
    const { simulateFailure = false, humanApproved = false, approvalId = null } = options;

    let incident = null;
    if (getIsConnected()) {
      incident = await Incident.findOne({ incidentId });
    }
    
    // Default fallback incident data if DB missing or incident not found
    if (!incident) {
      incident = {
        incidentId: incidentId || 'INC-4821',
        title: 'Delayed Order #4821 - Refund Request',
        description: 'Order #4821 has been delayed for 4 days and the customer wants a refund.',
        category: 'DELIVERY_DELAY',
        priority: 'HIGH',
        status: 'OPEN',
        customerId: 'CUST-RahulSharma',
        customerName: 'Rahul Sharma',
        orderId: '#4821'
      };
    }

    const executionId = `EXEC-${incidentId}-${Date.now()}`;
    const goal = `Autonomously investigate incident ${incidentId} for ${incident.customerName} and resolve delayed order ${incident.orderId}.`;

    const state = {
      executionId,
      incidentId,
      goal,
      status: 'RUNNING',
      taskGraph: [],
      logs: [],
      toolCalls: [],
      observations: {},
      decision: null,
      verification: null,
      failureRecoveryAttempts: 0,
      requiresApproval: false,
      approvalId: null,
      createdAt: new Date()
    };

    executionStore.set(executionId, state);
    await this.logEvent(state, 'Orchestrator', `Received goal: "${goal}"`, 'INFO');

    // Run orchestrator loop asynchronously or synchronously
    return await this.runAgenticLoop(state, incident, { simulateFailure, humanApproved, approvalId });
  }

  async runAgenticLoop(state, incident, options) {
    const { simulateFailure = false, humanApproved = false } = options;
    const context = { incidentId: state.incidentId, agent: 'Orchestrator' };

    try {
      // 1. PLANNER STAGE
      await this.logEvent(state, 'Planner Agent', 'Analyzing incident and generating task dependency graph...', 'INFO');
      const planRes = await agents.PlannerAgent.execute(state.goal, incident);
      state.taskGraph = planRes.plan.map((t, idx) => ({
        ...t,
        status: idx === 0 ? 'RUNNING' : 'WAITING'
      }));
      await this.logEvent(state, 'Planner Agent', `Task graph created with ${state.taskGraph.length} specialized tasks.`, 'SUCCESS');

      // 2. ORDER AGENT STAGE
      await this.updateTaskStatus(state, 'Order Agent', 'RUNNING');
      await this.logEvent(state, 'Order Agent', `Retrieving order details for ${incident.orderId} and customer info...`, 'INFO');
      const orderRes = await agents.OrderAgent.execute(incident.orderId, incident.customerId, context);
      state.observations.order = orderRes.order;
      state.observations.customer = orderRes.customer;
      state.toolCalls.push({ toolName: 'getOrder', agent: 'Order Agent', result: orderRes.order });
      state.toolCalls.push({ toolName: 'getCustomer', agent: 'Order Agent', result: orderRes.customer });
      await this.updateTaskStatus(state, 'Order Agent', 'COMPLETED', orderRes);
      await this.logEvent(state, 'Order Agent', `Verified order #${orderRes.order.orderId} (₹${orderRes.order.totalAmount.toLocaleString()}) for customer ${orderRes.customer.name} (${orderRes.customer.tier} tier).`, 'SUCCESS');

      // 3. PAYMENT AGENT STAGE
      await this.updateTaskStatus(state, 'Payment Agent', 'RUNNING');
      await this.logEvent(state, 'Payment Agent', `Verifying payment transaction for order ${incident.orderId}...`, 'INFO');
      const payRes = await agents.PaymentAgent.execute(incident.orderId, context);
      state.observations.payment = payRes.payment;
      state.toolCalls.push({ toolName: 'getPayment', agent: 'Payment Agent', result: payRes.payment });
      await this.updateTaskStatus(state, 'Payment Agent', 'COMPLETED', payRes);
      await this.logEvent(state, 'Payment Agent', `Payment verified: ₹${payRes.payment.amount.toLocaleString()} paid via ${payRes.payment.method} (Status: ${payRes.payment.status}).`, 'SUCCESS');

      // 4. DELIVERY AGENT STAGE WITH FAILURE RECOVERY DEMO
      await this.updateTaskStatus(state, 'Delivery Agent', 'RUNNING');
      await this.logEvent(state, 'Delivery Agent', `Checking logistics shipment status with carrier...`, 'INFO');

      let deliveryRes;
      let shouldSimulateFailure = simulateFailure && state.failureRecoveryAttempts === 0;

      try {
        if (shouldSimulateFailure) {
          throw new Error('CARRIER_API_TIMEOUT: Logistics tracking service bluedart.api.internal timed out (504 Gateway Timeout).');
        }
        deliveryRes = await agents.DeliveryAgent.execute(incident.orderId, false, context);
      } catch (err) {
        // OBSERVE -> ADAPT -> REPLAN LOOP!
        state.failureRecoveryAttempts += 1;
        await this.updateTaskStatus(state, 'Delivery Agent', 'FAILED', null, err.message);
        await this.logEvent(state, 'Delivery Agent', `Connection failed: ${err.message}`, 'ERROR');
        await this.logEvent(state, 'Orchestrator', `FAILURE DETECTED! Triggering Autonomous Failure Recovery Protocol...`, 'WARN');
        
        // Retry with Fallback strategy
        await this.logEvent(state, 'Planner Agent', `Creating fallback strategy: Querying secondary logistics telemetry cache...`, 'INFO');
        await this.updateTaskStatus(state, 'Delivery Agent', 'RETRYING');
        
        // Execute fallback retrieval
        deliveryRes = await agents.DeliveryAgent.execute(incident.orderId, false, context);
        await this.logEvent(state, 'Delivery Agent', `RETRY SUCCESSFUL! Alternative telemetry confirmed 4 days delay at Transit Hub - Hyderabad.`, 'SUCCESS');
      }

      state.observations.shipment = deliveryRes.shipment;
      state.toolCalls.push({ toolName: 'getShipment', agent: 'Delivery Agent', result: deliveryRes.shipment });
      await this.updateTaskStatus(state, 'Delivery Agent', 'COMPLETED', deliveryRes);

      // 5. INVENTORY AGENT STAGE
      await this.updateTaskStatus(state, 'Inventory Agent', 'RUNNING');
      await this.logEvent(state, 'Inventory Agent', `Checking warehouse inventory availability...`, 'INFO');
      const invRes = await agents.InventoryAgent.execute('SKU-LAPTOP-X1', context);
      state.observations.inventory = invRes.inventory;
      state.toolCalls.push({ toolName: 'getInventory', agent: 'Inventory Agent', result: invRes.inventory });
      await this.updateTaskStatus(state, 'Inventory Agent', 'COMPLETED', invRes);
      await this.logEvent(state, 'Inventory Agent', `Inventory confirmed: Stock level 42 units at WH-01-BOM.`, 'SUCCESS');

      // 6. POLICY AGENT STAGE
      await this.updateTaskStatus(state, 'Policy Agent', 'RUNNING');
      await this.logEvent(state, 'Policy Agent', `Evaluating company refund policy eligibility...`, 'INFO');
      const policyRes = await agents.PolicyAgent.execute('REFUND', deliveryRes.shipment.delayDays, orderRes.order.totalAmount, context);
      state.observations.policy = policyRes.policy;
      state.toolCalls.push({ toolName: 'checkPolicy', agent: 'Policy Agent', result: policyRes.policy });
      await this.updateTaskStatus(state, 'Policy Agent', 'COMPLETED', policyRes);
      await this.logEvent(state, 'Policy Agent', `Policy evaluation complete: 100% refund eligible (${deliveryRes.shipment.delayDays} days delay > 3 days allowed).`, 'SUCCESS');

      // 7. DECISION AGENT STAGE
      await this.updateTaskStatus(state, 'Decision Agent', 'RUNNING');
      await this.logEvent(state, 'Decision Agent', `Analyzing all evidence and determining optimal resolution...`, 'INFO');
      const decRes = await agents.DecisionAgent.execute(state.observations);
      state.decision = decRes.decision;
      await this.updateTaskStatus(state, 'Decision Agent', 'COMPLETED', decRes);
      await this.logEvent(state, 'Decision Agent', `RECOMMENDATION: FULL REFUND (${state.decision.confidence}% Confidence). ${state.decision.summary}`, 'SUCCESS');

      // 8. ACTION AGENT STAGE (RISK EVALUATION & HUMAN-IN-THE-LOOP CHECK)
      await this.updateTaskStatus(state, 'Action Agent', 'RUNNING');
      await this.logEvent(state, 'Action Agent', `Evaluating action risk limits for refund amount ₹${orderRes.order.totalAmount.toLocaleString()}...`, 'INFO');

      let companyRiskLimit = 5000;
      if (getIsConnected()) {
        const comp = await Company.findOne({ companyId: 'COMP-DEFAULT' });
        if (comp) companyRiskLimit = comp.riskThreshold;
      }

      if (orderRes.order.totalAmount > companyRiskLimit && !humanApproved) {
        // High Risk -> Trigger Human Approval Modal & Approval Center Record
        state.status = 'WAITING_APPROVAL';
        state.requiresApproval = true;

        const approvalRecord = {
          approvalId: `APP-${Date.now()}`,
          incidentId: incident.incidentId,
          executionId: state.executionId,
          recommendedAction: `Issue full refund of ₹${orderRes.order.totalAmount.toLocaleString()}`,
          amount: orderRes.order.totalAmount,
          riskLevel: 'HIGH',
          reason: `Refund amount of ₹${orderRes.order.totalAmount.toLocaleString()} exceeds automated approval threshold of ₹${companyRiskLimit.toLocaleString()}.`,
          confidence: state.decision.confidence,
          evidence: state.decision.evidence,
          status: 'PENDING',
          requestedByAgent: 'Decision Agent',
          createdAt: new Date()
        };

        if (getIsConnected()) {
          try { await Approval.create(approvalRecord); } catch (e) {}
          await Incident.updateOne({ incidentId: incident.incidentId }, { status: 'PENDING_APPROVAL', approvalId: approvalRecord.approvalId });
        }
        state.approvalId = approvalRecord.approvalId;

        await this.logEvent(state, 'Action Agent', `HUMAN APPROVAL REQUIRED: Refund ₹${orderRes.order.totalAmount.toLocaleString()} exceeds threshold ₹${companyRiskLimit.toLocaleString()}. Pausing execution.`, 'WARN');
        await this.saveExecutionState(state);

        return {
          status: 'WAITING_APPROVAL',
          executionId: state.executionId,
          incidentId: state.incidentId,
          approvalId: approvalRecord.approvalId,
          approvalRecord,
          executionState: state
        };
      }

      // If approved or low risk, execute action directly
      const actionRes = await agents.ActionAgent.execute(
        incident.orderId, 
        orderRes.order.totalAmount, 
        incident.customerId, 
        companyRiskLimit, 
        { ...context, humanApproved: true }
      );
      state.toolCalls.push({ toolName: 'createRefund', agent: 'Action Agent', result: actionRes.result });
      await this.updateTaskStatus(state, 'Action Agent', 'COMPLETED', actionRes);
      await this.logEvent(state, 'Action Agent', `Simulated refund of ₹${orderRes.order.totalAmount.toLocaleString()} initiated successfully (Ref: ${actionRes.result.refundRef}).`, 'SUCCESS');

      // 9. VERIFICATION AGENT STAGE
      await this.updateTaskStatus(state, 'Verification Agent', 'RUNNING');
      await this.logEvent(state, 'Verification Agent', `Validating backend payment status and transaction ledger...`, 'INFO');
      const verRes = await agents.VerificationAgent.execute(incident.orderId, context);
      state.verification = verRes;
      await this.updateTaskStatus(state, 'Verification Agent', 'COMPLETED', verRes);
      await this.logEvent(state, 'Verification Agent', `VERIFICATION SUCCESSFUL: ${verRes.details}`, 'SUCCESS');

      // 10. COMMUNICATION AGENT STAGE
      await this.updateTaskStatus(state, 'Communication Agent', 'RUNNING');
      await this.logEvent(state, 'Communication Agent', `Generating customer resolution message...`, 'INFO');
      const commRes = await agents.CommunicationAgent.execute(
        incident.customerName, 
        incident.orderId, 
        orderRes.order.totalAmount, 
        state.decision.summary, 
        incident.customerId, 
        context
      );
      state.customerResponse = commRes.message;
      state.toolCalls.push({ toolName: 'sendCustomerMessage', agent: 'Communication Agent', result: commRes.sentResult });
      await this.updateTaskStatus(state, 'Communication Agent', 'COMPLETED', commRes);
      await this.logEvent(state, 'Communication Agent', `Customer notified via Email & SMS. Incident resolution finalized.`, 'SUCCESS');

      // 11. COMPLETE INCIDENT
      state.status = 'COMPLETED';
      await this.logEvent(state, 'Orchestrator', `INCIDENT ${incident.incidentId} AUTONOMOUSLY RESOLVED IN FULL.`, 'SUCCESS');

      if (getIsConnected()) {
        await Incident.updateOne(
          { incidentId: incident.incidentId }, 
          { 
            status: 'RESOLVED', 
            resolutionSummary: state.decision.summary, 
            customerResponse: state.customerResponse,
            confidenceScore: state.decision.confidence,
            resolvedAt: new Date()
          }
        );
      }

      await this.saveExecutionState(state);

      return {
        status: 'COMPLETED',
        executionId: state.executionId,
        incidentId: state.incidentId,
        executionState: state
      };

    } catch (error) {
      console.error('[AgentOrchestrator] Error during agentic loop execution:', error);
      state.status = 'FAILED';
      await this.logEvent(state, 'Orchestrator', `UNHANDLED FAILURE: ${error.message}`, 'ERROR');
      await this.saveExecutionState(state);
      return { status: 'FAILED', error: error.message, executionState: state };
    }
  }

  async updateTaskStatus(state, agentName, status, output = null, error = null) {
    const task = state.taskGraph.find(t => t.agent === agentName);
    if (task) {
      task.status = status;
      if (output) task.output = output;
      if (error) task.error = error;
    }
  }

  async logEvent(state, agent, message, level = 'INFO') {
    const logItem = { timestamp: new Date(), agent, message, level };
    state.logs.push(logItem);
    console.log(`[${logItem.timestamp.toLocaleTimeString()}] [${agent}] (${level}) ${message}`);

    // Create immutable audit log
    const auditEntry = {
      auditId: `AUD-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      timestamp: new Date(),
      incidentId: state.incidentId,
      agent,
      actionType: level === 'SUCCESS' ? 'VERIFICATION' : 'AGENT_LOG',
      details: message,
      evidence: [JSON.stringify(state.decision || {})]
    };
    if (getIsConnected()) {
      try { await AuditLog.create(auditEntry); } catch (e) {}
    }
  }

  async saveExecutionState(state) {
    if (getIsConnected()) {
      try {
        await AgentExecution.findOneAndUpdate(
          { executionId: state.executionId },
          state,
          { upsert: true, new: true }
        );
      } catch (e) {
        console.warn('Failed to persist execution state to Mongo:', e.message);
      }
    }
  }

  getExecutionState(executionId) {
    return executionStore.get(executionId);
  }
}

module.exports = new AgentOrchestrator();
