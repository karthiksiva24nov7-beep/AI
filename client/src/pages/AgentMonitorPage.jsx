import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bot, CheckCircle2, AlertTriangle, Clock, RefreshCw, Activity } from 'lucide-react';

export default function AgentMonitorPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/agents');
      setAgents(res.data.agents || []);
    } catch (err) {
      console.warn('Failed to fetch agents:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-indigo-400" />
          Specialized Agent Health &amp; Telemetry Monitor
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor performance, latency, success metrics, and failure recovery across 10 specialized autonomous agents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{agent.name}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  {agent.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{agent.role}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-800 text-[10px]">
              <div className="p-2 rounded-lg bg-slate-900/60">
                <span className="text-slate-500 block">SUCCESS</span>
                <span className="font-extrabold text-emerald-400 text-xs">{agent.successRate}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60">
                <span className="text-slate-500 block">TASKS</span>
                <span className="font-extrabold text-indigo-300 text-xs">{agent.totalTasks}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60">
                <span className="text-slate-500 block">AVG TIME</span>
                <span className="font-extrabold text-cyan-400 text-xs">{agent.avgTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
