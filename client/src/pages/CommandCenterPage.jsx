import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Bot, Cpu, RefreshCw, CheckCircle2, AlertTriangle, Zap, Shield } from 'lucide-react';

export default function CommandCenterPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentMatrix();
    const interval = setInterval(fetchAgentMatrix, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgentMatrix = async () => {
    try {
      const res = await axios.get('/api/agents');
      setAgents(res.data.agents || []);
    } catch (err) {
      console.warn('Failed to fetch agent command matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-400 animate-pulse" />
            Live Agent Operations Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-agent execution matrix, active tool invocations, and live telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>10 AGENTS ACTIVE IN MATRIX</span>
        </div>
      </div>

      {/* Agent Operations Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800 bg-slate-900/80">
              <tr>
                <th className="py-3.5 px-4">Agent Name</th>
                <th className="py-3.5 px-4">Operational Role</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4">Success Rate</th>
                <th className="py-3.5 px-4">Total Executions</th>
                <th className="py-3.5 px-4">Avg Latency</th>
                <th className="py-3.5 px-4 text-right">Failure Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {agents.map((agent, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-500/30">
                        <Bot className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-100">{agent.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-sans text-xs">{agent.role}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                      {agent.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{agent.successRate}</td>
                  <td className="py-3.5 px-4 text-slate-300">{agent.totalTasks}</td>
                  <td className="py-3.5 px-4 text-cyan-400 font-bold">{agent.avgTime}</td>
                  <td className="py-3.5 px-4 text-right text-slate-400">{agent.failureRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
