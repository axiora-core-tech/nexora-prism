import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, TrendingUp, TrendingDown, Minus, ChevronRight, Filter, CheckCircle2, AlertCircle, XCircle, Crosshair } from 'lucide-react';
import { NavLink } from 'react-router';
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
          : <Minus size={11} className="text-white/30" />}
          <span className="text-sm text-white/70 font-light">{kpi.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] uppercase tracking-widest text-white/20 font-mono">Weight {kpi.weight}%</span>
          <span className="text-sm font-mono" style={{ color }}>
            {kpi.current}{kpi.unit}
            <span className="text-white/20"> / {kpi.target}{kpi.unit}</span>
          </span>
        </div>
      </div>
      <div className="w-full h-px bg-white/5 overflow-hidden">
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
      className="relative bg-white/5 border border-white/5 rounded-[2rem] p-6 overflow-hidden group hover:border-white/10 transition-all duration-500 cursor-crosshair"
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
            <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-mono border"
              style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.color + '30' }}>
              {cfg.label}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-white/20 font-mono">{okr.weight}</span>
          </div>
          <p className="text-white/80 text-sm font-light leading-relaxed">{okr.objective}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-3xl font-light text-white">{okr.progress}</span>
          <span className="text-sm text-white/20">%</span>
        </div>
      </div>

      <div className="w-full h-px bg-white/5 overflow-hidden relative z-10">
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
  const [selectedDept, setSelectedDept] = useState('All');
  const [activeTab, setActiveTab] = useState<'kpis' | 'okrs'>('kpis');

  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];
  const filtered = selectedDept === 'All' ? employees : employees.filter(e => e.department === selectedDept);

  const totalKPIs = employees.flatMap(e => e.kpis || []).length;
  const onTargetKPIs = employees.flatMap(e => (e.kpis || []).filter((k: any) => k.trend === 'up')).length;
  const totalOKRs = employees.flatMap(e => e.okrs || []).length;
  const completedOKRs = employees.flatMap(e => (e.okrs || []).filter((o: any) => o.status === 'completed')).length;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-32 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-12"
      >
        <div>
          <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-2">
            <Crosshair size={14} className="text-amber-400" /> Performance Intelligence
          </p>
          <h1 className="text-7xl md:text-9xl font-light tracking-tighter text-white leading-[0.9]">
            Signal <span className="text-white/30 italic font-serif">Matrix</span>
          </h1>
        </div>
        <div className="flex gap-16 text-right">
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] mb-2">Vectors Nominal</p>
            <p className="text-4xl font-light text-emerald-400">{onTargetKPIs}<span className="text-xl text-white/30">/{totalKPIs}</span></p>
          </div>
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] mb-2">Objectives Resolved</p>
            <p className="text-4xl font-light text-cyan-400">{completedOKRs}<span className="text-xl text-white/30">/{totalOKRs}</span></p>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="flex gap-px p-px bg-white/5 rounded-full border border-white/5">
          {(['kpis', 'okrs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-medium transition-all ${
                activeTab === tab ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'
              }`}
            >
              {tab === 'kpis' ? 'KPI Vectors' : 'Objective Nodes'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Filter size={10} className="text-white/20" />
          <div className="flex gap-2 flex-wrap">
            {departments.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDept(d)}
                className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest transition-all border ${
                  selectedDept === d
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'border-white/5 text-white/30 hover:border-white/10 hover:text-white/60'
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
              className="relative bg-white/5 border border-white/5 rounded-[2rem] p-8 overflow-hidden group hover:border-white/10 transition-all duration-500"
            >
              {/* Ambient glow top-right */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-1000" />

              {/* Employee header */}
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <img src={emp.avatar} alt={emp.name}
                    className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div>
                    <h3 className="text-white font-light text-lg leading-none">{emp.name.split(' ')[0]}</h3>
                    <h3 className="text-white/30 font-serif italic text-sm leading-none mt-0.5">{emp.name.split(' ')[1]}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-widest text-white/30 mb-1">Efficiency</p>
                    <p className="text-2xl font-light text-white">{emp.performanceScore}</p>
                  </div>
                  <NavLink to={`/employee/${emp.id}`}
                    className="p-2 rounded-full bg-white/5 text-white/30 hover:bg-white/10 hover:text-white transition-all"
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
                  <p className="text-white/20 text-xs text-center py-4 font-mono uppercase tracking-widest">No signals defined</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
