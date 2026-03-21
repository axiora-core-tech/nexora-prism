/**
 * Spectrum — The 6-dimension intelligence page.
 *
 * Design: "Prism Refracted"
 *
 * The page opens with a full-bleed hero showing all six dimensions
 * simultaneously as a prism fan — like light split into its components.
 * Each dimension row is tall and bold: the number is the centrepiece,
 * large enough to feel like architecture, not a table cell.
 * Expanding a dimension floods the screen and reveals a scatter
 * of the entire team mapped along that signal's axis.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useNavigate } from 'react-router';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { employees } from '../mockData';

type DimField = 'performanceScore'|'learningProgress'|'motivationScore'|'welfareScore'|'roi'|'attritionRiskPercentage';

const DIMS = [
  { id:'output',     label:'Output',     sub:'Delivery · KPI · Velocity',        color:'#f43f5e', glow:'rgba(244,63,94,0.2)',    field:'performanceScore'       as DimField, unit:'pt', invert:false,
    insight:'High output with low wellbeing is a burnout signal, not a strength. The two move together until suddenly they don\'t.' },
  { id:'growth',     label:'Growth',     sub:'Learning · Skills · Acquisition',  color:'#10b981', glow:'rgba(16,185,129,0.2)',   field:'learningProgress'       as DimField, unit:'%',  invert:false,
    insight:'The employee learning fastest today is your highest-leverage retention target. Growth drops six months before motivation does.' },
  { id:'motivation', label:'Motivation', sub:'Engagement · Initiative · Drive',  color:'#f59e0b', glow:'rgba(245,158,11,0.2)',   field:'motivationScore'        as DimField, unit:'pt', invert:false,
    insight:'Motivation is the earliest leading indicator of attrition. It drops 3–4 months before a resignation decision is made.' },
  { id:'wellbeing',  label:'Wellbeing',  sub:'Burnout · Stress · Cognitive Load',color:'#c084fc', glow:'rgba(192,132,252,0.2)',  field:'welfareScore'           as DimField, unit:'pt', invert:false,
    insight:'Wellbeing is the dimension most HR tools omit entirely. A person can score 90 on output while burning out.' },
  { id:'return',     label:'Return',     sub:'Revenue · ROI · Capital Value',    color:'#38bdf8', glow:'rgba(56,189,248,0.2)',   field:'roi'                    as DimField, unit:'%',  invert:false,
    insight:'A 200% ROI employee generates double their total cost in value. Knowing this makes promotion and retention decisions obvious.' },
  { id:'risk',       label:'Risk',       sub:'Attrition · Flight · Drift',       color:'#fb923c', glow:'rgba(251,146,60,0.2)',   field:'attritionRiskPercentage'as DimField, unit:'%',  invert:true,
    insight:'Risk is the only dimension where lower is better. A reading above 70% with no intervention is almost always a resignation within 90 days.' },
];

/* ── Prism Hero Visualisation ──────────────────────────────────────────── */
function PrismHero() {
  const [hovered, setHovered] = useState<string|null>(null);
  const cx = 100, cy = 60;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 180 }}>
      <svg width="100%" height={180} viewBox="0 0 700 180" preserveAspectRatio="xMidYMid meet"
        className="overflow-visible">
        <defs>
          {DIMS.map(d => (
            <linearGradient key={d.id} id={`pg-${d.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor={d.color} stopOpacity="0.9"/>
              <stop offset="100%" stopColor={d.color} stopOpacity="0.15"/>
            </linearGradient>
          ))}
          <filter id="prismGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Incoming ray */}
        <motion.line x1={cx} y1={0} x2={cx} y2={cy-4}
          stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="3 3"
          animate={{strokeOpacity:[0.3,0.8,0.3]}} transition={{duration:3,repeat:Infinity}} />

        {/* Prism triangle */}
        <motion.polygon points={`${cx},${cy-18} ${cx+22},${cy+14} ${cx-22},${cy+14}`}
          fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"
          animate={{strokeOpacity:[0.2,0.5,0.2]}} transition={{duration:3,repeat:Infinity}} />

        {/* Refraction node */}
        <motion.circle cx={cx} cy={cy} r={3} fill="white" fillOpacity="0.8"
          animate={{scale:[1,1.8,1], fillOpacity:[0.6,1,0.6]}}
          transition={{duration:2.5,repeat:Infinity}}
          style={{transformOrigin:`${cx}px ${cy}px`}} />

        {/* Six diverging beams — fans out to the right */}
        {DIMS.map((d, i) => {
          const angles = [-22, -13, -4, 5, 14, 23];
          const deg = angles[i];
          const rad = (deg * Math.PI) / 180;
          const len = hovered === d.id ? 580 : 520;
          const ex = cx + len * Math.cos(rad);
          const ey = cy + len * Math.sin(rad);
          const isH = hovered === d.id;

          return (
            <motion.g key={d.id}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'crosshair' }}>
              {/* Glow duplicate */}
              <motion.line x1={cx} y1={cy} x2={ex} y2={ey}
                stroke={d.color} strokeWidth={isH ? 12 : 6}
                strokeOpacity={0.08}
                filter="url(#prismGlow)"
                animate={{ strokeWidth: isH ? 12 : 6 }}
                transition={{ duration: 0.3 }} />
              {/* Main beam */}
              <motion.line x1={cx} y1={cy} x2={ex} y2={ey}
                stroke={`url(#pg-${d.id})`} strokeWidth={isH ? 3 : 2}
                strokeLinecap="round"
                animate={{ strokeWidth: isH ? 3 : 2 }}
                transition={{ duration: 0.3 }} />
              {/* Label at beam end */}
              <motion.text
                x={ex + (deg > 0 ? 6 : 6)} y={ey + 4}
                fontSize={isH ? 11 : 9}
                fontFamily="'Space Mono',monospace"
                fill={d.color} fillOpacity={isH ? 1 : 0.6}
                textAnchor="start"
                animate={{ fontSize: isH ? 11 : 9, fillOpacity: isH ? 1 : 0.6 }}
                transition={{ duration: 0.2 }}>
                {d.label.toUpperCase()}
              </motion.text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Team scatter visualisation ─────────────────────────────────────────── */
function TeamScatter({ field, color, unit, invert }: { field: DimField; color: string; unit: string; invert: boolean }) {
  const values = employees.map(e => ({ emp: e, val: (e as any)[field] as number }));
  const min = Math.min(...values.map(v => v.val));
  const max = Math.max(...values.map(v => v.val));

  return (
    <div className="relative w-full" style={{ height: 120 }}>
      {/* Track line */}
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
        style={{ background: 'rgba(255,255,255,0.08)' }} />

      {/* Scale ticks */}
      {[0,25,50,75,100].map(tick => (
        <div key={tick} className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${tick}%` }}>
          <div className="w-px h-3 -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'rgba(255,255,255,0.12)' }} />
          <span className="absolute top-5 -translate-x-1/2 text-[8px] font-mono"
            style={{ color: 'rgba(255,255,255,0.25)', left: '50%' }}>{tick}</span>
        </div>
      ))}

      {/* Employee avatars positioned by score */}
      {values.map(({ emp, val }, i) => {
        const pct = ((val - 0) / 100) * 100;
        return (
          <motion.div key={emp.id}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
            style={{ left: `${pct}%` }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16,1,0.3,1] }}>
            <NavLink to={`/app/employee/${emp.id}`} onClick={e => e.stopPropagation()}>
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full scale-150 opacity-40"
                  style={{ background: color, filter: 'blur(6px)' }} />
                <img src={emp.avatar} alt={emp.name}
                  className="relative w-8 h-8 rounded-full object-cover border-2 grayscale group-hover:grayscale-0 transition-all duration-500"
                  style={{ borderColor: color + '80' }} />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                  <div className="px-2 py-1 rounded text-[9px] font-mono"
                    style={{ background: '#0a0a0a', border: `1px solid ${color}40`, color }}>
                    {emp.name.split(' ')[0]} · {val}{unit}
                  </div>
                </div>
              </div>
            </NavLink>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */
export function Spectrum() {
  const navigate = useNavigate();
  const [active, setActive] = useState<string|null>(null);

  const orgAvg = (field: DimField) =>
    Math.round(employees.reduce((s,e) => s + (e as any)[field], 0) / employees.length);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: 'var(--p-bg)' }}>

      {/* ── HERO ── */}
      <div className="page-wrap pb-0">
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
          className="mb-0 pb-0">
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 p-text-dim hover:p-text-hi text-sm mb-8 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] p-text-ghost mb-5 flex items-center gap-3">
            <span className="inline-block w-6 h-px" style={{ background:'var(--p-border-hi)' }} />
            People Intelligence · The Six Dimensions
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <h1 className="hero-title font-light text-white">
              The <span className="italic font-serif p-text-dim">Spectrum</span>
            </h1>
            <p className="text-sm p-text-ghost font-light max-w-xs leading-relaxed text-right">
              One score compresses six signals.<br/>
              This page holds them apart.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── PRISM VISUALISATION ── */}
      <div className="px-6 md:px-12 lg:px-24 mb-4">
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.4, duration:1 }}>
          <PrismHero />
        </motion.div>
      </div>

      {/* ── SIX DIMENSION ROWS ── */}
      <div className="w-full border-t" style={{ borderColor:'var(--p-border)' }}>
        {DIMS.map((dim, i) => {
          const isActive = active === dim.id;
          const any      = active !== null;
          const avg      = orgAvg(dim.field);
          const ranked   = [...employees].sort((a,b) =>
            dim.invert
              ? (a as any)[dim.field] - (b as any)[dim.field]
              : (b as any)[dim.field] - (a as any)[dim.field]
          );

          return (
            <motion.div key={dim.id}
              onClick={() => setActive(isActive ? null : dim.id)}
              initial={{ opacity:0, x:-24 }}
              animate={{ opacity: (any && !isActive) ? 0.2 : 1, x:0 }}
              transition={{
                x:       { duration:0.5, delay:i*0.06, ease:[0.16,1,0.3,1] },
                opacity: { duration: any ? 0.12 : 0.5 },
              }}
              className="relative cursor-pointer overflow-hidden border-b"
              style={{ borderColor:'var(--p-border)' }}
              data-cursor={isActive ? 'Close' : 'Expand'}>

              {/* Colour flood */}
              <motion.div className="absolute inset-0 pointer-events-none"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration:0.5 }}
                style={{ background: `linear-gradient(135deg, ${dim.glow} 0%, transparent 60%)` }} />

              {/* Left colour bar */}
              <motion.div className="absolute left-0 top-0 bottom-0 w-1"
                style={{ background: dim.color }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration:0.25 }} />

              {/* ── Collapsed row — always visible ── */}
              <div className="relative z-10 flex items-center gap-4 md:gap-8
                px-6 md:px-12 lg:px-24 py-8">

                {/* Index */}
                <span className="text-[10px] font-mono w-5 flex-shrink-0 tabular-nums"
                  style={{ color: isActive ? dim.color : 'var(--p-text-ghost)' }}>
                  {String(i+1).padStart(2,'0')}
                </span>

                {/* Giant number — always visible, this IS the data */}
                <motion.div className="flex-shrink-0 w-28 md:w-36"
                  animate={{ opacity: 1 }}>
                  <span className="block font-mono tabular-nums leading-none"
                    style={{
                      fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                      color: dim.color,
                      textShadow: isActive ? `0 0 40px ${dim.color}60` : 'none',
                      transition: 'text-shadow 0.4s',
                    }}>
                    {avg}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest mt-1 block"
                    style={{ color: dim.color + '80' }}>{dim.unit}</span>
                </motion.div>

                {/* Label + sub */}
                <div className="flex-shrink-0 w-28 md:w-40">
                  <span className="block font-light leading-tight transition-colors"
                    style={{
                      fontSize:'clamp(1.25rem,2.5vw,2rem)',
                      color: isActive ? 'white' : 'var(--p-text-body)',
                    }}>
                    {dim.label}
                  </span>
                  <span className="hidden md:block text-[10px] font-mono p-text-ghost mt-1">
                    {dim.sub}
                  </span>
                </div>

                {/* Progress track — thick, always visible */}
                <div className="flex-1 relative" style={{ height:12 }}>
                  <div className="absolute inset-0 rounded-full"
                    style={{ background:'rgba(255,255,255,0.05)' }} />
                  <motion.div className="absolute left-0 top-0 h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${dim.color}60, ${dim.color})` }}
                    initial={{ width:0 }}
                    animate={{ width:`${Math.min(avg,100)}%` }}
                    transition={{ duration:1.2, delay:0.2+i*0.09, ease:[0.16,1,0.3,1] }} />
                  {/* Glow on the track */}
                  <motion.div className="absolute left-0 top-0 h-full rounded-full"
                    style={{ background: dim.color, filter:'blur(8px)', opacity:0.25 }}
                    animate={{ width:`${Math.min(avg,100)}%` }}
                    transition={{ duration:1.2, delay:0.2+i*0.09, ease:[0.16,1,0.3,1] }} />
                </div>

                {/* Employee avatar strip — 4 visible */}
                <div className="hidden lg:flex items-center -space-x-2 flex-shrink-0">
                  {ranked.slice(0,4).map((emp,j) => (
                    <motion.img key={emp.id} src={emp.avatar} alt={emp.name}
                      className="w-7 h-7 rounded-full object-cover border-2 grayscale hover:grayscale-0 transition-all duration-500 hover:z-10 hover:scale-125"
                      style={{ borderColor:'var(--p-bg)', zIndex:4-j }}
                      initial={{ opacity:0, x:8 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay:0.6+j*0.05 }} />
                  ))}
                  <span className="ml-3 text-[10px] font-mono p-text-ghost">
                    {ranked.length} nodes
                  </span>
                </div>
              </div>

              {/* ── EXPANDED PANEL ── */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height:0, opacity:0 }}
                    animate={{ height:'auto', opacity:1 }}
                    exit={{ height:0, opacity:0 }}
                    transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
                    className="overflow-hidden">

                    <div className="relative z-10 px-6 md:px-12 lg:px-24 pb-12">
                      {/* Divider */}
                      <div className="h-px mb-10 w-full"
                        style={{ background:`linear-gradient(90deg, ${dim.color}40, transparent)` }} />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* LEFT: Insight + ranked list */}
                        <div>
                          <p className="text-[9px] font-mono uppercase tracking-[0.22em] mb-4"
                            style={{ color: dim.color + '80' }}>Why this matters</p>
                          <p className="font-serif italic leading-relaxed mb-10"
                            style={{
                              fontSize:'clamp(1rem,2vw,1.35rem)',
                              color:'rgba(255,255,255,0.7)',
                            }}>
                            "{dim.insight}"
                          </p>

                          <p className="text-[9px] font-mono uppercase tracking-[0.22em] p-text-ghost mb-5">
                            {dim.invert ? 'Highest risk first' : 'Highest signal first'}
                          </p>
                          <div className="space-y-3">
                            {ranked.map((emp, j) => (
                              <NavLink key={emp.id} to={`/app/employee/${emp.id}`}
                                onClick={e => e.stopPropagation()}
                                className="flex items-center gap-4 group py-1">
                                <span className="text-[10px] font-mono p-text-ghost w-5 tabular-nums flex-shrink-0">
                                  {String(j+1).padStart(2,'0')}
                                </span>
                                <img src={emp.avatar} alt={emp.name}
                                  className="w-8 h-8 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 flex-shrink-0" />
                                <span className="flex-1 text-sm font-light p-text-body group-hover:text-white transition-colors truncate">
                                  {emp.name}
                                </span>
                                {/* Mini bar */}
                                <div className="w-20 h-1 rounded-full flex-shrink-0"
                                  style={{ background:'rgba(255,255,255,0.06)' }}>
                                  <div className="h-full rounded-full"
                                    style={{
                                      width:`${Math.min(((emp as any)[dim.field]/100)*100, 100)}%`,
                                      background: dim.color,
                                    }} />
                                </div>
                                <span className="text-xs font-mono flex-shrink-0 w-12 text-right"
                                  style={{ color:dim.color }}>
                                  {(emp as any)[dim.field]}{dim.unit}
                                </span>
                                <ArrowUpRight size={10}
                                  className="p-text-ghost group-hover:p-text-hi transition-colors flex-shrink-0" />
                              </NavLink>
                            ))}
                          </div>
                        </div>

                        {/* RIGHT: Team scatter */}
                        <div>
                          <p className="text-[9px] font-mono uppercase tracking-[0.22em] p-text-ghost mb-5">
                            Team distribution — each dot is a person
                          </p>
                          <TeamScatter
                            field={dim.field}
                            color={dim.color}
                            unit={dim.unit}
                            invert={dim.invert} />

                          {/* Org avg callout */}
                          <div className="mt-10 flex items-baseline gap-4">
                            <span className="font-mono tabular-nums"
                              style={{
                                fontSize:'clamp(3rem,6vw,5rem)',
                                color:dim.color,
                                textShadow:`0 0 60px ${dim.color}50`,
                                lineHeight:1,
                              }}>
                              {avg}
                            </span>
                            <div>
                              <p className="text-sm text-white font-light">org average</p>
                              <p className="text-[9px] font-mono p-text-ghost uppercase tracking-widest mt-1">{dim.unit} · {dim.label}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="px-6 md:px-12 lg:px-24 py-10 border-t" style={{ borderColor:'var(--p-border)' }}>
        <p className="text-[9px] font-mono p-text-ghost uppercase tracking-widest">
          Signals calculated from continuous review cycles, time-tracking, and wellbeing data · Updated daily
        </p>
      </div>
    </div>
  );
}
