import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useNavigate } from 'react-router';
import { employees } from '../mockData';
import { ArrowLeft, Search, Filter, TrendingUp, TrendingDown, Minus,
         ChevronRight, ArrowUpRight, Target, Brain, Heart, Zap,
         Users, Activity, DollarSign, MessageSquare } from 'lucide-react';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

/* ── Department colours ──────────────────────────────────────────────────── */
const deptColor: Record<string,string> = {
  'Core Architecture': '#38bdf8',
  'Product Design':    '#c084fc',
  'Infrastructure':    '#f43f5e',
  'Growth & Marketing':'#f59e0b',
  'Product':           '#10b981',
  'Data Engineering':  '#22d3ee',
  'Research':          '#818cf8',
  'DevOps':            '#fb923c',
};
const color = (dept: string) => deptColor[dept] ?? '#94a3b8';

const allDepts = Array.from(new Set(employees.map(e => e.department)));

/* ── 1:1 prep note snippets (mock) ─────────────────────────────────────── */
const oneOnOneTopics: Record<string, string[]> = {
  e1: ['Discuss Principal Engineer promotion timeline', 'Review code review workload — mentorship hours down'],
  e2: ['Celebrate completed Enterprise Design Systems course', 'Accessibility audit timeline for Q2'],
  e3: ['Urgent: Uptime SLA dropped to 98.7% — root cause analysis', 'Career path discussion — EM interest low probability'],
  e4: ['Q1 lead gen exceeded target by 22% — recognise', 'Cross-team sync frequency needs attention'],
  e5: ['Sprint velocity on track — stakeholder NPS strong', 'Time-to-ship improvement — acknowledge wins'],
  e6: ['Documentation backlog critical — action plan needed', 'Data Freshness SLA declining — prioritise'],
  e7: ['Research sessions exceeded target — strong quarter', 'Time-to-insight slightly above target — discuss'],
  e8: ['High attrition risk (71%) — wellbeing conversation urgent', 'MTTR above target — infra cost concern'],
};

