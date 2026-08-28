import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, X, AlertCircle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateIncidentModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('12500');
  const [category, setCategory] = useState('DELIVERY_DELAY');
  const [priority, setPriority] = useState('HIGH');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const incidentId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
      const customCustomerName = customerName || 'Vikram Malhotra';
      const customOrderId = orderId || `#${Math.floor(4000 + Math.random() * 1000)}`;

      const newIncident = {
        incidentId,
        title: title || `${category.replace('_', ' ')} for Order ${customOrderId}`,
        description: description || `Customer ${customCustomerName} requested immediate resolution for order ${customOrderId}. Amount: ₹${amount}`,
        category,
        priority,
        status: 'OPEN',
        customerId: `CUST-${customCustomerName.replace(/\s+/g, '')}`,
        customerName: customCustomerName,
        orderId: customOrderId,
        amount: Number(amount)
      };

      await axios.post('/api/incidents', newIncident);
      onClose();
      navigate(`/incidents/${incidentId}?autoStart=true`);
    } catch (err) {
      console.error('Failed to create incident:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-indigo-500/40 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            Create Custom Incident &amp; Run Autonomous Agents
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-400 block mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-400 block mb-1">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. #9021"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-400 block mb-1">Amount (INR)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-400 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="DELIVERY_DELAY">Delivery Delay</option>
                <option value="REFUND_REQUEST">Refund Request</option>
                <option value="PAYMENT_FAILURE">Payment Failure</option>
                <option value="INVENTORY_SHORTAGE">Inventory Shortage</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-400 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
                <option value="MEDIUM">Medium</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-400 block mb-1">Problem Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Shipment delayed 5 days & customer requested cancellation"
              required
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-400 block mb-1">Detailed Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, SLA thresholds, or special notes..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
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
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white glass-button hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{loading ? 'CREATING...' : 'CREATE & AUTONOMOUSLY RESOLVE'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
