import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Diamond, TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react';
import { NavLink } from 'react-router';
import { employees } from '../mockData';

type Metric = 'performance' | 'roi' | 'learning' | 'motivation' | 'welfare';

const metricConfig: Record<Metric, { label: string; vectorLabel: string; key: keyof typeof employees[0]; color: string; suffix: string }> = {
  performance: { label: 'Efficiency Vector',  vectorLabel: 'Efficiency',  key: 'performanceScore', color: '#c084fc', suffix: '' },
  roi:         { label: 'Capital ROI',         vectorLabel: 'ROI',         key: 'roi',              color: '#10b981', suffix: '%' },
  learning:    { label: 'Neural Acquisition',  vectorLabel: 'Learning',    key: 'learningProgress', color: '#38bdf8', suffix: '%' },
  motivation:  { label: 'Drive Index',         vectorLabel: 'Motivation',  key: 'motivationScore',  color: '#f59e0b', suffix: '' },
  welfare:     { label: 'Bio-Rhythm Score',    vectorLabel: 'Welfare',     key: 'welfareScore',     color: '#f43f5e', suffix: '' },
};

const podiumGlow: Record<number, string> = {
  0: 'rgba(252,211,77,0.12)',
  1: 'rgba(148,163,184,0.08)',
  2: 'rgba(180,83,9,0.08)',
};
const podiumBorder: Record<number, string> = {
  0: 'rgba(252,211,77,0.3)',
  1: 'rgba(148,163,184,0.25)',
  2: 'rgba(180,83,9,0.25)',
};
const rankLabels = ['I', 'II', 'III'];
const rankNumerals = ['01', '02', '03'];

function ranked(metric: Metric) {
  const cfg = metricConfig[metric];
  return [...employees].sort((a, b) => (Number(b[cfg.key])||0) - (Number(a[cfg.key])||0));
}

