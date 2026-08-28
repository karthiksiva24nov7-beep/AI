import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Play, ShieldAlert, User, LogOut, PlusCircle, Sparkles, Command, Wand2, ShoppingCart, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CommandBar from './CommandBar';
import CreateOrderModal from './CreateOrderModal';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandBarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        {/* Brand & Command Bar Trigger */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                SHOPPILOT <span className="text-indigo-400 font-mono text-sm">AI</span>
              </span>
              <p className="text-[11px] font-medium text-slate-400 -mt-0.5">
                Your autonomous AI assistant for everyday business operations.
              </p>
            </div>
          </Link>

          {/* AI Command Bar Search Input Trigger */}
          <button
            onClick={() => setIsCommandBarOpen(true)}
            className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-400 text-xs font-medium w-80 justify-between transition-colors shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Ask ShopPilot... (e.g. 'Which products are low in stock?')</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">Ctrl K</kbd>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">+ NEW ORDER</span>
          </button>

          <button
            onClick={() => navigate('/inventory')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white glass-button hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-600/30"
          >
            <Package className="w-4 h-4" />
            <span>INVENTORY CATALOG</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <Link to="/login" title="Switch User Persona" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-semibold text-xs">
                {user?.name ? user.name.charAt(0) : 'O'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-200">{user?.name || 'Business Owner'}</div>
                <div className="text-[10px] font-medium text-indigo-400 tracking-wider uppercase">{user?.role || 'OWNER'}</div>
              </div>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Sign Out / Switch Persona"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <CommandBar isOpen={isCommandBarOpen} onClose={() => setIsCommandBarOpen(false)} />
      <CreateOrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </>
  );
}
