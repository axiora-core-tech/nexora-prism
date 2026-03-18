import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Plus, X, ChevronRight, Calendar } from 'lucide-react';
import { employees } from '../mockData';

type Priority = 'critical' | 'high' | 'medium' | 'low';
type Status   = 'backlog'  | 'active' | 'review' | 'resolved';

interface Task {
  id: string; title: string; desc: string;
  status: Status; priority: Priority;
  owner: string; ownerId: string;
  due: string; tags: string[];
  estimate: number; effort: number;
}

const initialTasks: Task[] = [
  { id: 't1', title: 'Compile Architecture Docs',       desc: 'Full documentation pass for the new distributed systems',    status: 'active',   priority: 'high',     owner: 'Alex M.',    ownerId: 'e1', due: 'Nov 20', tags: ['Engineering', 'Docs'],     estimate: 8,  effort: 5  },
  { id: 't2', title: 'Refine UI State Transitions',     desc: 'Audit and improve all motion/spring interactions',            status: 'backlog',  priority: 'medium',   owner: 'Sarah C.',   ownerId: 'e2', due: 'Nov 22', tags: ['Design', 'UX'],            estimate: 5,  effort: 0  },
  { id: 't3', title: 'Database Indexing Optimization',  desc: 'Reduce query latency across primary data services',           status: 'active',   priority: 'critical', owner: 'Marcus J.',  ownerId: 'e3', due: 'Nov 18', tags: ['Infrastructure'],          estimate: 12, effort: 8  },
  { id: 't4', title: 'Q4 SEO Campaign Launch',          desc: 'Final review and deployment of organic growth strategy',      status: 'resolved', priority: 'high',     owner: 'Priya S.',   ownerId: 'e4', due: 'Nov 15', tags: ['Marketing', 'Growth'],     estimate: 10, effort: 10 },
  { id: 't5', title: 'Security Audit — Zero Trust',     desc: 'Full penetration test and architecture review',               status: 'backlog',  priority: 'critical', owner: 'Marcus J.',  ownerId: 'e3', due: 'Dec 01', tags: ['Security'],                estimate: 20, effort: 0  },
  { id: 't6', title: 'React 19 Migration — Phase II',   desc: 'Concurrent features and Server Components rollout',           status: 'review',   priority: 'high',     owner: 'Alex M.',    ownerId: 'e1', due: 'Nov 25', tags: ['Engineering'],             estimate: 16, effort: 14 },
  { id: 't7', title: 'User Onboarding Flow V2',         desc: 'A/B test new onboarding with activation funnel',              status: 'review',   priority: 'medium',   owner: 'Sarah C.',   ownerId: 'e2', due: 'Nov 28', tags: ['Design', 'Product'],       estimate: 6,  effort: 5  },
  { id: 't8', title: 'Sales & Marketing Sync Cadence',  desc: 'Establish bi-weekly joint campaign planning sessions',        status: 'backlog',  priority: 'low',      owner: 'Priya S.',   ownerId: 'e4', due: 'Dec 05', tags: ['Marketing'],               estimate: 3,  effort: 0  },
];

const columns: { id: Status; label: string; accent: string; glow: string }[] = [
  { id: 'backlog',  label: 'Dormant',      accent: '#52525b', glow: 'rgba(82,82,91,0.15)'    },
  { id: 'active',   label: 'In Flux',      accent: '#38bdf8', glow: 'rgba(56,189,248,0.12)'  },
  { id: 'review',   label: 'Orbit',        accent: '#c084fc', glow: 'rgba(192,132,252,0.12)' },
  { id: 'resolved', label: 'Transmitted',  accent: '#10b981', glow: 'rgba(16,185,129,0.12)'  },
];

const priorityConfig: Record<Priority, { color: string; label: string }> = {
  critical: { color: '#f43f5e', label: 'Critical' },
  high:     { color: '#f59e0b', label: 'High'     },
  medium:   { color: '#38bdf8', label: 'Medium'   },
  low:      { color: '#52525b', label: 'Low'      },
};

