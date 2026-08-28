import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Play, AlertCircle, ArrowUpDown, ChevronRight } from 'lucide-react';

export default function IncidentsPage() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, [search, category, priority, status]);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (priority) params.priority = priority;
      if (status) params.status = status;

      const res = await axios.get('/api/incidents', { params });
      setIncidents(res.data.incidents || []);
    } catch (err) {
      console.warn('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (id) => {
    navigate(`/incidents/${id}`);
  };

  const handleResolve = (id, e) => {
    e.stopPropagation();
    navigate(`/incidents/${id}?autoStart=true`);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Search Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-indigo-400" />
            Operational Incidents Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and autonomously resolve business exceptions
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Incident ID, Customer, Order..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          <option value="DELIVERY_DELAY">Delivery Delay</option>
          <option value="REFUND_REQUEST">Refund Request</option>
          <option value="PAYMENT_FAILURE">Payment Failure</option>
          <option value="INVENTORY_SHORTAGE">Inventory Shortage</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Incidents Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800 bg-slate-900/80">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Autonomous Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {incidents.map((inc) => (
                <tr
                  key={inc.incidentId}
                  onClick={() => handleOpenDetail(inc.incidentId)}
                  className={`hover:bg-slate-900/60 transition-colors cursor-pointer ${
                    inc.incidentId === 'INC-4821' ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                    <div className="flex items-center gap-2">
                      <span>{inc.incidentId}</span>
                      {inc.incidentId === 'INC-4821' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          PRIMARY DEMO
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{inc.customerName}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{inc.orderId}</td>
                  <td className="py-3.5 px-4 text-slate-300">{inc.category}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inc.priority === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          : inc.priority === 'HIGH'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {inc.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inc.status === 'RESOLVED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : inc.status === 'PENDING_APPROVAL'
                          ? 'bg-orange-950 text-orange-300 border border-orange-500/40'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => handleResolve(inc.incidentId, e)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white glass-button hover:opacity-90 transition-all inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>AUTONOMOUSLY RESOLVE</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
