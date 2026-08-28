import React from 'react';
import { 
  Cpu, 
  GitCommit, 
  PackageCheck, 
  CreditCard, 
  Truck, 
  Boxes, 
  ShieldCheck, 
  BrainCircuit, 
  Zap, 
  CheckCircle2, 
  MessageSquareCode, 
  RefreshCw, 
  AlertTriangle 
} from 'lucide-react';

export default function AgentExecutionGraph({ taskGraph = [], currentStage = '', failureRetry = false, activeScenario = '' }) {
  const getAgentStatus = (agentName) => {
    const task = taskGraph.find(t => t.agent === agentName);
    if (!task) return 'WAITING';
    return task.status || 'WAITING';
  };

  const agentNodes = [
    { id: 'Planner Agent', label: 'Planner Agent', desc: 'Task Graph & Strategy', icon: GitCommit, role: 'Orchestration' },
    { id: 'Order Agent', label: 'Order Agent', desc: 'Order & Customer Telemetry', icon: PackageCheck, role: 'Data Retrieval' },
    { id: 'Payment Agent', label: 'Payment Agent', desc: 'Payment Gateway Audit', icon: CreditCard, role: 'Financial' },
    { id: 'Delivery Agent', label: 'Delivery Agent', desc: 'Carrier Logistics Tracking', icon: Truck, role: 'Logistics' },
    { id: 'Inventory Agent', label: 'Inventory Agent', desc: 'Warehouse Stock Check', icon: Boxes, role: 'Inventory' },
    { id: 'Policy Agent', label: 'Policy Agent', desc: 'SLA Delay Policy Check', icon: ShieldCheck, role: 'Compliance' },
    { id: 'Decision Agent', label: 'Decision Agent', desc: 'Evidence & Confidence', icon: BrainCircuit, role: 'Reasoning' },
    { id: 'Action Agent', label: 'Action Agent', desc: 'Refund & Risk Enforcement', icon: Zap, role: 'Execution' },
    { id: 'Verification Agent', label: 'Verification Agent', desc: 'Status Validation', icon: CheckCircle2, role: 'Audit' },
    { id: 'Communication Agent', label: 'Communication Agent', desc: 'Customer Notification', icon: MessageSquareCode, role: 'Customer Response' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-950/90 px-2 py-0.5 rounded-full border border-indigo-500/60 shadow-lg shadow-indigo-500/30 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" /> RUNNING
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-500/60 shadow-md shadow-emerald-500/20">
            ✓ COMPLETED
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/90 px-2 py-0.5 rounded-full border border-rose-500/60 shadow-lg shadow-rose-500/30 animate-bounce">
            ⚠ FAILED
          </span>
        );
      case 'RETRYING':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/90 px-2 py-0.5 rounded-full border border-amber-500/60 shadow-lg shadow-amber-500/30 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" /> RE-PLANNING
          </span>
        );
      case 'BLOCKED':
      case 'WAITING_APPROVAL':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-950/90 px-2 py-0.5 rounded-full border border-orange-500/60 shadow-lg shadow-orange-500/30">
            <AlertTriangle className="w-3 h-3" /> APPROVAL REQD
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-medium text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
            WAITING
          </span>
        );
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case 'RUNNING':
        return 'border-indigo-500 shadow-xl shadow-indigo-500/30 bg-gradient-to-b from-indigo-950/60 to-slate-900/90 ring-2 ring-indigo-500/60 scale-105';
      case 'COMPLETED':
        return 'border-emerald-500/80 shadow-lg shadow-emerald-500/10 bg-gradient-to-b from-slate-900/90 to-emerald-950/20';
      case 'FAILED':
        return 'border-rose-500 bg-rose-950/40 shadow-xl shadow-rose-500/30';
      case 'RETRYING':
        return 'border-amber-500 bg-amber-950/40 shadow-xl shadow-amber-500/30';
      case 'BLOCKED':
      case 'WAITING_APPROVAL':
        return 'border-orange-500 bg-orange-950/40 shadow-xl shadow-orange-500/30';
      default:
        return 'border-slate-800/80 bg-slate-950/40 opacity-70 hover:opacity-100';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-indigo-500/20 relative overflow-hidden shadow-2xl">
      {/* Background Animated Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
            Agent Execution Graph &amp; Workflow State
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-agent dependency flow &amp; state monitoring
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-600" /> Waiting</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /> Running</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Completed</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Retrying / Fallback</div>
        </div>
      </div>

      {/* Orchestrator Goal Hub */}
      <div className="flex justify-center mb-8">
        <div className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border border-indigo-500/50 shadow-2xl shadow-indigo-500/20 flex items-center gap-3 text-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg">
            🎯
          </div>
          <div className="text-left">
            <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest block">ACTIVE ORCHESTRATION GOAL</span>
            <p className="text-xs font-semibold text-slate-100">
              {activeScenario || 'Autonomously Investigate & Resolve Incident Exception'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Agent Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative">
        {agentNodes.map((node) => {
          const status = getAgentStatus(node.id);
          const Icon = node.icon;

          return (
            <div
              key={node.id}
              className={`p-4 rounded-xl border transition-all duration-300 relative flex flex-col justify-between ${getBorderColor(status)}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl transition-all ${
                    status === 'COMPLETED' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                      : status === 'RUNNING'
                      ? 'bg-indigo-900 text-indigo-300 border border-indigo-500/60 shadow-lg shadow-indigo-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {getStatusBadge(status)}
                </div>
                <h4 className="text-xs font-bold text-slate-100 mt-1">{node.label}</h4>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{node.desc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{node.role}</span>
                {status === 'COMPLETED' && <span className="text-emerald-400 font-bold">✓ 100%</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Failure Recovery Banner */}
      {failureRetry && (
        <div className="mt-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-center gap-3 text-amber-200 text-xs shadow-xl animate-fade-in">
          <RefreshCw className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
          <div>
            <span className="font-extrabold text-amber-300">Autonomous Failure Recovery Active: </span>
            <span>Carrier logistics API connection timed out. Orchestrator initiated fallback telemetry strategy. Secondary tracking successful!</span>
          </div>
        </div>
      )}
    </div>
  );
}
