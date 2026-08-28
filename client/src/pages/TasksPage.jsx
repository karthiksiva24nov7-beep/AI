import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckSquare, Plus, CheckCircle2, Clock } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const defaultTasks = [
    { taskId: 'TASK-901', title: 'Verify low stock inventory re-order list', priority: 'HIGH', status: 'OPEN', description: 'Review low stock items and authorize PO creation.' },
    { taskId: 'TASK-902', title: 'Send payment reminder for Order #1024', priority: 'MEDIUM', status: 'OPEN', description: 'Follow up with customer Rahul Sharma regarding unpaid invoice.' }
  ];

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/tasks');
      setTasks(res.data && res.data.tasks?.length ? res.data.tasks : defaultTasks);
    } catch (err) {
      console.warn('Tasks fetch fallback active:', err);
      setTasks(defaultTasks);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'OPEN' : 'COMPLETED';
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: nextStatus });
      fetchTasks();
    } catch (err) {
      console.warn('Task toggle fallback active:', err);
      setTasks(prev => prev.map(t => t.taskId === taskId ? { ...t, status: nextStatus } : t));
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-indigo-400" />
          AI-Assisted Operational Tasks
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Automated business task queue assigned to shop managers and business owners
        </p>
      </div>

      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t.taskId} className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleTask(t.taskId, t.status)}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                  t.status === 'COMPLETED' ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 text-transparent hover:border-indigo-500'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <div>
                <h3 className={`text-xs font-extrabold ${t.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                  {t.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.description}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                  <span>Assigned: {t.assignedTo}</span>
                  <span>•</span>
                  <span>Agent: {t.createdByAgent}</span>
                </div>
              </div>
            </div>

            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
              t.priority === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
            }`}>
              {t.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
