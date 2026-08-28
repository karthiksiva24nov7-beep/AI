import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Play, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  PackageCheck, 
  CreditCard, 
  Truck, 
  FileText, 
  MessageSquare, 
  BrainCircuit, 
  AlertTriangle,
  History,
  Layers,
  ArrowLeft,
  Clock,
  Download,
  Sliders,
  Zap
} from 'lucide-react';
import AgentExecutionGraph from '../components/AgentExecutionGraph';
import LiveActivityFeed from '../components/LiveActivityFeed';
import ApprovalModal from '../components/ApprovalModal';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [incident, setIncident] = useState(null);
  const [audits, setAudits] = useState([]);
  const [executionState, setExecutionState] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [approvalModalData, setApprovalModalData] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [failureRetryMode, setFailureRetryMode] = useState(false);
  const [activeScenarioLabel, setActiveScenarioLabel] = useState('Incident Resolution Flow');

  const autoStartedRef = useRef(false);

  useEffect(() => {
    fetchIncidentDetails();
  }, [id]);

  useEffect(() => {
    if (searchParams.get('autoStart') === 'true' && incident && !autoStartedRef.current) {
      autoStartedRef.current = true;
      handleRunAutonomousResolution(false);
    }
  }, [incident, searchParams]);

  const fetchIncidentDetails = async () => {
    const fallbackIncident = {
      incidentId: id || 'INC-4821',
      title: 'Delayed Order #4821 - Customer Requesting Refund',
      description: 'Order #4821 has been delayed for 4 days and the customer wants a refund.',
      category: 'DELIVERY_DELAY',
      priority: 'HIGH',
      status: 'OPEN',
      customerId: 'CUST-RahulSharma',
      customerName: 'Rahul Sharma',
      orderId: '#4821',
      assignedAgents: ['Planner', 'Order', 'Payment', 'Delivery', 'Policy', 'Decision', 'Action', 'Verification', 'Communication']
    };

    try {
      const res = await axios.get(`/api/incidents/${id}`);
      setIncident(res.data.incident || fallbackIncident);
      setAudits(res.data.audits || []);
    } catch (err) {
      console.warn('Failed to fetch incident details, utilizing resilient fallback:', err);
      setIncident(fallbackIncident);
    }
  };

  const handleRunAutonomousResolution = async (simulateFailure = false, scenarioName = '') => {
    setIsExecuting(true);
    setFailureRetryMode(simulateFailure);
    setApprovalModalData(null);
    if (scenarioName) setActiveScenarioLabel(scenarioName);

    try {
      const res = await axios.post(`/api/incidents/${id}/resolve`, { simulateFailure });
      const data = res.data;

      if (data.executionState) {
        setExecutionState(data.executionState);
      }

      if (data.status === 'WAITING_APPROVAL') {
        setApprovalModalData(data.approvalRecord || {
          approvalId: data.approvalId,
          recommendedAction: 'Issue full refund of ₹25,000',
          reason: 'Refund amount ₹25,000 exceeds automated threshold ₹5,000.',
          confidence: 94,
          evidence: [
            '✓ Order verified (#4821)',
            '✓ Payment verified (₹25,000 via UPI)',
            '✓ Shipment delay confirmed (4 days)',
            '✓ Refund policy satisfied'
          ]
        });
      }

      fetchIncidentDetails();
    } catch (err) {
      console.error('Error during resolution execution:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleApprove = async (approvalId, comments) => {
    try {
      const res = await axios.post(`/api/approvals/${approvalId}/approve`, { comments });
      setApprovalModalData(null);
      if (res.data.orchestration && res.data.orchestration.executionState) {
        setExecutionState(res.data.orchestration.executionState);
      }
      fetchIncidentDetails();
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleReject = async (approvalId, comments) => {
    try {
      await axios.post(`/api/approvals/${approvalId}/reject`, { comments });
      setApprovalModalData(null);
      fetchIncidentDetails();
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  // Export Audit Report JSON/PDF
  const handleExportAuditReport = () => {
    const reportData = {
      platform: 'RESOLVEFLOW AI - Autonomous Operations Engine',
      reportType: 'Compliance & Execution Audit Report',
      timestamp: new Date().toISOString(),
      incident: incident || {},
      executionState: executionState || {},
      audits: audits || []
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ResolveFlow_Audit_${id}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!incident) {
    return (
      <div className="py-20 text-center text-slate-400 font-mono">
        Loading Incident {id}...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Main Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/incidents')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-indigo-400 text-sm">{incident.incidentId}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                incident.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
              }`}>
                {incident.status}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white mt-0.5">{incident.title}</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportAuditReport}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            title="Download Compliance Audit JSON"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">EXPORT REPORT</span>
          </button>

          <button
            onClick={() => setShowAuditModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>VIEW AUDIT</span>
          </button>

          <button
            onClick={() => handleRunAutonomousResolution(false, 'Autonomous Incident Execution')}
            disabled={isExecuting}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white glass-button hover:opacity-90 transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/30 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isExecuting ? 'RESOLVING...' : 'AUTONOMOUSLY RESOLVE'}</span>
          </button>
        </div>
      </div>

      {/* PRESET DEMO SCENARIO SWITCHER BAR */}
      <div className="glass-panel p-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-bold text-slate-200">Preset Demo Scenarios:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Scenario 1 */}
          <button
            onClick={() => handleRunAutonomousResolution(false, 'Scenario 1: High-Risk Human Approval (₹25,000)')}
            disabled={isExecuting}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900/60 transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>1. High-Risk Approval (₹25,000)</span>
          </button>

          {/* Scenario 2 */}
          <button
            onClick={() => handleRunAutonomousResolution(true, 'Scenario 2: Carrier Timeout & Failure Recovery')}
            disabled={isExecuting}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>2. Failure Recovery Simulation</span>
          </button>

          {/* Scenario 3 */}
          <button
            onClick={() => {
              navigate('/incidents/INC-4823?autoStart=true');
              setActiveScenarioLabel('Scenario 3: Standard Auto Refund (₹4,500)');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>3. Instant Auto Refund (&le; ₹5,000)</span>
          </button>
        </div>
      </div>

      {/* Incident Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-500">Customer</span>
          <div className="text-sm font-bold text-slate-200 mt-1">{incident.customerName}</div>
          <span className="text-[10px] text-indigo-400 font-semibold">{incident.customerId} (VIP Tier)</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-500">Order &amp; Value</span>
          <div className="text-sm font-bold text-slate-200 mt-1">{incident.orderId}</div>
          <span className="text-[10px] text-emerald-400 font-bold">₹25,000 INR (Paid via UPI)</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-500">Issue Category</span>
          <div className="text-sm font-bold text-slate-200 mt-1">{incident.category}</div>
          <span className="text-[10px] text-amber-400 font-semibold">4 Days Delivery Delay</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-500">Requested Action</span>
          <div className="text-sm font-bold text-emerald-400 mt-1">Full Refund</div>
          <span className="text-[10px] text-slate-400 font-semibold">Max SLA Allowed: 3 Days</span>
        </div>
      </div>

      {/* Visual Agent Execution Graph */}
      <AgentExecutionGraph
        taskGraph={executionState?.taskGraph || []}
        currentStage={executionState?.status}
        failureRetry={failureRetryMode}
        activeScenario={activeScenarioLabel}
      />

      {/* Grid: Live Feed & Decision Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Log Feed */}
        <LiveActivityFeed logs={executionState?.logs || [
          { timestamp: new Date(), agent: 'System', message: 'Ready to execute autonomous agentic loop.', level: 'INFO' }
        ]} />

        {/* AI Decision & Evidence Display */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                AI Decision Engine &amp; Evidence Audit
              </h3>
              {executionState?.decision && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  {executionState.decision.confidence || 94}% Confidence
                </span>
              )}
            </div>

            {/* Decision Summary */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">AI Recommendation</div>
              <div className="text-base font-extrabold text-emerald-400 mb-2">
                {executionState?.decision?.recommendation || 'FULL REFUND APPROVED'}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "{executionState?.decision?.summary || 'The shipment exceeded the company\'s allowed delivery threshold (4 days delay vs 3 allowed), payment was completed, and the customer requested a refund. Policy conditions are satisfied.'}"
              </p>
            </div>

            {/* Evidence Checklist */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Verified System Evidence (No Chain-of-Thought)
              </span>
              <div className="space-y-2 text-xs">
                {(executionState?.decision?.evidence || [
                  '✓ Order verified (#4821)',
                  '✓ Payment verified (₹25,000 paid via UPI)',
                  '✓ Shipment delay confirmed (4 days delay in transit)',
                  '✓ Refund policy satisfied'
                ]).map((ev, i) => (
                  <div key={i} className="flex items-center gap-2 text-emerald-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          {executionState?.verification && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-xs text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-emerald-200">Outcome Verified: </span>
                <span>{executionState.verification.details}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Communication Card if resolved */}
      {(executionState?.customerResponse || incident.customerResponse) && (
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/40 bg-indigo-950/20">
          <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Communication Agent Generated Customer Response
          </h3>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
            {executionState?.customerResponse || incident.customerResponse}
          </div>
        </div>
      )}

      {/* Human Approval Modal if waiting */}
      {approvalModalData && (
        <ApprovalModal
          approvalData={approvalModalData}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setApprovalModalData(null)}
        />
      )}

      {/* Audit Log Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-3xl glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                Immutable Compliance Audit Log ({incident.incidentId})
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportAuditReport}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export JSON
                </button>
                <button onClick={() => setShowAuditModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto my-4 space-y-2 text-xs font-mono">
              {audits.map((a, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <span className="text-slate-500 shrink-0">{new Date(a.timestamp).toLocaleTimeString()}</span>
                  <div>
                    <span className="font-bold text-indigo-300">{a.agent}</span>
                    <span className="ml-2 text-slate-400">[{a.actionType}]</span>
                    <p className="text-slate-200 mt-1">{a.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
