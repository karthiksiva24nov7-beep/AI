import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Plus, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
import CreateOrderModal from '../components/CreateOrderModal';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.warn('Orders fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter(o => o.customerName?.toLowerCase().includes(search.toLowerCase()) || o.orderNumber?.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-emerald-400" />
            Sales Orders Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real customer sales orders, real-time inventory deductions, and payment statuses
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white glass-button hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>CREATE NEW ORDER</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter orders by customer name or order number..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-100 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800 bg-slate-900/80">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Items Included</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4 text-right">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((o) => (
                <tr key={o.orderId} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-indigo-300">{o.orderNumber}</td>
                  <td className="py-3.5 px-4 font-sans font-semibold text-slate-200">{o.customerName}</td>
                  <td className="py-3.5 px-4 font-sans text-xs text-slate-400">
                    {(o.items || []).map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">₹{o.totalAmount?.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      o.paymentStatus === 'PAID' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                      {o.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
