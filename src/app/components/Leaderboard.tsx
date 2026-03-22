/**
 * Leaderboard — "The Race"
 *
 * Animated bar-race. Switch metrics → bars physically trade positions
 * with spring animations. Race button plays through time.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Diamond, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowLeft, Play, RotateCcw, ChevronRight } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { employees } from '../mockData';

type Metric = 'performance' | 'roi' | 'learning' | 'motivation' | 'welfare';

const metricConfig: Record<Metric, { label: string; key: keyof typeof employees[0]; color: string; suffix: string; max: number }> = {
  performance: { label: 'Output',     key: 'performanceScore', color: '#f43f5e', suffix: 'pt', max: 100 },
  roi:         { label: 'Return',     key: 'roi',              color: '#10b981', suffix: '%',  max: 350 },
  learning:    { label: 'Growth',     key: 'learningProgress', color: '#38bdf8', suffix: '%',  max: 100 },
  motivation:  { label: 'Motivation', key: 'motivationScore',  color: '#f59e0b', suffix: '',   max: 100 },
  welfare:     { label: 'Wellbeing',  key: 'welfareScore',     color: '#c084fc', suffix: '',   max: 100 },
};

// Synthetic quarterly data per employee per metric
function quarterlyData(metric: Metric) {
  const cfg = metricConfig[metric];
  const quarters = ['Q1 \'24', 'Q2 \'24', 'Q3 \'24', 'Q4 \'24', 'Q1 \'25', 'Q2 \'25', 'Q3 \'25', 'Q4 \'25'];
  return employees.map(emp => {
    const base = Number(emp[cfg.key]) || 50;
    return quarters.map((q, i) => {
      const progress = (i + 1) / quarters.length;
      const variation = Math.sin(emp.id.charCodeAt(1) * 7 + i * 1.8) * 14 + Math.cos(emp.id.charCodeAt(1) * 3 + i * 2.5) * 6;
      return { quarter: q, val: Math.round(base * (0.7 + progress * 0.3) + variation) };
    });
  });
}

const QUARTER_LABELS = ['Q1 \'24', 'Q2 \'24', 'Q3 \'24', 'Q4 \'24', 'Q1 \'25', 'Q2 \'25', 'Q3 \'25', 'Q4 \'25'];

export function Leaderboard() {
  const navigate = useNavigate();
  const [metric, setMetric] = useState<Metric>('performance');
  const [qi, setQi] = useState(QUARTER_LABELS.length - 1);
  const [playing, setPlaying] = useState(false);
  const cfg = metricConfig[metric];

  const empQuarterly = useMemo(() => quarterlyData(metric), [metric]);

  // Current values for selected quarter
  const ranked = useMemo(() => {
    return employees.map((emp, i) => ({
      emp,
      val: empQuarterly[i][qi].val,
    })).sort((a, b) => b.val - a.val);
  }, [empQuarterly, qi]);

  const maxVal = Math.max(...ranked.map(r => r.val));

  // Play animation
  useEffect(() => {
    if (!playing) return;
    if (qi >= QUARTER_LABELS.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setQi(q => q + 1), 850);
    return () => clearTimeout(t);
  }, [playing, qi]);

  const play = () => { setQi(0); setPlaying(true); };

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
          <Diamond size={14} style={{ color: '#f59e0b' }} /> Signal Rankings
        </p>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>
            The <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Race</span>
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={play} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-mono transition-all hover:scale-105"
              style={{ background: `${cfg.color}10`, border: `1px solid ${cfg.color}20`, color: cfg.color }}>
              {playing ? <RotateCcw size={12} /> : <Play size={12} />}
              {playing ? 'Racing...' : 'Play race'}
            </button>
            <span className="font-mono text-lg" style={{ color: cfg.color }}>
              {QUARTER_LABELS[qi]}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Metric selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(Object.keys(metricConfig) as Metric[]).map(m => {
          const mc = metricConfig[m];
          const isActive = metric === m;
          return (
            <button key={m} onClick={() => { setMetric(m); setQi(QUARTER_LABELS.length - 1); setPlaying(false); }}
              className="px-5 py-2 rounded-xl text-[11px] uppercase tracking-widest font-mono transition-all"
              style={{
                background: isActive ? `${mc.color}12` : 'var(--p-bg-card)',
                border: `1px solid ${isActive ? mc.color + '25' : 'var(--p-border)'}`,
                color: isActive ? mc.color : 'var(--p-text-dim)',
              }}>
              {mc.label}
            </button>
          );
        })}
      </div>

      {/* The Race — animated bars */}
      <div className="rounded-2xl p-5 md:p-8 mb-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
        <div className="space-y-3">
          {ranked.map((r, rank) => (
            <motion.div key={r.emp.id} layout transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="flex items-center gap-4">
              {/* Rank */}
              <span className="text-sm font-mono w-6 text-center flex-shrink-0" style={{ color: rank === 0 ? '#f59e0b' : 'var(--p-text-ghost)' }}>
                {rank === 0 ? '👑' : String(rank + 1).padStart(2, '0')}
              </span>
              {/* Avatar */}
              <img src={r.emp.avatar} alt={r.emp.name}
                className="w-8 h-8 rounded-full object-cover grayscale flex-shrink-0"
                loading="lazy" decoding="async" />
              {/* Name */}
              <span className="text-sm font-light w-24 flex-shrink-0 truncate" style={{ color: 'var(--p-text-body)' }}>
                {r.emp.name.split(' ')[0]}
              </span>
              {/* Bar */}
              <div className="flex-1 h-5 rounded overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <motion.div className="h-full rounded"
                  style={{ background: `linear-gradient(90deg, ${cfg.color}30, ${cfg.color})` }}
                  animate={{ width: `${(r.val / maxVal) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
              </div>
              {/* Score */}
              <span className="font-mono text-sm w-14 text-right flex-shrink-0" style={{ color: cfg.color }}>
                {r.val}{cfg.suffix}
              </span>
              {/* Trend */}
              {qi > 0 && (() => {
                const prev = empQuarterly[employees.indexOf(r.emp)][qi - 1].val;
                const delta = r.val - prev;
                return delta !== 0 ? (
                  <span className="text-[11px] font-mono w-10 text-right flex-shrink-0" style={{ color: delta > 0 ? '#10b981' : '#f43f5e' }}>
                    {delta > 0 ? '+' : ''}{delta}
                  </span>
                ) : <span className="w-10 flex-shrink-0" />;
              })()}
              {/* Link */}
              <NavLink to={`/app/employee/${r.emp.id}`} className="flex-shrink-0 transition-colors" style={{ color: 'var(--p-text-ghost)' }}>
                <ArrowUpRight size={12} />
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* Time scrubber */}
        <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--p-border)' }}>
          <input type="range" min={0} max={QUARTER_LABELS.length - 1} value={qi}
            onChange={e => { setQi(+e.target.value); setPlaying(false); }}
            className="w-full h-1 rounded-full cursor-pointer appearance-none"
            style={{ accentColor: cfg.color, background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex justify-between mt-2">
            {QUARTER_LABELS.map((q, i) => (
              <span key={i} className="text-[11px] font-mono cursor-pointer" onClick={() => { setQi(i); setPlaying(false); }}
                style={{ color: i === qi ? cfg.color : 'var(--p-text-ghost)' }}>{q}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Average', val: Math.round(ranked.reduce((s, r) => s + r.val, 0) / ranked.length) + cfg.suffix, color: cfg.color },
          { label: 'Leader', val: ranked[0]?.val + cfg.suffix, color: '#f59e0b' },
          { label: 'Spread', val: (ranked[0]?.val - ranked[ranked.length - 1]?.val) + cfg.suffix, color: '#c084fc' },
          { label: 'Above target', val: ranked.filter(r => r.val >= 85).length + ' / ' + ranked.length, color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
            <p className="text-[11px] uppercase tracking-[0.12em] font-mono mb-1.5" style={{ color: 'var(--p-text-ghost)' }}>{s.label}</p>
            <p className="text-xl font-light font-mono" style={{ color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
