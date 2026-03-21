/**
 * Spectrum — The Intelligence Nexus
 *
 * Structure:
 *   1. Hero
 *   2. Prism (orbital overview)
 *   3. Dimension Rows (expandable)
 *   4. Interactive Labs:
 *      — What-If Tensioning (correlated sliders with physics)
 *      — Dimension Duel (drag two dims → scatter)
 *      — Time Scrubber (animated quarterly history)
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useNavigate } from 'react-router';
import {
  ArrowLeft, ArrowUpRight, Zap, ShieldAlert, TrendingUp,
  Brain, Heart, DollarSign, Target, ChevronRight,
  Sparkles, Eye, Lightbulb, ArrowRight, Flame,
  SlidersHorizontal, Crosshair, Clock
} from 'lucide-react';
import { employees } from '../mockData';

type DimField = 'performanceScore'|'learningProgress'|'motivationScore'|'welfareScore'|'roi'|'attritionRiskPercentage';

const DIMS = [
  { id:'output',     label:'Output',     sub:'Delivery · KPI · Velocity',        color:'#f43f5e', glow:'rgba(244,63,94,0.12)',    field:'performanceScore'        as DimField, unit:'pt', invert:false, icon:Target,
    insight:'High output with low wellbeing is a burnout signal, not a strength.',
    action:'Cross-reference with Wellbeing — anyone 20+ points apart needs a check-in this week.' },
  { id:'growth',     label:'Growth',     sub:'Learning · Skills · Acquisition',  color:'#10b981', glow:'rgba(16,185,129,0.12)',   field:'learningProgress'        as DimField, unit:'%',  invert:false, icon:TrendingUp,
    insight:'The person learning fastest is your highest-leverage retention target.',
    action:'Invest in employees whose Growth outpaces Output — they\'re scaling up.' },
  { id:'motivation', label:'Motivation', sub:'Engagement · Initiative · Drive',  color:'#f59e0b', glow:'rgba(245,158,11,0.12)',   field:'motivationScore'         as DimField, unit:'pt', invert:false, icon:Zap,
    insight:'Motivation drops 3–4 months before a resignation decision is made.',
    action:'Schedule 1:1s with anyone below 65 — it\'s your last intervention window.' },
  { id:'wellbeing',  label:'Wellbeing',  sub:'Burnout · Stress · Cognitive Load', color:'#c084fc', glow:'rgba(192,132,252,0.12)',  field:'welfareScore'            as DimField, unit:'pt', invert:false, icon:Heart,
    insight:'A person can score 90 on output while burning out.',
    action:'Flag anyone with Wellbeing 20+ points below their Output for immediate support.' },
  { id:'return',     label:'Return',     sub:'Revenue · ROI · Capital Value',    color:'#38bdf8', glow:'rgba(56,189,248,0.12)',   field:'roi'                     as DimField, unit:'%',  invert:false, icon:DollarSign,
    insight:'A 200%+ ROI employee generates double their total cost in value.',
    action:'Promote high-ROI employees before competitors poach them.' },
  { id:'risk',       label:'Risk',       sub:'Attrition · Flight · Drift',       color:'#fb923c', glow:'rgba(251,146,60,0.12)',   field:'attritionRiskPercentage' as DimField, unit:'%',  invert:true,  icon:ShieldAlert,
    insight:'Above 70% with no intervention is almost always a resignation within 90 days.',
    action:'Trigger retention protocol for anyone above 60%. Time is the constraint.' },
];

const orgAvg = (field: DimField) => Math.round(employees.reduce((s,e) => s + (e as any)[field], 0) / employees.length);
const rankEmployees = (dim: typeof DIMS[0]) => [...employees].sort((a,b) => dim.invert ? (a as any)[dim.field]-(b as any)[dim.field] : (b as any)[dim.field]-(a as any)[dim.field]);

/* ═══════════════════════════════════════════════════════════════════════════
   THE PRISM — Self-labeling orbital overview
   ═══════════════════════════════════════════════════════════════════════════ */
