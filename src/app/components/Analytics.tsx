/**
 * Analytics — "Global Models"
 *
 * Tabs:
 *   1. Overview — Revenue, attrition, performance, employee matrix (original recharts)
 *   2. Capital Dynamics — Magnetic chart, forecast, departure cost (from ROI page, no race)
 *   3. Wellbeing — Radar, learning, burnout matrix (original recharts)
 *   4. Simulation Lab — Correlation Engine, Signal Scatter, Temporal Rewind (from Spectrum)
 *
 * Insights & Actions panel above tabs.
 */

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity, TrendingUp, AlertTriangle, BrainCircuit, DollarSign, Target, Users, Zap,
  ArrowLeft, Brain, Lightbulb, Flame, Eye, Sparkles, ChevronRight,
  Magnet, Ghost, DoorOpen, X, ArrowUpRight, Cpu, Coins,
  SlidersHorizontal, Crosshair, Clock,
  ShieldAlert, Heart
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid,
  ComposedChart, Line, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { performanceData, globalRevenueForecast, globalLearningData, orgROIData, departmentROI, employees } from '../mockData';

/* ═══ SHARED ═══ */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-bg-surface border p-border-mid rounded-xl p-3 text-xs">
      <p className="p-text-lo mb-2 uppercase tracking-widest">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.stroke || p.fill }} />
          <span className="p-text-mid">{p.name}:</span>
          <span className="text-white font-mono">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const radarData = [
  { metric: 'Performance', score: 84 }, { metric: 'Engagement', score: 78 },
  { metric: 'Learning', score: 68 }, { metric: 'Wellbeing', score: 76 },
  { metric: 'Innovation', score: 82 }, { metric: 'Collaboration', score: 71 },
];

/* ═══ DIMS CONFIG (for Simulation Lab) ═══ */
type DimField = 'performanceScore'|'learningProgress'|'motivationScore'|'welfareScore'|'roi'|'attritionRiskPercentage';
const DIMS = [
  { id:'output', label:'Output', color:'#f43f5e', field:'performanceScore' as DimField, unit:'pt', invert:false, icon:Target },
  { id:'growth', label:'Growth', color:'#10b981', field:'learningProgress' as DimField, unit:'%', invert:false, icon:TrendingUp },
  { id:'motivation', label:'Motivation', color:'#f59e0b', field:'motivationScore' as DimField, unit:'pt', invert:false, icon:Zap },
  { id:'wellbeing', label:'Wellbeing', color:'#c084fc', field:'welfareScore' as DimField, unit:'pt', invert:false, icon:Heart },
  { id:'return', label:'Return', color:'#38bdf8', field:'roi' as DimField, unit:'%', invert:false, icon:DollarSign },
  { id:'risk', label:'Risk', color:'#fb923c', field:'attritionRiskPercentage' as DimField, unit:'%', invert:true, icon:ShieldAlert },
];
const orgAvg = (field: DimField) => Math.round(employees.reduce((s,e) => s + (e as any)[field], 0) / employees.length);

/* ═══════════════════════════════════════════════════════════════════════════
   CAPITAL DYNAMICS COMPONENTS (from ROI page)
   ═══════════════════════════════════════════════════════════════════════════ */

