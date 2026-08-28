import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Sparkles, Command, ArrowRight, CornerDownLeft, Info, HelpCircle } from 'lucide-react';

export default function CommandBar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose ? onClose() : null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleExecute = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post('/api/commands/execute-command', { query });
      setResult(res.data);

      if (res.data.targetUrl) {
        setTimeout(() => {
          onClose();
          navigate(res.data.targetUrl);
        }, 1200);
      }
    } catch (err) {
      console.error('Command execution failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const exampleQueries = [
    "Show unresolved delivery issues",
    "Find high-priority incidents",
    "Why is incident INC-4821 unresolved?",
    "Resolve INC-4821",
    "Show agents that failed today"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-5 border border-indigo-500/40 shadow-2xl space-y-4 animate-fade-in">
        {/* Search Bar Input */}
        <form onSubmit={handleExecute} className="relative flex items-center">
          <Sparkles className="w-5 h-5 text-indigo-400 absolute left-4 pointer-events-none animate-pulse" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask ResolveFlow AI... (e.g. 'Show unresolved delivery issues' or 'Resolve INC-4821')"
            autoFocus
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>

        {/* AI Result Card */}
        {loading && (
          <div className="p-4 text-center font-mono text-xs text-indigo-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
            <span>AI Command Bar interpreting intent...</span>
          </div>
        )}

        {result && (
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-xs text-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>AI Command Interpreted</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-mono">
              {result.message || result.explanation}
            </p>
            {result.targetUrl && (
              <div className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1 mt-2">
                <span>Navigating...</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        )}

        {/* Example Suggestions */}
        <div className="pt-2 border-t border-slate-800">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            Suggested AI Queries
          </div>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(ex);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs hover:border-indigo-500/50 hover:text-white transition-all text-left"
              >
                "{ex}"
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800 font-mono">
          <span>Press ESC to close</span>
          <span>Shortcut: Ctrl+K</span>
        </div>
      </div>
    </div>
  );
}
