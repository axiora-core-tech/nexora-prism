import { EmptyState } from './ui/EmptyState';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, TrendingUp, TrendingDown, Minus, ChevronRight, Filter, CheckCircle2, AlertCircle, XCircle, Crosshair, ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router';
import { useNavigate } from 'react-router';
import { employees } from '../mockData';

const statusConfig: Record<string, { label: string; color: string; bg: string; glow: string }> = {
  on_track: { label: 'Nominal',   color: '#10b981', bg: 'rgba(16,185,129,0.08)',  glow: 'rgba(16,185,129,0.12)'  },
  at_risk:  { label: 'Degraded',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  glow: 'rgba(245,158,11,0.12)'  },
  off_track:{ label: 'Critical',  color: '#f43f5e', bg: 'rgba(244,63,94,0.08)',   glow: 'rgba(244,63,94,0.12)'   },
  completed:{ label: 'Resolved',  color: '#38bdf8', bg: 'rgba(56,189,248,0.08)',  glow: 'rgba(56,189,248,0.12)'  },
};

function KPIVector({ kpi }: { kpi: any }) {
  const isLowerBetter = ['Bug Escape Rate','CAC','API Response Time','Incident Response'].includes(kpi.name);
  const good = isLowerBetter ? kpi.current <= kpi.target : kpi.current >= kpi.target;
  const pct = Math.min((kpi.current / kpi.target) * 100, 100);
  const color = good ? '#10b981' : kpi.current / kpi.target > 0.8 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="group cursor-crosshair" data-cursor="Trace Vector">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {kpi.trend === 'up'   ? <TrendingUp size={11} className="text-emerald-400" />
          : kpi.trend === 'down' ? <TrendingDown size={11} className="text-rose-400" />
          : <Minus size={11} className="p-text-dim" />}
          <span className="text-sm p-text-body font-light">{kpi.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm uppercase tracking-[0.12em] p-text-ghost font-mono">Weight {kpi.weight}%</span>
          <span className="text-sm font-mono" style={{ color }}>
            {kpi.current}{kpi.unit}
            <span className="p-text-ghost"> / {kpi.target}{kpi.unit}</span>
          </span>
        </div>
      </div>
      <div className="w-full h-px p-bg-card overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
          style={{ background: `linear-gradient(to right, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
}

function ObjectiveNode({ okr }: { okr: any }) {
  const cfg = statusConfig[okr.status] || statusConfig.on_track;
  return (
    <div
      className="relative p-bg-card border p-border rounded-[2rem] p-6 overflow-hidden group hover:p-border-mid transition-all duration-500 cursor-crosshair"
      data-cursor={cfg.label}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] pointer-events-none transition-opacity duration-1000 group-hover:opacity-150"
        style={{ background: cfg.glow }} />

      {/* Left accent stripe */}
      <div className="absolute top-0 left-0 w-px h-full" style={{ background: `linear-gradient(to bottom, transparent, ${cfg.color}, transparent)` }} />

      <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded text-sm uppercase tracking-[0.12em] font-mono border"
              style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.color + '30' }}>
              {cfg.label}
            </span>
            <span className="text-sm uppercase tracking-[0.12em] p-text-ghost font-mono">{okr.weight}</span>
          </div>
          <p className="p-text-body text-base font-light leading-relaxed">{okr.objective}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-3xl font-light text-white">{okr.progress}</span>
          <span className="text-sm p-text-ghost">%</span>
        </div>
      </div>

      <div className="w-full h-px p-bg-card overflow-hidden relative z-10">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${okr.progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
          style={{ background: `linear-gradient(to right, ${cfg.color}50, ${cfg.color})` }}
        />
      </div>
    </div>
  );
}

export function KPIGoals() {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState('All');
  const [activeTab, setActiveTab] = useState<'kpis' | 'okrs'>('kpis');

  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];
  const filtered = selectedDept === 'All' ? employees : employees.filter(e => e.department === selectedDept);

  const totalKPIs = employees.flatMap(e => e.kpis || []).length;
  const onTargetKPIs = employees.flatMap(e => (e.kpis || []).filter((k: any) => k.trend === 'up')).length;
  const totalOKRs = employees.flatMap(e => e.okrs || []).length;
  const completedOKRs = employees.flatMap(e => (e.okrs || []).filter((o: any) => o.status === 'completed')).length;

  // Surface the items that need immediate attention
  const criticalKPIs = employees.flatMap(e =>
    (e.kpis || [])
      .filter((k: any) => k.trend === 'down')
      .map((k: any) => ({ emp: e, kpi: k }))
  ).slice(0, 3);

  const atRiskOKRs = employees.flatMap(e =>
    (e.okrs || [])
      .filter((o: any) => o.status === 'off_track' || (o.status === 'at_risk' && o.progress < 30))
      .map((o: any) => ({ emp: e, okr: o }))
  ).slice(0, 3);

  return (
    <div className="page-wrap">

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b p-border pb-12"
      >
        <div>
                    <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 p-text-dim hover:p-text-hi text-sm mb-4 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <p className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-2">
            <Crosshair size={14} className="text-amber-400" /> Performance Intelligence
          </p>
          <h1 className="hero-title font-light text-white">
            Signal <span className="p-text-dim italic font-serif">Matrix</span>
          </h1>
        </div>
        <div className="flex gap-16 text-right">
          <div>
            <p className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2">On Track</p>
            <p className="text-4xl font-light text-emerald-400">{onTargetKPIs}<span className="text-xl p-text-dim">/{totalKPIs}</span></p>
          </div>
          <div>
            <p className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2">Objectives Resolved</p>
            <p className="text-4xl font-light text-cyan-400">{completedOKRs}<span className="text-xl p-text-dim">/{totalOKRs}</span></p>
          </div>
        </div>
      </motion.div>

      {/* Needs Attention — surfaced priority signals */}
      {(criticalKPIs.length > 0 || atRiskOKRs.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 p-6 rounded-[2rem] border border-rose-500/20 bg-rose-500/[0.04] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-32 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-5 relative z-10">
            <AlertCircle size={14} className="text-rose-400" />
            <h3 className="text-sm uppercase tracking-[0.12em] text-rose-400 font-semibold">
              Needs Attention — {criticalKPIs.length + atRiskOKRs.length} item{criticalKPIs.length + atRiskOKRs.length !== 1 ? 's' : ''} flagged
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
            {criticalKPIs.map(({ emp, kpi }, i) => (
              <NavLink
                key={`kpi-${i}`}
                to={`/app/employee/${emp.id}`}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border p-border hover:border-rose-500/20 hover:bg-rose-500/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div>
                    <p className="p-text-body text-sm font-light">{emp.name.split(' ')[0]} · {kpi.name}</p>
                    <p className="text-rose-400 text-sm font-mono uppercase tracking-widest">
                      {kpi.current}{kpi.unit} vs {kpi.target}{kpi.unit} target
                    </p>
                  </div>
                </div>
                <TrendingDown size={12} className="text-rose-400 flex-shrink-0" />
              </NavLink>
            ))}
            {atRiskOKRs.map(({ emp, okr }, i) => (
              <NavLink
                key={`okr-${i}`}
                to={`/app/employee/${emp.id}`}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border p-border hover:border-amber-500/20 hover:bg-amber-500/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div>
                    <p className="p-text-body text-sm font-light">{emp.name.split(' ')[0]} · {okr.objective.slice(0, 35)}{okr.objective.length > 35 ? '…' : ''}</p>
                    <p className="text-amber-400 text-sm font-mono uppercase tracking-widest">{okr.progress}% complete · {okr.status.replace('_', ' ')}</p>
                  </div>
                </div>
                <AlertCircle size={12} className="text-amber-400 flex-shrink-0" />
              </NavLink>
            ))}
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="flex gap-px p-px p-bg-card rounded-full border p-border">
          {(['kpis', 'okrs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium transition-all ${
                activeTab === tab ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'
              }`}
            >
              {tab === 'kpis' ? 'KPIs' : 'OKRs'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Filter size={10} className="p-text-ghost" />
          <div className="flex gap-2 flex-wrap">
            {departments.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDept(d)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest transition-all border ${
                  selectedDept === d
                    ? 'bg-white/10 p-border-hi text-white'
                    : 'border-white/5 p-text-dim hover:p-border-mid hover:text-white/60'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + selectedDept}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filtered.map((emp, idx) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.6 }}
              className="relative p-bg-card border p-border rounded-[2rem] p-8 overflow-hidden group hover:p-border-mid transition-all duration-500"
            >
              {/* Ambient glow top-right */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-1000" />

              {/* Employee header */}
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <img src={emp.avatar} alt={emp.name}
                    className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div>
                    <h3 className="text-white font-light text-sm">{emp.name.split(' ')[0]}</h3>
                    <h3 className="p-text-dim font-serif italic text-sm leading-none mt-0.5">{emp.name.split(' ')[1]}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm uppercase tracking-[0.12em] p-text-dim mb-1">Efficiency</p>
                    <p className="text-2xl font-light text-white">{emp.performanceScore}</p>
                  </div>
                  <NavLink to={`/app/employee/${emp.id}`}
                    className="p-2 rounded-full p-bg-card p-text-dim hover:bg-white/10 hover:p-text-hi transition-all"
                    data-cursor="Deep Dive">
                    <ChevronRight size={14} />
                  </NavLink>
                </div>
              </div>

              {/* KPI Vectors or Objective Nodes */}
              <div className="space-y-5 relative z-10">
                {activeTab === 'kpis'
                  ? (emp.kpis || []).map((kpi: any, i: number) => <KPIVector key={i} kpi={kpi} />)
                  : (emp.okrs || []).map((okr: any, i: number) => <ObjectiveNode key={i} okr={okr} />)
                }
                {(activeTab === 'kpis' ? (!emp.kpis || emp.kpis.length === 0) : (!emp.okrs || emp.okrs.length === 0)) && (
                  <EmptyState variant="kpis" className="py-8" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
