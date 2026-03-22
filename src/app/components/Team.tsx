/**
 * Team — "The Directory"
 *
 * Org analytics + filterable people directory.
 * Click any person → 1:1 prep panel with custom SVG radar.
 * Zero recharts. Design tokens throughout.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useNavigate } from 'react-router';
import { employees } from '../mockData';
import {
  ArrowLeft, Search, TrendingUp, TrendingDown, Minus,
  ChevronRight, ArrowUpRight, Target, Brain, Heart, Zap,
  Users, Activity, DollarSign, MessageSquare
} from 'lucide-react';

const deptColor: Record<string, string> = {
  'Core Architecture': '#38bdf8', 'User Experience': '#c084fc',
  'Data Infrastructure': '#f43f5e', 'Growth': '#f59e0b',
  'Product': '#10b981', 'Data Engineering': '#22d3ee',
  'Research': '#818cf8', 'DevOps': '#fb923c',
};
const color = (dept: string) => deptColor[dept] ?? '#94a3b8';
const allDepts = Array.from(new Set(employees.map(e => e.department)));

/* 1:1 prep notes */
const oneOnOneTopics: Record<string, string[]> = {
  e1: ['Discuss Principal Engineer promotion timeline', 'Review code review workload — mentorship hours down'],
  e2: ['Celebrate completed Enterprise Design Systems course', 'Accessibility audit timeline for Q2'],
  e3: ['Urgent: Uptime SLA dropped to 98.7% — root cause analysis', 'Career path discussion'],
  e4: ['Q1 lead gen exceeded target by 22% — recognise', 'Cross-team sync frequency needs attention'],
  e5: ['Sprint velocity on track — stakeholder NPS strong', 'Time-to-ship improvement — acknowledge wins'],
  e6: ['Documentation backlog critical — action plan needed', 'Data Freshness SLA declining — prioritise'],
  e7: ['Research sessions exceeded target — strong quarter', 'Time-to-insight slightly above target'],
  e8: ['High attrition risk — wellbeing conversation urgent', 'MTTR above target — infra cost concern'],
};

/* ═══ SVG Mini Radar (replaces recharts) ═══ */
function MiniRadar({ data, accentColor, size = 120 }: { data: { label: string; val: number }[]; accentColor: string; size?: number }) {
  const cx = size / 2, cy = size / 2, maxR = size * 0.36;
  const n = data.length;
  const angleStep = (2 * Math.PI) / n;
  const getPoint = (i: number, r: number) => ({
    x: cx + r * Math.cos(i * angleStep - Math.PI / 2),
    y: cy + r * Math.sin(i * angleStep - Math.PI / 2),
  });

  const dataPts = data.map((d, i) => getPoint(i, (d.val / 100) * maxR));
  const dataPath = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {[0.33, 0.66, 1].map(r => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, r * maxR));
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';
        return <path key={r} d={d} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />;
      })}
      {/* Axes */}
      {data.map((_, i) => {
        const p = getPoint(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />;
      })}
      {/* Data polygon */}
      <path d={dataPath} fill={`${accentColor}12`} stroke={accentColor} strokeWidth={1.5} strokeLinejoin="round" />
      {dataPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={2} fill={accentColor} />)}
      {/* Labels */}
      {data.map((d, i) => {
        const p = getPoint(i, maxR + 14);
        return <text key={i} x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily="'Space Mono',monospace">{d.label}</text>;
      })}
    </svg>
  );
}