/* ── Employee card in directory ─────────────────────────────────────────── */
function EmpCard({ emp, selected, onSelect }: { emp: any; selected: boolean; onSelect: ()=>void }) {
  const radarData = [
    { subject: 'Perf',  A: emp.performanceScore },
    { subject: 'Learn', A: emp.learningProgress },
    { subject: 'Motiv', A: emp.motivationScore },
    { subject: 'Welf',  A: emp.welfareScore },
  ];
  const topics = oneOnOneTopics[emp.id] || [];
  const c = color(emp.department);

  return (
    <motion.div
      layout
      onClick={onSelect}
      className={`relative rounded-[2rem] border cursor-crosshair overflow-hidden transition-all duration-500 group ${
        selected ? 'border-white/20 bg-white/8' : 'p-border p-bg-card hover:p-border-mid'
      }`}
      data-cursor="View"
    >
      {/* Accent edge */}
      <div className="absolute top-0 left-0 w-full h-0.5 rounded-t-[2rem]" style={{ background: c }} />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <img src={emp.avatar} alt={emp.name}
              className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#030303] ${
              emp.attritionRisk === 'High' ? 'bg-rose-500' :
              emp.attritionRisk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-light truncate">{emp.name}</p>
            <p className="text-xs p-text-dim truncate">{emp.role}</p>
            <span className="text-xs font-mono" style={{ color: c }}>{emp.department.split(' ')[0]}</span>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-light text-white">{emp.performanceScore}</p>
            <p className="text-xs p-text-ghost font-mono">perf</p>
          </div>
        </div>

        {/* Mini metrics row */}
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          {[
            { val: emp.roi+'%', label: 'ROI', color: '#10b981' },
            { val: emp.motivationScore, label: 'Motiv', color: '#f59e0b' },
            { val: emp.welfareScore, label: 'Welf', color: '#c084fc' },
          ].map(m => (
            <div key={m.label} className="p-bg-pill rounded-xl py-1.5">
              <p className="text-sm font-light" style={{ color: m.color }}>{m.val}</p>
              <p className="text-xs p-text-ghost font-mono">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(emp.skills || []).slice(0, 3).map((s: string) => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full p-bg-pill border p-border p-text-dim">
              {s}
            </span>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between border-t p-border pt-3">
          <span className={`text-xs font-mono uppercase tracking-widest ${
            emp.trend === 'up' ? 'text-emerald-400' : emp.trend === 'down' ? 'text-rose-400' : 'p-text-ghost'
          }`}>
            {emp.trend === 'up' ? '↑' : emp.trend === 'down' ? '↓' : '—'} {emp.trend}
          </span>
          <NavLink
            to={`/app/employee/${emp.id}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-xs p-text-dim hover:text-cyan-400 transition-colors font-mono uppercase tracking-widest"
          >
            Profile <ArrowUpRight size={9} />
          </NavLink>
        </div>
      </div>

      {/* 1:1 prep panel — expands when selected */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
            className="overflow-hidden border-t p-border"
          >
            <div className="p-5 bg-white/[0.02]">
              <p className="text-xs uppercase tracking-widest p-text-ghost font-mono mb-3 flex items-center gap-2">
                <MessageSquare size={9} /> 1:1 Prep
              </p>
              <div className="space-y-2">
                {topics.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: c }} />
                    <p className="text-xs p-text-mid leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>

              {/* Mini radar */}
              <div className="mt-4 h-28 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="var(--p-chart-grid)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--p-chart-axis)', fontSize: 9 }} />
                    <Radar dataKey="A" stroke={c} fill={c} fillOpacity={0.12} strokeWidth={1.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export function Team() {
  const navigate = useNavigate();
  const [search, setSearch]     = useState('');
  const [dept, setDept]         = useState('All');
  const [risk, setRisk]         = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.role.toLowerCase().includes(search.toLowerCase()) ||
                        e.department.toLowerCase().includes(search.toLowerCase());
    const matchDept   = dept === 'All' || e.department === dept;
    const matchRisk   = risk === 'All' || e.attritionRisk === risk;
    return matchSearch && matchDept && matchRisk;
  }), [search, dept, risk]);

  /* ── Org analytics ── */
  const avgPerf   = Math.round(employees.reduce((s,e)=>s+e.performanceScore,0)/employees.length);
  const avgMotiv  = Math.round(employees.reduce((s,e)=>s+e.motivationScore,0)/employees.length);
  const avgWelf   = Math.round(employees.reduce((s,e)=>s+e.welfareScore,0)/employees.length);
  const avgROI    = Math.round(employees.reduce((s,e)=>s+e.roi,0)/employees.length);
  const highRisk  = employees.filter(e=>e.attritionRisk==='High').length;
  const trending  = employees.filter(e=>e.trend==='up').length;

  const deptHealth = allDepts.map(d => {
    const group = employees.filter(e => e.department === d);
    return {
      dept: d,
      avg: Math.round(group.reduce((s,e)=>s+e.performanceScore,0)/group.length),
      count: group.length,
      color: color(d),
    };
  }).sort((a,b) => b.avg - a.avg);

  return (
    <div className="page-wrap">

      {/* Hero */}
      <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
        className="mb-16 flex flex-col md:flex-row justify-between items-end gap-12 border-b p-border pb-12">
        <div>
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 p-text-dim hover:p-text-hi text-sm mb-4 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <p className="p-text-lo uppercase tracking-[0.15em] text-sm font-semibold mb-6 flex items-center gap-2">
            <Users size={14} className="text-cyan-400" /> People Directory & Analytics
          </p>
          <h1 className="hero-title font-light text-white whitespace-nowrap">
            Your <span className="p-text-dim italic font-serif">Team</span>
          </h1>
        </div>
        <div className="flex gap-12 text-right">
          <div>
            <p className="p-text-lo uppercase tracking-[0.15em] text-xs mb-2">Members</p>
            <p className="text-4xl font-light text-white">{employees.length}</p>
          </div>
          <div>
            <p className="p-text-lo uppercase tracking-[0.15em] text-xs mb-2">High Risk</p>
            <p className="text-4xl font-light text-rose-400">{highRisk}</p>
          </div>
          <div>
            <p className="p-text-lo uppercase tracking-[0.15em] text-xs mb-2">Trending Up</p>
            <p className="text-4xl font-light text-emerald-400">{trending}</p>
          </div>
        </div>
      </motion.div>

      {/* ── SECTION 1: Org Analytics ────────────────────────────────────── */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.7, delay:0.1 }} className="mb-16">
        <h2 className="text-sm uppercase tracking-[0.15em] p-text-dim font-semibold mb-6 flex items-center gap-3 border-b p-border pb-4">
          <Activity size={12} className="text-cyan-400" /> Organisation Analytics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Avg Performance', val: avgPerf, suffix: '', color: '#c084fc', icon: Target },
            { label: 'Avg Motivation',  val: avgMotiv, suffix: '', color: '#f59e0b', icon: Zap },
            { label: 'Avg Wellbeing',   val: avgWelf,  suffix: '', color: '#10b981', icon: Heart },
            { label: 'Avg ROI',         val: avgROI,   suffix: '%', color: '#38bdf8', icon: DollarSign },
          ].map(m => (
            <div key={m.label} className="p-bg-card border p-border rounded-[2rem] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg" style={{ background: m.color+'18' }}>
                  <m.icon size={12} style={{ color: m.color }} />
                </div>
                <span className="text-xs uppercase tracking-widest p-text-lo">{m.label}</span>
              </div>
              <p className="text-3xl font-light" style={{ color: m.color }}>{m.val}<span className="text-lg p-text-ghost">{m.suffix}</span></p>
            </div>
          ))}
        </div>

        {/* Dept performance bars */}
        <div className="p-bg-card border p-border rounded-[2rem] p-6">
          <p className="text-xs uppercase tracking-widest p-text-ghost font-mono mb-5">Department Performance</p>
          <div className="space-y-3">
            {deptHealth.map(d => (
              <div key={d.dept} className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ background: d.color+'40', border: `1px solid ${d.color}60` }} />
                <div className="w-36 flex-shrink-0">
                  <p className="text-xs p-text-mid truncate">{d.dept.split(' ')[0]}</p>
                  <p className="text-xs p-text-ghost">{d.count} member{d.count!==1?'s':''}</p>
                </div>
                <div className="flex-1 h-1.5 p-bg-pill rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${d.avg}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16,1,0.3,1] }}
                    style={{ background: d.color }} />
                </div>
                <span className="text-sm font-mono w-8 text-right" style={{ color: d.color }}>{d.avg}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── SECTION 2: Directory ────────────────────────────────────────── */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.7, delay:0.2 }}>
        <h2 className="text-sm uppercase tracking-[0.15em] p-text-dim font-semibold mb-6 flex items-center gap-3 border-b p-border pb-4">
          <Users size={12} className="text-purple-400" /> Directory — click any card to open 1:1 prep
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2 p-text-dim" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, role, department…"
              className="w-full pl-10 pr-4 py-3 p-bg-card border p-border rounded-full text-sm p-text-body outline-none focus:p-border-mid transition-colors placeholder:p-text-ghost"
              style={{ background: 'var(--p-bg-card)', borderColor: 'var(--p-border)' }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={dept} onChange={e => setDept(e.target.value)}
              className="px-4 py-2.5 p-bg-card border p-border rounded-full text-xs p-text-mid outline-none cursor-pointer"
              style={{ background: 'var(--p-bg-card)' }}>
              <option value="All">All Depts</option>
              {allDepts.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={risk} onChange={e => setRisk(e.target.value)}
              className="px-4 py-2.5 p-bg-card border p-border rounded-full text-xs p-text-mid outline-none cursor-pointer"
              style={{ background: 'var(--p-bg-card)' }}>
              <option value="All">All Risk</option>
              {['High','Medium','Low'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(e => (
              <EmpCard key={e.id} emp={e}
                selected={selectedId === e.id}
                onSelect={() => setSelectedId(selectedId === e.id ? null : e.id)} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 p-text-ghost">
            <p className="text-sm font-mono uppercase tracking-widest">No team members match your filters</p>
            <button onClick={() => { setSearch(''); setDept('All'); setRisk('All'); }}
              className="mt-4 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono uppercase tracking-widest">
              Clear filters
            </button>
          </div>
        )}
      </motion.div>

    </div>
  );
}
