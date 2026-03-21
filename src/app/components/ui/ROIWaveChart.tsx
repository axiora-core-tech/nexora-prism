/**
 * ROIWaveChart — Prism's signature ROI visualisation.
 *
 * Design: "The Value Engine"
 * - Multi-layer emerald glow fills beneath the value curve
 * - Value curve animated via strokeDashoffset (reliable cross-browser)
 * - Interactive scan line: vertical crosshair follows cursor with live tooltip
 * - Animated pulse ring on the latest (rightmost) data point
 * - Diamond markers with concentric glow rings
 * - Dot-grid background for depth
 * - No axes, no box — pure data on dark canvas
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

interface DataPoint {
  month: string;
  totalInvestment: number;
  totalValue: number;
  roi: number;
}

interface Props { data: DataPoint[]; height?: number; }

function catmull(pts: [number,number][], t=0.4): string {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i=0; i<pts.length-1; i++) {
    const p0=pts[Math.max(0,i-1)], p1=pts[i], p2=pts[i+1], p3=pts[Math.min(pts.length-1,i+2)];
    const cp1x=p1[0]+(p2[0]-p0[0])*t, cp1y=p1[1]+(p2[1]-p0[1])*t;
    const cp2x=p2[0]-(p3[0]-p1[0])*t, cp2y=p2[1]-(p3[1]-p1[1])*t;
    d+=` C${cp1x},${cp1y},${cp2x},${cp2y},${p2[0]},${p2[1]}`;
  }
  return d;
}

export function ROIWaveChart({ data, height = 340 }: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const vPathRef = useRef<SVGPathElement>(null);
  const iPathRef = useRef<SVGPathElement>(null);
  const rPathRef = useRef<SVGPathElement>(null);

  const [w, setW]             = useState(640);
  const [drawn, setDrawn]     = useState(false);
  const [vLen, setVLen]       = useState(0);
  const [iLen, setILen]       = useState(0);
  const [rLen, setRLen]       = useState(0);
  const [scanX, setScanX]     = useState<number|null>(null);
  const [scanIdx, setScanIdx] = useState<number|null>(null);
  const [pulse, setPulse]     = useState(false);

  const H = height;
  const PL=0, PR=0, PT=40, PB=48;
  const CW = w - PL - PR;
  const CH = H - PT - PB;

  useEffect(() => {
    const obs = new ResizeObserver(e => { const ww=e[0].contentRect.width; if(ww>0) setW(ww); });
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  // Recompute path lengths whenever dimensions change
  useEffect(() => {
    if (vPathRef.current) setVLen(vPathRef.current.getTotalLength());
    if (iPathRef.current) setILen(iPathRef.current.getTotalLength());
    if (rPathRef.current) setRLen(rPathRef.current.getTotalLength());
  });

  useEffect(() => {
    const t = setTimeout(() => { setDrawn(true); setTimeout(()=>setPulse(true), 1400); }, 200);
    return () => clearTimeout(t);
  }, []);

  const allV = data.flatMap(d=>[d.totalValue, d.totalInvestment]);
  const minV = Math.min(...allV)*0.88, maxV = Math.max(...allV)*1.08;
  const sy = (v:number) => PT + CH - ((v-minV)/(maxV-minV))*CH;
  const sx = (i:number) => PL + (i/(data.length-1))*CW;

  const roiMin = Math.min(...data.map(d=>d.roi))*0.94;
  const roiMax = Math.max(...data.map(d=>d.roi))*1.06;
  const ry = (v:number) => PT + 8 + (1-(v-roiMin)/(roiMax-roiMin))*(CH*0.28);

  const vPts  = data.map((_,i)=>[sx(i),sy(_.totalValue)]  as [number,number]);
  const iPts  = data.map((_,i)=>[sx(i),sy(_.totalInvestment)] as [number,number]);
  const rPts  = data.map((_,i)=>[sx(i),ry(_.roi)]          as [number,number]);

  // Closed fill: value curve → right edge down → investment reversed → close
  const fillClose = `${catmull(vPts)} L${iPts[iPts.length-1][0]},${sy(minV)} L${PL},${sy(minV)} Z`;
  const surplusClose = `${catmull(vPts)} L${iPts[iPts.length-1][0]},${iPts[iPts.length-1][1]} ${catmull([...iPts].reverse())} Z`;

  const vPath = catmull(vPts);
  const iPath = catmull(iPts);
  const rPath = catmull(rPts, 0.3);

  const lastV = vPts[vPts.length-1];
  const lastR = rPts[rPts.length-1];

  const onMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const step = CW / (data.length-1);
    const idx = Math.round((mx - PL) / step);
    if (idx >= 0 && idx < data.length) { setScanIdx(idx); setScanX(sx(idx)); }
    else { setScanIdx(null); setScanX(null); }
  }, [w, data.length]);
  const onMouseLeave = () => { setScanIdx(null); setScanX(null); };

  const DUR_DRAW = 1.6;

  return (
    <div ref={wrapRef} className="relative w-full select-none" style={{ height: H }}>
      <svg width="100%" height={H} viewBox={`0 0 ${w} ${H}`}
        className="overflow-visible cursor-crosshair"
        onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <defs>
          {/* Deep glow fill under value curve */}
          <linearGradient id="deepFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#10b981" stopOpacity="0.35"/>
            <stop offset="40%"  stopColor="#10b981" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02"/>
          </linearGradient>
          {/* Surplus zone between value and investment */}
          <linearGradient id="surplusFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#10b981" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.04"/>
          </linearGradient>
          {/* Value stroke left→right brightening */}
          <linearGradient id="vStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#10b981" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="1"/>
          </linearGradient>
          {/* Investment stroke */}
          <linearGradient id="iStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#f43f5e" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.5"/>
          </linearGradient>
          {/* Scan line */}
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="white" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
          {/* Glow filter — value curve */}
          <filter id="glow" x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b1"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="b2"/>
            <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Diamond glow */}
          <filter id="dGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Pulse ring glow */}
          <filter id="pulseGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6"/>
          </filter>
        </defs>

        {/* ── Dot grid background ── */}
        {Array.from({length: Math.ceil(CW/32)+1}).map((_,ci) =>
          Array.from({length: Math.ceil(CH/24)+1}).map((_,ri) => (
            <circle key={`${ci}-${ri}`}
              cx={PL + ci*32} cy={PT + ri*24} r="0.8"
              fill="white" fillOpacity="0.04" />
          ))
        )}

        {/* ── Deep fill under entire value curve ── */}
        <motion.path d={fillClose} fill="url(#deepFill)"
          initial={{opacity:0}} animate={{opacity: drawn?1:0}}
          transition={{duration:0.8, delay:0.6}} />

        {/* ── Surplus zone fill ── */}
        <motion.path d={surplusClose} fill="url(#surplusFill)"
          initial={{opacity:0}} animate={{opacity: drawn?1:0}}
          transition={{duration:0.8, delay:0.8}} />

        {/* ── Investment curve ── */}
        <path ref={iPathRef} d={iPath} fill="none" stroke="transparent" />
        {iLen > 0 && (
          <motion.path d={iPath} fill="none"
            stroke="url(#iStroke)" strokeWidth="1.5" strokeDasharray="5 4"
            strokeDasharray={`${iLen}`}
            initial={{strokeDashoffset: iLen}}
            animate={{strokeDashoffset: drawn ? 0 : iLen}}
            transition={{duration: DUR_DRAW*0.9, delay:0.3, ease:[0.16,1,0.3,1]}} />
        )}

        {/* ── Value curve glow layer (blurred duplicate) ── */}
        <motion.path d={vPath} fill="none"
          stroke="#10b981" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.18"
          filter="url(#glow)"
          initial={{opacity:0}} animate={{opacity: drawn?1:0}}
          transition={{duration:0.6, delay:0.4}} />

        {/* ── Value curve main ── */}
        <path ref={vPathRef} d={vPath} fill="none" stroke="transparent" />
        {vLen > 0 && (
          <motion.path d={vPath} fill="none"
            stroke="url(#vStroke)" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={`${vLen}`}
            initial={{strokeDashoffset: vLen}}
            animate={{strokeDashoffset: drawn ? 0 : vLen}}
            transition={{duration: DUR_DRAW, delay:0.2, ease:[0.16,1,0.3,1]}} />
        )}

        {/* ── ROI dashed arc ── */}
        <path ref={rPathRef} d={rPath} fill="none" stroke="transparent" />
        {rLen > 0 && (
          <motion.path d={rPath} fill="none"
            stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.45"
            strokeDasharray={`${rLen}`}
            initial={{strokeDashoffset: rLen}}
            animate={{strokeDashoffset: drawn ? 0 : rLen}}
            transition={{duration: DUR_DRAW*0.8, delay:0.5, ease:[0.16,1,0.3,1]}} />
        )}

        {/* ── ROI diamond markers ── */}
        {rPts.map(([x,y],i) => (
          <motion.g key={i}
            initial={{opacity:0, scale:0}}
            animate={{opacity: drawn?1:0, scale: drawn?1:0}}
            transition={{duration:0.35, delay:0.8+i*0.1, ease:[0.34,1.56,0.64,1]}}
            style={{transformOrigin:`${x}px ${y}px`}}
            filter="url(#dGlow)">
            <rect x={x-5} y={y-5} width={10} height={10}
              transform={`rotate(45,${x},${y})`}
              fill="#f59e0b" fillOpacity="0.9" />
            <text x={x} y={y-14} textAnchor="middle"
              fontSize="9" fontFamily="'Space Mono',monospace"
              fill="#f59e0b" fillOpacity="0.9">{data[i].roi}%</text>
          </motion.g>
        ))}

        {/* ── Value data dots ── */}
        {vPts.map(([x,y],i) => (
          <motion.circle key={i} cx={x} cy={y} r={i===vPts.length-1?4:2.5}
            fill={i===vPts.length-1?'#10b981':'#10b981'}
            fillOpacity={i===vPts.length-1?1:0.7}
            initial={{r:0,opacity:0}}
            animate={{r: drawn?(i===vPts.length-1?4:2.5):0, opacity: drawn?1:0}}
            transition={{duration:0.3, delay:1.0+i*0.08}} />
        ))}

        {/* ── Pulse ring on latest point ── */}
        {pulse && (
          <>
            {/* Glow blur behind ring */}
            <motion.circle cx={lastV[0]} cy={lastV[1]} r={14}
              fill="none" stroke="#10b981" strokeWidth="6" strokeOpacity="0.15"
              filter="url(#pulseGlow)"
              animate={{r:[10,22,10], strokeOpacity:[0.25,0,0.25]}}
              transition={{duration:2.4, repeat:Infinity, ease:'easeInOut'}} />
            <motion.circle cx={lastV[0]} cy={lastV[1]} r={10}
              fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.6"
              animate={{r:[6,18,6], strokeOpacity:[0.7,0,0.7]}}
              transition={{duration:2.4, repeat:Infinity, ease:'easeInOut'}} />
          </>
        )}

        {/* ── Scan line + crosshairs ── */}
        {scanX !== null && scanIdx !== null && (
          <g>
            <line x1={scanX} y1={PT-8} x2={scanX} y2={H-PB}
              stroke="url(#scanGrad)" strokeWidth="1" />
            {/* Value crosshair */}
            <circle cx={vPts[scanIdx][0]} cy={vPts[scanIdx][1]} r={5}
              fill="none" stroke="#10b981" strokeWidth="1.5" />
            <circle cx={vPts[scanIdx][0]} cy={vPts[scanIdx][1]} r={2.5}
              fill="#10b981" />
            {/* Investment crosshair */}
            <circle cx={iPts[scanIdx][0]} cy={iPts[scanIdx][1]} r={4}
              fill="none" stroke="#f43f5e" strokeWidth="1.5" />
            {/* Tooltip card */}
            <g transform={`translate(${Math.min(scanX+12, w-130)},${PT})`}>
              <rect x={0} y={0} width={120} height={80} rx={6}
                fill="#0a0a0a" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
              <text x={10} y={16} fontSize="8" fontFamily="'Space Mono',monospace"
                fill="rgba(255,255,255,0.4)">{data[scanIdx].month}</text>
              <text x={10} y={34} fontSize="10" fontFamily="'Space Mono',monospace"
                fill="#10b981">${data[scanIdx].totalValue}M value</text>
              <text x={10} y={50} fontSize="10" fontFamily="'Space Mono',monospace"
                fill="#f43f5e">${data[scanIdx].totalInvestment}M invest</text>
              <text x={10} y={68} fontSize="10" fontFamily="'Space Mono',monospace"
                fill="#f59e0b">{data[scanIdx].roi}% ROI</text>
            </g>
          </g>
        )}

        {/* ── Month ruler ── */}
        <line x1={PL} y1={H-PB+8} x2={w-PR} y2={H-PB+8}
          stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
        {data.map((d,i) => (
          <g key={i}>
            <line x1={sx(i)} y1={PT} x2={sx(i)} y2={H-PB+8}
              stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 4"/>
            <text x={sx(i)} y={H-PB+22} textAnchor="middle"
              fontSize="9" fontFamily="'Space Mono',monospace"
              fill="rgba(255,255,255,0.3)">{d.month}</text>
          </g>
        ))}

        {/* ── Legend ── */}
        <g transform={`translate(${PL},${H-10})`}>
          {[
            {x:0,  stroke:'#10b981', dash:false, label:'Value Generated'},
            {x:90, stroke:'#f43f5e', dash:true,  label:'Investment'},
            {x:175,stroke:'#f59e0b', dia:true,   label:'ROI %'},
          ].map((l,i)=>(
            <g key={i} transform={`translate(${l.x},0)`}>
              {l.dia
                ? <rect x={0} y={-7} width={7} height={7} transform="rotate(45,3.5,-3.5)" fill="#f59e0b" fillOpacity="0.85"/>
                : <line x1={0} y1={-3} x2={14} y2={-3} stroke={l.stroke} strokeWidth={l.dash?1.5:2} strokeDasharray={l.dash?'4 3':undefined}/>
              }
              <text x={l.dia?12:18} y={0} fontSize="8"
                fontFamily="'Space Mono',monospace" fill="rgba(255,255,255,0.3)">{l.label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
