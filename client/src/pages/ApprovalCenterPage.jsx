import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, ChevronRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ApprovalCenterPage() {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/approvals');
      setApprovals(res.data.approvals || []);
    } catch (err) {
      console.warn('Failed to fetch approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, incidentId) => {
    setActionLoading(prev => ({ ...prev, [id]: 'APPROVING' }));
    try {
      const res = await axios.post(`/api/approvals/${id}/approve`, { comments: 'Approved in Approval Center' });
      const targetIncident = res.data.incidentId || incidentId || 'INC-4821';
      navigate(`/incidents/${targetIncident}`);
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleReject = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: 'REJECTING' }));
    try {
      await axios.post(`/api/approvals/${id}/reject`, { comments: 'Rejected in Approval Center' });
      await fetchApprovals();
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          Human-in-the-Loop Approval Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review, approve, or reject high-risk financial and operational actions recommended by autonomous agents
        </p>
      </div>

      <div className="space-y-4">
        {approvals.map((app) => (
          <div key={app.approvalId} className="glass-panel p-6 rounded-2xl border border-amber-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-300 text-xs">{app.approvalId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-500/40">
                      {app.riskLevel || 'HIGH'} RISK
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      app.status === 'PENDING' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-0.5">{app.recommendedAction}</h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Amount</span>
                <span className="text-lg font-extrabold text-emerald-400">₹{(app.amount || 25000).toLocaleString()} INR</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Reason &amp; Context</span>
                <p className="text-slate-300 leading-relaxed">{app.reason}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Evidence Checklist</span>
                <div className="space-y-1 text-emerald-300">
                  {(app.evidence || ['✓ Order verified', '✓ Shipment delay 4 days']).map((ev, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {app.status === 'PENDING' ? (
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleReject(app.approvalId)}
                  disabled={!!actionLoading[app.approvalId]}
                  className="px-4 py-2 rounded-xl border border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{actionLoading[app.approvalId] === 'REJECTING' ? 'REJECTING...' : 'REJECT'}</span>
                </button>

                <button
                  onClick={() => handleApprove(app.approvalId, app.incidentId)}
                  disabled={!!actionLoading[app.approvalId]}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading[app.approvalId] === 'APPROVING' ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{actionLoading[app.approvalId] === 'APPROVING' ? 'EXECUTING REFUND...' : 'APPROVE & EXECUTE'}</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center justify-end gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Reviewed &amp; Action Executed ({app.status})</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
