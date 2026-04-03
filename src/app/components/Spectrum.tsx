/**
 * Spectrum — The Intelligence Nexus (Single Hub)
 *
 * This is the landing page. Everything lives here:
 *   1. Hero (no back button — this IS home)
 *   2. The Prism (orbital overview)
 *   3. Dimension Rows (expandable)
 *   4. Intelligence (cross-dimensional patterns)
 *   5. Analytics Tabs: Overview | Capital Dynamics | Wellbeing | Simulation Lab
 */

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useNavigate } from 'react-router';
import {
  ArrowUpRight, Zap, ShieldAlert, TrendingUp,
  Brain, Heart, DollarSign, Target, ChevronRight,
  Sparkles, Eye, Lightbulb, ArrowRight, Flame,
  Activity, AlertTriangle, X,
  Magnet, Ghost, DoorOpen, Coins, Cpu,
  SlidersHorizontal, Crosshair, Clock
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid,
  ComposedChart, Line, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { employees, performanceData, globalRevenueForecast, globalLearningData, orgROIData, departmentROI } from '../mockData';
import { useAuth } from '../auth/AuthContext';

/* ═══ DIMS CONFIG ═══ */
type DimField = 'performanceScore'|'learningProgress'|'motivationScore'|'welfareScore'|'roi'|'attritionRiskPercentage';

const DIMS = [
  { id:'output', label:'Output', sub:'Delivery · KPI · Velocity', color:'#f43f5e', glow:'rgba(244,63,94,0.12)', field:'performanceScore' as DimField, unit:'pt', invert:false, icon:Target,
    insight:'High output with low wellbeing is a burnout signal, not a strength.', action:'Cross-reference with Wellbeing — anyone 20+ points apart needs a check-in this week.' },
  { id:'growth', label:'Growth', sub:'Learning · Skills · Acquisition', color:'#10b981', glow:'rgba(16,185,129,0.12)', field:'learningProgress' as DimField, unit:'%', invert:false, icon:TrendingUp,
    insight:'The person learning fastest is your highest-leverage retention target.', action:'Invest in employees whose Growth outpaces Output — they\'re scaling up.' },
  { id:'motivation', label:'Motivation', sub:'Engagement · Initiative · Drive', color:'#f59e0b', glow:'rgba(245,158,11,0.12)', field:'motivationScore' as DimField, unit:'pt', invert:false, icon:Zap,
    insight:'Motivation drops 3–4 months before a resignation decision is made.', action:'Schedule 1:1s with anyone below 65 — it\'s your last intervention window.' },
  { id:'wellbeing', label:'Wellbeing', sub:'Burnout · Stress · Cognitive Load', color:'#c084fc', glow:'rgba(192,132,252,0.12)', field:'welfareScore' as DimField, unit:'pt', invert:false, icon:Heart,
    insight:'A person can score 90 on output while burning out.', action:'Flag anyone with Wellbeing 20+ points below their Output for immediate support.' },
  { id:'return', label:'Return', sub:'Revenue · ROI · Capital Value', color:'#38bdf8', glow:'rgba(56,189,248,0.12)', field:'roi' as DimField, unit:'%', invert:false, icon:DollarSign,
    insight:'A 200%+ ROI employee generates double their total cost in value.', action:'Promote high-ROI employees before competitors poach them.' },
  { id:'risk', label:'Risk', sub:'Attrition · Flight · Drift', color:'#fb923c', glow:'rgba(251,146,60,0.12)', field:'attritionRiskPercentage' as DimField, unit:'%', invert:true, icon:ShieldAlert,
    insight:'Above 70% with no intervention is almost always a resignation within 90 days.', action:'Trigger retention protocol for anyone above 60%. Time is the constraint.' },
];

const orgAvg = (field: DimField) => Math.round(employees.reduce((s,e) => s + (e as any)[field], 0) / employees.length);
const rankEmployees = (dim: typeof DIMS[0]) => [...employees].sort((a,b) => dim.invert ? (a as any)[dim.field]-(b as any)[dim.field] : (b as any)[dim.field]-(a as any)[dim.field]);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (<div className="p-bg-surface border p-border-mid rounded-xl p-3 text-xs"><p className="p-text-lo mb-2 uppercase tracking-widest">{label}</p>{payload.map((p: any, i: number) => (<div key={i} className="flex items-center gap-2 mt-1"><div className="w-2 h-2 rounded-full" style={{ background: p.stroke || p.fill }} /><span className="p-text-mid">{p.name}:</span><span className="text-white font-mono">{p.value}</span></div>))}</div>);
};

const radarData = [{metric:'Performance',score:84},{metric:'Engagement',score:78},{metric:'Learning',score:68},{metric:'Wellbeing',score:76},{metric:'Innovation',score:82},{metric:'Collaboration',score:71}];

/* ═══ THE PRISM ═══ */
function ThePrism({ onSelect }: { onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState<string|null>(null);
  const cx=220, cy=220, baseR=48, gap=27;
  const composite = Math.round(DIMS.reduce((s,d) => s + (d.invert ? 100-orgAvg(d.field) : d.field==='roi' ? Math.min(orgAvg(d.field)/3,100) : orgAvg(d.field)),0)/DIMS.length);
  return (
    <div className="relative flex items-center justify-center" style={{height:460}}>
      <svg width={440} height={440} viewBox="0 0 440 440" className="overflow-visible">
        <defs>{DIMS.map(d => (<linearGradient key={`pg-${d.id}`} id={`pg-${d.id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={d.color} stopOpacity={0.95}/><stop offset="100%" stopColor={d.color} stopOpacity={0.35}/></linearGradient>))}<filter id="prismGlow"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/></filter></defs>
        {DIMS.map((d,i) => { const r=baseR+i*gap, circ=2*Math.PI*r, avg=orgAvg(d.field); const pct=(d.invert?(100-avg):d.field==='roi'?Math.min(avg/350,1)*100:avg)/100; const isH=hovered===d.id, anyH=hovered!==null; const angle=-90+pct*360, rad=(angle*Math.PI)/180; const lx=cx+(r+18)*Math.cos(rad), ly=cy+(r+18)*Math.sin(rad);
          return (<g key={d.id} onMouseEnter={()=>setHovered(d.id)} onMouseLeave={()=>setHovered(null)} onClick={()=>onSelect(d.id)} style={{cursor:'pointer'}}>
            {isH && <circle cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={10} strokeOpacity={0.1} filter="url(#prismGlow)"/>}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={isH?5:3} style={{transition:'stroke-width 0.3s'}}/>
            <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#pg-${d.id})`} strokeWidth={isH?5:3} strokeLinecap="round" strokeDasharray={circ} initial={{strokeDashoffset:circ}} animate={{strokeDashoffset:circ*(1-pct),opacity:anyH?(isH?1:0.18):0.85}} transition={{strokeDashoffset:{duration:1.6,delay:i*0.1,ease:[0.16,1,0.3,1]},opacity:{duration:0.2}}} style={{transform:'rotate(-90deg)',transformOrigin:`${cx}px ${cy}px`}}/>
            <AnimatePresence>{isH && (<motion.g initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}><text x={lx} y={ly-7} textAnchor="middle" dominantBaseline="middle" fill={d.color} fontSize={11} fontWeight={500} fontFamily="'Space Mono',monospace">{d.label}</text><text x={lx} y={ly+7} textAnchor="middle" dominantBaseline="middle" fill={d.color} fontSize={10} fontFamily="'Space Mono',monospace" opacity={0.7}>{avg}{d.unit}</text></motion.g>)}</AnimatePresence>
          </g>); })}
        <motion.text x={cx} y={cy-10} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={42} fontWeight={200} fontFamily="'Space Mono',monospace" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}>{composite}</motion.text>
        <text x={cx} y={cy+16} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={11} fontFamily="'Space Mono',monospace" letterSpacing="0.25em">COMPOSITE</text>
        {!hovered && DIMS.map((d,i) => (<text key={`sl-${d.id}`} x={cx} y={cy-(baseR+i*gap)-8} textAnchor="middle" fill={d.color} fillOpacity={0.5} fontSize={10} fontFamily="'Space Mono',monospace" letterSpacing="0.1em">{d.label.toUpperCase()}</text>))}
      </svg>
    </div>
  );
}

