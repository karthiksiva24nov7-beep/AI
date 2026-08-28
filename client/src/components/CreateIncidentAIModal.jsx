import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, X, Play, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateIncidentAIModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [promptText, setPromptText] = useState('Customer Rahul Sharma says order 4821 is four days late and wants a refund.');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post('/api/commands/extract-incident', { promptText });
      if (res.data.incident) {
        onClose();
        navigate(`/incidents/${res.data.incident.incidentId}?autoStart=true`);
      }
    } catch (err) {
      console.error('Failed to extract incident with AI:', err);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Customer Rahul Sharma says order 4821 is four days late and wants a refund.",
    "Priya Patel reported duplicate payment charge of ₹68,000 on order #4822.",
    "Warehouse WH-01 stock for UltraBook X1 fell below threshold of 10 units."
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-indigo-500/40 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-400 animate-pulse" />
            Create Incident with Natural Language AI
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-400 block mb-1">
              Type or Paste Operational Issue Prompt:
            </label>
            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. Customer Rahul Sharma says order 4821 is four days late and wants a refund."
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Sample Prompts */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sample Natural Prompts:</span>
            <div className="space-y-1.5">
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPromptText(sp)}
                  className="w-full text-left p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-indigo-500/40 transition-colors text-[11px]"
                >
                  "{sp}"
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white glass-button hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'AI EXTRACTING PARAMETERS...' : 'EXTRACT & AUTONOMOUSLY RESOLVE'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
