import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Activity, TrendingUp, AlertTriangle, DollarSign, ArrowLeft } from 'lucide-react';
import { performanceData, globalRevenueForecast, globalLearningData, orgROIData, employees } from '../mockData';

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOM CHART: Area Wave — Hand-crafted SVG area chart with gradient
   ═══════════════════════════════════════════════════════════════════════════ */

function AreaWave({ data, dataKey, color, height = 300, secondaryData, secondaryKey, secondaryColor, barData, barKey, barColor, xKey = 'month' }:
  { data: any[]; dataKey: string; color: string; height?: number; secondaryData?: any[]; secondaryKey?: string; secondaryColor?: string; barData?: any[]; barKey?: string; barColor?: string; xKey?: string }) {

  const W = 600, H = height;
  const padX = 40, padY = 30, padB = 40;
  const chartW = W - padX * 2;
  const chartH = H - padY - padB;
  const id = useMemo(() => `aw-${Math.random().toString(36).slice(2, 6)}`, []);

  // Get all numeric values for scale
  const allVals = data.map(d => d[dataKey] as number).filter(v => v != null);
  const secVals = secondaryData && secondaryKey ? (secondaryData || data).map(d => d[secondaryKey] as number).filter(v => v != null) : [];
  const barVals = barData && barKey ? (barData || data).map(d => d[barKey] as number).filter(v => v != null) : [];
  const allNums = [...allVals, ...secVals, ...barVals];
  const maxV = Math.max(...allNums) * 1.15;
  const minV = Math.min(0, Math.min(...allNums));

  const toX = (i: number) => padX + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => padY + chartH - ((v - minV) / (maxV - minV)) * chartH;

  // Build smooth path for primary line
  const validData = data.filter(d => d[dataKey] != null);
  const primaryPath = validData.map((d, i) => {
    const x = toX(data.indexOf(d));
    const y = toY(d[dataKey]);
    if (i === 0) return `M ${x},${y}`;
    const prev = validData[i - 1];
    const px = toX(data.indexOf(prev));
    const cpx = (px + x) / 2;
    return `C ${cpx},${toY(prev[dataKey])} ${cpx},${y} ${x},${y}`;
  }).join(' ');

  const areaPath = primaryPath + ` L ${toX(data.indexOf(validData[validData.length - 1]))},${padY + chartH} L ${toX(data.indexOf(validData[0]))},${padY + chartH} Z`;

  // Secondary line path (dashed)
  const secondaryPath = secondaryKey ? data.filter(d => d[secondaryKey] != null).map((d, i, arr) => {
    const x = toX(data.indexOf(d));
    const y = toY(d[secondaryKey]);
    if (i === 0) return `M ${x},${y}`;
    const prev = arr[i - 1];
    const px = toX(data.indexOf(prev));
    const cpx = (px + x) / 2;
    return `C ${cpx},${toY(prev[secondaryKey])} ${cpx},${y} ${x},${y}`;
  }).join(' ') : '';

  // Bar width
  const barW = barKey ? (chartW / data.length) * 0.5 : 0;

  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="overflow-visible">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(pct => {
        const y = padY + chartH * (1 - pct);
        const val = Math.round(minV + (maxV - minV) * pct);
        return (
          <g key={pct}>
            <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            <text x={padX - 6} y={y + 3} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize={8} fontFamily="'Space Mono',monospace">{val}</text>
          </g>
        );
      })}

      {/* X axis labels */}
      {data.map((d, i) => (
        <text key={i} x={toX(i)} y={H - 8} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={9} fontFamily="'Space Mono',monospace">
          {d[xKey]}
        </text>
      ))}

      {/* Bars (if provided) */}
      {barKey && data.map((d, i) => {
        if (d[barKey] == null) return null;
        const x = toX(i) - barW / 2;
        const bh = ((d[barKey] - minV) / (maxV - minV)) * chartH;
        return (
          <motion.rect key={`bar-${i}`}
            x={x} y={padY + chartH - bh} width={barW} rx={3}
            fill={barColor || '#8b5cf6'} fillOpacity={0.35}
            initial={{ height: 0, y: padY + chartH }}
            whileInView={{ height: bh, y: padY + chartH - bh }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}

      {/* Area fill */}
      <motion.path d={areaPath} fill={`url(#${id}-fill)`}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.8 }} />

      {/* Primary line */}
      <motion.path d={primaryPath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} />

      {/* Dots on primary */}
      {validData.map((d, i) => (
        <motion.circle key={i}
          cx={toX(data.indexOf(d))} cy={toY(d[dataKey])} r={3}
          fill={color} stroke="var(--p-bg)" strokeWidth={2}
          initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.5 + i * 0.08 }}
        />
      ))}

      {/* Secondary line (dashed) */}
      {secondaryPath && (
        <motion.path d={secondaryPath} fill="none" stroke={secondaryColor || '#22d3ee'} strokeWidth={1.5}
          strokeDasharray="5 5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOM CHART: Radar Web — Hand-crafted SVG spider chart
   ═══════════════════════════════════════════════════════════════════════════ */

function RadarWeb({ data, color = '#38bdf8', size = 280 }: { data: { metric: string; score: number }[]; color?: string; size?: number }) {
  const cx = size / 2, cy = size / 2;
  const maxR = size * 0.38;
  const n = data.length;
  const id = useMemo(() => `rw-${Math.random().toString(36).slice(2, 6)}`, []);

  const angleStep = (2 * Math.PI) / n;
  const getPoint = (i: number, r: number) => ({
    x: cx + r * Math.cos(i * angleStep - Math.PI / 2),
    y: cy + r * Math.sin(i * angleStep - Math.PI / 2),
  });

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1];

  // Data polygon
  const dataPoints = data.map((d, i) => getPoint(i, (d.score / 100) * maxR));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  return (
    <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0.05} />
        </linearGradient>
      </defs>

      {/* Grid */}
      {rings.map(r => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, r * maxR));
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';
        return <path key={r} d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
      })}

      {/* Axis lines */}
      {data.map((_, i) => {
        const p = getPoint(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />;
      })}

      {/* Data polygon */}
      <motion.path d={dataPath} fill={`url(#${id}-fill)`} stroke={color} strokeWidth={1.5} strokeLinejoin="round"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r={3} fill={color}
          initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.5 + i * 0.08 }}
        />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const p = getPoint(i, maxR + 20);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.45)" fontSize={9} fontFamily="'Space Mono',monospace">
            {d.metric}
          </text>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOM CHART: Horizontal Signal Bars
   ═══════════════════════════════════════════════════════════════════════════ */