/* ═══ TEAM SCATTER ═══ */
function TeamScatter({ dim }: { dim: typeof DIMS[0] }) {
  const values = employees.map(e => ({emp:e, val:(e as any)[dim.field] as number})); const avg = orgAvg(dim.field);
  return (<div className="relative w-full" style={{height:90}}>
    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] rounded-full" style={{background:dim.invert?`linear-gradient(90deg,${dim.color}08,${dim.color}50,${dim.color})`:`linear-gradient(90deg,${dim.color},${dim.color}50,${dim.color}08)`}}/>
    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{left:`${Math.min(avg,98)}%`}}><div className="w-px h-8 -translate-y-1/2" style={{background:`${dim.color}35`}}/><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono px-1 py-px rounded whitespace-nowrap" style={{background:`${dim.color}12`,color:dim.color}}>AVG {avg}</span></div>
    {values.map(({emp,val},i) => { const pct=Math.max(3,Math.min(97,dim.field==='roi'?Math.min(val/350,1)*100:val)); const jitter=(i%3-1)*9;
      return (<motion.div key={emp.id} className="absolute group" style={{left:`${pct}%`,top:`calc(50% + ${jitter}px)`,transform:'translateX(-50%) translateY(-50%)'}} initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:0.15+i*0.04,duration:0.4,ease:[0.16,1,0.3,1]}}>
        <NavLink to={`/app/employee/${emp.id}`} onClick={e => e.stopPropagation()}><img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover border-2 grayscale group-hover:grayscale-0 group-hover:scale-125 group-hover:z-20 relative transition-all duration-500" style={{borderColor:`${dim.color}40`}} loading="lazy" decoding="async"/><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap"><div className="px-2 py-1 rounded-lg text-[10px] font-mono" style={{background:'var(--p-surface)',border:`1px solid ${dim.color}25`,color:dim.color}}>{emp.name.split(' ')[0]} · {val}{dim.unit}</div></div></NavLink>
      </motion.div>); })}
  </div>);
}

/* ═══ INSIGHTS ═══ */
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