export function Leaderboard() {
  const [metric, setMetric] = useState<Metric>('performance');
  const rankedEmps = ranked(metric);
  const cfg = metricConfig[metric];
  const topScore = Number(rankedEmps[0]?.[cfg.key]) || 1;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-12"
      >
        <div>
          <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-2">
            <Diamond size={14} className="text-amber-400" /> Performance Rankings
          </p>
          <h1 className="text-7xl md:text-9xl font-light tracking-tighter text-white leading-[0.9]">
            Signal <span className="text-white/30 italic font-serif">Ranking</span>
          </h1>
        </div>
      </motion.div>

      {/* Metric selector */}
      <div className="flex flex-wrap gap-2 mb-20">
        {(Object.keys(metricConfig) as Metric[]).map(m => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`px-6 py-2.5 rounded-full border text-[9px] uppercase tracking-widest font-medium transition-all ${
              metric === m ? 'text-white' : 'text-white/30 border-white/5 hover:border-white/10 hover:text-white/60'
            }`}
            style={metric === m ? {
              borderColor: metricConfig[m].color + '50',
              background: metricConfig[m].color + '12',
              color: metricConfig[m].color
            } : {}}
            data-cursor={metricConfig[m].vectorLabel}
          >
            {metricConfig[m].label}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 mb-16 max-w-xl mx-auto">
        {[rankedEmps[1], rankedEmps[0], rankedEmps[2]].map((emp, i) => {
          if (!emp) return <div key={i}/>;
          const rank = i === 1 ? 0 : i === 0 ? 1 : 2;
          const score = Number(emp[cfg.key]) || 0;
          const heights = ['h-40','h-52','h-36'];

          return (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="flex flex-col items-center"
            >
              <NavLink to={`/employee/${emp.id}`} data-cursor="View Node">
                <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center mb-3 group cursor-crosshair">
                  <div className="relative mb-3">
                    <img src={emp.avatar} alt={emp.name}
                      className="w-14 h-14 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      style={{ outline: `2px solid ${podiumBorder[rank]}`, outlineOffset: '2px' }} />
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border"
                      style={{ background: podiumGlow[rank], borderColor: podiumBorder[rank] }}>
                      {rank + 1}
                    </div>
                  </div>
                  <p className="text-white/80 text-sm font-light text-center">{emp.name.split(' ')[0]}</p>
                  <p className="text-[9px] uppercase tracking-widest text-center mt-0.5 font-mono" style={{ color: cfg.color }}>
                    {score}{cfg.suffix}
                  </p>
                </motion.div>
              </NavLink>

              <div
                className={`w-full ${heights[i]} rounded-t-xl flex items-end justify-center pb-3 border-t-2 transition-all`}
                style={{ background: podiumGlow[rank], borderColor: podiumBorder[rank] }}
              >
                <span className="text-sm font-mono font-light" style={{ color: podiumBorder[rank] }}>0{rank + 1}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full ranking table */}
      <div className="relative bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full pointer-events-none transition-all duration-1000"
          style={{ background: cfg.color + '05' }} />

        <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between relative z-10">
          <p className="text-[9px] uppercase tracking-widest text-white/30 font-mono">Full Ranking · {cfg.label}</p>
          <p className="text-[9px] uppercase tracking-widest text-white/20 font-mono">{employees.length} nodes</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={metric} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {rankedEmps.map((emp, i) => {
              const score = Number(emp[cfg.key]) || 0;
              const pct = (score / topScore) * 100;
              return (
                <motion.div
                  key={emp.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="flex items-center gap-6 px-8 py-5 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors group/row relative z-10"
                  data-cursor="View Node"
                >
                  {/* Rank */}
                  <div className="w-8 text-center flex-shrink-0">
                    {i < 3
                      ? <span className="text-sm font-mono font-light" style={{ color: i === 0 ? '#FCD34D' : i === 1 ? '#94A3B8' : '#B45309' }}>{String(i+1).padStart(2,'0')}</span>
                      : <span className="text-white/20 text-sm font-mono">{i+1}</span>}
                  </div>

                  {/* Employee */}
                  <div className="flex items-center gap-3 w-52 flex-shrink-0">
                    <img src={emp.avatar} alt={emp.name}
                      className="w-9 h-9 rounded-full object-cover grayscale group-hover:grayscale-0 group-hover/row:grayscale group-hover:grayscale-0-0 transition-all duration-500" />
                    <div>
                      <p className="text-white/80 text-sm font-light leading-none">{emp.name.split(' ')[0]}</p>
                      <p className="text-white/30 font-serif italic text-sm leading-none mt-0.5">{emp.name.split(' ')[1]}</p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="w-24 flex-shrink-0 text-right">
                    <span className="text-2xl font-light" style={{ color: cfg.color }}>{score}</span>
                    <span className="text-white/20 text-sm">{cfg.suffix}</span>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-px bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: i * 0.05, ease: [0.16,1,0.3,1] }}
                      className="h-full"
                      style={{ background: `linear-gradient(to right, ${cfg.color}40, ${cfg.color})` }}
                    />
                  </div>

                  {/* Trend */}
                  <div className="w-20 flex-shrink-0 flex items-center justify-end gap-1">
                    <span className={`text-[8px] uppercase tracking-widest flex items-center gap-1 px-2 py-1 rounded-full ${
                      emp.trend === 'up'   ? 'text-emerald-400 bg-emerald-500/10' :
                      emp.trend === 'down' ? 'text-rose-400 bg-rose-500/10' :
                      'text-white/20 bg-white/5'
                    }`}>
                      {emp.trend === 'up' ? <TrendingUp size={8}/> : emp.trend === 'down' ? <TrendingDown size={8}/> : <Minus size={8}/>}
                      {emp.trend}
                    </span>
                  </div>

                  <NavLink to={`/employee/${emp.id}`}
                    className="opacity-0 group-hover/row:opacity-100 transition-opacity p-2 rounded-full bg-white/5 text-white/30 hover:text-white hover:bg-white/10">
                    <ArrowUpRight size={11}/>
                  </NavLink>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Summary nodes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          { label: 'Collective Average', val: Math.round(employees.reduce((s,e)=>(s+Number(e[cfg.key]))||0,0)/employees.length)+cfg.suffix, color: cfg.color },
          { label: 'Peak Signal',        val: topScore+cfg.suffix, color: '#fcd34d' },
          { label: 'Signal Spread',      val: (topScore-(Number(rankedEmps[rankedEmps.length-1]?.[cfg.key])||0))+cfg.suffix, color: '#c084fc' },
          { label: 'Above Threshold',    val: employees.filter(e=>(Number(e[cfg.key])||0)>=85).length+' / '+employees.length, color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="relative bg-white/5 border border-white/5 rounded-[2rem] p-5 overflow-hidden group hover:border-white/10 transition-colors" data-cursor="Stat">
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-[30px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: s.color + '20' }} />
            <p className="text-[8px] uppercase tracking-widest text-white/20 mb-2 font-mono">{s.label}</p>
            <p className="text-2xl font-light relative z-10" style={{ color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