function ThePrism({ onSelect }: { onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState<string|null>(null);
  const cx=220, cy=220, baseR=48, gap=27;
  const composite = Math.round(DIMS.reduce((s,d) => s + (d.invert ? 100-orgAvg(d.field) : d.field==='roi' ? Math.min(orgAvg(d.field)/3,100) : orgAvg(d.field)),0)/DIMS.length);

  return (
    <div className="relative flex items-center justify-center" style={{height:460}}>
      <svg width={440} height={440} viewBox="0 0 440 440" className="overflow-visible">
        <defs>
          {DIMS.map(d => (<linearGradient key={`pg-${d.id}`} id={`pg-${d.id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={d.color} stopOpacity={0.95}/><stop offset="100%" stopColor={d.color} stopOpacity={0.35}/></linearGradient>))}
          <filter id="prismGlow"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/></filter>
        </defs>
        {DIMS.map((d,i) => {
          const r=baseR+i*gap, circ=2*Math.PI*r, avg=orgAvg(d.field);
          const pct=(d.invert ? (100-avg) : d.field==='roi' ? Math.min(avg/350,1)*100 : avg)/100;
          const isH=hovered===d.id, anyH=hovered!==null;
          const angle=-90+pct*360, rad=(angle*Math.PI)/180;
          const lx=cx+(r+18)*Math.cos(rad), ly=cy+(r+18)*Math.sin(rad);
          return (<g key={d.id} onMouseEnter={()=>setHovered(d.id)} onMouseLeave={()=>setHovered(null)} onClick={()=>onSelect(d.id)} style={{cursor:'pointer'}}>
            {isH && <circle cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={10} strokeOpacity={0.1} filter="url(#prismGlow)"/>}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={isH?5:3} style={{transition:'stroke-width 0.3s'}}/>
            <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#pg-${d.id})`} strokeWidth={isH?5:3} strokeLinecap="round" strokeDasharray={circ}
              initial={{strokeDashoffset:circ}} animate={{strokeDashoffset:circ*(1-pct),opacity:anyH?(isH?1:0.18):0.85}}
              transition={{strokeDashoffset:{duration:1.6,delay:i*0.1,ease:[0.16,1,0.3,1]},opacity:{duration:0.2}}}
              style={{transform:'rotate(-90deg)',transformOrigin:`${cx}px ${cy}px`}}/>
            <AnimatePresence>{isH && (
              <motion.g initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}>
                <text x={lx} y={ly-7} textAnchor="middle" dominantBaseline="middle" fill={d.color} fontSize={11} fontWeight={500} fontFamily="'Space Mono',monospace">{d.label}</text>
                <text x={lx} y={ly+7} textAnchor="middle" dominantBaseline="middle" fill={d.color} fontSize={10} fontFamily="'Space Mono',monospace" opacity={0.7}>{avg}{d.unit}</text>
              </motion.g>
            )}</AnimatePresence>
          </g>);
        })}
        <motion.text x={cx} y={cy-10} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={42} fontWeight={200} fontFamily="'Space Mono',monospace" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}>{composite}</motion.text>
        <text x={cx} y={cy+16} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={8} fontFamily="'Space Mono',monospace" letterSpacing="0.25em">COMPOSITE</text>
        {!hovered && DIMS.map((d,i) => (<text key={`sl-${d.id}`} x={cx} y={cy-(baseR+i*gap)-8} textAnchor="middle" fill={d.color} fillOpacity={0.5} fontSize={7} fontFamily="'Space Mono',monospace" letterSpacing="0.1em">{d.label.toUpperCase()}</text>))}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEAM SCATTER — Expanded dimension visualization
   ═══════════════════════════════════════════════════════════════════════════ */
