import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Zap, Clock, ShieldCheck, PieChart } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/analytics').then(res => setData(res.data)).catch(err => console.warn(err));
  }, []);

  const overview = data?.overview || {
    activeIncidents: 24,
    resolvedToday: 187,
    autonomousResolutionRate: 94.7,
    humanEscalationRate: 5.3,
    avgResolutionTime: '3m 42s',
    agentSuccessRate: 96.2
  };

  const categories = data?.categoryBreakdown || [
    { category: 'Delivery Delay', count: 86, percentage: 46 },
    { category: 'Refund Request', count: 42, percentage: 22 },
    { category: 'Payment Failure', count: 28, percentage: 15 },
    { category: 'Inventory Shortage', count: 18, percentage: 10 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          Autonomous Resolution Analytics &amp; Business Impact
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics on resolution times, agent success rates, and escalation ratios
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-500">Autonomous Resolution Rate</span>
          <div className="text-3xl font-extrabold text-indigo-400 mt-1">{overview.autonomousResolutionRate}%</div>
          <p className="text-xs text-emerald-400 mt-1 font-semibold">Target SLA &gt; 90% Exceeded</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-500">Average Resolution Time</span>
          <div className="text-3xl font-extrabold text-cyan-400 mt-1">{overview.avgResolutionTime}</div>
          <p className="text-xs text-slate-400 mt-1 font-semibold">VS 4.5 hours manual standard</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-500">Agent Success Rate</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{overview.agentSuccessRate}%</div>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Across 10 specialized agents</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-400" />
          Incidents by Operational Category
        </h3>
        <div className="space-y-4">
          {categories.map((cat, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>{cat.category}</span>
                <span className="font-mono">{cat.count} incidents ({cat.percentage}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
