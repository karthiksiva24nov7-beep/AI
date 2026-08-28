import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Plus, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [supRes, poRes] = await Promise.all([
        axios.get('/api/suppliers'),
        axios.get('/api/suppliers/purchase-orders')
      ]);

      setSuppliers(supRes.data.suppliers || []);
      setPurchaseOrders(poRes.data.purchaseOrders || []);
    } catch (err) {
      console.warn('Suppliers fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-violet-400" />
          Suppliers &amp; Vendor Purchase Orders
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage vendor relationships, purchase recommendations, and low-stock inventory replenishment orders
        </p>
      </div>

      {/* Supplier Directory */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-white">Vendor Directory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((s) => (
            <div key={s.supplierId} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="font-extrabold text-white text-sm">{s.name}</div>
                <span className="font-mono text-xs text-violet-300 font-bold">{s.supplierId}</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1 font-sans">
                <div><span className="text-slate-500 font-semibold">Contact Person:</span> {s.contactPerson}</div>
                <div><span className="text-slate-500 font-semibold">Email:</span> {s.email}</div>
                <div><span className="text-slate-500 font-semibold">Phone:</span> {s.phone}</div>
                <div><span className="text-slate-500 font-semibold">Address:</span> {s.address}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          Vendor Purchase Orders Tracker
        </h2>
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800 bg-slate-900/80">
                <tr>
                  <th className="py-3.5 px-4">PO Number</th>
                  <th className="py-3.5 px-4">Supplier Name</th>
                  <th className="py-3.5 px-4">Requested Items</th>
                  <th className="py-3.5 px-4">Total Cost</th>
                  <th className="py-3.5 px-4">Requested By</th>
                  <th className="py-3.5 px-4 text-right">PO Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {purchaseOrders.map((po) => (
                  <tr key={po.poNumber} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-violet-300">{po.poNumber}</td>
                    <td className="py-3.5 px-4 font-sans font-semibold text-slate-200">{po.supplierName}</td>
                    <td className="py-3.5 px-4 font-sans text-xs text-slate-400">
                      {(po.items || []).map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">₹{po.totalAmount?.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-sans text-xs">{po.requestedByAgent}</td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        po.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