function TeamScatter({ dim }: { dim: typeof DIMS[0] }) {
  const values = employees.map(e => ({emp:e, val:(e as any)[dim.field] as number}));
  const avg = orgAvg(dim.field);
  return (
    <div className="relative w-full" style={{height:90}}>
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] rounded-full"
        style={{background:dim.invert?`linear-gradient(90deg,${dim.color}08,${dim.color}50,${dim.color})`:`linear-gradient(90deg,${dim.color},${dim.color}50,${dim.color}08)`}}/>
      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{left:`${Math.min(avg,98)}%`}}>
        <div className="w-px h-8 -translate-y-1/2" style={{background:`${dim.color}35`}}/>
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[7px] font-mono px-1 py-px rounded whitespace-nowrap" style={{background:`${dim.color}12`,color:dim.color}}>AVG {avg}</span>
      </div>
      {values.map(({emp,val},i) => {
        const pct=Math.max(3,Math.min(97,dim.field==='roi'?Math.min(val/350,1)*100:val));
        const jitter=(i%3-1)*9;
        return (<motion.div key={emp.id} className="absolute group" style={{left:`${pct}%`,top:`calc(50% + ${jitter}px)`,transform:'translateX(-50%) translateY(-50%)'}}
          initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:0.15+i*0.04,duration:0.4,ease:[0.16,1,0.3,1]}}>
          <NavLink to={`/app/employee/${emp.id}`} onClick={e => e.stopPropagation()}>
            <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover border-2 grayscale group-hover:grayscale-0 group-hover:scale-125 group-hover:z-20 relative transition-all duration-500" style={{borderColor:`${dim.color}40`}} loading="lazy" decoding="async"/>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              <div className="px-2 py-1 rounded-lg text-[9px] font-mono" style={{background:'var(--p-surface)',border:`1px solid ${dim.color}25`,color:dim.color}}>{emp.name.split(' ')[0]} · {val}{dim.unit}</div>
            </div>
          </NavLink>
        </motion.div>);
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   WHAT-IF TENSIONING
   Drag one dimension → correlated dimensions resist/pull with physics
   ═══════════════════════════════════════════════════════════════════════════ */
function WhatIfTensioning() {
  const base = useMemo(() => Object.fromEntries(DIMS.map(d => [d.field, orgAvg(d.field)])) as Record<DimField,number>, []);
  const [vals, setVals] = useState<Record<DimField,number>>({...base});
  const [dragging, setDragging] = useState<DimField|null>(null);

  const change = useCallback((field: DimField, raw: number) => {
    const nv = {...vals, [field]: raw};
    const delta = raw - base[field];
    // Correlation matrix (simplified but felt)
    if (field === 'performanceScore' && delta > 5) {
      nv.welfareScore = Math.max(30, Math.round(base.welfareScore - delta * 0.45));
      nv.attritionRiskPercentage = Math.min(90, Math.round(base.attritionRiskPercentage + delta * 0.3));
    }
    if (field === 'motivationScore') {
      nv.attritionRiskPercentage = Math.max(5, Math.min(90, Math.round(100 - raw + (Math.random()*8-4))));
      nv.learningProgress = Math.min(100, Math.round(base.learningProgress + (raw - base.motivationScore) * 0.25));
    }
    if (field === 'welfareScore' && raw < 65) {
      nv.attritionRiskPercentage = Math.min(90, Math.round(nv.attritionRiskPercentage + (65 - raw) * 0.5));
      nv.motivationScore = Math.max(30, Math.round(nv.motivationScore - (65 - raw) * 0.3));
    }
    if (field === 'learningProgress') {
      nv.motivationScore = Math.min(100, Math.round(base.motivationScore + (raw - base.learningProgress) * 0.3));
      nv.roi = Math.max(80, Math.round(base.roi + (raw - base.learningProgress) * 1.2));
    }
    if (field === 'roi') {
      nv.performanceScore = Math.min(100, Math.round(base.performanceScore + (raw - base.roi) * 0.05));
    }
    setVals(nv);
  }, [vals, base]);

  const reset = () => setVals({...base});

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {DIMS.map((d,i) => {
          const v = vals[d.field];
          const delta = v - base[d.field];
          const isDragging = dragging === d.field;
          const mx = d.field === 'roi' ? 350 : 100;
          return (
            <div key={d.id} className="p-3.5 rounded-xl transition-all duration-300"
              style={{background:`${d.color}${isDragging?'12':'06'}`, border:`1px solid ${d.color}${isDragging?'25':'10'}`}}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-light" style={{color:isDragging?'white':'var(--p-text-body)'}}>{d.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm tabular-nums" style={{color:d.color}}>{v}</span>
                  {delta !== 0 && (
                    <span className="text-[9px] font-mono" style={{color:delta>0?'#10b981':'#f43f5e'}}>
                      {delta>0?'+':''}{delta}
                    </span>
                  )}
                </div>
              </div>
              <input type="range" min={d.field==='roi'?50:10} max={mx} value={v}
                onChange={e => change(d.field, +e.target.value)}
                onMouseDown={() => setDragging(d.field)}
                onMouseUp={() => setDragging(null)}
                onTouchStart={() => setDragging(d.field)}
                onTouchEnd={() => setDragging(null)}
                className="w-full h-1 rounded-full cursor-pointer appearance-none"
                style={{accentColor:d.color, background:'rgba(255,255,255,0.06)'}}/>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-[8px] font-mono p-text-ghost uppercase tracking-widest">Drag any slider — watch correlated dimensions resist and pull</p>
        <button onClick={reset} className="text-[9px] font-mono px-3 py-1 rounded-lg p-text-dim hover:p-text-hi transition-colors" style={{border:'1px solid var(--p-border)'}}>Reset</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DIMENSION DUEL — Pick two dims → instant scatter plot
   ═══════════════════════════════════════════════════════════════════════════ */
function DimensionDuel() {
  const [dx, setDx] = useState(0); // Output
  const [dy, setDy] = useState(3); // Wellbeing

  const dimX = DIMS[dx], dimY = DIMS[dy];
  const mxX = dimX.field === 'roi' ? 350 : 100;
  const mxY = dimY.field === 'roi' ? 350 : 100;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <select value={dx} onChange={e => setDx(+e.target.value)}
          className="p-bg-input border rounded-lg px-3 py-1.5 font-mono text-xs cursor-pointer"
          style={{borderColor:'var(--p-border)', color:dimX.color, background:'var(--p-bg-input)'}}>
          {DIMS.map((d,i) => <option key={d.id} value={i}>{d.label}</option>)}
        </select>
        <span className="text-xs p-text-ghost font-mono">vs</span>
        <select value={dy} onChange={e => setDy(+e.target.value)}
          className="p-bg-input border rounded-lg px-3 py-1.5 font-mono text-xs cursor-pointer"
          style={{borderColor:'var(--p-border)', color:dimY.color, background:'var(--p-bg-input)'}}>
          {DIMS.map((d,i) => <option key={d.id} value={i}>{d.label}</option>)}
        </select>
      </div>

      <div className="rounded-xl overflow-hidden" style={{background:'rgba(255,255,255,0.01)', border:'1px solid var(--p-border)'}}>
        <svg viewBox="0 0 420 340" style={{width:'100%',maxHeight:340}} className="overflow-visible">
          {/* Grid */}
          <line x1={50} y1={20} x2={50} y2={280} stroke="rgba(255,255,255,0.05)"/>
          <line x1={50} y1={280} x2={400} y2={280} stroke="rgba(255,255,255,0.05)"/>
          {[0.25,0.5,0.75].map(p => (<g key={p}><line x1={50} y1={280-p*260} x2={400} y2={280-p*260} stroke="rgba(255,255,255,0.02)"/><line x1={50+p*350} y1={20} x2={50+p*350} y2={280} stroke="rgba(255,255,255,0.02)"/></g>))}
          {/* Axis labels */}
          <text x={225} y={316} textAnchor="middle" fill={dimX.color} fontSize={10} fontFamily="'Space Mono',monospace">{dimX.label}</text>
          <text x={14} y={150} textAnchor="middle" fill={dimY.color} fontSize={10} fontFamily="'Space Mono',monospace" transform="rotate(-90,14,150)">{dimY.label}</text>
          {/* Dots */}
          {employees.map((emp,i) => {
            const vx = (emp as any)[dimX.field] as number;
            const vy = (emp as any)[dimY.field] as number;
            const px = 50 + (vx/mxX) * 350;
            const py = 280 - (vy/mxY) * 260;
            return (<g key={emp.id}>
              <motion.circle cx={px} cy={py} r={10} fill={`${dimX.color}15`} stroke={dimX.color} strokeWidth={1.5} strokeOpacity={0.5}
                initial={{cx:225,cy:150,opacity:0}} animate={{cx:px,cy:py,opacity:1}} transition={{duration:0.7,delay:i*0.06,ease:[0.16,1,0.3,1]}}/>
              <motion.text x={px} y={py-16} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={9} fontFamily="-apple-system,sans-serif"
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4+i*0.06}}>
                {emp.name.split(' ')[0]}
              </motion.text>
              <motion.text x={px+16} y={py+4} fill="rgba(255,255,255,0.2)" fontSize={7} fontFamily="'Space Mono',monospace"
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5+i*0.06}}>
                {vx},{vy}
              </motion.text>
            </g>);
          })}
        </svg>
      </div>
      <p className="text-[8px] font-mono p-text-ghost uppercase tracking-widest mt-3">
        Try Output vs Wellbeing to spot the burnout cluster · Motivation vs Risk to see the flight corridor
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TIME SCRUBBER — Drag through quarters, everything animates
   ═══════════════════════════════════════════════════════════════════════════ */
function TimeScrubber() {
  const quarters = ["Q1 '25", "Q2 '25", "Q3 '25", "Q4 '25"];
  // Synthetic quarterly history per dimension
  const history = useMemo<Record<string,number[]>>(() => ({
    performanceScore:    [78, 82, 86, orgAvg('performanceScore')],
    learningProgress:    [55, 62, 68, orgAvg('learningProgress')],
    motivationScore:     [82, 79, 74, orgAvg('motivationScore')],
    welfareScore:        [88, 83, 78, orgAvg('welfareScore')],
    roi:                 [180, 210, 230, orgAvg('roi')],
    attritionRiskPercentage: [15, 20, 28, orgAvg('attritionRiskPercentage')],
  }), []);

  const [qi, setQi] = useState(3);

  return (
    <div>
      {/* Score display */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {DIMS.map((d) => {
          const vals = history[d.field];
          const v = vals[qi];
          const prev = qi > 0 ? vals[qi-1] : v;
          const delta = v - prev;
          const improving = d.invert ? delta < 0 : delta > 0;
          return (
            <motion.div key={d.id} className="text-center p-3 rounded-xl"
              style={{background:`${d.color}06`, border:`1px solid ${d.color}10`}}
              animate={{borderColor: `${d.color}${qi===3?'20':'10'}`}}>
              <motion.span className="font-mono text-xl tabular-nums block" style={{color:d.color}}
                key={`${d.id}-${qi}`}
                initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}}>
                {v}
              </motion.span>
              <span className="text-[7px] font-mono p-text-ghost uppercase tracking-widest block mt-1">{d.label}</span>
              {delta !== 0 && (
                <span className="text-[8px] font-mono mt-1 block" style={{color:improving?'#10b981':'#f43f5e'}}>
                  {delta>0?'+':''}{delta}{d.unit}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Scrubber */}
      <div className="flex items-center gap-4">
        <span className="font-mono text-sm" style={{color:'#38bdf8'}}>{quarters[qi]}</span>
        <div className="flex-1">
          <input type="range" min={0} max={3} value={qi} onChange={e => setQi(+e.target.value)}
            className="w-full h-1 rounded-full cursor-pointer appearance-none"
            style={{accentColor:'#38bdf8', background:'rgba(255,255,255,0.06)'}}/>
          <div className="flex justify-between mt-2">
            {quarters.map((q,i) => (
              <span key={i} className="text-[8px] font-mono cursor-pointer" onClick={() => setQi(i)}
                style={{color:i===qi?'#38bdf8':'rgba(255,255,255,0.15)'}}>{q}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[8px] font-mono p-text-ghost uppercase tracking-widest mt-4">
        Watch Motivation erode while Output climbed — the classic burnout pattern
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTERVENTIONS
   ═══════════════════════════════════════════════════════════════════════════ */
function generateInsights() {
  const ins: {type:'critical'|'watch'|'opportunity'; title:string; detail:string; empId?:string; color:string}[] = [];
  employees.forEach(emp => {
    if(emp.performanceScore>85&&emp.welfareScore<65) ins.push({type:'critical',color:'#f43f5e',empId:emp.id,title:`${emp.name.split(' ')[0]} — burnout corridor`,detail:`Output ${emp.performanceScore}pt but Wellbeing ${emp.welfareScore}pt.`});
    if(emp.attritionRiskPercentage>50&&emp.roi>150) ins.push({type:'critical',color:'#fb923c',empId:emp.id,title:`${emp.name.split(' ')[0]} — high-value flight risk`,detail:`${emp.roi}% ROI, ${emp.attritionRiskPercentage}% attrition.`});
    if(emp.learningProgress>emp.performanceScore+5&&emp.motivationScore>75) ins.push({type:'opportunity',color:'#10b981',empId:emp.id,title:`${emp.name.split(' ')[0]} — scaling past role`,detail:`Growth ${emp.learningProgress}% vs Output ${emp.performanceScore}pt.`});
    if(emp.motivationScore<60&&emp.performanceScore>70) ins.push({type:'watch',color:'#f59e0b',empId:emp.id,title:`${emp.name.split(' ')[0]} — motivation decoupling`,detail:`Delivering ${emp.performanceScore}pt but motivation at ${emp.motivationScore}pt.`});
  });
  return ins.sort((a,b)=>({critical:0,watch:1,opportunity:2}[a.type]-{critical:0,watch:1,opportunity:2}[b.type]));
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export function Spectrum() {
  const navigate = useNavigate();
  const [active, setActive] = useState<string|null>(null);
  const [activeLab, setActiveLab] = useState<'tension'|'duel'|'time'|null>(null);
  const insights = useMemo(() => generateInsights(), []);

  const handleRingClick = (id: string) => {
    setActive(prev => prev===id ? null : id);
    setTimeout(() => document.getElementById(`dim-${id}`)?.scrollIntoView({behavior:'smooth',block:'center'}), 100);
  };

  const labs = [
    { id:'tension' as const, icon:SlidersHorizontal, label:'What-If', desc:'Drag dimensions — feel the correlations', color:'#c084fc' },
    { id:'duel' as const, icon:Crosshair, label:'Dimension Duel', desc:'Scatter any two dimensions against each other', color:'#f43f5e' },
    { id:'time' as const, icon:Clock, label:'Time Scrubber', desc:'Travel through quarters — watch signals shift', color:'#38bdf8' },
  ];

  return (
    <div className="w-full min-h-screen pb-32" style={{backgroundColor:'var(--p-bg)'}}>

      {/* ═══ HERO ═══ */}
      <div className="page-wrap pb-0">
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:[0.16,1,0.3,1]}}>
          <button onClick={()=>navigate(-1)} className="inline-flex items-center gap-2 p-text-dim hover:p-text-hi text-sm mb-8 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform"/> Back
          </button>
          <p className="text-[9px] font-mono uppercase tracking-[0.28em] p-text-ghost mb-5 flex items-center gap-3">
            <span className="inline-block w-6 h-px" style={{background:'var(--p-border-hi)'}}/> People Intelligence · Six Dimensions
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-0">
            <h1 className="hero-title font-light text-white">The <span className="italic font-serif p-text-dim">Spectrum</span></h1>
            <p className="text-sm p-text-ghost font-light max-w-xs leading-relaxed md:text-right">One score compresses six signals.<br/>This page holds them apart.</p>
          </div>
        </motion.div>
      </div>

      {/* ═══ PRISM ═══ */}
      <div className="px-6 md:px-12 lg:px-24">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3,duration:1}}>
          <ThePrism onSelect={handleRingClick}/>
        </motion.div>
      </div>

      {/* ═══ DIMENSION ROWS ═══ */}
      <div className="w-full border-t" style={{borderColor:'var(--p-border)'}}>
        {DIMS.map((dim,i) => {
          const isActive=active===dim.id, anyActive=active!==null;
          const avg=orgAvg(dim.field), ranked=rankEmployees(dim);
          const Icon=dim.icon;
          return (
            <motion.div key={dim.id} id={`dim-${dim.id}`} onClick={()=>setActive(isActive?null:dim.id)}
              initial={{opacity:0,x:-20}} animate={{opacity:anyActive&&!isActive?0.25:1,x:0}}
              transition={{x:{duration:0.5,delay:i*0.05,ease:[0.16,1,0.3,1]},opacity:{duration:anyActive?0.15:0.5}}}
              className="relative cursor-pointer overflow-hidden border-b select-none" style={{borderColor:'var(--p-border)'}} data-cursor={isActive?'Close':'Expand'}>
              <motion.div className="absolute inset-0 pointer-events-none" animate={{opacity:isActive?1:0}} transition={{duration:0.4}} style={{background:`linear-gradient(135deg,${dim.glow} 0%,transparent 50%)`}}/>
              <motion.div className="absolute left-0 top-0 bottom-0 w-1" style={{background:dim.color}} animate={{opacity:isActive?1:0}} transition={{duration:0.2}}/>
              <div className="relative z-10 flex items-center gap-4 md:gap-8 px-6 md:px-12 lg:px-24 py-7 md:py-9">
                <span className="text-[10px] font-mono w-5 flex-shrink-0 tabular-nums" style={{color:isActive?dim.color:'var(--p-text-ghost)'}}>{String(i+1).padStart(2,'0')}</span>
                <Icon size={15} className="flex-shrink-0 hidden md:block" style={{color:dim.color,opacity:isActive?1:0.5}}/>
                <span className="flex-shrink-0 w-20 md:w-28 font-mono tabular-nums leading-none" style={{fontSize:'clamp(2rem,4.5vw,3.5rem)',color:dim.color,textShadow:isActive?`0 0 40px ${dim.color}50`:'none',transition:'text-shadow 0.4s'}}>
                  {avg}<span className="text-[10px] font-mono tracking-widest ml-1" style={{color:`${dim.color}70`}}>{dim.unit}</span>
                </span>
                <div className="flex-shrink-0 w-24 md:w-36">
                  <span className="block font-light leading-tight transition-colors" style={{fontSize:'clamp(1.1rem,2vw,1.6rem)',color:isActive?'white':'var(--p-text-body)'}}>{dim.label}</span>
                  <span className="hidden md:block text-[9px] font-mono p-text-ghost mt-0.5">{dim.sub}</span>
                </div>
                <div className="flex-1 relative hidden sm:block" style={{height:10}}>
                  <div className="absolute inset-0 rounded-full" style={{background:'rgba(255,255,255,0.04)'}}/>
                  <motion.div className="absolute left-0 top-0 h-full rounded-full" style={{background:`linear-gradient(90deg,${dim.color}50,${dim.color})`}} initial={{width:0}} animate={{width:`${Math.min(dim.invert?100-avg:dim.field==='roi'?Math.min(avg/350*100,100):avg,100)}%`}} transition={{duration:1.2,delay:0.15+i*0.08,ease:[0.16,1,0.3,1]}}/>
                </div>
                <div className="hidden lg:flex items-center -space-x-2 flex-shrink-0">
                  {ranked.slice(0,3).map((emp,j) => (
                    <motion.img key={emp.id} src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover border-2 grayscale hover:grayscale-0 transition-all duration-500 hover:z-10 hover:scale-125" style={{borderColor:'var(--p-bg)',zIndex:3-j}} loading="lazy" decoding="async" initial={{opacity:0,x:6}} animate={{opacity:1,x:0}} transition={{delay:0.5+j*0.04}}/>
                  ))}
                </div>
              </div>
              <AnimatePresence>{isActive && (
                <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}} className="overflow-hidden">
                  <div className="relative z-10 px-6 md:px-12 lg:px-24 pb-10">
                    <div className="h-px mb-8" style={{background:`linear-gradient(90deg,${dim.color}30,transparent 60%)`}}/>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="space-y-6">
                        <div><p className="text-[8px] font-mono uppercase tracking-[0.22em] mb-3" style={{color:`${dim.color}70`}}><Lightbulb size={9} className="inline mr-1.5" style={{color:dim.color}}/> Why this matters</p><p className="font-serif italic leading-relaxed p-text-mid" style={{fontSize:'clamp(0.85rem,1.4vw,1.05rem)'}}>"{dim.insight}"</p></div>
                        <div className="p-3.5 rounded-xl" style={{background:`${dim.color}06`,border:`1px solid ${dim.color}12`}}><p className="text-[8px] font-mono uppercase tracking-[0.22em] mb-1.5" style={{color:dim.color}}><ArrowRight size={8} className="inline mr-1"/> Action</p><p className="text-xs p-text-body leading-relaxed">{dim.action}</p></div>
                      </div>
                      <div className="lg:col-span-2 space-y-8">
                        <div><p className="text-[8px] font-mono uppercase tracking-[0.22em] p-text-ghost mb-5">Team distribution — each face is a person</p><TeamScatter dim={dim}/></div>
                        <div className="grid grid-cols-2 gap-6">
                          {[{title:dim.invert?'Lowest risk':'Top signal',list:ranked.slice(0,3),good:true},{title:dim.invert?'Highest risk':'Needs attention',list:ranked.slice(-3).reverse(),good:false}].map((col,ci) => (
                            <div key={ci}><p className="text-[8px] font-mono uppercase tracking-[0.22em] mb-3" style={{color:col.good?`${dim.color}70`:'var(--p-text-ghost)'}}>{col.title}</p>
                              {col.list.map((emp,j) => (<NavLink key={emp.id} to={`/app/employee/${emp.id}`} onClick={e=>e.stopPropagation()} className="flex items-center gap-2.5 py-1.5 group"><span className="text-[9px] font-mono p-text-ghost w-3">{col.good?j+1:employees.length-2+j}</span><img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" loading="lazy" decoding="async"/><span className="flex-1 text-xs font-light p-text-body group-hover:text-white transition-colors truncate">{emp.name}</span><span className="text-xs font-mono" style={{color:col.good?dim.color:'var(--p-text-dim)'}}>{(emp as any)[dim.field]}{dim.unit}</span><ArrowUpRight size={8} className="p-text-ghost group-hover:p-text-hi transition-colors"/></NavLink>))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}</AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ═══ INTELLIGENCE ═══ */}
      {insights.length > 0 && (
        <div className="px-6 md:px-12 lg:px-24 py-10">
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}}>
            <div className="flex items-center gap-2 mb-6"><Brain size={13} className="p-text-mid"/><p className="text-[9px] font-mono uppercase tracking-[0.22em] p-text-ghost">Cross-dimensional patterns</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.slice(0,4).map((ins,i) => {
                const cfg={critical:{label:'Critical',icon:Flame},watch:{label:'Watch',icon:Eye},opportunity:{label:'Opportunity',icon:Sparkles}}[ins.type];
                const Icon=cfg.icon;
                return (<motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="rounded-xl p-4 group transition-all duration-300 hover:scale-[1.005]" style={{background:`${ins.color}06`,border:`1px solid ${ins.color}12`,cursor:ins.empId?'pointer':'default'}} onClick={()=>ins.empId&&navigate(`/app/employee/${ins.empId}`)} data-cursor={ins.empId?'View':undefined}>
                  <div className="flex items-start gap-3"><Icon size={11} className="flex-shrink-0 mt-0.5" style={{color:ins.color}}/><div className="flex-1 min-w-0"><span className="text-[7px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded mb-1.5 inline-block" style={{background:`${ins.color}12`,color:ins.color}}>{cfg.label}</span><p className="text-sm font-light text-white leading-snug mb-0.5">{ins.title}</p><p className="text-xs p-text-dim leading-relaxed">{ins.detail}</p></div>{ins.empId && <ChevronRight size={12} className="p-text-ghost group-hover:p-text-mid transition-colors flex-shrink-0 mt-1"/>}</div>
                </motion.div>);
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══ INTERACTIVE LABS ═══ */}
      <div className="px-6 md:px-12 lg:px-24 py-8 border-t" style={{borderColor:'var(--p-border)'}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}}>
          <p className="text-[9px] font-mono uppercase tracking-[0.22em] p-text-ghost mb-2">Interactive Labs</p>
          <h2 className="text-xl font-light text-white mb-6">
            Play with the <span className="italic font-serif p-text-dim">data</span>
          </h2>

          {/* Lab selector */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {labs.map(lab => {
              const isActive = activeLab === lab.id;
              return (
                <button key={lab.id} onClick={() => setActiveLab(isActive ? null : lab.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300"
                  style={{background:isActive?`${lab.color}12`:'var(--p-bg-card)', border:`1px solid ${isActive?lab.color+'25':'var(--p-border)'}`, color:isActive?lab.color:'var(--p-text-dim)'}}>
                  <lab.icon size={13}/>
                  <span className="text-xs font-light">{lab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active lab */}
          <AnimatePresence mode="wait">
            {activeLab && (
              <motion.div key={activeLab}
                initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
                transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
                className="p-6 rounded-2xl" style={{background:'var(--p-bg-card)', border:'1px solid var(--p-border)'}}>
                {activeLab === 'tension' && <WhatIfTensioning/>}
                {activeLab === 'duel' && <DimensionDuel/>}
                {activeLab === 'time' && <TimeScrubber/>}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <div className="px-6 md:px-12 lg:px-24 py-8 border-t" style={{borderColor:'var(--p-border)'}}>
        <p className="text-[8px] font-mono p-text-ghost uppercase tracking-widest">Signals from continuous review cycles, time-tracking, wellbeing data & economic models · Updated daily</p>
      </div>
    </div>
  );
}
