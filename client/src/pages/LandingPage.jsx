import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cpu, Play, ArrowRight, ShieldCheck, Zap, Bot, RefreshCw, BarChart2, Layers, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartDemo = () => {
    navigate('/incidents/INC-4821?autoStart=true');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              RESOLVEFLOW <span className="text-indigo-400 font-mono text-sm">AI</span>
            </span>
            <p className="text-[11px] font-medium text-slate-400 -mt-1">Autonomous Operations Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Enter Dashboard
          </Link>
          <button
            onClick={handleStartDemo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white glass-button hover:opacity-90 transition-all shadow-xl shadow-indigo-600/30"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>TRY LIVE DEMO</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold mb-6">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            NEXT-GEN AGENTIC OPERATIONS PLATFORM
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Detect the problem. <br />
            Decide the solution. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Execute the fix.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
            ResolveFlow AI is an autonomous business operations platform that investigates incidents, coordinates specialized AI agents, uses business tools, makes decisions, safely executes actions, verifies outcomes, and escalates to humans only when required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-extrabold text-white glass-button flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>RUN AUTONOMOUS DEMO (INC-4821)</span>
            </button>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm font-bold text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800/80 transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Traditional AI vs Agentic AI Comparison */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Traditional AI vs. Agentic AI</h2>
          <p className="text-slate-400 text-sm mt-2">Why simple chatbots fail at operational execution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional AI */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800/80 relative overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> TRADITIONAL AI
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-4">Static Question &amp; Answer</h3>
            <div className="font-mono text-xs bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-slate-300 space-y-2 mb-6">
              <p className="text-slate-400">User → Question → AI Answer</p>
              <p className="text-rose-400">❌ Cannot inspect live databases</p>
              <p className="text-rose-400">❌ Cannot execute backend actions</p>
              <p className="text-rose-400">❌ Cannot handle failure recovery</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Requires manual human effort for every operational step: searching systems, verifying policy, executing transactions, and updating tickets.
            </p>
          </div>

          {/* Agentic AI */}
          <div className="glass-panel p-8 rounded-2xl border border-indigo-500/50 relative overflow-hidden shadow-xl shadow-indigo-500/10">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" /> AGENTIC AI (RESOLVEFLOW)
            </div>
            <h3 className="text-lg font-bold text-white mb-4">Autonomous Operational Execution</h3>
            <div className="font-mono text-xs bg-indigo-950/60 p-4 rounded-xl border border-indigo-500/40 text-indigo-200 space-y-2 mb-6">
              <p className="text-emerald-300 font-bold">Goal → Plan → Delegate → Execute → Observe → Verify → Adapt → Complete</p>
              <p className="text-emerald-400">✓ Coordinates 10 specialized agents</p>
              <p className="text-emerald-400">✓ Safe backend tool execution</p>
              <p className="text-emerald-400">✓ Human-in-the-Loop risk control</p>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Investigates root causes across systems, evaluates policies, executes verified backend transactions, and resolves business incidents autonomously.
            </p>
          </div>
        </div>
      </section>

      {/* Multi-Agent Architecture */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Specialized Multi-Agent Ecosystem</h2>
          <p className="text-slate-400 text-sm mt-2">10 purpose-built agents collaborating to resolve business issues</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Planner Agent', desc: 'Analyzes incident goals, creates dependency task graphs, and manages fallback strategies.', icon: Layers },
            { title: 'Order Agent', desc: 'Queries live order state, customer tier, and historical transaction telemetry.', icon: Bot },
            { title: 'Payment Agent', desc: 'Audits payment gateway state, card/UPI transactions, and refund ledgers.', icon: ShieldCheck },
            { title: 'Delivery Agent', desc: 'Checks carrier logistics, delay days, and handles carrier API failure retries.', icon: RefreshCw },
            { title: 'Inventory Agent', desc: 'Inspects warehouse stock levels, reserved stock, and reorder metrics.', icon: Zap },
            { title: 'Policy Agent', desc: 'Evaluates business SLA rules, refund eligibility, and approval thresholds.', icon: ShieldCheck },
            { title: 'Decision Agent', desc: 'Synthesizes evidence across agents, providing clear confidence scores.', icon: BarChart2 },
            { title: 'Action Agent', desc: 'Executes approved backend tool actions while enforcing risk limit controls.', icon: CheckCircle2 },
            { title: 'Verification Agent', desc: 'Validates backend transaction outcomes and triggers retry loops if needed.', icon: CheckCircle2 },
            { title: 'Communication Agent', desc: 'Generates professional customer notifications via Email and SMS.', icon: Bot }
          ].map((agent, idx) => {
            const Icon = agent.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-indigo-500/50 transition-all">
                <div className="w-9 h-9 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-100">{agent.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{agent.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-slate-800 py-12 px-6 text-center bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-extrabold text-white mb-3">Ready to Experience Autonomous Operations?</h3>
          <p className="text-slate-400 text-xs mb-6">Explore the primary hackathon demo incident INC-4821 with full visual execution graph.</p>
          <button
            onClick={handleStartDemo}
            className="px-8 py-3.5 rounded-xl text-sm font-extrabold text-white glass-button inline-flex items-center gap-2 shadow-xl shadow-indigo-600/30"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>LAUNCH INCIDENT INC-4821 DEMO</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