function HorizontalBars({ data, dataKey, labelKey, colorFn, maxVal }: { data: any[]; dataKey: string; labelKey: string; colorFn: (v: number) => string; maxVal?: number }) {
  const max = maxVal || Math.max(...data.map(d => d[dataKey] as number));

  return (
    <div className="space-y-5">
      {data.map((d, i) => {
        const val = d[dataKey] as number;
        const pct = Math.min((val / max) * 100, 100);
        const color = colorFn(val);
        return (
          <div key={i}>
            <div className="flex justify-between text-xs mb-2">
              <span className="p-text-body">{d[labelKey]}</span>
              <span className="font-mono" style={{ color }}>{val}{typeof d[dataKey] === 'number' && d[dataKey] < 10 ? '' : '%'}</span>
            </div>
            <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.06 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOM CHART: Stacked Horizontal Bars
   ═══════════════════════════════════════════════════════════════════════════ */

function StackedHBars({ data }: { data: { domain: string; completed: number; active: number }[] }) {
  const max = Math.max(...data.map(d => d.completed + d.active));

  return (
    <div className="space-y-6">
      {data.map((d, i) => {
        const compPct = (d.completed / max) * 100;
        const actPct = (d.active / max) * 100;
        return (
          <div key={d.domain}>
            <div className="flex justify-between text-xs mb-2">
              <span className="p-text-body">{d.domain}</span>
              <span className="font-mono p-text-mid">{d.completed + d.active}</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div className="h-full rounded-l-full" style={{ background: '#10b981' }}
                initial={{ width: 0 }} whileInView={{ width: `${compPct}%` }} viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.08 }} />
              <motion.div className="h-full" style={{ background: '#38bdf8' }}
                initial={{ width: 0 }} whileInView={{ width: `${actPct}%` }} viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }} />
            </div>
          </div>
        );
      })}
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] p-text-ghost font-mono">Completed</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cyan-500" /><span className="text-[9px] p-text-ghost font-mono">In Progress</span></div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN ANALYTICS PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const radarData = [
  { metric: 'Performance', score: 84 },
  { metric: 'Engagement', score: 78 },
  { metric: 'Learning', score: 68 },
  { metric: 'Wellbeing', score: 76 },
  { metric: 'Innovation', score: 82 },
  { metric: 'Collaboration', score: 71 },
];

const attritionRiskBars = [12, 15, 18, 14, 25, 32, 28, 22];

export function Analytics() {
  const [activeView, setActiveView] = useState<'overview' | 'roi' | 'health'>('overview');
  const navigate = useNavigate();

  return (
    <div className="page-wrap">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b p-border pb-12"
      >
        <div>
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 p-text-dim hover:p-text-hi text-sm mb-4 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <p className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-2">
            <Activity size={14} className="text-cyan-400" /> Economic & System Telemetry
          </p>
          <h1 className="hero-title font-light text-white">
            Global <span className="p-text-dim italic font-serif">Models</span>
          </h1>
        </div>
        <div className="text-right flex gap-12">
          <div>
            <p className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2">System Health</p>
            <p className="text-4xl font-light text-white">98.9<span className="text-xl p-text-dim">%</span></p>
          </div>
          <div>
            <p className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2">Global ROI</p>
            <p className="text-4xl font-light text-white">246<span className="text-xl p-text-dim">%</span></p>
          </div>
        </div>
      </motion.div>

      {/* View tabs */}
      <div className="flex gap-1 p-1 p-bg-card rounded-xl border p-border w-fit mb-12">
        {(['overview', 'roi', 'health'] as const).map(v => (
          <button key={v} onClick={() => setActiveView(v)} data-cursor={v}
            className={`px-6 py-2 rounded-lg text-xs uppercase tracking-widest font-medium transition-all ${
              activeView === v ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
            }`}>
            {v === 'overview' ? 'Overview' : v === 'roi' ? 'ROI' : 'Wellbeing'}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Revenue Chart — Custom SVG */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-2 p-bg-card border p-border rounded-[2rem] p-8 md:p-12 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="flex justify-between items-center mb-12">
                <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-4 border-b p-border-mid pb-4">Revenue vs Human Capital Cost ($M)</h3>
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <div className="w-full -ml-2">
                <AreaWave
                  data={globalRevenueForecast}
                  dataKey="actual"
                  color="#10b981"
                  height={300}
                  secondaryKey="projected"
                  secondaryColor="#22d3ee"
                  barKey="cost"
                  barColor="#8b5cf6"
                />
              </div>
              {/* Legend */}
              <div className="flex gap-6 mt-4 ml-10">
                <div className="flex items-center gap-2"><div className="w-3 h-0.5 rounded bg-emerald-500" /><span className="text-[9px] font-mono p-text-ghost">Actual Rev</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-0.5 rounded border-b border-dashed border-cyan-400" /><span className="text-[9px] font-mono p-text-ghost">Projected</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-violet-500/40" /><span className="text-[9px] font-mono p-text-ghost">Investment</span></div>
              </div>
            </motion.div>

            {/* Attrition Risk + Performance Trend */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="p-bg-card border p-border rounded-[2rem] p-8 relative overflow-hidden"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-4 border-b p-border-mid pb-4">Global Attrition Risk</h3>
                  <AlertTriangle size={16} className="text-rose-400" />
                </div>
                <div className="flex items-end justify-between gap-2 h-24">
                  {attritionRiskBars.map((val, i) => (
                    <div key={i} className="w-full rounded-t-sm relative group overflow-hidden" style={{ height: '100%', background: 'rgba(255,255,255,0.03)' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${val}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className={`absolute bottom-0 left-0 right-0 rounded-t-sm ${val > 25 ? 'bg-rose-500' : val > 15 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm uppercase tracking-[0.12em] p-text-ghost mt-3 font-mono">
                  <span>T-8wk</span><span>Now</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="p-bg-card border p-border rounded-[2rem] p-8"
              >
                <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Performance Trend (6M)</h3>
                <div className="h-28">
                  <AreaWave
                    data={performanceData}
                    dataKey="avgScore"
                    color="#c084fc"
                    height={112}
                    secondaryKey="target"
                    secondaryColor="rgba(255,255,255,0.15)"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Employee comparison grid */}
          <div className="p-bg-card border p-border rounded-[2rem] p-8">
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Employee Performance Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b p-border">
                    {['Employee', 'Score', 'ROI', 'Motivation', 'Welfare', 'Attrition Risk', 'Next Promo'].map(h => (
                      <th key={h} className="text-left text-sm uppercase tracking-widest p-text-dim font-mono pb-4 pr-8">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} onClick={() => navigate(`/app/employee/${emp.id}`)} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer" data-cursor="Deep Dive">
                      <td className="py-4 pr-8">
                        <div className="flex items-center gap-3">
                          <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover grayscale" loading="lazy" decoding="async" />
                          <div>
                            <p className="text-white text-sm font-light">{emp.name}</p>
                            <p className="p-text-dim text-sm uppercase tracking-[0.12em]">{emp.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-8">
                        <span className={`font-mono ${emp.performanceScore >= 90 ? 'text-emerald-400' : emp.performanceScore >= 80 ? 'text-cyan-400' : 'text-amber-400'}`}>
                          {emp.performanceScore}
                        </span>
                      </td>
                      <td className="py-4 pr-8">
                        <span className={`font-mono ${emp.roi >= 200 ? 'text-emerald-400' : emp.roi >= 150 ? 'text-cyan-400' : 'text-amber-400'}`}>
                          {emp.roi}%
                        </span>
                      </td>
                      <td className="py-4 pr-8">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="h-full rounded-full bg-amber-400" style={{ width: `${emp.motivationScore}%` }} />
                          </div>
                          <span className="p-text-mid text-sm font-mono">{emp.motivationScore}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-8">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="h-full rounded-full bg-purple-400" style={{ width: `${emp.welfareScore}%` }} />
                          </div>
                          <span className="p-text-mid text-sm font-mono">{emp.welfareScore}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-8">
                        <span className={`px-2 py-0.5 rounded-full text-xs uppercase tracking-widest border ${
                          emp.attritionRisk === 'High' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' :
                          emp.attritionRisk === 'Medium' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                          'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                        }`}>{emp.attritionRisk}</span>
                      </td>
                      <td className="py-4 pr-8 p-text-lo text-sm font-mono">{emp.nextPromotionEligibility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ROI TAB ═══ */}
      {activeView === 'roi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-bg-card border p-border rounded-[2rem] p-8">
              <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Organisation ROI Trajectory</h3>
              <AreaWave
                data={orgROIData}
                dataKey="totalValue"
                color="#10b981"
                height={280}
                secondaryKey="totalInvestment"
                secondaryColor="#f43f5e"
              />
              <div className="flex gap-6 mt-4 ml-10">
                <div className="flex items-center gap-2"><div className="w-3 h-0.5 rounded bg-emerald-500" /><span className="text-[9px] font-mono p-text-ghost">Value ($M)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-0.5 rounded border-b border-dashed border-rose-400" /><span className="text-[9px] font-mono p-text-ghost">Investment ($M)</span></div>
              </div>
            </div>

            <div className="p-bg-card border p-border rounded-[2rem] p-8">
              <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Individual ROI Comparison</h3>
              <HorizontalBars
                data={employees.map(e => ({ name: e.name, roi: e.roi }))}
                dataKey="roi"
                labelKey="name"
                maxVal={400}
                colorFn={(v: number) => v >= 200 ? '#10b981' : v >= 150 ? '#38bdf8' : v >= 110 ? '#f59e0b' : '#f43f5e'}
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══ WELLBEING TAB ═══ */}
      {activeView === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-bg-card border p-border rounded-[2rem] p-8">
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Org Health Radar</h3>
            <div className="flex items-center justify-center">
              <RadarWeb data={radarData} />
            </div>
          </div>

          <div className="p-bg-card border p-border rounded-[2rem] p-8">
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Learning Domain Completion</h3>
            <StackedHBars data={globalLearningData} />
          </div>

          {/* Burnout heatmap */}
          <div className="lg:col-span-2 p-bg-card border p-border rounded-[2rem] p-8">
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Wellbeing & Burnout Matrix</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {employees.map(emp => (
                <NavLink key={emp.id} to={`/app/employee/${emp.id}`} className="relative group block">
                  <div
                    className="rounded-2xl p-5 border p-border transition-all hover:p-border-hi"
                    style={{
                      background: emp.bioRhythm.burnoutProbability > 60
                        ? 'rgba(244,63,94,0.05)'
                        : emp.bioRhythm.burnoutProbability > 35
                        ? 'rgba(245,158,11,0.05)'
                        : 'rgba(16,185,129,0.05)'
                    }}>
                    <div className="flex items-center gap-2 mb-4">
                      <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" loading="lazy" decoding="async" />
                      <p className="p-text-body text-sm font-light">{emp.name.split(' ')[0]}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="p-text-dim">Stress</span>
                        <span className="font-mono" style={{ color: emp.bioRhythm.stressIndex > 60 ? '#f43f5e' : '#10b981' }}>{emp.bioRhythm.stressIndex}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="p-text-dim">Burnout risk</span>
                        <span className="font-mono" style={{ color: emp.bioRhythm.burnoutProbability > 60 ? '#f43f5e' : emp.bioRhythm.burnoutProbability > 35 ? '#f59e0b' : '#10b981' }}>
                          {emp.bioRhythm.burnoutProbability}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="p-text-dim">Sleep</span>
                        <span className="font-mono p-text-mid">{emp.bioRhythm.sleepQuality}%</span>
                      </div>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