// ─── Task Card ──────────────────────────────────────────────────────────────
function TaskCard({ task, onMove }: { task: Task; onMove: (id: string, dir: 'right') => void }) {
  const pCfg  = priorityConfig[task.priority];
  const col   = columns.find(c => c.id === task.status)!;
  const emp   = employees.find(e => e.id === task.ownerId);
  const pct   = task.estimate > 0 ? Math.round((task.effort / task.estimate) * 100) : 0;
  const done  = task.status === 'resolved';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      whileHover={done ? {} : { y: -4 }}
      transition={{ duration: 0.4 }}
      className={`relative group rounded-[2rem] border overflow-hidden transition-colors duration-300 ${
        done
          ? 'bg-white/5 border-white/5 opacity-50'
          : 'bg-white/5 border-white/5 hover:bg-white/[0.04] hover:border-white/10 cursor-crosshair'
      }`}
      data-cursor={done ? undefined : 'Manage Vector'}
    >
      {/* ── Ambient glow orb (canonical pattern) ── */}
      {!done && (
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[70px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: col.glow }}
        />
      )}

      {/* ── Priority stripe along top ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[2rem]"
        style={{ background: pCfg.color, opacity: done ? 0.25 : 0.7 }}
      />

      <div className="relative z-10 p-6">
        {/* Tags + priority */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex flex-wrap gap-1.5">
            {task.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[8px] uppercase tracking-widest font-mono bg-white/5 text-white/40 border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            className="text-[8px] font-mono uppercase tracking-widest flex-shrink-0"
            style={{ color: pCfg.color }}
          >
            {pCfg.label}
          </span>
        </div>

        {/* Title */}
        <h4 className={`text-sm font-light leading-snug mb-2 ${
          done ? 'line-through text-white/25 decoration-white/15' : 'text-white/90'
        }`}>
          {task.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-white/30 font-light leading-relaxed mb-5">{task.desc}</p>

        {/* Progress bar — only when in flight */}
        {!done && task.status !== 'backlog' && task.estimate > 0 && (
          <div className="mb-5">
            <div className="flex justify-between text-[9px] font-mono text-white/30 mb-1.5">
              <span>Effort</span>
              <span>{task.effort}h / {task.estimate}h</span>
            </div>
            <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full"
                style={{ background: col.accent }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            {emp && (
              <img
                src={emp.avatar}
                alt={emp.name}
                className="w-5 h-5 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70"
              />
            )}
            <span className="text-[10px] text-white/40 font-light">{task.owner}</span>
          </div>
          <div className="flex items-center gap-2">
            {!done && (
              <button
                onClick={e => { e.stopPropagation(); onMove(task.id, 'right'); }}
                className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:border-white/30 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                data-cursor="Advance"
              >
                <ChevronRight size={9} />
              </button>
            )}
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/30">
              <Calendar size={8} />
              <span>{task.due}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── New Task Modal ──────────────────────────────────────────────────────────
function NewTaskModal({ onClose, onAdd }: { onClose: () => void; onAdd: (t: Task) => void }) {
  const [form, setForm] = useState({
    title: '', desc: '',
    priority: 'medium' as Priority,
    ownerId: 'e1', due: '', tags: '',
  });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    const emp = employees.find(e => e.id === form.ownerId);
    onAdd({
      id: `t${Date.now()}`,
      title: form.title, desc: form.desc,
      status: 'backlog', priority: form.priority,
      owner: emp ? `${emp.name.split(' ')[0]} ${emp.name.split(' ')[1][0]}.` : 'Team',
      ownerId: form.ownerId,
      due: form.due || 'TBD',
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      estimate: 0, effort: 0,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg bg-[#0a0a0b] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold mb-1">Operational Matrix</p>
            <h3 className="text-white text-xl font-light">New Task Vector</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 border border-white/5 text-white/40 hover:bg-white/[0.04] hover:text-white transition-all"
            data-cursor="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          {/* Title */}
          <div>
            <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Vector Label</label>
            <input
              autoFocus
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Signal vector name..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Signal Description</label>
            <textarea
              value={form.desc}
              onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
              placeholder="Additional context..."
              rows={2}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Priority */}
            <div>
              <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Priority Class</label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-white/20"
              >
                {(['critical', 'high', 'medium', 'low'] as Priority[]).map(p => (
                  <option key={p} value={p} className="bg-[#0a0a0b]">{priorityConfig[p].label}</option>
                ))}
              </select>
            </div>
            {/* Assign */}
            <div>
              <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Assign Node</label>
              <select
                value={form.ownerId}
                onChange={e => setForm(f => ({ ...f, ownerId: e.target.value }))}
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-white/20"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id} className="bg-[#0a0a0b]">{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Due */}
            <div>
              <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Terminus</label>
              <input
                value={form.due}
                onChange={e => setForm(f => ({ ...f, due: e.target.value }))}
                placeholder="Nov 30"
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20"
              />
            </div>
            {/* Tags */}
            <div>
              <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Tags</label>
              <input
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="Engineering, UX"
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8 relative z-10">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-white/5 text-white/40 text-sm font-light hover:text-white hover:bg-white/[0.04] hover:border-white/10 transition-all"
          >
            Abort
          </button>
          <button
            onClick={handleAdd}
            disabled={!form.title.trim()}
            className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-light hover:bg-white/[0.04] hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Create Vector
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Tasks Page ─────────────────────────────────────────────────────────
export function Tasks() {
  const [tasks, setTasks]               = useState<Task[]>(initialTasks);
  const [showModal, setShowModal]       = useState(false);
  const [filterOwner, setFilterOwner]   = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<Priority | null>(null);
  const [view, setView]                 = useState<'board' | 'list'>('board');

  const moveTask = (id: string, dir: 'right') => {
    const order: Status[] = ['backlog', 'active', 'review', 'resolved'];
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const idx    = order.indexOf(t.status);
      const newIdx = Math.min(idx + 1, 3);
      return { ...t, status: order[newIdx] };
    }));
  };

  const addTask = (t: Task) => setTasks(prev => [t, ...prev]);

  const filtered = tasks.filter(t => {
    if (filterOwner   && t.ownerId   !== filterOwner)   return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    return true;
  });

  const stats = {
    active:   tasks.filter(t => t.status === 'active').length,
    critical: tasks.filter(t => t.priority === 'critical' && t.status !== 'resolved').length,
    done:     tasks.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-12"
      >
        <div>
          <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-2">
            <Layers size={14} className="text-emerald-400" /> Operational Matrix
          </p>
          <h1 className="text-7xl md:text-9xl font-light tracking-tighter text-white leading-[0.9]">
            Active <span className="text-white/30 italic font-serif">Vectors</span>
          </h1>
        </div>

        <div className="flex items-end gap-12">
          {/* Stats */}
          <div className="flex gap-8 text-right">
            {[
              { label: 'In Flux',   val: stats.active,   color: '#38bdf8' },
              { label: 'Critical',  val: stats.critical, color: '#f43f5e' },
              { label: 'Transmitted', val: stats.done,   color: '#10b981' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] mb-2">{s.label}</p>
                <p className="text-4xl font-light" style={{ color: s.color }}>{s.val}</p>
              </div>
            ))}
          </div>

          {/* New task CTA — matches original Dashboard constellation CTA */}
          <button
            onClick={() => setShowModal(true)}
            className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/[0.04] hover:border-emerald-400/50 transition-all duration-500 group"
            data-cursor="New Signal"
          >
            <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </motion.div>

      {/* ── Controls ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
      >
        {/* View toggle */}
        <div className="flex gap-1 p-1 bg-white/5 border border-white/5 rounded-xl">
          {(['board', 'list'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 rounded-lg text-xs uppercase tracking-widest font-medium transition-all ${
                view === v ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
              }`}
              data-cursor={v === 'board' ? 'Grid View' : 'Linear View'}
            >
              {v === 'board' ? 'Grid View' : 'Linear View'}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono mr-1">Filter ·</span>
          {employees.map(e => (
            <button
              key={e.id}
              onClick={() => setFilterOwner(filterOwner === e.id ? null : e.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] transition-all border ${
                filterOwner === e.id
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'border-white/5 text-white/40 hover:border-white/10 hover:text-white/70'
              }`}
              data-cursor={e.name.split(' ')[0]}
            >
              <img
                src={e.avatar} alt={e.name}
                className="w-4 h-4 rounded-full object-cover grayscale"
              />
              {e.name.split(' ')[0]}
            </button>
          ))}
          <div className="w-px h-4 bg-white/10 mx-1" />
          {(['critical', 'high'] as Priority[]).map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(filterPriority === p ? null : p)}
              className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all border ${
                filterPriority === p ? 'text-white' : 'border-white/5 text-white/40 hover:border-white/10'
              }`}
              style={filterPriority === p
                ? { borderColor: priorityConfig[p].color + '60', background: priorityConfig[p].color + '12', color: priorityConfig[p].color }
                : {}}
              data-cursor={priorityConfig[p].label}
            >
              {priorityConfig[p].label}
            </button>
          ))}
          {(filterOwner || filterPriority) && (
            <button
              onClick={() => { setFilterOwner(null); setFilterPriority(null); }}
              className="px-3 py-1.5 rounded-full text-[10px] border border-white/5 text-white/30 hover:text-white hover:border-white/20 transition-all flex items-center gap-1"
              data-cursor="Clear"
            >
              <X size={9} /> Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Board View ── */}
      {view === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((col, colIdx) => {
            const colTasks = filtered.filter(t => t.status === col.id);
            return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: colIdx * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4"
              >
                {/* Column header — single border, no double-stacking */}
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col.accent }} />
                    <h3 className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold">
                      {col.label}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task cards */}
                <AnimatePresence>
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onMove={moveTask} />
                  ))}
                </AnimatePresence>

                {/* Empty state */}
                {colTasks.length === 0 && (
                  <div className="border border-dashed border-white/[0.07] rounded-[2rem] p-8 text-center">
                    <p className="text-[9px] uppercase tracking-widest text-white/20 font-mono">No signals</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Linear View ── */}
      {view === 'list' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden"
        >
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-48 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

          <table className="w-full relative z-10">
            <thead>
              <tr className="border-b border-white/5">
                {['Task', 'Owner', 'Priority', 'Status', 'Due', 'Progress'].map(h => (
                  <th
                    key={h}
                    className="text-left text-[9px] uppercase tracking-widest text-white/30 font-mono py-4 px-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((task, i) => {
                  const pCfg = priorityConfig[task.priority];
                  const col  = columns.find(c => c.id === task.status)!;
                  const emp  = employees.find(e => e.id === task.ownerId);
                  const pct  = task.estimate > 0 ? Math.round((task.effort / task.estimate) * 100) : 0;
                  return (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <p className={`text-sm font-light ${task.status === 'resolved' ? 'line-through text-white/25' : 'text-white/80'}`}>
                          {task.title}
                        </p>
                        <p className="text-[9px] text-white/30 mt-0.5 font-mono">{task.tags.join(' · ')}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {emp && <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover grayscale" />}
                          <span className="text-white/60 text-xs font-light">{task.owner}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: pCfg.color }}>
                          {pCfg.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-mono" style={{ color: col.accent }}>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col.accent }} />
                          {col.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-white/40 text-xs font-mono">{task.due}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-[2px] bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: col.accent }} />
                          </div>
                          <span className="text-[9px] font-mono text-white/30">{pct}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}

      {/* ── Modal ── */}
      <AnimatePresence>
        {showModal && (
          <NewTaskModal
            onClose={() => setShowModal(false)}
            onAdd={addTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
