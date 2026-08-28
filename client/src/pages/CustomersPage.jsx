import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Mail, Phone, MapPin, DollarSign } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const defaultCustomers = [
    { customerId: 'CUST-101', name: 'Rahul Sharma', email: 'rahul.sharma@example.com', phone: '+91 98765 43210', totalPurchases: 93000, outstandingAmount: 25000 },
    { customerId: 'CUST-102', name: 'Sneha Reddy', email: 'sneha.reddy@example.com', phone: '+91 98123 45678', totalPurchases: 68000, outstandingAmount: 0 }
  ];

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/customers');
      setCustomers(res.data && res.data.customers?.length ? res.data.customers : defaultCustomers);
    } catch (err) {
      console.warn('Customers fetch fallback active:', err);
      setCustomers(defaultCustomers);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-400" />
          Customer Directory &amp; CRM
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Track customer profiles, lifetime purchases, contact history, and outstanding balances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {customers.map((c) => (
          <div key={c.customerId} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="font-extrabold text-white text-sm">{c.name}</div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40 font-mono">
                {c.customerId}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{c.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{c.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                <span>{c.address}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Lifetime Value</span>
                <span className="text-emerald-400 font-extrabold">₹{c.totalPurchases?.toLocaleString()}</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Outstanding</span>
                <span className={`font-bold ${c.outstandingAmount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                  ₹{c.outstandingAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
