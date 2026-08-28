import React, { useEffect, useRef } from 'react';
import { Activity, Clock, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export default function LiveActivityFeed({ logs = [] }) {
  const feedEndRef = useRef(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLevelBadge = (level) => {
    switch (level) {
      case 'SUCCESS':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">SUCCESS</span>;
      case 'WARN':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-500/30">WARN</span>;
      case 'ERROR':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-500/30">ERROR</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-400 border border-indigo-500/30">INFO</span>;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col h-full max-h-[500px]">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
          Live Activity Execution Feed
        </h3>
        <span className="text-[11px] font-mono text-slate-400">{logs.length} events logged</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center">
            <Clock className="w-6 h-6 mb-2 opacity-50" />
            <p>Waiting to initialize autonomous execution loop...</p>
          </div>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-start gap-3 hover:bg-slate-900 transition-colors"
            >
              <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-indigo-300 text-xs">{log.agent}</span>
                  {getLevelBadge(log.level)}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed break-words">{log.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={feedEndRef} />
      </div>
    </div>
  );
}
