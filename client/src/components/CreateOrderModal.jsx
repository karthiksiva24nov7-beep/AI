import React, { useState } from 'react';
import axios from 'axios';
import { ShoppingCart, X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateOrderModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [productName, setProductName] = useState('A4 Copy Paper (500 Sheets)');
  const [quantity, setQuantity] = useState(5);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessOrder(null);

    try {
      const customerId = `CUST-${customerName.replace(/\s+/g, '')}`;
      const res = await axios.post('/api/orders', {
        customerId,
        items: [{ productName, quantity: Number(quantity) }],
        paymentMethod
      });

      setSuccessOrder(res.data);
      setTimeout(() => {
        setSuccessOrder(null);
        onClose();
        navigate('/orders');
      }, 1500);
    } catch (err) {
      console.error('Create order error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-indigo-500/40 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            Place New Sales Order
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successOrder ? (
          <div className="p-6 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Order {successOrder.orderNumber} Created!</h3>
            <p className="text-xs text-slate-300">
              Total Amount: ₹{successOrder.totalAmount?.toLocaleString()} • Stock Deducted Cleanly in DB.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-400 block mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-400 block mb-1">Product Item</label>
              <select
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="A4 Copy Paper (500 Sheets)">A4 Copy Paper (500 Sheets) — ₹250</option>
                <option value="Blue Ballpoint Pens (Box of 50)">Blue Ballpoint Pens (Box of 50) — ₹499</option>
                <option value="Printer Ink Cartridge (Black HP-680)">Printer Ink Cartridge (Black HP-680) — ₹1,250</option>
                <option value="Enterprise UltraBook X1">Enterprise UltraBook X1 — ₹55,000</option>
                <option value="Wireless Ergonomic Optical Mouse">Wireless Ergonomic Optical Mouse — ₹799</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  <option value="UPI">UPI Payment</option>
                  <option value="CARD">Credit / Debit Card</option>
                  <option value="CASH">Cash Payment</option>
                  <option value="UNPAID">Pending Invoice</option>
                </select>
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
                <ShoppingCart className="w-4 h-4" />
                <span>{loading ? 'PROCESSING ORDER & DB STOCK...' : 'PLACE ORDER & DEDUCT STOCK'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
