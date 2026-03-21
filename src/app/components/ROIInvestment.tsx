/**
 * ROI & Investment — "The Capital Engine"
 *
 * Four radical interactions:
 *   1. Magnetic Data Points — cursor generates a force field, data leans toward it
 *   2. Predictive Ghost Horizon — forecast zone with confidence envelope + growth slider
 *   3. ROI Race — month-on-month bar race with animation
 *   4. Cost of Departure — click any person to see what losing them actually costs
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useNavigate } from 'react-router';
import {
  ArrowLeft, ArrowUpRight, TrendingUp, Cpu, Coins, X,
  Magnet, Ghost, Trophy, DoorOpen, Play, RotateCcw
} from 'lucide-react';
import { employees, orgROIData, departmentROI } from '../mockData';

/* ═══════════════════════════════════════════════════════════════════════════
   MAGNETIC DATA POINTS
   Cursor proximity pulls data points with spring physics. No click needed.
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

  // Build smooth paths
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
    <svg ref={svgRef} width="100%" height={H} viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet" className="overflow-visible cursor-none"
      onMouseMove={onMove} onMouseLeave={() => {setMouse({x:-100,y:-100});setClosest(null);}}>
      <defs>
        <linearGradient id="magFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity={0.12}/>
          <stop offset="100%" stopColor="#10b981" stopOpacity={0.01}/>
        </linearGradient>
      </defs>

      {/* Grid */}
      {[0.25,0.5,0.75,1].map(p => (<g key={p}><line x1={pad.l} y1={pad.t+ch*(1-p)} x2={W-pad.r} y2={pad.t+ch*(1-p)} stroke="rgba(255,255,255,0.03)"/><text x={pad.l-8} y={pad.t+ch*(1-p)+3} textAnchor="end" fill="rgba(255,255,255,0.15)" fontSize={8} fontFamily="'Space Mono',monospace">${(maxV*p).toFixed(1)}M</text></g>))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#magFill)"/>

      {/* Investment line */}
      <path d={buildPath(invPts)} fill="none" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="5 4" strokeOpacity={0.4}/>

      {/* Value line */}
      <path d={valPath} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round"/>

      {/* Cursor glow */}
      <circle cx={mouse.x} cy={mouse.y} r={60} fill="rgba(56,189,248,0.03)"/>
      <circle cx={mouse.x} cy={mouse.y} r={3} fill="rgba(56,189,248,0.3)"/>

      {/* Magnetic data points */}
      {data.map((d,i) => {
        const bx=sx(i), by=sy(d.totalValue);
        const dist=Math.hypot(mouse.x-bx,mouse.y-by);
        const pull=Math.max(0,1-dist/100);
        const dx=(mouse.x-bx)*pull*0.12, dy=(mouse.y-by)*pull*0.12;
        const isClose = closest===i;
        return (<g key={i}>
          {/* Investment dot */}
          <circle cx={sx(i)} cy={sy(d.totalInvestment)} r={3} fill="#f43f5e" fillOpacity={0.4}/>
          {/* Value dot with magnetic pull */}
          <circle cx={bx+dx} cy={by+dy} r={isClose?8:4} fill={isClose?"#10b981":"rgba(16,185,129,0.6)"} style={{transition:'r 0.15s'}}/>
          {isClose && <>
            {/* Connecting line to baseline */}
            <line x1={bx} y1={by+10} x2={bx} y2={pad.t+ch} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 3"/>
            {/* Tooltip */}
            <g transform={`translate(${Math.min(bx+14,W-135)},${Math.max(by-60,10)})`}>
              <rect x={0} y={0} width={125} height={72} rx={8} fill="#0a0a0a" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5}/>
              <text x={10} y={16} fontSize={8} fontFamily="'Space Mono',monospace" fill="rgba(255,255,255,0.35)">{d.month}</text>
              <text x={10} y={34} fontSize={11} fontFamily="'Space Mono',monospace" fill="#10b981">${d.totalValue}M value</text>
              <text x={10} y={50} fontSize={11} fontFamily="'Space Mono',monospace" fill="#f43f5e">${d.totalInvestment}M invested</text>
              <text x={10} y={66} fontSize={11} fontFamily="'Space Mono',monospace" fill="#f59e0b">{d.roi}% ROI</text>
            </g>
          </>}
          {/* Month label */}
          <text x={sx(i)} y={H-10} textAnchor="middle" fill={isClose?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.2)"} fontSize={9} fontFamily="'Space Mono',monospace">{d.month}</text>
        </g>);
      })}

      {/* Legend */}
      <g transform={`translate(${pad.l},${H-2})`}>
        <line x1={0} y1={-3} x2={14} y2={-3} stroke="#10b981" strokeWidth={2}/><text x={18} y={0} fontSize={8} fontFamily="'Space Mono',monospace" fill="rgba(255,255,255,0.25)">Value</text>
        <line x1={65} y1={-3} x2={79} y2={-3} stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 3"/><text x={83} y={0} fontSize={8} fontFamily="'Space Mono',monospace" fill="rgba(255,255,255,0.25)">Investment</text>
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PREDICTIVE GHOST HORIZON
   Real data + forecast zone + confidence envelope + growth slider
   ═══════════════════════════════════════════════════════════════════════════ */
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
        {/* Grid */}
        {[0.25,0.5,0.75,1].map(p => <line key={p} x1={pad.l} y1={pad.t+ch*(1-p)} x2={W-pad.r} y2={pad.t+ch*(1-p)} stroke="rgba(255,255,255,0.03)"/>)}

        {/* Forecast zone */}
        <rect x={sx(data.length-1)} y={pad.t} width={sx(months.length-1)-sx(data.length-1)} height={ch} fill="rgba(56,189,248,0.02)" rx={4}/>
        <text x={(sx(data.length-1)+sx(months.length-1))/2} y={pad.t+12} textAnchor="middle" fill="rgba(56,189,248,0.15)" fontSize={7} fontFamily="'Space Mono',monospace">FORECAST</text>

        {/* Confidence envelope */}
        <polygon
          points={
            forecast.map((v,i)=>`${sx(data.length-1+i)},${sy(v*0.92)}`).join(' ') +
            ' ' + [...forecast].reverse().map((v,i)=>`${sx(data.length-1+(forecast.length-1-i))},${sy(v*1.08)}`).join(' ')
          }
          fill="rgba(56,189,248,0.04)" stroke="rgba(56,189,248,0.08)" strokeWidth={0.5}/>

        {/* Actual line */}
        <polyline points={data.map((d,i)=>`${sx(i)},${sy(d.roi)}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round"/>
        {data.map((d,i) => <circle key={i} cx={sx(i)} cy={sy(d.roi)} r={4} fill="#f59e0b"/>)}

        {/* Forecast line */}
        <polyline points={forecast.map((v,i)=>`${sx(data.length-1+i)},${sy(v)}`).join(' ')} fill="none" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="6 4"/>
        {forecast.slice(1).map((v,i) => <circle key={i} cx={sx(data.length+i)} cy={sy(v)} r={3} fill="#38bdf8" fillOpacity={0.6}/>)}

        {/* Month labels */}
        {months.map((m,i) => <text key={i} x={sx(i)} y={H-6} textAnchor="middle" fill={i>=data.length?"rgba(56,189,248,0.3)":"rgba(255,255,255,0.2)"} fontSize={8} fontFamily="'Space Mono',monospace">{m}</text>)}

        {/* Forecast values */}
        {forecast.slice(1).map((v,i) => <text key={i} x={sx(data.length+i)} y={sy(v)-12} textAnchor="middle" fill="#38bdf8" fontSize={9} fontFamily="'Space Mono',monospace" fillOpacity={0.7}>{v}%</text>)}
      </svg>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-[9px] font-mono p-text-ghost">Growth rate</span>
        <input type="range" min={-5} max={20} value={growth} onChange={e=>setGrowth(+e.target.value)}
          className="flex-1 h-1 rounded-full cursor-pointer appearance-none"
          style={{accentColor:'#38bdf8', background:'rgba(255,255,255,0.06)'}}/>
        <span className="font-mono text-sm" style={{color:'#38bdf8'}}>{growth}%</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROI RACE — Month-on-month. Bars grow and trade positions.
   ═══════════════════════════════════════════════════════════════════════════ */
function ROIRace() {
  const months = orgROIData.map(d => d.month);
  const [mi, setMi] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Per-employee monthly ROI (synthetic but realistic variation)
  const empMonthly = useMemo(() => employees.map(emp => {
    const base = emp.roi;
    return orgROIData.map((_,i) => {
      const progress = (i+1)/orgROIData.length;
      const variation = Math.sin(emp.id.charCodeAt(1)*7 + i*2) * 15;
      return Math.round(base * (0.8 + progress * 0.2) + variation);
    });
  }), []);

  useEffect(() => {
    if(!playing) return;
    if(mi >= months.length-1) { setPlaying(false); return; }
    const t = setTimeout(() => setMi(m => m+1), 1000);
    return () => clearTimeout(t);
  }, [playing, mi, months.length]);

  const play = () => { setMi(0); setPlaying(true); };

  const sorted = employees.map((emp,i) => ({emp, val:empMonthly[i][mi], i})).sort((a,b) => b.val-a.val);
  const maxV = Math.max(...sorted.map(s=>s.val));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm" style={{color:'#38bdf8'}}>{months[mi]}</span>
          <span className="text-[8px] font-mono p-text-ghost">Month {mi+1} of {months.length}</span>
        </div>
        <button onClick={play} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-mono transition-all hover:scale-105"
          style={{background:'rgba(56,189,248,0.08)', border:'1px solid rgba(56,189,248,0.15)', color:'#38bdf8'}}>
          {playing ? <RotateCcw size={10}/> : <Play size={10}/>} {playing ? 'Playing...' : 'Race'}
        </button>
      </div>

      <div className="space-y-2">
        {sorted.map((s,rank) => (
          <motion.div key={s.emp.id} layout transition={{type:'spring',damping:25,stiffness:200}}
            className="flex items-center gap-3">
            <span className="text-[9px] font-mono w-4 flex-shrink-0" style={{color:rank===0?'#f59e0b':'var(--p-text-ghost)'}}>
              {rank===0?'👑':String(rank+1).padStart(2,'0')}
            </span>
            <img src={s.emp.avatar} alt={s.emp.name} className="w-6 h-6 rounded-full object-cover flex-shrink-0 grayscale" loading="lazy" decoding="async"/>
            <span className="text-xs font-light w-16 flex-shrink-0 truncate" style={{color:'var(--p-text-body)'}}>{s.emp.name.split(' ')[0]}</span>
            <div className="flex-1 h-4 rounded overflow-hidden" style={{background:'rgba(255,255,255,0.03)'}}>
              <motion.div className="h-full rounded"
                style={{background:`linear-gradient(90deg, #38bdf830, #38bdf8)`}}
                animate={{width:`${(s.val/maxV)*100}%`}}
                transition={{duration:0.6,ease:[0.16,1,0.3,1]}}/>
            </div>
            <span className="font-mono text-xs w-12 text-right flex-shrink-0" style={{color:'#38bdf8'}}>{s.val}%</span>
          </motion.div>
        ))}
      </div>

      {/* Scrubber */}
      <div className="mt-4">
        <input type="range" min={0} max={months.length-1} value={mi} onChange={e=>{setMi(+e.target.value);setPlaying(false);}}
          className="w-full h-1 rounded-full cursor-pointer appearance-none"
          style={{accentColor:'#38bdf8', background:'rgba(255,255,255,0.06)'}}/>
        <div className="flex justify-between mt-1">
          {months.map((m,i) => <span key={i} className="text-[7px] font-mono" style={{color:i===mi?'#38bdf8':'rgba(255,255,255,0.12)'}}>{m}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COST OF DEPARTURE — Click any person → dark card expands with cost data
   ═══════════════════════════════════════════════════════════════════════════ */
function CostOfDeparture() {
  const [sel, setSel] = useState<string|null>(null);
  const emp = sel ? employees.find(e => e.id === sel) : null;

  return (
    <div>
      {!emp ? (
        <>
          <p className="text-[8px] font-mono p-text-ghost uppercase tracking-widest mb-3">Click any person to model departure cost</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {employees.map(e => {
              const surplus = e.revenueContribution - e.costInvestment;
              return (
                <button key={e.id} onClick={() => setSel(e.id)}
                  className="flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] group"
                  style={{background:'var(--p-bg-card)', border:'1px solid var(--p-border)'}}>
                  <img src={e.avatar} alt={e.name} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 flex-shrink-0"/>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-light text-white truncate">{e.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs" style={{color:e.roi>=200?'#10b981':e.roi>=150?'#38bdf8':'#f59e0b'}}>{e.roi}%</span>
                      <span className="text-[8px] p-text-ghost font-mono">ROI</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
          className="rounded-2xl p-6 relative overflow-hidden" style={{background:'rgba(244,63,94,0.04)', border:'1px solid rgba(244,63,94,0.12)'}}>
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full blur-[80px] pointer-events-none" style={{background:'rgba(244,63,94,0.06)'}}/>

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full object-cover" style={{border:'2px solid rgba(244,63,94,0.3)'}}/>
              <div>
                <p className="text-lg font-light text-white">{emp.name}</p>
                <p className="text-xs p-text-dim">{emp.role} · {emp.department}</p>
              </div>
            </div>
            <button onClick={() => setSel(null)} className="p-2 rounded-lg hover:bg-white/5 transition-colors p-text-ghost hover:p-text-hi"><X size={16}/></button>
          </div>

          <p className="text-[9px] font-mono uppercase tracking-[0.2em] mb-4 relative z-10" style={{color:'rgba(244,63,94,0.6)'}}>
            If {emp.name.split(' ')[0]} leaves your organization
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
            {[
              {label:'Replacement cost', val:`$${Math.round(emp.costInvestment*1.5/1000)}K`, sub:'1.5× annual comp', color:'#f43f5e'},
              {label:'Lost value / quarter', val:`$${Math.round(emp.revenueContribution*0.4/1000)}K`, sub:'Pipeline + tribal knowledge', color:'#f43f5e'},
              {label:'Time to replace', val:`${(3+Math.sin(emp.id.charCodeAt(1))*1.5).toFixed(1)} mo`, sub:'Recruit + ramp + proficiency', color:'#f43f5e'},
            ].map((m,i) => (
              <div key={i} className="p-4 rounded-xl" style={{background:'rgba(244,63,94,0.04)', border:'1px solid rgba(244,63,94,0.08)'}}>
                <motion.span className="font-mono text-2xl block" style={{color:m.color}}
                  initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2+i*0.1}}>
                  {m.val}
                </motion.span>
                <span className="text-[8px] font-mono p-text-ghost uppercase tracking-widest block mt-1">{m.label}</span>
                <span className="text-[7px] p-text-dim block mt-0.5">{m.sub}</span>
              </div>
            ))}
          </div>

          {/* Context */}
          <div className="flex items-center gap-3 p-3 rounded-xl relative z-10" style={{background:'rgba(255,255,255,0.02)', border:'1px solid var(--p-border)'}}>
            <div className="w-1 h-8 rounded-full flex-shrink-0" style={{background:emp.attritionRiskPercentage>50?'#f43f5e':emp.attritionRiskPercentage>25?'#f59e0b':'#10b981'}}/>
            <div>
              <p className="text-xs p-text-body">Current flight risk: <span className="font-mono" style={{color:emp.attritionRiskPercentage>50?'#f43f5e':'#f59e0b'}}>{emp.attritionRiskPercentage}%</span></p>
              <p className="text-[9px] p-text-dim mt-0.5">Current ROI: <span className="font-mono text-emerald-400">{emp.roi}%</span> · Total annual value: <span className="font-mono">${Math.round(emp.revenueContribution/1000)}K</span></p>
            </div>
          </div>

          <NavLink to={`/app/employee/${emp.id}`}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-xs font-mono transition-all hover:scale-105 relative z-10"
            style={{background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.15)', color:'#f43f5e'}}>
            View full profile <ArrowUpRight size={11}/>
          </NavLink>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export function ROIInvestment() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'magnetic'|'horizon'|'race'|'departure'>('magnetic');

  const totalInvestment = employees.reduce((s,e) => s+e.costInvestment, 0);
  const totalRevenue = employees.reduce((s,e) => s+e.revenueContribution, 0);
  const orgROI = Math.round((totalRevenue/totalInvestment)*100);
  const topROI = [...employees].sort((a,b) => b.roi-a.roi)[0];

  const sections = [
    {id:'magnetic' as const, icon:Magnet, label:'Trajectory', desc:'Magnetic data points'},
    {id:'horizon' as const, icon:Ghost, label:'Forecast', desc:'Predictive horizon'},
    {id:'race' as const, icon:Trophy, label:'Race', desc:'Month-on-month'},
    {id:'departure' as const, icon:DoorOpen, label:'Departure Cost', desc:'What if they leave?'},
  ];

  return (
    <div className="page-wrap">
      {/* Hero */}
      <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:[0.16,1,0.3,1]}}
        className="mb-16 flex flex-col md:flex-row justify-between items-end gap-12 border-b p-border pb-12">
        <div>
          <button onClick={()=>navigate(-1)} className="inline-flex items-center gap-2 p-text-dim hover:p-text-hi text-sm mb-4 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform"/> Back
          </button>
          <p className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-2">
            <Cpu size={14} className="text-emerald-400"/> Investment · Forecasting · Momentum · Risk
          </p>
          <h1 className="hero-title font-light text-white">Capital <span className="p-text-dim italic font-serif">Dynamics</span></h1>
        </div>
        <div className="flex gap-16 text-right">
          <div>
            <p className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2">Org ROI</p>
            <p className="text-4xl font-light text-emerald-400">{orgROI}%</p>
          </div>
          <div>
            <p className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2">Surplus Generated</p>
            <p className="text-4xl font-light text-white">${(totalRevenue/1000000).toFixed(1)}M</p>
          </div>
        </div>
      </motion.div>

      {/* Top ROI callout */}
      {topROI && (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
          className="mb-10 p-4 rounded-xl flex items-center gap-4"
          style={{background:'rgba(16,185,129,0.04)', border:'1px solid rgba(16,185,129,0.12)'}}>
          <img src={topROI.avatar} alt={topROI.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0"/>
          <div className="flex-1">
            <p className="text-sm font-light text-white">{topROI.name} is your highest-ROI employee at <span className="font-mono text-emerald-400">{topROI.roi}%</span></p>
            <p className="text-xs p-text-dim mt-0.5">Every $1 invested returns ${(topROI.roi/100).toFixed(1)}. Protect this person.</p>
          </div>
          <NavLink to={`/app/employee/${topROI.id}`} className="p-text-ghost hover:text-emerald-400 transition-colors"><ArrowUpRight size={16}/></NavLink>
        </motion.div>
      )}

      {/* Section selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sections.map(s => {
          const isActive = activeSection === s.id;
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300"
              style={{
                background: isActive ? 'rgba(16,185,129,0.08)' : 'var(--p-bg-card)',
                border: `1px solid ${isActive ? 'rgba(16,185,129,0.2)' : 'var(--p-border)'}`,
                color: isActive ? '#10b981' : 'var(--p-text-dim)',
              }}>
              <s.icon size={13}/>
              <div className="text-left">
                <span className="text-xs font-light block">{s.label}</span>
                <span className="text-[7px] font-mono opacity-50 hidden md:block">{s.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active section */}
      <AnimatePresence mode="wait">
        <motion.div key={activeSection}
          initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
          transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
          className="p-bg-card border p-border rounded-2xl p-6 md:p-8 relative overflow-hidden mb-8">

          {activeSection === 'magnetic' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-3">ROI Trajectory (6M)</h3>
                  <p className="p-text-ghost text-xs font-mono mt-1">Move cursor near data — points are magnetically attracted</p>
                </div>
                <TrendingUp size={14} className="text-emerald-400"/>
              </div>
              <MagneticChart data={orgROIData}/>
            </div>
          )}

          {activeSection === 'horizon' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-3">Predictive Ghost Horizon</h3>
                  <p className="p-text-ghost text-xs font-mono mt-1">Drag the growth rate — forecast reshapes in real time</p>
                </div>
              </div>
              <GhostHorizon data={orgROIData}/>
            </div>
          )}

          {activeSection === 'race' && (
            <div>
              <div className="mb-4">
                <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-3">ROI Race — Month on Month</h3>
                <p className="p-text-ghost text-xs font-mono mt-1">Hit race to watch employees compete as ROI shifts monthly</p>
              </div>
              <ROIRace/>
            </div>
          )}

          {activeSection === 'departure' && <CostOfDeparture/>}

        </motion.div>
      </AnimatePresence>

      {/* Department vectors */}
      <div className="p-bg-card border p-border rounded-2xl p-6 md:p-8">
        <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-3 mb-6">
          <Coins size={10} className="text-emerald-400"/> Department Vectors
        </h3>
        <div className="space-y-5">
          {departmentROI.map((dept,i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-2">
                <span className="p-text-mid">{dept.department}</span>
                <span className={`font-mono ${dept.roi>=200?'text-emerald-400':dept.roi>=150?'text-cyan-400':dept.roi>=110?'text-amber-400':'text-rose-400'}`}>{dept.roi}%</span>
              </div>
              <div className="h-px" style={{background:'rgba(255,255,255,0.04)'}}>
                <motion.div className="h-full" initial={{width:0}} whileInView={{width:`${Math.min((dept.roi/400)*100,100)}%`}} viewport={{once:true}} transition={{duration:1.2,delay:i*0.1,ease:[0.16,1,0.3,1]}}
                  style={{background:dept.roi>=200?'#10b981':dept.roi>=150?'#38bdf8':dept.roi>=110?'#f59e0b':'#f43f5e'}}/>
              </div>
              <div className="flex justify-between text-xs p-text-ghost mt-1 font-mono">
                <span>Cost ${(dept.investment/1000).toFixed(0)}K</span>
                <span>Value ${(dept.value/1000).toFixed(0)}K</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