/* ═══ Employee Card ═══ */
function EmpCard({ emp, selected, onSelect }: { emp: typeof employees[0]; selected: boolean; onSelect: () => void }) {
  const radarData = [
    { label: 'Perf', val: emp.performanceScore },
    { label: 'Learn', val: emp.learningProgress },
    { label: 'Motiv', val: emp.motivationScore },
    { label: 'Well', val: emp.welfareScore },
  ];
  const topics = oneOnOneTopics[emp.id] || [];
  const c = color(emp.department);

  return (
    <motion.div layout onClick={onSelect}
      className="relative rounded-2xl overflow-hidden transition-all duration-500 group cursor-pointer"
      style={{
        background: selected ? `${c}08` : 'var(--p-bg-card)',
        border: `1px solid ${selected ? c + '25' : 'var(--p-border)'}`,
      }}>
      {/* Accent edge */}
      <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: c }} />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <img src={emp.avatar} alt={emp.name}
              className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              loading="lazy" decoding="async" />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
              emp.attritionRisk === 'High' ? 'bg-rose-500' : emp.attritionRisk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
            }`} style={{ borderColor: 'var(--p-bg)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-light truncate" style={{ color: 'var(--p-text-hi)' }}>{emp.name}</p>
            <p className="text-[12px] truncate" style={{ color: 'var(--p-text-dim)' }}>{emp.role}</p>
            <span className="text-[12px] font-mono" style={{ color: c }}>{emp.department}</span>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-light" style={{ color: 'var(--p-text-hi)' }}>{emp.performanceScore}</p>
            <p className="text-[11px] font-mono" style={{ color: 'var(--p-text-ghost)' }}>perf</p>
          </div>
        </div>

        {/* Mini metrics */}
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          {[
            { val: emp.roi + '%', label: 'ROI', color: '#10b981' },
            { val: emp.motivationScore, label: 'Motiv', color: '#f59e0b' },
            { val: emp.welfareScore, label: 'Well', color: '#c084fc' },
          ].map(m => (
            <div key={m.label} className="rounded-lg py-1.5" style={{ background: 'var(--p-bg-pill)' }}>
              <p className="text-sm font-light" style={{ color: m.color }}>{m.val}</p>
              <p className="text-[11px] font-mono" style={{ color: 'var(--p-text-ghost)' }}>{m.label}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(emp.skills || []).slice(0, 3).map((s: string) => (
            <span key={s} className="text-[12px] px-2 py-0.5 rounded-full"
              style={{ background: 'var(--p-bg-pill)', border: '1px solid var(--p-border)', color: 'var(--p-text-dim)' }}>
              {s}
            </span>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--p-border)' }}>
          <span className={`text-[12px] font-mono uppercase tracking-widest ${
            emp.trend === 'up' ? 'text-emerald-400' : emp.trend === 'down' ? 'text-rose-400' : ''
          }`} style={{ color: emp.trend === 'stable' ? 'var(--p-text-ghost)' : undefined }}>
            {emp.trend === 'up' ? '↑' : emp.trend === 'down' ? '↓' : '—'} {emp.trend}
          </span>
          <NavLink to={`/app/employee/${emp.id}`} onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-[12px] font-mono uppercase tracking-widest transition-colors"
            style={{ color: 'var(--p-text-dim)' }}>
            Profile <ArrowUpRight size={10} />
          </NavLink>
        </div>
      </div>

      {/* 1:1 prep panel */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden" style={{ borderTop: '1px solid var(--p-border)' }}>
            <div className="p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-[11px] uppercase tracking-widest font-mono mb-3 flex items-center gap-2" style={{ color: 'var(--p-text-ghost)' }}>
                <MessageSquare size={10} /> 1:1 prep
              </p>
              <div className="space-y-2 mb-4">
                {topics.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: c }} />
                    <p className="text-[12px] leading-relaxed" style={{ color: 'var(--p-text-mid)' }}>{t}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <MiniRadar data={radarData} accentColor={c} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══ MAIN PAGE ═══ */
export function Team() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [risk, setRisk] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'All' || e.department === dept;
    const matchRisk = risk === 'All' || e.attritionRisk === risk;
    return matchSearch && matchDept && matchRisk;
  }), [search, dept, risk]);

  const avgPerf = Math.round(employees.reduce((s, e) => s + e.performanceScore, 0) / employees.length);
  const avgMotiv = Math.round(employees.reduce((s, e) => s + e.motivationScore, 0) / employees.length);
  const avgWelf = Math.round(employees.reduce((s, e) => s + e.welfareScore, 0) / employees.length);
  const avgROI = Math.round(employees.reduce((s, e) => s + e.roi, 0) / employees.length);
  const highRisk = employees.filter(e => e.attritionRisk === 'High').length;
  const trending = employees.filter(e => e.trend === 'up').length;

  const deptHealth = allDepts.map(d => {
    const group = employees.filter(e => e.department === d);
    return { dept: d, avg: Math.round(group.reduce((s, e) => s + e.performanceScore, 0) / group.length), count: group.length, color: color(d) };
  }).sort((a, b) => b.avg - a.avg);

  return (
    <div className="page-wrap">

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 border-b pb-10" style={{ borderColor: 'var(--p-border)' }}>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm mb-4 transition-colors group" style={{ color: 'var(--p-text-dim)' }}>
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2" style={{ color: 'var(--p-text-lo)' }}>
          <Users size={14} style={{ color: '#38bdf8' }} /> People directory & analytics
        </p>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>
            Your <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Team</span>
          </h1>
          <div className="flex gap-10 text-right">
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--p-text-lo)' }}>Members</p>
              <p className="text-3xl font-light" style={{ color: 'var(--p-text-hi)' }}>{employees.length}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--p-text-lo)' }}>High risk</p>
              <p className="text-3xl font-light" style={{ color: '#f43f5e' }}>{highRisk}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--p-text-lo)' }}>Trending up</p>
              <p className="text-3xl font-light" style={{ color: '#10b981' }}>{trending}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Org analytics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }} className="mb-12">
        <h2 className="text-[11px] uppercase tracking-[0.15em] font-mono mb-6 flex items-center gap-3 pb-4" style={{ color: 'var(--p-text-dim)', borderBottom: '1px solid var(--p-border)' }}>
          <Activity size={12} style={{ color: '#38bdf8' }} /> Organisation analytics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Avg performance', val: avgPerf, suffix: '', color: '#c084fc', icon: Target },
            { label: 'Avg motivation', val: avgMotiv, suffix: '', color: '#f59e0b', icon: Zap },
            { label: 'Avg wellbeing', val: avgWelf, suffix: '', color: '#10b981', icon: Heart },
            { label: 'Avg ROI', val: avgROI, suffix: '%', color: '#38bdf8', icon: DollarSign },
          ].map(m => (
            <div key={m.label} className="p-4 rounded-xl" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <m.icon size={12} style={{ color: m.color }} />
                <span className="text-[11px] uppercase tracking-widest" style={{ color: 'var(--p-text-lo)' }}>{m.label}</span>
              </div>
              <p className="text-2xl font-light" style={{ color: m.color }}>{m.val}<span className="text-base" style={{ color: 'var(--p-text-ghost)' }}>{m.suffix}</span></p>
            </div>
          ))}
        </div>

        {/* Dept bars */}
        <div className="p-5 rounded-xl" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
          <p className="text-[11px] uppercase tracking-widest font-mono mb-4" style={{ color: 'var(--p-text-ghost)' }}>Department performance</p>
          <div className="space-y-3">
            {deptHealth.map(d => (
              <div key={d.dept} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: `${d.color}30`, border: `1px solid ${d.color}50` }} />
                <div className="w-32 flex-shrink-0">
                  <p className="text-[12px] truncate" style={{ color: 'var(--p-text-mid)' }}>{d.dept}</p>
                  <p className="text-[11px]" style={{ color: 'var(--p-text-ghost)' }}>{d.count} member{d.count !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: d.color }}
                    initial={{ width: 0 }} whileInView={{ width: `${d.avg}%` }} viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
                </div>
                <span className="text-sm font-mono w-8 text-right" style={{ color: d.color }}>{d.avg}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Directory */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}>
        <h2 className="text-[11px] uppercase tracking-[0.15em] font-mono mb-6 flex items-center gap-3 pb-4"
          style={{ color: 'var(--p-text-dim)', borderBottom: '1px solid var(--p-border)' }}>
          <Users size={12} style={{ color: '#c084fc' }} /> Directory — click any card to open 1:1 prep
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--p-text-dim)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, role, department…"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-colors"
              style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)', color: 'var(--p-text-body)' }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={dept} onChange={e => setDept(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-[12px] outline-none cursor-pointer"
              style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)', color: 'var(--p-text-mid)' }}>
              <option value="All">All depts</option>
              {allDepts.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={risk} onChange={e => setRisk(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-[12px] outline-none cursor-pointer"
              style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)', color: 'var(--p-text-mid)' }}>
              <option value="All">All risk</option>
              {['High', 'Medium', 'Low'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(e => (
              <EmpCard key={e.id} emp={e} selected={selectedId === e.id}
                onSelect={() => setSelectedId(selectedId === e.id ? null : e.id)} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-sm font-mono uppercase tracking-widest" style={{ color: 'var(--p-text-ghost)' }}>No team members match your filters</p>
            <button onClick={() => { setSearch(''); setDept('All'); setRisk('All'); }}
              className="mt-4 text-[12px] font-mono uppercase tracking-widest transition-colors" style={{ color: '#38bdf8' }}>
              Clear filters
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