function MagneticChart({ data }: { data: typeof orgROIData }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mouse, setMouse] = useState({x:-100,y:-100});
  const [closest, setClosest] = useState<number|null>(null);
  const W=700, H=320, pad={l:50,r:20,t:30,b:45};
  const cw=W-pad.l-pad.r, ch=H-pad.t-pad.b;
  const allV = data.flatMap(d => [d.totalValue, d.totalInvestment]);
  const maxV = Math.max(...allV)*1.15;
  const sx = (i:number) => pad.l + (i/(data.length-1))*cw;
  const sy = (v:number) => pad.t + ch - (v/maxV)*ch;
  const onMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = (e.clientX-rect.left)/(rect.width)*W;
    const my = (e.clientY-rect.top)/(rect.height)*H;
    setMouse({x:mx,y:my});
    let minD=Infinity, minI=-1;
    data.forEach((_,i) => { const d=Math.hypot(mx-sx(i),my-sy(_.totalValue)); if(d<minD){minD=d;minI=i;} });
    setClosest(minD<80?minI:null);
  }, [data]);
  const buildPath = (pts:{x:number,y:number}[]) => {
    let d=`M ${pts[0].x},${pts[0].y}`;
    for(let i=1;i<pts.length;i++){const p=pts[i-1],c=pts[i];const cpx=(p.x+c.x)/2;d+=` C ${cpx},${p.y} ${cpx},${c.y} ${c.x},${c.y}`;}
    return d;
  };
  const valPts = data.map((_,i) => ({x:sx(i),y:sy(_.totalValue)}));
  const invPts = data.map((_,i) => ({x:sx(i),y:sy(_.totalInvestment)}));
  const valPath = buildPath(valPts);
  const areaPath = valPath + ` L ${valPts[valPts.length-1].x},${pad.t+ch} L ${valPts[0].x},${pad.t+ch} Z`;
  return (
    <svg ref={svgRef} width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="overflow-visible cursor-none"
      onMouseMove={onMove} onMouseLeave={() => {setMouse({x:-100,y:-100});setClosest(null);}}>
      <defs><linearGradient id="magFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.12}/><stop offset="100%" stopColor="#10b981" stopOpacity={0.01}/></linearGradient></defs>
      {[0.25,0.5,0.75,1].map(p => (<g key={p}><line x1={pad.l} y1={pad.t+ch*(1-p)} x2={W-pad.r} y2={pad.t+ch*(1-p)} stroke="rgba(255,255,255,0.03)"/><text x={pad.l-8} y={pad.t+ch*(1-p)+3} textAnchor="end" fill="rgba(255,255,255,0.15)" fontSize={11} fontFamily="'Space Mono',monospace">${(maxV*p).toFixed(1)}M</text></g>))}
      <path d={areaPath} fill="url(#magFill)"/>
      <path d={buildPath(invPts)} fill="none" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="5 4" strokeOpacity={0.4}/>
      <path d={valPath} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round"/>
      <circle cx={mouse.x} cy={mouse.y} r={60} fill="rgba(56,189,248,0.03)"/><circle cx={mouse.x} cy={mouse.y} r={3} fill="rgba(56,189,248,0.3)"/>
      {data.map((d,i) => {
        const bx=sx(i), by=sy(d.totalValue); const dist=Math.hypot(mouse.x-bx,mouse.y-by); const pull=Math.max(0,1-dist/100);
        const dx=(mouse.x-bx)*pull*0.12, dy=(mouse.y-by)*pull*0.12; const isClose=closest===i;
        return (<g key={i}>
          <circle cx={sx(i)} cy={sy(d.totalInvestment)} r={3} fill="#f43f5e" fillOpacity={0.4}/>
          <circle cx={bx+dx} cy={by+dy} r={isClose?8:4} fill={isClose?"#10b981":"rgba(16,185,129,0.6)"} style={{transition:'r 0.15s'}}/>
          {isClose && <><line x1={bx} y1={by+10} x2={bx} y2={pad.t+ch} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 3"/>
            <g transform={`translate(${Math.min(bx+14,W-135)},${Math.max(by-60,10)})`}><rect x={0} y={0} width={125} height={72} rx={8} fill="#0a0a0a" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5}/>
              <text x={10} y={16} fontSize={11} fontFamily="'Space Mono',monospace" fill="rgba(255,255,255,0.35)">{d.month}</text>
              <text x={10} y={34} fontSize={12} fontFamily="'Space Mono',monospace" fill="#10b981">${d.totalValue}M value</text>
              <text x={10} y={50} fontSize={12} fontFamily="'Space Mono',monospace" fill="#f43f5e">${d.totalInvestment}M invested</text>
              <text x={10} y={66} fontSize={12} fontFamily="'Space Mono',monospace" fill="#f59e0b">{d.roi}% ROI</text>
            </g></>}
          <text x={sx(i)} y={H-10} textAnchor="middle" fill={isClose?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.2)"} fontSize={11} fontFamily="'Space Mono',monospace">{d.month}</text>
        </g>);
      })}
      <g transform={`translate(${pad.l},${H-2})`}>
        <line x1={0} y1={-3} x2={14} y2={-3} stroke="#10b981" strokeWidth={2}/><text x={18} y={0} fontSize={11} fontFamily="'Space Mono',monospace" fill="rgba(255,255,255,0.25)">Value</text>
        <line x1={65} y1={-3} x2={79} y2={-3} stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 3"/><text x={83} y={0} fontSize={11} fontFamily="'Space Mono',monospace" fill="rgba(255,255,255,0.25)">Investment</text>
      </g>
    </svg>
  );
}

