import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Cpu } from 'lucide-react';

export default function ApprovalModal({ approvalData, onApprove, onReject, onClose }) {
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  if (!approvalData) return null;

  const handleApprove = async () => {
    setLoading(true);
    await onApprove(approvalData.approvalId, comments);
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await onReject(approvalData.approvalId, comments);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel rounded-2xl p-6 border border-amber-500/40 shadow-2xl shadow-amber-500/10">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              HUMAN APPROVAL REQUIRED
            </h2>
            <p className="text-xs text-slate-400">
              High-risk operation threshold triggered by Action Agent
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="my-5 space-y-4 text-sm">
          {/* Action Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recommended Action</div>
            <div className="text-lg font-extrabold text-emerald-400">
              {approvalData.recommendedAction || 'Issue full refund of ₹25,000'}
            </div>
          </div>

          {/* Reason & Confidence */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Reason</span>
              <p className="text-xs text-slate-300 mt-0.5">{approvalData.reason || 'Refund policy conditions satisfied.'}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Confidence</span>
              <p className="text-lg font-extrabold text-indigo-400 mt-0.5">{approvalData.confidence || 94}%</p>
            </div>
          </div>

          {/* Evidence Checklist */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Verified Evidence Checklist</span>
            <div className="space-y-1.5 text-xs text-slate-300">
              {(approvalData.evidence || [
                '✓ Order verified (#4821)',
                '✓ Payment verified (₹25,000 via UPI)',
                '✓ Shipment delay confirmed (4 days)',
                '✓ Policy satisfied'
              ]).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Operator Comments */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Operator Note / Instructions (Optional)</label>
            <input
              type="text"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="e.g. Approved following SLA verification"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleReject}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-950/40 transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            <span>REJECT ACTION</span>
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? 'EXECUTING...' : 'APPROVE & EXECUTE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