/* ═══ CAPITAL DYNAMICS COMPONENTS ═══ */
function MagneticChart({ data }: { data: typeof orgROIData }) {
  const [mouse, setMouse] = useState({x:-100,y:-100}); const [closest, setClosest] = useState<number|null>(null);
  const W=700, H=320, pad={l:50,r:20,t:30,b:45}; const cw=W-pad.l-pad.r, ch=H-pad.t-pad.b;
  const allV = data.flatMap(d => [d.totalValue, d.totalInvestment]); const maxV = Math.max(...allV)*1.15;
  const sx = (i:number) => pad.l + (i/(data.length-1))*cw; const sy = (v:number) => pad.t + ch - (v/maxV)*ch;
  const onMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => { const rect = e.currentTarget.getBoundingClientRect(); const mx = (e.clientX-rect.left)/(rect.width)*W; const my = (e.clientY-rect.top)/(rect.height)*H; setMouse({x:mx,y:my}); let minD=Infinity, minI=-1; data.forEach((_,i) => { const d=Math.hypot(mx-sx(i),my-sy(_.totalValue)); if(d<minD){minD=d;minI=i;} }); setClosest(minD<80?minI:null); }, [data]);
  const buildPath = (pts:{x:number,y:number}[]) => { let d=`M ${pts[0].x},${pts[0].y}`; for(let i=1;i<pts.length;i++){const p=pts[i-1],c=pts[i];const cpx=(p.x+c.x)/2;d+=` C ${cpx},${p.y} ${cpx},${c.y} ${c.x},${c.y}`;} return d; };
  const valPts = data.map((_,i) => ({x:sx(i),y:sy(_.totalValue)})); const invPts = data.map((_,i) => ({x:sx(i),y:sy(_.totalInvestment)}));
  const valPath = buildPath(valPts); const areaPath = valPath + ` L ${valPts[valPts.length-1].x},${pad.t+ch} L ${valPts[0].x},${pad.t+ch} Z`;
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="overflow-visible cursor-none" onMouseMove={onMove} onMouseLeave={() => {setMouse({x:-100,y:-100});setClosest(null);}}>
      <defs><linearGradient id="magFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.12}/><stop offset="100%" stopColor="#10b981" stopOpacity={0.01}/></linearGradient></defs>
      {[0.25,0.5,0.75,1].map(p => (<g key={p}><line x1={pad.l} y1={pad.t+ch*(1-p)} x2={W-pad.r} y2={pad.t+ch*(1-p)} stroke="rgba(255,255,255,0.03)"/><text x={pad.l-8} y={pad.t+ch*(1-p)+3} textAnchor="end" fill="rgba(255,255,255,0.15)" fontSize={11} fontFamily="'Space Mono',monospace">${(maxV*p).toFixed(1)}M</text></g>))}
      <path d={areaPath} fill="url(#magFill)"/><path d={buildPath(invPts)} fill="none" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="5 4" strokeOpacity={0.4}/><path d={valPath} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round"/>
      <circle cx={mouse.x} cy={mouse.y} r={60} fill="rgba(56,189,248,0.03)"/><circle cx={mouse.x} cy={mouse.y} r={3} fill="rgba(56,189,248,0.3)"/>
      {data.map((d,i) => { const bx=sx(i), by=sy(d.totalValue); const dist=Math.hypot(mouse.x-bx,mouse.y-by); const pull=Math.max(0,1-dist/100); const dx=(mouse.x-bx)*pull*0.12, dy=(mouse.y-by)*pull*0.12; const isClose=closest===i;
        return (<g key={i}><circle cx={sx(i)} cy={sy(d.totalInvestment)} r={3} fill="#f43f5e" fillOpacity={0.4}/><circle cx={bx+dx} cy={by+dy} r={isClose?8:4} fill={isClose?"#10b981":"rgba(16,185,129,0.6)"} style={{transition:'r 0.15s'}}/>
          {isClose && <><line x1={bx} y1={by+10} x2={bx} y2={pad.t+ch} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 3"/><g transform={`translate(${Math.min(bx+14,W-135)},${Math.max(by-60,10)})`}><rect x={0} y={0} width={125} height={72} rx={8} fill="#0a0a0a" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5}/><text x={10} y={16} fontSize={11} fontFamily="'Space Mono',monospace" fill="rgba(255,255,255,0.35)">{d.month}</text><text x={10} y={34} fontSize={12} fontFamily="'Space Mono',monospace" fill="#10b981">${d.totalValue}M value</text><text x={10} y={50} fontSize={12} fontFamily="'Space Mono',monospace" fill="#f43f5e">${d.totalInvestment}M invested</text><text x={10} y={66} fontSize={12} fontFamily="'Space Mono',monospace" fill="#f59e0b">{d.roi}% ROI</text></g></>}
          <text x={sx(i)} y={H-10} textAnchor="middle" fill={isClose?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.2)"} fontSize={11} fontFamily="'Space Mono',monospace">{d.month}</text></g>); })}
      <g transform={`translate(${pad.l},${H-2})`}><line x1={0} y1={-3} x2={14} y2={-3} stroke="#10b981" strokeWidth={2}/><text x={18} y={0} fontSize={11} fontFamily="'Space Mono',monospace" fill="rgba(255,255,255,0.25)">Value</text><line x1={65} y1={-3} x2={79} y2={-3} stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 3"/><text x={83} y={0} fontSize={11} fontFamily="'Space Mono',monospace" fill="rgba(255,255,255,0.25)">Investment</text></g>
    </svg>);
}

function GhostHorizon({ data }: { data: typeof orgROIData }) {
  const [growth, setGrowth] = useState(8); const lastROI = data[data.length-1].roi;
  const forecast = [lastROI, Math.round(lastROI*(1+growth/100)), Math.round(lastROI*(1+growth/100)**2)];
  const maxR = Math.max(...[...data.map(d=>d.roi), ...forecast.slice(1)])*1.1;
  const months = [...data.map(d=>d.month), "Jul", "Aug"];
  const W=600, H=220, pad={l:40,r:20,t:20,b:35}; const cw=W-pad.l-pad.r, ch=H-pad.t-pad.b;
  const sx = (i:number) => pad.l + (i/(months.length-1))*cw; const sy = (v:number) => pad.t + ch - (v/maxR)*ch;
  return (<div><svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%'}} className="overflow-visible">
    {[0.25,0.5,0.75,1].map(p => <line key={p} x1={pad.l} y1={pad.t+ch*(1-p)} x2={W-pad.r} y2={pad.t+ch*(1-p)} stroke="rgba(255,255,255,0.03)"/>)}
    <rect x={sx(data.length-1)} y={pad.t} width={sx(months.length-1)-sx(data.length-1)} height={ch} fill="rgba(56,189,248,0.02)" rx={4}/><text x={(sx(data.length-1)+sx(months.length-1))/2} y={pad.t+12} textAnchor="middle" fill="rgba(56,189,248,0.15)" fontSize={10} fontFamily="'Space Mono',monospace">FORECAST</text>
    <polygon points={forecast.map((v,i)=>`${sx(data.length-1+i)},${sy(v*0.92)}`).join(' ')+' '+[...forecast].reverse().map((v,i)=>`${sx(data.length-1+(forecast.length-1-i))},${sy(v*1.08)}`).join(' ')} fill="rgba(56,189,248,0.04)" stroke="rgba(56,189,248,0.08)" strokeWidth={0.5}/>
    <polyline points={data.map((d,i)=>`${sx(i)},${sy(d.roi)}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round"/>{data.map((d,i) => <circle key={i} cx={sx(i)} cy={sy(d.roi)} r={4} fill="#f59e0b"/>)}
    <polyline points={forecast.map((v,i)=>`${sx(data.length-1+i)},${sy(v)}`).join(' ')} fill="none" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="6 4"/>{forecast.slice(1).map((v,i) => <circle key={i} cx={sx(data.length+i)} cy={sy(v)} r={3} fill="#38bdf8" fillOpacity={0.6}/>)}
    {months.map((m,i) => <text key={i} x={sx(i)} y={H-6} textAnchor="middle" fill={i>=data.length?"rgba(56,189,248,0.3)":"rgba(255,255,255,0.2)"} fontSize={11} fontFamily="'Space Mono',monospace">{m}</text>)}
    {forecast.slice(1).map((v,i) => <text key={i} x={sx(data.length+i)} y={sy(v)-12} textAnchor="middle" fill="#38bdf8" fontSize={11} fontFamily="'Space Mono',monospace" fillOpacity={0.7}>{v}%</text>)}
  </svg><div className="flex items-center gap-3 mt-2"><span className="text-xs font-mono p-text-ghost">Growth rate</span><input type="range" min={-5} max={20} value={growth} onChange={e=>setGrowth(+e.target.value)} className="flex-1 h-1 rounded-full cursor-pointer appearance-none" style={{accentColor:'#38bdf8', background:'rgba(255,255,255,0.06)'}}/><span className="font-mono text-sm" style={{color:'#38bdf8'}}>{growth}%</span></div></div>);
}

function CostOfDeparture() {
  const [sel, setSel] = useState<string|null>(null); const emp = sel ? employees.find(e => e.id === sel) : null;
  return (<div>{!emp ? (<><p className="text-xs font-mono p-text-ghost uppercase tracking-widest mb-3">Click any person to model departure cost</p><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{employees.map(e => (<button key={e.id} onClick={() => setSel(e.id)} className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] group" style={{background:'var(--p-bg-card)', border:'1px solid var(--p-border)'}}><img src={e.avatar} alt={e.name} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 flex-shrink-0"/><div className="min-w-0 flex-1"><p className="text-sm font-light text-white truncate">{e.name}</p><div className="flex items-center gap-2 mt-1"><span className="font-mono text-xs" style={{color:e.roi>=200?'#10b981':e.roi>=150?'#38bdf8':'#f59e0b'}}>{e.roi}%</span><span className="text-xs p-text-ghost font-mono">ROI</span></div></div></button>))}</div></>) : (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="rounded-2xl p-6 relative overflow-hidden" style={{background:'rgba(244,63,94,0.04)', border:'1px solid rgba(244,63,94,0.12)'}}>
      <div className="absolute top-0 right-0 w-60 h-60 rounded-full blur-[80px] pointer-events-none" style={{background:'rgba(244,63,94,0.06)'}}/>
      <div className="flex items-center justify-between mb-6 relative z-10"><div className="flex items-center gap-4"><img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full object-cover" style={{border:'2px solid rgba(244,63,94,0.3)'}}/><div><p className="text-lg font-light text-white">{emp.name}</p><p className="text-xs p-text-dim">{emp.role} · {emp.department}</p></div></div><button onClick={() => setSel(null)} className="p-2 rounded-lg hover:bg-white/5 transition-colors p-text-ghost hover:p-text-hi"><X size={16}/></button></div>
      <p className="text-xs font-mono uppercase tracking-[0.2em] mb-4 relative z-10" style={{color:'rgba(244,63,94,0.6)'}}>If {emp.name.split(' ')[0]} leaves</p>
      <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">{[{label:'Replacement cost', val:`$${Math.round(emp.costInvestment*1.5/1000)}K`, sub:'1.5× annual comp', color:'#f43f5e'},{label:'Lost value / quarter', val:`$${Math.round(emp.revenueContribution*0.4/1000)}K`, sub:'Pipeline + tribal knowledge', color:'#f43f5e'},{label:'Time to replace', val:`${(3+Math.sin(emp.id.charCodeAt(1))*1.5).toFixed(1)} mo`, sub:'Recruit + ramp + proficiency', color:'#f43f5e'}].map((m,i) => (<div key={i} className="p-4 rounded-xl" style={{background:'rgba(244,63,94,0.04)', border:'1px solid rgba(244,63,94,0.08)'}}><motion.span className="font-mono text-2xl block" style={{color:m.color}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2+i*0.1}}>{m.val}</motion.span><span className="text-xs font-mono p-text-ghost uppercase tracking-widest block mt-1">{m.label}</span><span className="text-[11px] p-text-dim block mt-0.5">{m.sub}</span></div>))}</div>
      <NavLink to={`/app/employee/${emp.id}`} className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg text-xs font-mono transition-all hover:scale-105 relative z-10" style={{background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.15)', color:'#f43f5e'}}>View full profile <ArrowUpRight size={11}/></NavLink>
    </motion.div>)}</div>);
}

/* ═══ SIMULATION LAB COMPONENTS ═══ */
function CorrelationEngine() {
  const base = useMemo(() => Object.fromEntries(DIMS.map(d => [d.field, orgAvg(d.field)])) as Record<DimField,number>, []);
  const [vals, setVals] = useState<Record<DimField,number>>({...base}); const [dragging, setDragging] = useState<DimField|null>(null);
  const change = useCallback((field: DimField, raw: number) => { const nv = {...vals, [field]: raw}; const delta = raw - base[field];
    if (field === 'performanceScore' && delta > 5) { nv.welfareScore = Math.max(30, Math.round(base.welfareScore - delta * 0.45)); nv.attritionRiskPercentage = Math.min(90, Math.round(base.attritionRiskPercentage + delta * 0.3)); }
    if (field === 'motivationScore') { nv.attritionRiskPercentage = Math.max(5, Math.min(90, Math.round(100 - raw + (Math.random()*8-4)))); nv.learningProgress = Math.min(100, Math.round(base.learningProgress + (raw - base.motivationScore) * 0.25)); }
    if (field === 'welfareScore' && raw < 65) { nv.attritionRiskPercentage = Math.min(90, Math.round(nv.attritionRiskPercentage + (65 - raw) * 0.5)); nv.motivationScore = Math.max(30, Math.round(nv.motivationScore - (65 - raw) * 0.3)); }
    if (field === 'learningProgress') { nv.motivationScore = Math.min(100, Math.round(base.motivationScore + (raw - base.learningProgress) * 0.3)); nv.roi = Math.max(80, Math.round(base.roi + (raw - base.learningProgress) * 1.2)); }
    if (field === 'roi') { nv.performanceScore = Math.min(100, Math.round(base.performanceScore + (raw - base.roi) * 0.05)); }
    setVals(nv); }, [vals, base]);
  return (<div><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{DIMS.map(d => { const v=vals[d.field]; const delta=v-base[d.field]; const isDragging=dragging===d.field; const mx=d.field==='roi'?350:100;
    return (<div key={d.id} className="p-3.5 rounded-xl transition-all duration-300" style={{background:`${d.color}${isDragging?'12':'06'}`, border:`1px solid ${d.color}${isDragging?'25':'10'}`}}><div className="flex items-center justify-between mb-2"><span className="text-xs font-light" style={{color:isDragging?'white':'var(--p-text-body)'}}>{d.label}</span><div className="flex items-center gap-1.5"><span className="font-mono text-sm tabular-nums" style={{color:d.color}}>{v}</span>{delta!==0&&<span className="text-xs font-mono" style={{color:delta>0?'#10b981':'#f43f5e'}}>{delta>0?'+':''}{delta}</span>}</div></div><input type="range" min={d.field==='roi'?50:10} max={mx} value={v} onChange={e=>change(d.field,+e.target.value)} onMouseDown={()=>setDragging(d.field)} onMouseUp={()=>setDragging(null)} onTouchStart={()=>setDragging(d.field)} onTouchEnd={()=>setDragging(null)} className="w-full h-1 rounded-full cursor-pointer appearance-none" style={{accentColor:d.color, background:'rgba(255,255,255,0.06)'}}/></div>); })}</div>
    <div className="flex items-center justify-between mt-4"><p className="text-xs font-mono p-text-ghost uppercase tracking-widest">Drag any slider — watch correlated dimensions resist</p><button onClick={()=>setVals({...base})} className="text-xs font-mono px-3 py-1 rounded-lg p-text-dim hover:p-text-hi transition-colors" style={{border:'1px solid var(--p-border)'}}>Reset</button></div></div>);
}

function SignalScatter() {
  const [dx, setDx] = useState(0); const [dy, setDy] = useState(3); const dimX = DIMS[dx], dimY = DIMS[dy]; const mxX = dimX.field === 'roi' ? 350 : 100; const mxY = dimY.field === 'roi' ? 350 : 100;
  return (<div><div className="flex items-center gap-3 mb-4 flex-wrap"><select value={dx} onChange={e=>setDx(+e.target.value)} className="p-bg-input border rounded-lg px-3 py-1.5 font-mono text-xs cursor-pointer" style={{borderColor:'var(--p-border)', color:dimX.color, background:'var(--p-bg-input)'}}>{DIMS.map((d,i) => <option key={d.id} value={i}>{d.label}</option>)}</select><span className="text-xs p-text-ghost font-mono">vs</span><select value={dy} onChange={e=>setDy(+e.target.value)} className="p-bg-input border rounded-lg px-3 py-1.5 font-mono text-xs cursor-pointer" style={{borderColor:'var(--p-border)', color:dimY.color, background:'var(--p-bg-input)'}}>{DIMS.map((d,i) => <option key={d.id} value={i}>{d.label}</option>)}</select></div>
    <div className="rounded-xl overflow-hidden" style={{background:'rgba(255,255,255,0.01)', border:'1px solid var(--p-border)'}}><svg viewBox="0 0 420 340" style={{width:'100%',maxHeight:340}} className="overflow-visible"><line x1={50} y1={20} x2={50} y2={280} stroke="rgba(255,255,255,0.05)"/><line x1={50} y1={280} x2={400} y2={280} stroke="rgba(255,255,255,0.05)"/>{[0.25,0.5,0.75].map(p => (<g key={p}><line x1={50} y1={280-p*260} x2={400} y2={280-p*260} stroke="rgba(255,255,255,0.02)"/><line x1={50+p*350} y1={20} x2={50+p*350} y2={280} stroke="rgba(255,255,255,0.02)"/></g>))}<text x={225} y={316} textAnchor="middle" fill={dimX.color} fontSize={11} fontFamily="'Space Mono',monospace">{dimX.label}</text><text x={14} y={150} textAnchor="middle" fill={dimY.color} fontSize={11} fontFamily="'Space Mono',monospace" transform="rotate(-90,14,150)">{dimY.label}</text>
      {employees.map((emp,i) => { const vx=(emp as any)[dimX.field] as number; const vy=(emp as any)[dimY.field] as number; const px=50+(vx/mxX)*350; const py=280-(vy/mxY)*260; return (<g key={emp.id}><motion.circle cx={px} cy={py} r={10} fill={`${dimX.color}15`} stroke={dimX.color} strokeWidth={1.5} strokeOpacity={0.5} initial={{cx:225,cy:150,opacity:0}} animate={{cx:px,cy:py,opacity:1}} transition={{duration:0.7,delay:i*0.06,ease:[0.16,1,0.3,1]}}/><motion.text x={px} y={py-16} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={11} fontFamily="-apple-system,sans-serif" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4+i*0.06}}>{emp.name.split(' ')[0]}</motion.text></g>); })}</svg></div>
    <p className="text-xs font-mono p-text-ghost uppercase tracking-widest mt-3">Try Output vs Wellbeing to spot the burnout cluster</p></div>);
}

function TemporalRewind() {
  const quarters = ["Q1 '25","Q2 '25","Q3 '25","Q4 '25"];
  const history = useMemo<Record<string,number[]>>(() => ({performanceScore:[78,82,86,orgAvg('performanceScore')],learningProgress:[55,62,68,orgAvg('learningProgress')],motivationScore:[82,79,74,orgAvg('motivationScore')],welfareScore:[88,83,78,orgAvg('welfareScore')],roi:[180,210,230,orgAvg('roi')],attritionRiskPercentage:[15,20,28,orgAvg('attritionRiskPercentage')]}), []);
  const [qi, setQi] = useState(3);
  return (<div><div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">{DIMS.map(d => { const vals=history[d.field]; const v=vals[qi]; const prev=qi>0?vals[qi-1]:v; const delta=v-prev; const improving=d.invert?delta<0:delta>0;
    return (<motion.div key={d.id} className="text-center p-3 rounded-xl" style={{background:`${d.color}06`, border:`1px solid ${d.color}10`}} animate={{borderColor:`${d.color}${qi===3?'20':'10'}`}}><motion.span className="font-mono text-xl tabular-nums block" style={{color:d.color}} key={`${d.id}-${qi}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.3}}>{v}</motion.span><span className="text-[11px] font-mono p-text-ghost uppercase tracking-widest block mt-1">{d.label}</span>{delta!==0&&<span className="text-xs font-mono mt-1 block" style={{color:improving?'#10b981':'#f43f5e'}}>{delta>0?'+':''}{delta}{d.unit}</span>}</motion.div>); })}</div>
    <div className="flex items-center gap-4"><span className="font-mono text-sm" style={{color:'#38bdf8'}}>{quarters[qi]}</span><div className="flex-1"><input type="range" min={0} max={3} value={qi} onChange={e=>setQi(+e.target.value)} className="w-full h-1 rounded-full cursor-pointer appearance-none" style={{accentColor:'#38bdf8', background:'rgba(255,255,255,0.06)'}}/><div className="flex justify-between mt-2">{quarters.map((q,i) => (<span key={i} className="text-xs font-mono cursor-pointer" onClick={()=>setQi(i)} style={{color:i===qi?'#38bdf8':'rgba(255,255,255,0.15)'}}>{q}</span>))}</div></div></div></div>);
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export function Spectrum() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';
  const [active, setActive] = useState<string|null>(null);
  const [analyticsTab, setAnalyticsTab] = useState<'overview'|'capital'|'health'|'simulation'>('overview');
  const [activeCapital, setActiveCapital] = useState<'magnetic'|'horizon'|'departure'>('magnetic');
  const [activeSim, setActiveSim] = useState<'correlation'|'scatter'|'rewind'>('correlation');
  const insights = useMemo(() => generateInsights(), []);
  const totalInvestment = employees.reduce((s,e) => s+e.costInvestment, 0);
  const totalRevenue = employees.reduce((s,e) => s+e.revenueContribution, 0);
  const orgROI = Math.round((totalRevenue/totalInvestment)*100);
  const topROI = [...employees].sort((a,b) => b.roi-a.roi)[0];

  const handleRingClick = (id: string) => {
    setActive(prev => prev===id ? null : id);
    setTimeout(() => document.getElementById(`dim-${id}`)?.scrollIntoView({behavior:'smooth',block:'center'}), 100);
  };

  return (
    <div className="w-full min-h-screen pb-32" style={{backgroundColor:'var(--p-bg)'}}>

      {/* ═══ HERO — no back button, this is home ═══ */}
      <div className="page-wrap pb-0">
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:[0.16,1,0.3,1]}}>
          <p className="text-[11px] font-mono uppercase tracking-[0.28em] p-text-ghost mb-5 flex items-center gap-3">
            <span className="inline-block w-6 h-px" style={{background:'var(--p-border-hi)'}}/> Welcome back, {firstName}
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-0">
            <h1 className="hero-title font-light text-white">The <span className="italic font-serif p-text-dim">Spectrum</span></h1>
            <p className="text-sm p-text-ghost font-light max-w-xs leading-relaxed md:text-right">One score compresses six signals.<br/>This page holds them apart.</p>
          </div>
        </motion.div>
      </div>

      {/* ═══ PRISM ═══ */}
      <div className="px-6 md:px-12 lg:px-24">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3,duration:1}}><ThePrism onSelect={handleRingClick}/></motion.div>
      </div>

      {/* ═══ TEAM CONSTELLATION ═══ */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4,duration:1}}
        className="px-6 md:px-12 lg:px-24 mb-6 md:mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-light p-text-body">Team <span className="font-serif italic p-text-mid">Constellation</span></h2>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute top-0 right-0 w-24 h-full z-10" style={{ background: 'linear-gradient(to left, var(--p-bg), transparent)' }} />
          <div className="constellation-track flex overflow-x-auto gap-6 pb-8 pt-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {employees.map((emp, index) => (
              <NavLink to={`/app/employee/${emp.id}`} key={emp.id}>
                <motion.div
                  initial={{ opacity: 0, x: 50, rotateY: -10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1), duration: 0.8, ease: "easeOut" }}
                  whileHover={{ y: -20, scale: 1.02 }}
                  className="group relative w-[260px] h-[370px] shrink-0 rounded-[2rem] overflow-hidden p-bg-surface snap-center cursor-crosshair border p-border hover:p-border-hi transition-all duration-500"
                >
                  <img src={emp.avatar} alt={emp.name} loading="lazy" decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

                  {/* Risk dot */}
                  <div className="absolute top-5 left-5 flex items-center gap-2 pointer-events-none">
                    <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] ${
                      emp.attritionRisk === 'High' ? 'bg-rose-500 text-rose-500' :
                      emp.attritionRisk === 'Medium' ? 'bg-amber-500 text-amber-500' : 'bg-emerald-500 text-emerald-500'
                    }`} />
                    <span className="text-xs uppercase tracking-[0.12em] p-text-mid font-semibold truncate max-w-[120px]">{emp.stage}</span>
                  </div>

                  {/* ROI badge */}
                  <div className="absolute top-5 right-5 pointer-events-none">
                    <div className="px-2 py-0.5 rounded-full bg-black/40 border p-border-mid text-sm font-mono p-text-mid">ROI {emp.roi}%</div>
                  </div>

                  <div className="absolute bottom-4 left-5 right-5 pointer-events-none">
                    <h3 className="text-lg font-light text-white leading-tight group-hover:text-cyan-400 transition-colors truncate">{emp.name.split(' ')[0]}</h3>
                    <h3 className="text-lg font-serif italic p-text-mid leading-tight mb-2 truncate">{emp.name.split(' ')[1]}</h3>
                    <div className="flex justify-between items-end border-t p-border-mid pt-2">
                      <div><span className="block text-[10px] uppercase tracking-widest p-text-lo mb-0.5">Perf</span><span className="text-base font-light text-white">{emp.performanceScore}<span className="text-[10px] p-text-dim">pt</span></span></div>
                      <div><span className="block text-[10px] uppercase tracking-widest p-text-lo mb-0.5">Learn</span><span className="text-base font-light text-white">{emp.learningProgress}<span className="text-[10px] p-text-dim">%</span></span></div>
                      <div><span className="block text-[10px] uppercase tracking-widest p-text-lo mb-0.5">Welfare</span><span className="text-base font-light text-white">{emp.welfareScore}<span className="text-[10px] p-text-dim">pt</span></span></div>
                    </div>
                  </div>
                </motion.div>
              </NavLink>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══ DIMENSION ROWS ═══ */}
      <div className="w-full border-t" style={{borderColor:'var(--p-border)'}}>
        {DIMS.map((dim,i) => {
          const isActive=active===dim.id, anyActive=active!==null;
          const avg=orgAvg(dim.field), ranked=rankEmployees(dim); const Icon=dim.icon;
          return (
            <motion.div key={dim.id} id={`dim-${dim.id}`} onClick={()=>setActive(isActive?null:dim.id)} initial={{opacity:0,x:-20}} animate={{opacity:anyActive&&!isActive?0.25:1,x:0}} transition={{x:{duration:0.5,delay:i*0.05,ease:[0.16,1,0.3,1]},opacity:{duration:anyActive?0.15:0.5}}} className="relative cursor-pointer overflow-hidden border-b select-none" style={{borderColor:'var(--p-border)'}}>
              <motion.div className="absolute inset-0 pointer-events-none" animate={{opacity:isActive?1:0}} transition={{duration:0.4}} style={{background:`linear-gradient(135deg,${dim.glow} 0%,transparent 50%)`}}/>
              <motion.div className="absolute left-0 top-0 bottom-0 w-1" style={{background:dim.color}} animate={{opacity:isActive?1:0}} transition={{duration:0.2}}/>
              <div className="relative z-10 flex items-center gap-4 md:gap-8 px-6 md:px-12 lg:px-24 py-7 md:py-9">
                <span className="text-[10px] font-mono w-5 flex-shrink-0 tabular-nums" style={{color:isActive?dim.color:'var(--p-text-ghost)'}}>{String(i+1).padStart(2,'0')}</span>
                <Icon size={15} className="flex-shrink-0 hidden md:block" style={{color:dim.color,opacity:isActive?1:0.5}}/>
                <span className="flex-shrink-0 w-20 md:w-28 font-mono tabular-nums leading-none" style={{fontSize:'clamp(2rem,4.5vw,3.5rem)',color:dim.color,textShadow:isActive?`0 0 40px ${dim.color}50`:'none',transition:'text-shadow 0.4s'}}>{avg}<span className="text-[10px] font-mono tracking-widest ml-1" style={{color:`${dim.color}70`}}>{dim.unit}</span></span>
                <div className="flex-shrink-0 w-24 md:w-36"><span className="block font-light leading-tight transition-colors" style={{fontSize:'clamp(1.1rem,2vw,1.6rem)',color:isActive?'white':'var(--p-text-body)'}}>{dim.label}</span><span className="hidden md:block text-[11px] font-mono p-text-ghost mt-0.5">{dim.sub}</span></div>
                <div className="flex-1 relative hidden sm:block" style={{height:10}}><div className="absolute inset-0 rounded-full" style={{background:'rgba(255,255,255,0.04)'}}/><motion.div className="absolute left-0 top-0 h-full rounded-full" style={{background:`linear-gradient(90deg,${dim.color}50,${dim.color})`}} initial={{width:0}} animate={{width:`${Math.min(dim.invert?100-avg:dim.field==='roi'?Math.min(avg/350*100,100):avg,100)}%`}} transition={{duration:1.2,delay:0.15+i*0.08,ease:[0.16,1,0.3,1]}}/></div>
                <div className="hidden lg:flex items-center -space-x-2 flex-shrink-0">{ranked.slice(0,3).map((emp,j) => (<motion.img key={emp.id} src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover border-2 grayscale hover:grayscale-0 transition-all duration-500 hover:z-10 hover:scale-125" style={{borderColor:'var(--p-bg)',zIndex:3-j}} loading="lazy" decoding="async" initial={{opacity:0,x:6}} animate={{opacity:1,x:0}} transition={{delay:0.5+j*0.04}}/>))}</div>
              </div>
              <AnimatePresence>{isActive && (
                <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}} className="overflow-hidden">
                  <div className="relative z-10 px-6 md:px-12 lg:px-24 pb-10">
                    <div className="h-px mb-8" style={{background:`linear-gradient(90deg,${dim.color}30,transparent 60%)`}}/>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="space-y-6">
                        <div><p className="text-[11px] font-mono uppercase tracking-[0.22em] mb-3" style={{color:`${dim.color}70`}}><Lightbulb size={9} className="inline mr-1.5" style={{color:dim.color}}/> Why this matters</p><p className="font-serif italic leading-relaxed p-text-mid" style={{fontSize:'clamp(0.85rem,1.4vw,1.05rem)'}}>"{dim.insight}"</p></div>
                        <div className="p-3.5 rounded-xl" style={{background:`${dim.color}06`,border:`1px solid ${dim.color}12`}}><p className="text-[11px] font-mono uppercase tracking-[0.22em] mb-1.5" style={{color:dim.color}}><ArrowRight size={8} className="inline mr-1"/> Action</p><p className="text-xs p-text-body leading-relaxed">{dim.action}</p></div>
                      </div>
                      <div className="lg:col-span-2 space-y-8">
                        <div><p className="text-[11px] font-mono uppercase tracking-[0.22em] p-text-ghost mb-5">Team distribution — each face is a person</p><TeamScatter dim={dim}/></div>
                        <div className="grid grid-cols-2 gap-6">
                          {[{title:dim.invert?'Lowest risk':'Top signal',list:ranked.slice(0,3),good:true},{title:dim.invert?'Highest risk':'Needs attention',list:ranked.slice(-3).reverse(),good:false}].map((col,ci) => (
                            <div key={ci}><p className="text-[11px] font-mono uppercase tracking-[0.22em] mb-3" style={{color:col.good?`${dim.color}70`:'var(--p-text-ghost)'}}>{col.title}</p>
                              {col.list.map((emp,j) => (<NavLink key={emp.id} to={`/app/employee/${emp.id}`} onClick={e=>e.stopPropagation()} className="flex items-center gap-2.5 py-1.5 group"><span className="text-[11px] font-mono p-text-ghost w-3">{col.good?j+1:employees.length-2+j}</span><img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" loading="lazy" decoding="async"/><span className="flex-1 text-xs font-light p-text-body group-hover:text-white transition-colors truncate">{emp.name}</span><span className="text-xs font-mono" style={{color:col.good?dim.color:'var(--p-text-dim)'}}>{(emp as any)[dim.field]}{dim.unit}</span><ArrowUpRight size={8} className="p-text-ghost group-hover:p-text-hi transition-colors"/></NavLink>))}
                            </div>))}
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

      {/* ═══ ILLUMINATIONS (v3: replaces Intelligence) ═══ */}
      {insights.length > 0 && (
        <div className="px-6 md:px-12 lg:px-24 py-10">
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}}>
            <div className="flex items-center gap-2 mb-6"><Brain size={13} className="p-text-mid"/><p className="text-[11px] font-mono uppercase tracking-[0.22em] p-text-ghost">Illuminations — Prism-powered patterns</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.slice(0,4).map((ins,i) => { const cfg={critical:{label:'Critical',icon:Flame},watch:{label:'Watch',icon:Eye},opportunity:{label:'Opportunity',icon:Sparkles}}[ins.type]; const Icon=cfg.icon;
                return (<motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="rounded-xl p-4 group transition-all duration-300 hover:scale-[1.005]" style={{background:`${ins.color}06`,border:`1px solid ${ins.color}12`,cursor:ins.empId?'pointer':'default'}} onClick={()=>ins.empId&&navigate(`/app/employee/${ins.empId}`)}>
                  <div className="flex items-start gap-3"><Icon size={11} className="flex-shrink-0 mt-0.5" style={{color:ins.color}}/><div className="flex-1 min-w-0"><span className="text-[11px] font-mono uppercase tracking-[0.2em] px-1.5 py-0.5 rounded mb-1.5 inline-block" style={{background:`${ins.color}12`,color:ins.color}}>{cfg.label}</span><p className="text-sm font-light text-white leading-snug mb-0.5">{ins.title}</p><p className="text-xs p-text-dim leading-relaxed">{ins.detail}</p></div>{ins.empId && <ChevronRight size={12} className="p-text-ghost group-hover:p-text-mid transition-colors flex-shrink-0 mt-1"/>}</div>
                </motion.div>); })}
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══ MERIDIAN PULSE (v3: roadmap progress widget) ═══ */}
      <div className="px-6 md:px-12 lg:px-24 py-6">
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}}>
          <div className="rounded-[2rem] p-6 md:p-8 relative overflow-hidden" style={{background:'var(--p-bg-card)',border:'1px solid var(--p-border)'}}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] pointer-events-none" style={{background:'rgba(16,185,129,0.04)'}} />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity size={13} style={{color:'#10b981'}} />
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] p-text-ghost">Meridian Pulse</p>
              </div>
              <NavLink to="/app/roadmap" className="text-[10px] font-mono uppercase tracking-[0.15em] flex items-center gap-1 transition-colors hover:text-emerald-400" style={{color:'var(--p-text-ghost)'}}>
                View Meridian <ArrowRight size={10}/>
              </NavLink>
            </div>
            {/* Compact progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="p-text-mid">Overall progress</span>
                <span className="font-mono" style={{color:'#10b981'}}>47%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{background:'var(--p-border)'}}>
                <motion.div initial={{width:0}} whileInView={{width:'47%'}} viewport={{once:true}} transition={{duration:1.2,ease:[0.16,1,0.3,1]}}
                  className="h-full rounded-full" style={{background:'linear-gradient(90deg, #10b981, #38bdf8)'}} />
              </div>
            </div>
            {/* Top 3 at-risk milestones */}
            <div className="space-y-2">
              {[
                {title:'API Gateway',dept:'core-arch',pct:65,status:'on-track'},
                {title:'User Research Phase 2',dept:'growth',pct:40,status:'watch'},
                {title:'Beta Launch',dept:'growth',pct:0,status:'not-started'},
              ].map((m,i)=>(<div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:m.status==='on-track'?'#10b981':m.status==='watch'?'#f59e0b':'var(--p-text-ghost)'}} />
                <span className="text-xs flex-1" style={{color:'var(--p-text-mid)'}}>{m.title}</span>
                <span className="text-[10px] font-mono" style={{color:'var(--p-text-ghost)'}}>{m.dept.replace('-',' ')}</span>
                <span className="text-[10px] font-mono" style={{color:m.pct>=50?'#10b981':m.pct>0?'#f59e0b':'var(--p-text-ghost)'}}>{m.pct}%</span>
              </div>))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ ANALYTICS SECTION ═══ */}
      <div className="px-6 md:px-12 lg:px-24 py-8 border-t" style={{borderColor:'var(--p-border)'}}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}}>
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] p-text-ghost mb-2">Deep analytics</p>
          <h2 className="text-xl font-light text-white mb-6">Global <span className="italic font-serif p-text-dim">Models</span></h2>

          {/* Tab selector */}
          <div className="flex gap-1 p-1 p-bg-card rounded-xl border p-border w-fit mb-8 flex-wrap">
            {([{id:'overview' as const,label:'Overview'},{id:'capital' as const,label:'Capital Dynamics'},{id:'health' as const,label:'Wellbeing'},{id:'simulation' as const,label:'Simulation Lab'}]).map(v => (
              <button key={v.id} onClick={() => setAnalyticsTab(v.id)} className={`px-5 py-2 rounded-lg text-xs uppercase tracking-widest font-medium transition-all ${analyticsTab === v.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>{v.label}</button>
            ))}
          </div>

          {/* OVERVIEW */}
          {analyticsTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:1,delay:0.2}} className="lg:col-span-2 p-bg-card border p-border rounded-[2rem] p-8 md:p-12 relative overflow-hidden group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
                  <div className="flex justify-between items-center mb-12"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-4 border-b p-border-mid pb-4">Revenue vs Human Capital Cost ($M)</h3><TrendingUp size={16} className="text-emerald-400" /></div>
                  <div className="h-[300px] w-full -ml-4"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={globalRevenueForecast}><defs><linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.1}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="var(--p-chart-grid)" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'var(--p-chart-axis)',fontSize:10}} dy={20}/><Tooltip content={<CustomTooltip/>}/><Area type="monotone" dataKey="projected" stroke="#22d3ee" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" name="Projected Rev"/><Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{r:4,fill:'#10b981'}} name="Actual Rev"/><Bar dataKey="cost" fill="#8b5cf6" opacity={0.5} radius={[4,4,0,0]} barSize={20} name="Investment"/></ComposedChart></ResponsiveContainer></div>
                </motion.div>
                <div className="space-y-6">
                  <div className="p-bg-card border p-border rounded-[2rem] p-8 relative overflow-hidden"><div className="flex justify-between items-center mb-8"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-4 border-b p-border-mid pb-4">Attrition Risk</h3><AlertTriangle size={16} className="text-rose-400" /></div><div className="flex items-end justify-between gap-2 h-24">{[12,15,18,14,25,32,28,22].map((v,i) => (<motion.div key={i} initial={{height:0}} whileInView={{height:`${v*3}px`}} viewport={{once:true}} transition={{duration:0.8,delay:0.5+i*0.05}} className="flex-1 rounded-t-lg" style={{background:v>25?`linear-gradient(to top, rgba(244,63,94,0.2), rgba(244,63,94,${v/40}))`:`linear-gradient(to top, rgba(56,189,248,0.1), rgba(56,189,248,${v/50}))`}}/>))}</div></div>
                  <div className="p-bg-card border p-border rounded-[2rem] p-8 relative overflow-hidden"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-4 border-b p-border-mid pb-4 mb-6">Performance Trend</h3><div className="h-24"><ResponsiveContainer width="100%" height="100%"><AreaChart data={performanceData}><defs><linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c084fc" stopOpacity={0.2}/><stop offset="95%" stopColor="#c084fc" stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="avgScore" stroke="#c084fc" fill="url(#perfGrad)" strokeWidth={2} dot={false}/></AreaChart></ResponsiveContainer></div></div>
                </div>
              </div>
              <div className="p-bg-card border p-border rounded-[2rem] overflow-hidden"><div className="px-8 py-5 border-b p-border flex items-center justify-between"><p className="text-sm uppercase tracking-[0.12em] p-text-dim font-mono">Employee Matrix</p><p className="text-sm uppercase tracking-[0.12em] p-text-ghost font-mono">{employees.length} nodes</p></div>
                <table className="w-full text-left"><thead><tr className="border-b p-border text-xs p-text-ghost uppercase tracking-widest">{['','Name','Dept','Perf','Risk','ROI'].map((h,i) => <th key={i} className="px-6 py-4 font-medium">{h}</th>)}</tr></thead><tbody>{employees.map(emp => (<tr key={emp.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors group"><td className="pl-6 py-4"><NavLink to={`/app/employee/${emp.id}`}><img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"/></NavLink></td><td className="py-4"><NavLink to={`/app/employee/${emp.id}`} className="p-text-body text-sm font-light hover:text-white transition-colors">{emp.name}</NavLink></td><td className="py-4 p-text-lo text-xs font-mono uppercase tracking-widest">{emp.department.split(' ')[0]}</td><td className="py-4"><span className={`font-mono text-sm ${emp.performanceScore>=90?'text-emerald-400':emp.performanceScore>=80?'text-cyan-400':'text-amber-400'}`}>{emp.performanceScore}</span></td><td className="py-4"><span className={`px-2 py-0.5 text-xs uppercase tracking-widest rounded-full border ${emp.attritionRisk==='High'?'border-rose-500/30 text-rose-400 bg-rose-500/10':emp.attritionRisk==='Medium'?'border-amber-500/30 text-amber-400 bg-amber-500/10':'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'}`}>{emp.attritionRisk}</span></td><td className="py-4 pr-6"><span className={`font-mono text-sm ${emp.roi>=200?'text-emerald-400':emp.roi>=150?'text-cyan-400':'text-amber-400'}`}>{emp.roi}%</span></td></tr>))}</tbody></table>
              </div>
            </div>
          )}

          {/* CAPITAL DYNAMICS */}
          {analyticsTab === 'capital' && (
            <div className="space-y-6">
              {topROI && (<div className="p-4 rounded-xl flex items-center gap-4" style={{background:'rgba(16,185,129,0.04)', border:'1px solid rgba(16,185,129,0.12)'}}><img src={topROI.avatar} alt={topROI.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0"/><div className="flex-1"><p className="text-sm font-light text-white">{topROI.name} is your highest-ROI at <span className="font-mono text-emerald-400">{topROI.roi}%</span></p></div><NavLink to={`/app/employee/${topROI.id}`} className="p-text-ghost hover:text-emerald-400 transition-colors"><ArrowUpRight size={16}/></NavLink></div>)}
              <div className="flex gap-2 flex-wrap">{([{id:'magnetic' as const,icon:Magnet,label:'Trajectory'},{id:'horizon' as const,icon:Ghost,label:'Forecast'},{id:'departure' as const,icon:DoorOpen,label:'Departure Cost'}]).map(s => (<button key={s.id} onClick={()=>setActiveCapital(s.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300" style={{background:activeCapital===s.id?'rgba(16,185,129,0.08)':'var(--p-bg-card)', border:`1px solid ${activeCapital===s.id?'rgba(16,185,129,0.2)':'var(--p-border)'}`, color:activeCapital===s.id?'#10b981':'var(--p-text-dim)'}}><s.icon size={13}/><span className="text-xs font-light">{s.label}</span></button>))}</div>
              <AnimatePresence mode="wait"><motion.div key={activeCapital} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.4}} className="p-bg-card border p-border rounded-2xl p-6 md:p-8 relative overflow-hidden">
                {activeCapital==='magnetic' && <div><div className="flex items-center justify-between mb-6"><div><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold border-b p-border-mid pb-3">ROI Trajectory (6M)</h3><p className="p-text-ghost text-xs font-mono mt-1">Move cursor near data — points are magnetically attracted</p></div><TrendingUp size={14} className="text-emerald-400"/></div><MagneticChart data={orgROIData}/></div>}
                {activeCapital==='horizon' && <div><div className="mb-6"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold border-b p-border-mid pb-3">Predictive Ghost Horizon</h3><p className="p-text-ghost text-xs font-mono mt-1">Drag growth rate — forecast reshapes live</p></div><GhostHorizon data={orgROIData}/></div>}
                {activeCapital==='departure' && <CostOfDeparture/>}
              </motion.div></AnimatePresence>
              <div className="p-bg-card border p-border rounded-2xl p-6 md:p-8"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-3 mb-6"><Coins size={10} className="text-emerald-400"/> Department Vectors</h3><div className="space-y-5">{departmentROI.map((dept,i) => (<div key={i}><div className="flex justify-between text-xs mb-2"><span className="p-text-mid">{dept.department}</span><span className={`font-mono ${dept.roi>=200?'text-emerald-400':dept.roi>=150?'text-cyan-400':dept.roi>=110?'text-amber-400':'text-rose-400'}`}>{dept.roi}%</span></div><div className="h-px" style={{background:'rgba(255,255,255,0.04)'}}><motion.div className="h-full" initial={{width:0}} whileInView={{width:`${Math.min((dept.roi/400)*100,100)}%`}} viewport={{once:true}} transition={{duration:1.2,delay:i*0.1}} style={{background:dept.roi>=200?'#10b981':dept.roi>=150?'#38bdf8':dept.roi>=110?'#f59e0b':'#f43f5e'}}/></div><div className="flex justify-between text-xs p-text-ghost mt-1 font-mono"><span>Cost ${(dept.investment/1000).toFixed(0)}K</span><span>Value ${(dept.value/1000).toFixed(0)}K</span></div></div>))}</div></div>
            </div>
          )}

          {/* WELLBEING */}
          {analyticsTab === 'health' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-bg-card border p-border rounded-[2rem] p-8"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 border-b p-border-mid pb-4">Org Health Radar</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%"><PolarGrid stroke="var(--p-chart-grid)"/><PolarAngleAxis dataKey="metric" tick={{fill:'var(--p-chart-axis)',fontSize:11}}/><Radar name="Score" dataKey="score" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} strokeWidth={1.5}/><Tooltip content={<CustomTooltip/>}/></RadarChart></ResponsiveContainer></div></div>
              <div className="p-bg-card border p-border rounded-[2rem] p-8"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 border-b p-border-mid pb-4">Learning Domain Completion</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={globalLearningData} layout="vertical"><XAxis type="number" axisLine={false} tickLine={false} tick={{fill:'var(--p-chart-axis)',fontSize:10}}/><YAxis dataKey="domain" type="category" axisLine={false} tickLine={false} tick={{fill:'var(--p-chart-axis-hi)',fontSize:11}} width={80}/><Tooltip content={<CustomTooltip/>} cursor={{fill:'var(--p-chart-cursor)'}}/><Bar dataKey="completed" name="Completed" fill="#10b981" radius={[0,4,4,0]} barSize={12} stackId="a"/><Bar dataKey="active" name="In Progress" fill="#38bdf8" radius={[0,4,4,0]} barSize={12} stackId="a"/></ComposedChart></ResponsiveContainer></div></div>
              <div className="lg:col-span-2 p-bg-card border p-border rounded-[2rem] p-8"><h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 border-b p-border-mid pb-4">Wellbeing & Burnout Matrix</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{employees.map(emp => (<NavLink key={emp.id} to={`/app/employee/${emp.id}`} className="relative group block"><div className="rounded-2xl p-5 border p-border transition-all hover:p-border-hi" style={{background:emp.bioRhythm.burnoutProbability>60?'rgba(244,63,94,0.05)':emp.bioRhythm.burnoutProbability>35?'rgba(245,158,11,0.05)':'rgba(16,185,129,0.05)'}}><div className="flex items-center gap-2 mb-4"><img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"/><p className="p-text-body text-sm font-light">{emp.name.split(' ')[0]}</p></div><div className="space-y-2"><div className="flex justify-between text-xs"><span className="p-text-dim">Stress</span><span className="font-mono" style={{color:emp.bioRhythm.stressIndex>60?'#f43f5e':'#10b981'}}>{emp.bioRhythm.stressIndex}</span></div><div className="flex justify-between text-xs"><span className="p-text-dim">Burnout</span><span className="font-mono" style={{color:emp.bioRhythm.burnoutProbability>60?'#f43f5e':emp.bioRhythm.burnoutProbability>35?'#f59e0b':'#10b981'}}>{emp.bioRhythm.burnoutProbability}%</span></div><div className="flex justify-between text-xs"><span className="p-text-dim">Sleep</span><span className="font-mono p-text-mid">{emp.bioRhythm.sleepQuality}%</span></div></div></div></NavLink>))}</div></div>
            </div>
          )}

          {/* SIMULATION LAB */}
          {analyticsTab === 'simulation' && (
            <div>
              <div className="flex gap-2 mb-6 flex-wrap">{([{id:'correlation' as const,icon:SlidersHorizontal,label:'Correlation Engine',color:'#c084fc'},{id:'scatter' as const,icon:Crosshair,label:'Signal Scatter',color:'#f43f5e'},{id:'rewind' as const,icon:Clock,label:'Temporal Rewind',color:'#38bdf8'}]).map(s => (<button key={s.id} onClick={()=>setActiveSim(s.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300" style={{background:activeSim===s.id?`${s.color}12`:'var(--p-bg-card)', border:`1px solid ${activeSim===s.id?s.color+'25':'var(--p-border)'}`, color:activeSim===s.id?s.color:'var(--p-text-dim)'}}><s.icon size={13}/><span className="text-xs font-light">{s.label}</span></button>))}</div>
              <AnimatePresence mode="wait"><motion.div key={activeSim} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.4}} className="p-6 rounded-2xl" style={{background:'var(--p-bg-card)', border:'1px solid var(--p-border)'}}>
                {activeSim==='correlation' && <CorrelationEngine/>}{activeSim==='scatter' && <SignalScatter/>}{activeSim==='rewind' && <TemporalRewind/>}
              </motion.div></AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