function GhostHorizon({ data }: { data: typeof orgROIData }) {
  const [growth, setGrowth] = useState(8);
  const lastROI = data[data.length-1].roi;
  const forecast = [lastROI, Math.round(lastROI*(1+growth/100)), Math.round(lastROI*(1+growth/100)**2)];
  const allROI = [...data.map(d=>d.roi), ...forecast.slice(1)];
  const maxR = Math.max(...allROI)*1.1;
  const months = [...data.map(d=>d.month), "Jul", "Aug"];
  const W=600, H=220, pad={l:40,r:20,t:20,b:35};
  const cw=W-pad.l-pad.r, ch=H-pad.t-pad.b;
  const sx = (i:number) => pad.l + (i/(months.length-1))*cw;
  const sy = (v:number) => pad.t + ch - (v/maxR)*ch;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%'}} className="overflow-visible">
        {[0.25,0.5,0.75,1].map(p => <line key={p} x1={pad.l} y1={pad.t+ch*(1-p)} x2={W-pad.r} y2={pad.t+ch*(1-p)} stroke="rgba(255,255,255,0.03)"/>)}
        <rect x={sx(data.length-1)} y={pad.t} width={sx(months.length-1)-sx(data.length-1)} height={ch} fill="rgba(56,189,248,0.02)" rx={4}/>
        <text x={(sx(data.length-1)+sx(months.length-1))/2} y={pad.t+12} textAnchor="middle" fill="rgba(56,189,248,0.15)" fontSize={10} fontFamily="'Space Mono',monospace">FORECAST</text>
        <polygon points={forecast.map((v,i)=>`${sx(data.length-1+i)},${sy(v*0.92)}`).join(' ')+' '+[...forecast].reverse().map((v,i)=>`${sx(data.length-1+(forecast.length-1-i))},${sy(v*1.08)}`).join(' ')} fill="rgba(56,189,248,0.04)" stroke="rgba(56,189,248,0.08)" strokeWidth={0.5}/>
        <polyline points={data.map((d,i)=>`${sx(i)},${sy(d.roi)}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round"/>
        {data.map((d,i) => <circle key={i} cx={sx(i)} cy={sy(d.roi)} r={4} fill="#f59e0b"/>)}
        <polyline points={forecast.map((v,i)=>`${sx(data.length-1+i)},${sy(v)}`).join(' ')} fill="none" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="6 4"/>
        {forecast.slice(1).map((v,i) => <circle key={i} cx={sx(data.length+i)} cy={sy(v)} r={3} fill="#38bdf8" fillOpacity={0.6}/>)}
        {months.map((m,i) => <text key={i} x={sx(i)} y={H-6} textAnchor="middle" fill={i>=data.length?"rgba(56,189,248,0.3)":"rgba(255,255,255,0.2)"} fontSize={11} fontFamily="'Space Mono',monospace">{m}</text>)}
        {forecast.slice(1).map((v,i) => <text key={i} x={sx(data.length+i)} y={sy(v)-12} textAnchor="middle" fill="#38bdf8" fontSize={11} fontFamily="'Space Mono',monospace" fillOpacity={0.7}>{v}%</text>)}
      </svg>
      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs font-mono p-text-ghost">Growth rate</span>
        <input type="range" min={-5} max={20} value={growth} onChange={e=>setGrowth(+e.target.value)} className="flex-1 h-1 rounded-full cursor-pointer appearance-none" style={{accentColor:'#38bdf8', background:'rgba(255,255,255,0.06)'}}/>
        <span className="font-mono text-sm" style={{color:'#38bdf8'}}>{growth}%</span>
      </div>
    </div>
  );
}

function CostOfDeparture() {
  const [sel, setSel] = useState<string|null>(null);
  const emp = sel ? employees.find(e => e.id === sel) : null;
  return (
    <div>
      {!emp ? (
        <>
          <p className="text-xs font-mono p-text-ghost uppercase tracking-widest mb-3">Click any person to model departure cost</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {employees.map(e => (
              <button key={e.id} onClick={() => setSel(e.id)} className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] group" style={{background:'var(--p-bg-card)', border:'1px solid var(--p-border)'}}>
                <img src={e.avatar} alt={e.name} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 flex-shrink-0"/>
                <div className="min-w-0 flex-1"><p className="text-sm font-light text-white truncate">{e.name}</p><div className="flex items-center gap-2 mt-1"><span className="font-mono text-xs" style={{color:e.roi>=200?'#10b981':e.roi>=150?'#38bdf8':'#f59e0b'}}>{e.roi}%</span><span className="text-xs p-text-ghost font-mono">ROI</span></div></div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="rounded-2xl p-6 relative overflow-hidden" style={{background:'rgba(244,63,94,0.04)', border:'1px solid rgba(244,63,94,0.12)'}}>
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full blur-[80px] pointer-events-none" style={{background:'rgba(244,63,94,0.06)'}}/>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-4"><img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full object-cover" style={{border:'2px solid rgba(244,63,94,0.3)'}}/><div><p className="text-lg font-light text-white">{emp.name}</p><p className="text-xs p-text-dim">{emp.role} · {emp.department}</p></div></div>
            <button onClick={() => setSel(null)} className="p-2 rounded-lg hover:bg-white/5 transition-colors p-text-ghost hover:p-text-hi"><X size={16}/></button>
          </div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] mb-4 relative z-10" style={{color:'rgba(244,63,94,0.6)'}}>If {emp.name.split(' ')[0]} leaves your organization</p>
          <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
            {[{label:'Replacement cost', val:`$${Math.round(emp.costInvestment*1.5/1000)}K`, sub:'1.5× annual comp', color:'#f43f5e'},{label:'Lost value / quarter', val:`$${Math.round(emp.revenueContribution*0.4/1000)}K`, sub:'Pipeline + tribal knowledge', color:'#f43f5e'},{label:'Time to replace', val:`${(3+Math.sin(emp.id.charCodeAt(1))*1.5).toFixed(1)} mo`, sub:'Recruit + ramp + proficiency', color:'#f43f5e'}].map((m,i) => (
              <div key={i} className="p-4 rounded-xl" style={{background:'rgba(244,63,94,0.04)', border:'1px solid rgba(244,63,94,0.08)'}}><motion.span className="font-mono text-2xl block" style={{color:m.color}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2+i*0.1}}>{m.val}</motion.span><span className="text-xs font-mono p-text-ghost uppercase tracking-widest block mt-1">{m.label}</span><span className="text-[11px] p-text-dim block mt-0.5">{m.sub}</span></div>
            ))}
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl relative z-10" style={{background:'rgba(255,255,255,0.02)', border:'1px solid var(--p-border)'}}>
            <div className="w-1 h-8 rounded-full flex-shrink-0" style={{background:emp.attritionRiskPercentage>50?'#f43f5e':emp.attritionRiskPercentage>25?'#f59e0b':'#10b981'}}/>
            <div><p className="text-xs p-text-body">Current flight risk: <span className="font-mono" style={{color:emp.attritionRiskPercentage>50?'#f43f5e':'#f59e0b'}}>{emp.attritionRiskPercentage}%</span></p><p className="text-xs p-text-dim mt-0.5">Current ROI: <span className="font-mono text-emerald-400">{emp.roi}%</span> · Total annual value: <span className="font-mono">${Math.round(emp.revenueContribution/1000)}K</span></p></div>
          </div>
          <NavLink to={`/app/employee/${emp.id}`} className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-xs font-mono transition-all hover:scale-105 relative z-10" style={{background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.15)', color:'#f43f5e'}}>View full profile <ArrowUpRight size={11}/></NavLink>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIMULATION LAB COMPONENTS (from Spectrum)
   ═══════════════════════════════════════════════════════════════════════════ */

function CorrelationEngine() {
  const base = useMemo(() => Object.fromEntries(DIMS.map(d => [d.field, orgAvg(d.field)])) as Record<DimField,number>, []);
  const [vals, setVals] = useState<Record<DimField,number>>({...base});
  const [dragging, setDragging] = useState<DimField|null>(null);
  const change = useCallback((field: DimField, raw: number) => {
    const nv = {...vals, [field]: raw}; const delta = raw - base[field];
    if (field === 'performanceScore' && delta > 5) { nv.welfareScore = Math.max(30, Math.round(base.welfareScore - delta * 0.45)); nv.attritionRiskPercentage = Math.min(90, Math.round(base.attritionRiskPercentage + delta * 0.3)); }
    if (field === 'motivationScore') { nv.attritionRiskPercentage = Math.max(5, Math.min(90, Math.round(100 - raw + (Math.random()*8-4)))); nv.learningProgress = Math.min(100, Math.round(base.learningProgress + (raw - base.motivationScore) * 0.25)); }
    if (field === 'welfareScore' && raw < 65) { nv.attritionRiskPercentage = Math.min(90, Math.round(nv.attritionRiskPercentage + (65 - raw) * 0.5)); nv.motivationScore = Math.max(30, Math.round(nv.motivationScore - (65 - raw) * 0.3)); }
    if (field === 'learningProgress') { nv.motivationScore = Math.min(100, Math.round(base.motivationScore + (raw - base.learningProgress) * 0.3)); nv.roi = Math.max(80, Math.round(base.roi + (raw - base.learningProgress) * 1.2)); }
    if (field === 'roi') { nv.performanceScore = Math.min(100, Math.round(base.performanceScore + (raw - base.roi) * 0.05)); }
    setVals(nv);
  }, [vals, base]);
  const reset = () => setVals({...base});
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {DIMS.map(d => { const v=vals[d.field]; const delta=v-base[d.field]; const isDragging=dragging===d.field; const mx=d.field==='roi'?350:100;
          return (<div key={d.id} className="p-3.5 rounded-xl transition-all duration-300" style={{background:`${d.color}${isDragging?'12':'06'}`, border:`1px solid ${d.color}${isDragging?'25':'10'}`}}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-light" style={{color:isDragging?'white':'var(--p-text-body)'}}>{d.label}</span><div className="flex items-center gap-1.5"><span className="font-mono text-sm tabular-nums" style={{color:d.color}}>{v}</span>{delta!==0&&<span className="text-xs font-mono" style={{color:delta>0?'#10b981':'#f43f5e'}}>{delta>0?'+':''}{delta}</span>}</div></div>
            <input type="range" min={d.field==='roi'?50:10} max={mx} value={v} onChange={e=>change(d.field,+e.target.value)} onMouseDown={()=>setDragging(d.field)} onMouseUp={()=>setDragging(null)} onTouchStart={()=>setDragging(d.field)} onTouchEnd={()=>setDragging(null)} className="w-full h-1 rounded-full cursor-pointer appearance-none" style={{accentColor:d.color, background:'rgba(255,255,255,0.06)'}}/>
          </div>);
        })}
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs font-mono p-text-ghost uppercase tracking-widest">Drag any slider — watch correlated dimensions resist and pull</p>
        <button onClick={reset} className="text-xs font-mono px-3 py-1 rounded-lg p-text-dim hover:p-text-hi transition-colors" style={{border:'1px solid var(--p-border)'}}>Reset</button>
      </div>
    </div>
  );
}

function SignalScatter() {
  const [dx, setDx] = useState(0); const [dy, setDy] = useState(3);
  const dimX = DIMS[dx], dimY = DIMS[dy];
  const mxX = dimX.field === 'roi' ? 350 : 100; const mxY = dimY.field === 'roi' ? 350 : 100;
  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <select value={dx} onChange={e=>setDx(+e.target.value)} className="p-bg-input border rounded-lg px-3 py-1.5 font-mono text-xs cursor-pointer" style={{borderColor:'var(--p-border)', color:dimX.color, background:'var(--p-bg-input)'}}>{DIMS.map((d,i) => <option key={d.id} value={i}>{d.label}</option>)}</select>
        <span className="text-xs p-text-ghost font-mono">vs</span>
        <select value={dy} onChange={e=>setDy(+e.target.value)} className="p-bg-input border rounded-lg px-3 py-1.5 font-mono text-xs cursor-pointer" style={{borderColor:'var(--p-border)', color:dimY.color, background:'var(--p-bg-input)'}}>{DIMS.map((d,i) => <option key={d.id} value={i}>{d.label}</option>)}</select>
      </div>
      <div className="rounded-xl overflow-hidden" style={{background:'rgba(255,255,255,0.01)', border:'1px solid var(--p-border)'}}>
        <svg viewBox="0 0 420 340" style={{width:'100%',maxHeight:340}} className="overflow-visible">
          <line x1={50} y1={20} x2={50} y2={280} stroke="rgba(255,255,255,0.05)"/><line x1={50} y1={280} x2={400} y2={280} stroke="rgba(255,255,255,0.05)"/>
          {[0.25,0.5,0.75].map(p => (<g key={p}><line x1={50} y1={280-p*260} x2={400} y2={280-p*260} stroke="rgba(255,255,255,0.02)"/><line x1={50+p*350} y1={20} x2={50+p*350} y2={280} stroke="rgba(255,255,255,0.02)"/></g>))}
          <text x={225} y={316} textAnchor="middle" fill={dimX.color} fontSize={11} fontFamily="'Space Mono',monospace">{dimX.label}</text>
          <text x={14} y={150} textAnchor="middle" fill={dimY.color} fontSize={11} fontFamily="'Space Mono',monospace" transform="rotate(-90,14,150)">{dimY.label}</text>
          {employees.map((emp,i) => { const vx=(emp as any)[dimX.field] as number; const vy=(emp as any)[dimY.field] as number; const px=50+(vx/mxX)*350; const py=280-(vy/mxY)*260;
            return (<g key={emp.id}><motion.circle cx={px} cy={py} r={10} fill={`${dimX.color}15`} stroke={dimX.color} strokeWidth={1.5} strokeOpacity={0.5} initial={{cx:225,cy:150,opacity:0}} animate={{cx:px,cy:py,opacity:1}} transition={{duration:0.7,delay:i*0.06,ease:[0.16,1,0.3,1]}}/><motion.text x={px} y={py-16} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={11} fontFamily="-apple-system,sans-serif" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4+i*0.06}}>{emp.name.split(' ')[0]}</motion.text></g>);
          })}
        </svg>
      </div>
      <p className="text-xs font-mono p-text-ghost uppercase tracking-widest mt-3">Try Output vs Wellbeing to spot the burnout cluster · Motivation vs Risk to see the flight corridor</p>
    </div>
  );
}

function TemporalRewind() {
  const quarters = ["Q1 '25", "Q2 '25", "Q3 '25", "Q4 '25"];
  const history = useMemo<Record<string,number[]>>(() => ({
    performanceScore:[78,82,86,orgAvg('performanceScore')], learningProgress:[55,62,68,orgAvg('learningProgress')],
    motivationScore:[82,79,74,orgAvg('motivationScore')], welfareScore:[88,83,78,orgAvg('welfareScore')],
    roi:[180,210,230,orgAvg('roi')], attritionRiskPercentage:[15,20,28,orgAvg('attritionRiskPercentage')],
  }), []);
  const [qi, setQi] = useState(3);
  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {DIMS.map(d => { const vals=history[d.field]; const v=vals[qi]; const prev=qi>0?vals[qi-1]:v; const delta=v-prev; const improving=d.invert?delta<0:delta>0;
          return (<motion.div key={d.id} className="text-center p-3 rounded-xl" style={{background:`${d.color}06`, border:`1px solid ${d.color}10`}} animate={{borderColor:`${d.color}${qi===3?'20':'10'}`}}>
            <motion.span className="font-mono text-xl tabular-nums block" style={{color:d.color}} key={`${d.id}-${qi}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}}>{v}</motion.span>
            <span className="text-[11px] font-mono p-text-ghost uppercase tracking-widest block mt-1">{d.label}</span>
            {delta!==0&&<span className="text-xs font-mono mt-1 block" style={{color:improving?'#10b981':'#f43f5e'}}>{delta>0?'+':''}{delta}{d.unit}</span>}
          </motion.div>);
        })}
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-sm" style={{color:'#38bdf8'}}>{quarters[qi]}</span>
        <div className="flex-1">
          <input type="range" min={0} max={3} value={qi} onChange={e=>setQi(+e.target.value)} className="w-full h-1 rounded-full cursor-pointer appearance-none" style={{accentColor:'#38bdf8', background:'rgba(255,255,255,0.06)'}}/>
          <div className="flex justify-between mt-2">{quarters.map((q,i) => (<span key={i} className="text-xs font-mono cursor-pointer" onClick={()=>setQi(i)} style={{color:i===qi?'#38bdf8':'rgba(255,255,255,0.15)'}}>{q}</span>))}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export function Analytics() {
  const [activeView, setActiveView] = useState<'overview' | 'capital' | 'health' | 'simulation'>('overview');
  const [activeCapital, setActiveCapital] = useState<'magnetic'|'horizon'|'departure'>('magnetic');
  const [activeSim, setActiveSim] = useState<'correlation'|'scatter'|'rewind'>('correlation');
  const navigate = useNavigate();

  const totalInvestment = employees.reduce((s,e) => s+e.costInvestment, 0);
  const totalRevenue = employees.reduce((s,e) => s+e.revenueContribution, 0);
  const orgROI = Math.round((totalRevenue/totalInvestment)*100);
  const topROI = [...employees].sort((a,b) => b.roi-a.roi)[0];

  /* ── Insights ── */
  const insights = useMemo(() => {
    const avgPerf = Math.round(employees.reduce((s,e) => s+e.performanceScore, 0) / employees.length);
    const avgWell = Math.round(employees.reduce((s,e) => s+e.welfareScore, 0) / employees.length);
    const highRisk = employees.filter(e => e.attritionRiskPercentage > 50);
    const lowWell = employees.filter(e => e.welfareScore < 65);
    const burnoutRisk = employees.filter(e => e.performanceScore > 85 && e.welfareScore < 70);
    const items: {type:'critical'|'watch'|'opportunity'; title:string; detail:string; action:string; color:string; icon:React.ElementType; empId?:string}[] = [];
    if (burnoutRisk.length > 0) items.push({ type:'critical', color:'#f43f5e', icon:Flame, title:`${burnoutRisk.length} employee${burnoutRisk.length>1?'s':''} in burnout corridor`, detail:`High output (>85pt) with low wellbeing (<70pt).`, action:`Schedule wellbeing check-ins with ${burnoutRisk.map(e=>e.name.split(' ')[0]).join(', ')} this week.`, empId:burnoutRisk[0].id });
    if (highRisk.length > 0) items.push({ type:'critical', color:'#fb923c', icon:AlertTriangle, title:`${highRisk.length} high-value flight risk${highRisk.length>1?'s':''}`, detail:`Combined ROI of ${highRisk.reduce((s,e)=>s+e.roi,0)}%. Replacement cost ≈$${Math.round(highRisk.reduce((s,e)=>s+e.costInvestment*1.5,0)/1000)}K.`, action:`Trigger retention protocol. ${highRisk[0].name.split(' ')[0]} should be highest priority.`, empId:highRisk[0].id });
    if (orgROI > 200) items.push({ type:'opportunity', color:'#10b981', icon:Sparkles, title:`Org ROI at ${orgROI}% — expansion territory`, detail:`Every $1 invested returns $${(orgROI/100).toFixed(1)}.`, action:`Increase investment in top performers. ${topROI.name.split(' ')[0]} at ${topROI.roi}% ROI is your highest leverage.` });
    if (lowWell.length > 0) items.push({ type:'watch', color:'#f59e0b', icon:Eye, title:`${lowWell.length} below wellbeing threshold`, detail:`Wellbeing below 65pt precedes motivation drops by 2-3 months.`, action:`Review workload distribution and consider forced PTO.` });
    if (avgPerf > 85) items.push({ type:'opportunity', color:'#38bdf8', icon:TrendingUp, title:`Team output at ${avgPerf}pt`, detail:`${employees.filter(e=>e.performanceScore>=85).length} of ${employees.length} exceeding 85pt threshold.`, action:`Lock in gains: document processes, cross-train, and prepare stretch assignments.` });
    return items.sort((a,b) => ({critical:0,watch:1,opportunity:2}[a.type] - {critical:0,watch:1,opportunity:2}[b.type]));
  }, []);

  return (
    <div className="page-wrap">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b p-border pb-12">
        <div>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 p-text-dim hover:p-text-hi text-sm mb-4 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <p className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-2">
            <Activity size={14} className="text-cyan-400" /> Economic & System Telemetry
          </p>
          <h1 className="hero-title font-light text-white">Global <span className="p-text-dim italic font-serif">Models</span></h1>
        </div>
        <div className="text-right flex gap-12">
          <div><p className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2">Org ROI</p><p className="text-4xl font-light text-emerald-400">{orgROI}<span className="text-xl p-text-dim">%</span></p></div>
          <div><p className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2">Surplus</p><p className="text-4xl font-light text-white">${(totalRevenue/1000000).toFixed(1)}<span className="text-xl p-text-dim">M</span></p></div>
        </div>
      </motion.div>

      {/* Insights */}
      {insights.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="mb-12">
          <div className="flex items-center gap-2 mb-4"><Brain size={13} className="p-text-mid" /><p className="text-xs font-mono uppercase tracking-[0.2em] p-text-ghost">Insights & recommended actions</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.slice(0, 4).map((ins, i) => { const Icon = ins.icon; return (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                className="rounded-xl p-4 group transition-all duration-300 hover:scale-[1.005]" style={{ background: `${ins.color}06`, border: `1px solid ${ins.color}12`, cursor: ins.empId ? 'pointer' : 'default' }}
                onClick={() => ins.empId && navigate(`/app/employee/${ins.empId}`)}>
                <div className="flex items-start gap-3"><Icon size={12} className="flex-shrink-0 mt-0.5" style={{ color: ins.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded mb-1 inline-block" style={{ background: `${ins.color}12`, color: ins.color }}>{ins.type}</span>
                    <p className="text-sm font-light text-white leading-snug mb-1">{ins.title}</p>
                    <p className="text-xs p-text-dim leading-relaxed mb-2">{ins.detail}</p>
                    <div className="flex items-start gap-1.5 p-2 rounded-lg" style={{ background: `${ins.color}06` }}><Lightbulb size={10} className="flex-shrink-0 mt-0.5" style={{ color: ins.color }} /><p className="text-xs leading-relaxed" style={{ color: `${ins.color}cc` }}>{ins.action}</p></div>
                  </div>
                  {ins.empId && <ChevronRight size={12} className="p-text-ghost group-hover:p-text-mid transition-colors flex-shrink-0 mt-1" />}
                </div>
              </motion.div>
            ); })}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 p-bg-card rounded-xl border p-border w-fit mb-12 flex-wrap">
        {([
          { id: 'overview' as const, label: 'Overview' },
          { id: 'capital' as const, label: 'Capital Dynamics' },
          { id: 'health' as const, label: 'Wellbeing' },
          { id: 'simulation' as const, label: 'Simulation Lab' },
        ]).map(v => (
          <button key={v.id} onClick={() => setActiveView(v.id)} data-cursor={v.label}
            className={`px-5 py-2 rounded-lg text-xs uppercase tracking-widest font-medium transition-all ${activeView === v.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-2 p-bg-card border p-border rounded-[2rem] p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="flex justify-between items-center mb-12"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-4 border-b p-border-mid pb-4">Revenue vs Human Capital Cost ($M)</h3><TrendingUp size={16} className="text-emerald-400" /></div>
              <div className="h-[300px] w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={globalRevenueForecast}>
                    <defs><linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.1}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--p-chart-grid)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--p-chart-axis)', fontSize: 10 }} dy={20} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="projected" stroke="#22d3ee" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" name="Projected Rev" />
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} name="Actual Rev" />
                    <Bar dataKey="cost" fill="#8b5cf6" opacity={0.5} radius={[4, 4, 0, 0]} barSize={20} name="Investment" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
                className="p-bg-card border p-border rounded-[2rem] p-8 relative overflow-hidden">
                <div className="flex justify-between items-center mb-8"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-4 border-b p-border-mid pb-4">Global Attrition Risk</h3><AlertTriangle size={16} className="text-rose-400" /></div>
                <div className="flex items-end justify-between gap-2 h-24">
                  {[12, 15, 18, 14, 25, 32, 28, 22].map((v, i) => (<motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${v * 3}px` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }} className="flex-1 rounded-t-lg" style={{ background: v > 25 ? `linear-gradient(to top, rgba(244,63,94,0.2), rgba(244,63,94,${v/40}))` : `linear-gradient(to top, rgba(56,189,248,0.1), rgba(56,189,248,${v/50}))` }} />))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 }}
                className="p-bg-card border p-border rounded-[2rem] p-8 relative overflow-hidden">
                <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-4 border-b p-border-mid pb-4 mb-6">Performance Trend</h3>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}><defs><linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c084fc" stopOpacity={0.2}/><stop offset="95%" stopColor="#c084fc" stopOpacity={0}/></linearGradient></defs>
                      <Area type="monotone" dataKey="avgScore" stroke="#c084fc" fill="url(#perfGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="p-bg-card border p-border rounded-[2rem] overflow-hidden">
            <div className="px-8 py-5 border-b p-border flex items-center justify-between"><p className="text-sm uppercase tracking-[0.12em] p-text-dim font-mono">Employee Matrix</p><p className="text-sm uppercase tracking-[0.12em] p-text-ghost font-mono">{employees.length} nodes</p></div>
            <table className="w-full text-left">
              <thead><tr className="border-b p-border text-xs p-text-ghost uppercase tracking-widest">{['','Name','Role','Dept','Performance','Risk','ROI','Next Review'].map((h,i) => <th key={i} className="px-6 py-4 font-medium">{h}</th>)}</tr></thead>
              <tbody>{employees.map(emp => (<tr key={emp.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors group">
                <td className="pl-6 py-4"><NavLink to={`/app/employee/${emp.id}`}><img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" /></NavLink></td>
                <td className="py-4"><NavLink to={`/app/employee/${emp.id}`} className="p-text-body text-sm font-light hover:text-white transition-colors">{emp.name}</NavLink></td>
                <td className="py-4 p-text-dim text-sm font-light">{emp.role}</td>
                <td className="py-4 p-text-lo text-xs font-mono uppercase tracking-widest">{emp.department.split(' ')[0]}</td>
                <td className="py-4"><span className={`font-mono text-sm ${emp.performanceScore >= 90 ? 'text-emerald-400' : emp.performanceScore >= 80 ? 'text-cyan-400' : 'text-amber-400'}`}>{emp.performanceScore}</span></td>
                <td className="py-4"><span className={`px-2 py-0.5 text-xs uppercase tracking-widest rounded-full border ${emp.attritionRisk === 'High' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' : emp.attritionRisk === 'Medium' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'}`}>{emp.attritionRisk}</span></td>
                <td className="py-4"><span className={`font-mono text-sm ${emp.roi >= 200 ? 'text-emerald-400' : emp.roi >= 150 ? 'text-cyan-400' : 'text-amber-400'}`}>{emp.roi}%</span></td>
                <td className="py-4 pr-8 p-text-lo text-sm font-mono">{emp.nextPromotionEligibility}</td>
              </tr>))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ CAPITAL DYNAMICS TAB ═══ */}
      {activeView === 'capital' && (
        <div className="space-y-6">
          {/* Top ROI callout */}
          {topROI && (
            <div className="p-4 rounded-xl flex items-center gap-4" style={{background:'rgba(16,185,129,0.04)', border:'1px solid rgba(16,185,129,0.12)'}}>
              <img src={topROI.avatar} alt={topROI.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0"/>
              <div className="flex-1"><p className="text-sm font-light text-white">{topROI.name} is your highest-ROI employee at <span className="font-mono text-emerald-400">{topROI.roi}%</span></p><p className="text-xs p-text-dim mt-0.5">Every $1 invested returns ${(topROI.roi/100).toFixed(1)}. Protect this person.</p></div>
              <NavLink to={`/app/employee/${topROI.id}`} className="p-text-ghost hover:text-emerald-400 transition-colors"><ArrowUpRight size={16}/></NavLink>
            </div>
          )}

          {/* Sub-tabs */}
          <div className="flex gap-2 flex-wrap">
            {([
              {id:'magnetic' as const, icon:Magnet, label:'Trajectory'},
              {id:'horizon' as const, icon:Ghost, label:'Forecast'},
              {id:'departure' as const, icon:DoorOpen, label:'Departure Cost'},
            ]).map(s => (
              <button key={s.id} onClick={() => setActiveCapital(s.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300"
                style={{background:activeCapital===s.id?'rgba(16,185,129,0.08)':'var(--p-bg-card)', border:`1px solid ${activeCapital===s.id?'rgba(16,185,129,0.2)':'var(--p-border)'}`, color:activeCapital===s.id?'#10b981':'var(--p-text-dim)'}}>
                <s.icon size={13}/><span className="text-xs font-light">{s.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeCapital} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.4}}
              className="p-bg-card border p-border rounded-2xl p-6 md:p-8 relative overflow-hidden">
              {activeCapital === 'magnetic' && <div><div className="flex items-center justify-between mb-6"><div><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-3">ROI Trajectory (6M)</h3><p className="p-text-ghost text-xs font-mono mt-1">Move cursor near data — points are magnetically attracted</p></div><TrendingUp size={14} className="text-emerald-400"/></div><MagneticChart data={orgROIData}/></div>}
              {activeCapital === 'horizon' && <div><div className="flex items-center justify-between mb-6"><div><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-3">Predictive Ghost Horizon</h3><p className="p-text-ghost text-xs font-mono mt-1">Drag the growth rate — forecast reshapes in real time</p></div></div><GhostHorizon data={orgROIData}/></div>}
              {activeCapital === 'departure' && <CostOfDeparture/>}
            </motion.div>
          </AnimatePresence>

          {/* Department vectors */}
          <div className="p-bg-card border p-border rounded-2xl p-6 md:p-8">
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-3 mb-6"><Coins size={10} className="text-emerald-400"/> Department Vectors</h3>
            <div className="space-y-5">{departmentROI.map((dept,i) => (<div key={i}><div className="flex justify-between text-xs mb-2"><span className="p-text-mid">{dept.department}</span><span className={`font-mono ${dept.roi>=200?'text-emerald-400':dept.roi>=150?'text-cyan-400':dept.roi>=110?'text-amber-400':'text-rose-400'}`}>{dept.roi}%</span></div><div className="h-px" style={{background:'rgba(255,255,255,0.04)'}}><motion.div className="h-full" initial={{width:0}} whileInView={{width:`${Math.min((dept.roi/400)*100,100)}%`}} viewport={{once:true}} transition={{duration:1.2,delay:i*0.1}} style={{background:dept.roi>=200?'#10b981':dept.roi>=150?'#38bdf8':dept.roi>=110?'#f59e0b':'#f43f5e'}}/></div><div className="flex justify-between text-xs p-text-ghost mt-1 font-mono"><span>Cost ${(dept.investment/1000).toFixed(0)}K</span><span>Value ${(dept.value/1000).toFixed(0)}K</span></div></div>))}</div>
          </div>
        </div>
      )}

      {/* ═══ WELLBEING TAB ═══ */}
      {activeView === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-bg-card border p-border rounded-[2rem] p-8"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Org Health Radar</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%"><PolarGrid stroke="var(--p-chart-grid)" /><PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--p-chart-axis)', fontSize: 11 }} /><Radar name="Score" dataKey="score" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} strokeWidth={1.5} /><Tooltip content={<CustomTooltip />} /></RadarChart></ResponsiveContainer></div></div>
          <div className="p-bg-card border p-border rounded-[2rem] p-8"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Learning Domain Completion</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={globalLearningData} layout="vertical"><XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--p-chart-axis)', fontSize: 10 }} /><YAxis dataKey="domain" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--p-chart-axis-hi)', fontSize: 11 }} width={80} /><Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--p-chart-cursor)' }} /><Bar dataKey="completed" name="Completed" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} stackId="a" /><Bar dataKey="active" name="In Progress" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={12} stackId="a" /></ComposedChart></ResponsiveContainer></div></div>
          <div className="lg:col-span-2 p-bg-card border p-border rounded-[2rem] p-8"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Wellbeing & Burnout Matrix</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{employees.map(emp => (<NavLink key={emp.id} to={`/app/employee/${emp.id}`} className="relative group block"><div className="rounded-2xl p-5 border p-border transition-all hover:p-border-hi" style={{background: emp.bioRhythm.burnoutProbability > 60 ? 'rgba(244,63,94,0.05)' : emp.bioRhythm.burnoutProbability > 35 ? 'rgba(245,158,11,0.05)' : 'rgba(16,185,129,0.05)'}}>
              <div className="flex items-center gap-2 mb-4"><img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" /><p className="p-text-body text-sm font-light">{emp.name.split(' ')[0]}</p></div>
              <div className="space-y-2"><div className="flex justify-between text-xs"><span className="p-text-dim">Stress</span><span className="font-mono" style={{ color: emp.bioRhythm.stressIndex > 60 ? '#f43f5e' : '#10b981' }}>{emp.bioRhythm.stressIndex}</span></div><div className="flex justify-between text-xs"><span className="p-text-dim">Burnout risk</span><span className="font-mono" style={{ color: emp.bioRhythm.burnoutProbability > 60 ? '#f43f5e' : emp.bioRhythm.burnoutProbability > 35 ? '#f59e0b' : '#10b981' }}>{emp.bioRhythm.burnoutProbability}%</span></div><div className="flex justify-between text-xs"><span className="p-text-dim">Sleep</span><span className="font-mono p-text-mid">{emp.bioRhythm.sleepQuality}%</span></div></div>
            </div></NavLink>))}</div>
          </div>
        </div>
      )}

      {/* ═══ SIMULATION LAB TAB ═══ */}
      {activeView === 'simulation' && (
        <div>
          <div className="flex gap-2 mb-6 flex-wrap">
            {([
              { id: 'correlation' as const, icon: SlidersHorizontal, label: 'Correlation Engine', color: '#c084fc' },
              { id: 'scatter' as const, icon: Crosshair, label: 'Signal Scatter', color: '#f43f5e' },
              { id: 'rewind' as const, icon: Clock, label: 'Temporal Rewind', color: '#38bdf8' },
            ]).map(s => (
              <button key={s.id} onClick={() => setActiveSim(s.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300"
                style={{background:activeSim===s.id?`${s.color}12`:'var(--p-bg-card)', border:`1px solid ${activeSim===s.id?s.color+'25':'var(--p-border)'}`, color:activeSim===s.id?s.color:'var(--p-text-dim)'}}>
                <s.icon size={13}/><span className="text-xs font-light">{s.label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeSim} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.4}}
              className="p-6 rounded-2xl" style={{background:'var(--p-bg-card)', border:'1px solid var(--p-border)'}}>
              {activeSim === 'correlation' && <CorrelationEngine/>}
              {activeSim === 'scatter' && <SignalScatter/>}
              {activeSim === 'rewind' && <TemporalRewind/>}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
