import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Truck, CheckSquare, ShieldCheck, BarChart3, Settings, Bot, Activity, Sparkles } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/inventory', label: 'Inventory', icon: Package, badge: '3 Low' },
    { path: '/orders', label: 'Sales Orders', icon: ShoppingCart, badge: '2 Pending' },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/suppliers', label: 'Suppliers & POs', icon: Truck },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare, badge: '2' },
    { path: '/command-center', label: 'AI Command Center', icon: Activity, highlight: true },
    { path: '/approvals', label: 'Approvals', icon: ShieldCheck },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between p-4 shrink-0 font-sans min-h-screen">
      <div className="space-y-6">
        <div className="px-3 pt-2">
          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>ShopPilot Operations</span>
          </div>
          <p className="text-xs text-slate-400">Autonomous SME Business Control</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-md shadow-indigo-600/10'
                      : item.highlight
                      ? 'bg-gradient-to-r from-indigo-950/80 to-violet-950/80 border border-indigo-500/40 text-indigo-200 hover:border-indigo-400'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.badge.includes('Low') ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3.5 rounded-2xl glass-panel border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold text-slate-200">ShopPilot AI Engine</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Metro Stationers &amp; Electronics
        </p>
      </div>
    </aside>
  );
}
