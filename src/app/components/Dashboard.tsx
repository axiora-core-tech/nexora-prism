import React, { useRef, useMemo, memo } from 'react';
import { NavLink } from 'react-router';
import { motion } from 'motion/react';
import { ArrowUpRight, TrendingUp, ShieldAlert, Zap, Target, Star, ChevronRight, DollarSign, Activity, Trophy, FileText, BarChart2, Brain } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { employees, alerts, performanceData } from '../mockData';

/* ═══════════════════════════════════════════════════════════════════════════
   LIVE CLOCK — Isolated to prevent re-rendering the whole dashboard
   ═══════════════════════════════════════════════════════════════════════════ */

function LiveClock() {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="text-4xl font-light text-white font-mono">
      {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOM CHART: Waveform Sparkline — hand-crafted SVG
   A smooth interpolated path with gradient fill, no recharts.
   ═══════════════════════════════════════════════════════════════════════════ */

const WaveformSpark = memo(function WaveformSpark({ data, color, width = 72, height = 32 }: { data: number[]; color: string; width?: number; height?: number }) {
  const id = useMemo(() => `wf-${color.replace('#', '')}-${Math.random().toString(36).slice(2, 6)}`, [color]);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Build smooth cubic path
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * (height * 0.85) - height * 0.075,
  }));

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
  }

  const areaD = d + ` L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      {/* End dot */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={2} fill={color} />
    </svg>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOM CHART: Signal Columns — Animated bar chart from scratch
   Each bar grows from bottom with a glowing cap and staggered entrance.
   ═══════════════════════════════════════════════════════════════════════════ */

function SignalColumns({ values, gradientFrom, gradientTo }: { values: number[]; gradientFrom: string; gradientTo: string }) {
  const max = Math.max(...values);
  const id = useMemo(() => `sc-${Math.random().toString(36).slice(2, 6)}`, []);

  return (
    <div className="h-56 flex items-end justify-between gap-2 relative z-10">
      {values.map((val, i) => {
        const hPct = Math.max(6, (val / max) * 100);
        return (
          <div key={i} className="w-full relative group" style={{ height: '100%' }}>
            {/* Background track */}
            <div className="absolute inset-0 rounded-t-md" style={{ background: 'var(--p-bg-card)' }} />
            {/* Filled bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-t-md overflow-hidden"
              initial={{ height: 0 }}
              whileInView={{ height: `${hPct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.04, type: 'spring', bounce: 0.15 }}>
              <div className="w-full h-full"
                style={{ background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`, opacity: 0.7 }} />
            </motion.div>
            {/* Glow cap */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 rounded-full"
              style={{ background: gradientTo, boxShadow: `0 0 8px ${gradientTo}80` }}
              initial={{ bottom: 0, opacity: 0 }}
              whileInView={{ bottom: `${hPct}%`, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.04 }}
            />
            {/* Hover value */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
              <span className="text-[8px] font-mono px-1 py-0.5 rounded text-white" style={{ background: 'var(--p-surface)' }}>
                {val}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOM CHART: Orbital Health Rings — Mini dimension overview
   ═══════════════════════════════════════════════════════════════════════════ */

function HealthRingMini({ value, color, size = 36, strokeW = 2.5 }: { value: number; color: string; size?: number; strokeW?: number }) {
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value, 100) / 100;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeW} />
      <motion.circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        whileInView={{ strokeDashoffset: circ * (1 - pct) }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={size * 0.28} fontFamily="'Space Mono',monospace">
        {value}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   QUICK ACTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

const quickActions = [
  { icon: FileText, label: 'Start Review', path: '/app/review', color: '#38bdf8', desc: '360° cycle' },
  { icon: Target, label: 'View KPIs', path: '/app/kpis', color: '#f59e0b', desc: 'Goals tracker' },
  { icon: Trophy, label: 'Leaderboard', path: '/app/leaderboard', color: '#c084fc', desc: 'Rankings' },
  { icon: BarChart2, label: 'Analytics', path: '/app/analytics', color: '#10b981', desc: 'Deep dive' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ORG METRICS — data-driven insight cards
   ═══════════════════════════════════════════════════════════════════════════ */

const orgMetrics = [
  { label: 'Avg Performance', val: '84.2', suffix: '', sparkData: [79, 81, 83, 82, 85, 84, 87, 84], color: '#c084fc', trend: '+2.3%', icon: Activity },
  { label: 'Team ROI', val: '246', suffix: '%', sparkData: [211, 222, 237, 255, 261, 270, 265, 280], color: '#10b981', trend: '+33%', icon: DollarSign },
  { label: 'Engagement', val: '78', suffix: '', sparkData: [72, 74, 75, 76, 78, 77, 79, 78], color: '#f59e0b', trend: '+5.4%', icon: Zap },
  { label: 'Attrition Risk', val: '12', suffix: '%', sparkData: [18, 16, 15, 14, 13, 12, 13, 12], color: '#f43f5e', trend: '-6pts', icon: ShieldAlert },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════════════════════════════ */

export function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';
  const scrollRef = useRef<HTMLDivElement>(null);

  const atRisk = useMemo(() => employees.filter(e => e.attritionRisk === 'High'), []);
  const topPerformers = useMemo(() => [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 2), []);

  // Generate smart narrative insight
  const narrativeInsight = useMemo(() => {
    const avgPerf = employees.reduce((s, e) => s + e.performanceScore, 0) / employees.length;
    const avgWelf = employees.reduce((s, e) => s + e.welfareScore, 0) / employees.length;
    const highRisk = employees.filter(e => e.attritionRiskPercentage > 50);
    if (highRisk.length > 0 && avgPerf > 80) {
      return { text: `Strong output at ${Math.round(avgPerf)}pt but ${highRisk.length} employee${highRisk.length > 1 ? 's' : ''} above 50% flight risk. Your performance is masking a retention problem.`, type: 'warn' as const };
    }
    if (avgWelf < 70) {
      return { text: `Wellbeing is averaging ${Math.round(avgWelf)}pt — below the healthy threshold. Consider force-scheduling PTO this quarter.`, type: 'warn' as const };
    }
    return { text: `Team is performing well across dimensions. Focus on growth investments to compound current momentum.`, type: 'good' as const };
  }, []);

  return (
    <div className="page-wrap" ref={scrollRef}>

      {/* ═══ HERO ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-6 md:gap-12 border-b p-border pb-8 md:pb-12"
      >
        <div>
          <p className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-2">{firstName}'s Overview</p>
          <h1 className="hero-title font-light text-white">
            People <span className="p-text-dim italic font-serif">Intelligence</span>
          </h1>
        </div>
        <div className="flex gap-6 md:gap-16 text-right flex-wrap justify-end">
          <div>
            <span className="p-text-dim text-sm uppercase tracking-[0.15em] block mb-2">Live Feed</span>
            <LiveClock />
          </div>
          <div className="flex flex-col items-end group cursor-crosshair">
            <span className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2 flex items-center gap-2 group-hover:text-cyan-400 transition-colors">
              Global Efficiency <ArrowUpRight size={12} />
            </span>
            <span className="text-4xl font-light text-white">84.2%</span>
          </div>
          <div className="flex flex-col items-end group cursor-crosshair">
            <span className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2 flex items-center gap-2 group-hover:text-rose-400 transition-colors">
              Risk Index <ShieldAlert size={12} />
            </span>
            <span className="text-4xl font-light text-white">12%</span>
          </div>
        </div>
      </motion.div>

      {/* ═══ NARRATIVE INSIGHT BANNER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="mb-8 md:mb-12 p-4 md:p-5 rounded-2xl flex items-start gap-3"
        style={{
          background: narrativeInsight.type === 'warn' ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.06)',
          border: `1px solid ${narrativeInsight.type === 'warn' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)'}`,
        }}>
        <Brain size={14} className="flex-shrink-0 mt-0.5"
          style={{ color: narrativeInsight.type === 'warn' ? '#f59e0b' : '#10b981' }} />
        <div>
          <p className="text-[8px] font-mono uppercase tracking-[0.22em] mb-1"
            style={{ color: narrativeInsight.type === 'warn' ? '#f59e0b' : '#10b981' }}>
            Intelligence Summary
          </p>
          <p className="text-sm font-light p-text-body leading-relaxed">{narrativeInsight.text}</p>
        </div>
      </motion.div>

      {/* ═══ TEAM CONSTELLATION ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mb-6 md:mb-12"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-light p-text-body">Team <span className="font-serif italic p-text-mid">Constellation</span></h2>
          <div className="p-text-dim text-xs tracking-widest uppercase flex gap-4">
            <span className="text-white border-b border-white pb-1">All Nodes</span>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute top-0 right-0 w-24 h-full z-10 bg-gradient-to-l to-transparent" style={{ background: 'linear-gradient(to left, var(--p-bg), transparent)' }} />
          <div className="constellation-track flex overflow-x-auto gap-6 pb-8 pt-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {employees.map((emp, index) => (
              <NavLink to={`/app/employee/${emp.id}`} key={emp.id} data-cursor="View Node">
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
                    <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] ${emp.attritionRisk === 'High' ? 'bg-rose-500 text-rose-500' :
                        emp.attritionRisk === 'Medium' ? 'bg-amber-500 text-amber-500' : 'bg-emerald-500 text-emerald-500'
                      }`} />
                    <span className="text-xs uppercase tracking-[0.12em] p-text-mid font-semibold truncate max-w-[120px]">{emp.stage}</span>
                  </div>

                  {/* ROI badge */}
                  <div className="absolute top-5 right-5 pointer-events-none">
                    <div className="px-2 py-0.5 rounded-full bg-black/40 border p-border-mid text-sm font-mono p-text-mid">
                      ROI {emp.roi}%
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-5 right-5 pointer-events-none">
                    <h3 className="text-lg font-light text-white leading-tight group-hover:text-cyan-400 transition-colors truncate">{emp.name.split(' ')[0]}</h3>
                    <h3 className="text-lg font-serif italic p-text-mid leading-tight mb-2 truncate">{emp.name.split(' ')[1]}</h3>

                    <div className="flex justify-between items-end border-t p-border-mid pt-2">
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest p-text-lo mb-0.5">Perf</span>
                        <span className="text-base font-light text-white">{emp.performanceScore}<span className="text-[10px] p-text-dim">pt</span></span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest p-text-lo mb-0.5">Learn</span>
                        <span className="text-base font-light text-white">{emp.learningProgress}<span className="text-[10px] p-text-dim">%</span></span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest p-text-lo mb-0.5">Welfare</span>
                        <span className="text-base font-light text-white">{emp.welfareScore}<span className="text-[10px] p-text-dim">pt</span></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </NavLink>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══ SPECTRUM INLINE — Six Signals ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 p-bg-card border p-border rounded-[2rem] overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b p-border">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-ghost mb-1">People Intelligence</p>
            <h3 className="text-lg font-light text-white">
              Six <span className="font-serif italic p-text-dim">Signals</span>
            </h3>
          </div>
          <NavLink to="/app/spectrum"
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest p-text-dim hover:p-text-hi transition-colors group"
            data-cursor="Full Spectrum">
            Full Analysis <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </NavLink>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--p-border)' }}>
          {[
            { label: 'Output', val: Math.round(employees.reduce((s, e) => s + e.performanceScore, 0) / employees.length), unit: 'pt', color: '#f43f5e' },
            { label: 'Growth', val: Math.round(employees.reduce((s, e) => s + e.learningProgress, 0) / employees.length), unit: '%', color: '#10b981' },
            { label: 'Motivation', val: Math.round(employees.reduce((s, e) => s + e.motivationScore, 0) / employees.length), unit: 'pt', color: '#f59e0b' },
            { label: 'Wellbeing', val: Math.round(employees.reduce((s, e) => s + e.welfareScore, 0) / employees.length), unit: 'pt', color: '#c084fc' },
            { label: 'Return', val: Math.round(employees.reduce((s, e) => s + e.roi, 0) / employees.length), unit: '%', color: '#38bdf8' },
            { label: 'Risk', val: Math.round(employees.reduce((s, e) => s + e.attritionRiskPercentage, 0) / employees.length), unit: '%', color: '#fb923c' },
          ].map((dim, i) => (
            <NavLink key={dim.label} to="/app/spectrum"
              className="flex items-center gap-4 px-6 py-3.5 group hover:bg-white/[0.02] transition-colors">
              <span className="text-[9px] font-mono p-text-ghost w-4 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-sm font-light p-text-body group-hover:text-white transition-colors w-24 flex-shrink-0">{dim.label}</span>
              <div className="flex-1 h-px relative overflow-hidden" style={{ background: 'var(--p-border)' }}>
                <motion.div className="absolute left-0 top-0 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(dim.val, 100)}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{ background: dim.color }}
                />
              </div>
              <span className="text-sm font-mono w-14 text-right flex-shrink-0" style={{ color: dim.color }}>
                {dim.val}{dim.unit}
              </span>
            </NavLink>
          ))}
        </div>
      </motion.div>

      {/* ═══ QUICK ACTIONS ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
      >
        {quickActions.map((a) => (
          <NavLink
            key={a.path}
            to={a.path}
            className="group flex items-center gap-4 p-4 bg-white/[0.02] border p-border rounded-2xl hover:p-border-mid hover:bg-white/[0.04] transition-all"
            data-cursor={a.label}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.color + '15' }}>
              <a.icon size={16} style={{ color: a.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-light">{a.label}</p>
              <p className="text-sm uppercase tracking-[0.12em] p-text-dim">{a.desc}</p>
            </div>
            <ChevronRight size={12} className="p-text-ghost group-hover:text-white/60 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </NavLink>
        ))}
      </motion.div>

      {/* ═══ MAIN GRID — Custom charts ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* ── Performance Signal Columns ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:col-span-8 p-bg-card border p-border rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:bg-white/[0.04] transition-colors"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-1000" />
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-4 border-b p-border-mid pb-4">Vector Quality Trend</h3>
              <p className="p-text-ghost text-xs mt-1">15-day rolling performance signal</p>
            </div>
            <TrendingUp size={14} className="text-cyan-400" />
          </div>

          <SignalColumns
            values={[45, 60, 35, 75, 50, 85, 95, 65, 80, 40, 90, 70, 85, 60, 95]}
            gradientFrom="#0891b2"
            gradientTo="#7c3aed"
          />

          <div className="mt-6 flex justify-between text-sm uppercase tracking-[0.12em] p-text-dim border-t p-border pt-4 relative z-10">
            <span>T-15</span>
            <span>Today</span>
          </div>
        </motion.div>

        {/* ── Alert Feed ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:col-span-4 p-bg-card border p-border rounded-[2rem] p-8 md:p-10 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-4 border-b p-border-mid pb-4">Live Feed</h3>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
          </div>

          <div className="space-y-6">
            {alerts.map((alert) => (
              <div key={alert.id} className="group cursor-default">
                <div className="flex items-start gap-3 mb-2">
                  <div className={`w-1 h-7 rounded-full flex-shrink-0 mt-0.5 ${alert.type === 'warning' ? 'bg-amber-500/50' :
                      alert.type === 'success' ? 'bg-emerald-500/50' : 'bg-cyan-500/50'
                    }`} />
                  <div>
                    <p className="text-sm font-light p-text-body group-hover:text-white transition-colors leading-relaxed">{alert.message}</p>
                    <p className="text-sm uppercase tracking-[0.12em] p-text-dim mt-1.5 font-mono">
                      {alert.user} // T-0
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Org Metrics with Waveform Sparklines ── */}
        {orgMetrics.map((m, i) => (
          <motion.div key={m.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            className="md:col-span-3 p-bg-card border p-border rounded-[2rem] p-6 group hover:bg-white/[0.04] transition-colors relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <m.icon size={14} style={{ color: m.color }} />
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  background: m.trend.startsWith('+') || m.trend.startsWith('-') && m.label === 'Attrition Risk'
                    ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                  color: m.trend.startsWith('+') && m.label !== 'Attrition Risk' ? '#10b981'
                    : m.trend.startsWith('-') && m.label === 'Attrition Risk' ? '#10b981' : '#f43f5e',
                }}>
                {m.trend}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-light text-white font-mono">
                  {m.val}<span className="text-sm p-text-dim">{m.suffix}</span>
                </p>
                <p className="text-[9px] font-mono uppercase tracking-widest p-text-ghost mt-1">{m.label}</p>
              </div>
              <WaveformSpark data={m.sparkData} color={m.color} />
            </div>
          </motion.div>
        ))}

        {/* ── At-Risk Panel ── */}
        {atRisk.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-6 bg-rose-500/5 border border-rose-500/20 rounded-[2rem] p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert size={14} className="text-rose-400" />
              <h3 className="text-rose-400 uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-4 border-b p-border-mid pb-4">At-Risk Employees</h3>
            </div>
            <div className="space-y-4">
              {atRisk.map(emp => (
                <NavLink to={`/app/employee/${emp.id}`} key={emp.id}
                  className="flex items-center gap-4 group hover:bg-rose-500/5 -mx-2 px-2 py-2 rounded-xl transition-colors">
                  <img src={emp.avatar} alt={emp.name} loading="lazy" decoding="async" className="w-9 h-9 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-light truncate">{emp.name}</p>
                    <p className="p-text-lo text-xs truncate">{emp.role}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-rose-400 text-sm font-mono">{emp.attritionRiskPercentage}%</p>
                    <p className="text-sm uppercase tracking-[0.12em] p-text-dim">risk</p>
                  </div>
                  <ChevronRight size={12} className="p-text-ghost group-hover:text-rose-400 transition-colors flex-shrink-0" />
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Top Performers ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="md:col-span-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Star size={14} className="text-amber-400" />
            <h3 className="text-amber-400 uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-4 border-b p-border-mid pb-4">Top Performers</h3>
          </div>
          <div className="space-y-4">
            {topPerformers.map((emp, i) => (
              <NavLink to={`/app/employee/${emp.id}`} key={emp.id}
                className="flex items-center gap-4 group hover:bg-amber-500/5 -mx-2 px-2 py-2 rounded-xl transition-colors">
                <div className="w-6 text-center flex-shrink-0 text-sm font-mono p-text-dim">{i === 0 ? '01' : '02'}</div>
                <img src={emp.avatar} alt={emp.name} loading="lazy" decoding="async" className="w-9 h-9 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="flex-1">
                  <p className="text-white text-sm font-light">{emp.name}</p>
                  <p className="p-text-lo text-xs">{emp.role}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-emerald-400 text-sm font-mono">{emp.performanceScore}</p>
                  <p className="text-sm uppercase tracking-[0.12em] p-text-dim">score</p>
                </div>
                <ChevronRight size={12} className="p-text-ghost group-hover:text-amber-400 transition-colors flex-shrink-0" />
              </NavLink>
            ))}
          </div>

          <NavLink to="/app/leaderboard" className="mt-6 flex items-center gap-2 text-sm uppercase tracking-[0.12em] p-text-dim hover:text-amber-400 transition-colors">
            <Trophy size={10} /> Signal Hierarchy <ChevronRight size={10} />
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
}
