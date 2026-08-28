import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Shield, Sliders, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [riskThreshold, setRiskThreshold] = useState(5000);
  const [automationLevel, setAutomationLevel] = useState('AUTONOMOUS');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get('/api/settings').then(res => {
      if (res.data.company) {
        setRiskThreshold(res.data.company.riskThreshold || 5000);
        setAutomationLevel(res.data.company.automationLevel || 'AUTONOMOUS');
      }
    }).catch(err => console.warn(err));
  }, []);

  const handleSave = async () => {
    try {
      await axios.put('/api/settings', {
        riskThreshold: Number(riskThreshold),
        automationLevel
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          Company Automation &amp; Risk Policy Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure financial risk limits, human-in-the-loop triggers, and business policy thresholds
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        {/* Risk Threshold */}
        <div>
          <label className="text-sm font-bold text-slate-200 block mb-1">
            Automated Financial Execution Threshold (INR)
          </label>
          <p className="text-xs text-slate-400 mb-3">
            Financial actions up to this amount execute automatically. Refunds exceeding this amount pause for Human-in-the-Loop approval.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-slate-400">₹</span>
            <input
              type="number"
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-extrabold text-emerald-400 w-48 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-xs text-slate-400 font-mono">(Default hackathon demo limit: ₹5,000)</span>
          </div>
        </div>

        {/* Automation Level */}
        <div className="pt-4 border-t border-slate-800">
          <label className="text-sm font-bold text-slate-200 block mb-1">
            Agentic Automation Operating Level
          </label>
          <p className="text-xs text-slate-400 mb-3">
            Controls agent autonomy across system tools and resolution workflows.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {['MANUAL', 'ASSISTED', 'AUTONOMOUS'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setAutomationLevel(lvl)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  automationLevel === lvl
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          {saved && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Settings updated successfully
            </span>
          )}
          <button
            onClick={handleSave}
            className="ml-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white glass-button hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
