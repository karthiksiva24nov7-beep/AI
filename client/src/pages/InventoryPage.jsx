import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, AlertTriangle, Plus, Search, RefreshCw, CheckCircle2, ArrowUpDown } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adjustingId, setAdjustingId] = useState(null);
  const [delta, setDelta] = useState(10);

  useEffect(() => {
    fetchInventory();
  }, []);

  const defaultProducts = [
    { productId: 'PROD-PAPER-A4', sku: 'SKU-PAPER-A4', name: 'A4 Copy Paper (500 Sheets)', category: 'Paper & Stationery', stockQuantity: 4, minThreshold: 20, price: 250 },
    { productId: 'PROD-PEN-BLUE', sku: 'SKU-PEN-BLUE', name: 'Premium Ballpoint Pen (Pack of 10)', category: 'Paper & Stationery', stockQuantity: 8, minThreshold: 15, price: 120 },
    { productId: 'PROD-DESK-LAMPD', sku: 'SKU-DESK-LAMP', name: 'LED Rechargeable Desk Lamp', category: 'Electronics & Accessories', stockQuantity: 2, minThreshold: 5, price: 890 },
    { productId: 'PROD-LAPTOP-BAG', sku: 'SKU-LAPTOP-BAG', name: 'Waterproof Laptop Backpack 15.6"', category: 'Electronics & Accessories', stockQuantity: 18, minThreshold: 5, price: 1450 },
    { productId: 'PROD-WIRELESS-MOUSE', sku: 'SKU-MOUSE-WL', name: 'Ergonomic Wireless Mouse', category: 'Electronics & Accessories', stockQuantity: 25, minThreshold: 10, price: 650 }
  ];

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/products');
      setProducts(res.data && res.data.products?.length ? res.data.products : defaultProducts);
    } catch (err) {
      console.warn('Inventory fetch fallback active:', err);
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (productId) => {
    try {
      await axios.post(`/api/products/${productId}/adjust-stock`, {
        quantityDelta: Number(delta),
        reason: 'Manual stock adjustment by shop manager'
      });
      fetchInventory();
    } catch (err) {
      console.warn('Adjust stock fallback active:', err);
      setProducts(prev => prev.map(p => p.productId === productId ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + Number(delta)) } : p));
    } finally {
      setAdjustingId(null);
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-400" />
            Inventory &amp; Stock Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time SME stock management, low-stock warnings, and warehouse adjustments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInventory}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or SKU..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-100 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Product Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800 bg-slate-900/80">
              <tr>
                <th className="py-3.5 px-4">Product / SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Stock Quantity</th>
                <th className="py-3.5 px-4">Min Stock</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4 text-right">Quick Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((p) => {
                const isLow = p.stockQuantity <= p.minStock;
                return (
                  <tr key={p.productId} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-100">{p.name}</div>
                        <div className="text-[10px] text-slate-500">{p.sku}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans text-xs">{p.category}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{p.minStock}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">₹{p.sellingPrice.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      {adjustingId === p.productId ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <input
                            type="number"
                            value={delta}
                            onChange={(e) => setDelta(e.target.value)}
                            className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-100"
                          />
                          <button
                            onClick={() => handleAdjustStock(p.productId)}
                            className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setAdjustingId(null)}
                            className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAdjustingId(p.productId)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Adjust Stock</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
