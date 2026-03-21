import React, { useRef, useState, useEffect, useMemo, memo } from 'react';
import { NavLink } from 'react-router';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, TrendingUp, ShieldAlert, Zap, Target, Star, ChevronRight, DollarSign, Activity, Trophy, FileText, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { employees, alerts, performanceData } from '../mockData';

// Isolated so setTime re-renders only this element, not the whole Dashboard
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

const quickActions = [
  { icon: FileText, label: 'Start Review', path: '/app/review', color: '#38bdf8', desc: '360° cycle' },
  { icon: Target, label: 'View KPIs', path: '/app/kpis', color: '#f59e0b', desc: 'Goals tracker' },
  { icon: Trophy, label: 'Leaderboard', path: '/app/leaderboard', color: '#c084fc', desc: 'Rankings' },
  { icon: BarChart2, label: 'Analytics', path: '/app/analytics', color: '#10b981', desc: 'Deep dive' },
];

const SparkLine = memo(function SparkLine({ data, color }: { data: number[]; color: string }) {
  const chartData = useMemo(() => data.map((v, i) => ({ i, v })), [data]);
  return (
    <div style={{ width: 64, height: 28 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sg-${color.replace('#', '')})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

const orgMetrics = [
  { label: 'Avg Performance', val: '84.2', suffix: '', sparkData: [79, 81, 83, 82, 85, 84, 87, 84], color: '#c084fc', trend: '+2.3%', icon: Activity },
  { label: 'Team ROI', val: '246', suffix: '%', sparkData: [211, 222, 237, 255, 261, 270, 265, 280], color: '#10b981', trend: '+33%', icon: DollarSign },
  { label: 'Engagement', val: '78', suffix: '', sparkData: [72, 74, 75, 76, 78, 77, 79, 78], color: '#f59e0b', trend: '+5.4%', icon: Zap },
  { label: 'Attrition Risk', val: '12', suffix: '%', sparkData: [18, 16, 15, 14, 13, 12, 13, 12], color: '#f43f5e', trend: '-6pts', icon: ShieldAlert },
];

export function Dashboard() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const atRisk = useMemo(() => employees.filter(e => e.attritionRisk === 'High'), []);
  const topPerformers = useMemo(() => [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 2), []);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32" ref={scrollRef}>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-12"
      >
        <div>
          <p className="text-white/40 uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-2">Director Overview</p>
          <h1 className="text-7xl md:text-9xl font-light tracking-tighter text-white leading-[0.9]">
            System <span className="text-white/30 italic font-serif">Pulse</span>
          </h1>
        </div>
        <div className="flex gap-16 text-right">
          <div>
            <span className="text-white/30 text-xs uppercase tracking-[0.2em] block mb-2">Live Feed</span>
            <LiveClock />
          </div>
          <div className="flex flex-col items-end group cursor-crosshair">
            <span className="text-white/40 uppercase tracking-[0.2em] text-xs mb-2 flex items-center gap-2 group-hover:text-cyan-400 transition-colors">
              Global Efficiency <ArrowUpRight size={12} />
            </span>
            <span className="text-4xl font-light text-white">84.2%</span>
          </div>
          <div className="flex flex-col items-end group cursor-crosshair">
            <span className="text-white/40 uppercase tracking-[0.2em] text-xs mb-2 flex items-center gap-2 group-hover:text-rose-400 transition-colors">
              Risk Index <ShieldAlert size={12} />
            </span>
            <span className="text-4xl font-light text-white">12%</span>
          </div>
        </div>
      </motion.div>

      {/* ORG METRIC PULSE CARDS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {orgMetrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="relative bg-white/[0.02] border border-white/5 rounded-[1.5rem] p-6 overflow-hidden group hover:border-white/10 transition-colors hover-lift"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/30 font-mono mb-2">{m.label}</p>
                <p className="text-3xl font-light text-white leading-none">
                  {m.val}<span className="text-lg text-white/30">{m.suffix}</span>
                </p>
              </div>
              <div className="p-2 rounded-xl" style={{ background: m.color + '15' }}>
                <m.icon size={14} style={{ color: m.color }} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-xs font-mono" style={{ color: m.color }}>{m.trend}</span>
              <SparkLine data={m.sparkData} color={m.color} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* QUICK ACTIONS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
      >
        {quickActions.map((a, i) => (
          <NavLink
            key={a.path}
            to={a.path}
            className="group flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/15 hover:bg-white/[0.04] transition-all"
            data-cursor={a.label}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.color + '15' }}>
              <a.icon size={16} style={{ color: a.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-light">{a.label}</p>
              <p className="text-xs uppercase tracking-widest text-white/30">{a.desc}</p>
            </div>
            <ChevronRight size={12} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </NavLink>
        ))}
      </motion.div>

      {/* TEAM CONSTELLATION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mb-12"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-light text-white/80">Team <span className="font-serif italic text-white/50">Constellation</span></h2>
          <div className="text-white/30 text-xs tracking-widest uppercase flex gap-4">
            <span className="text-white border-b border-white pb-1">All Nodes</span>
          </div>
        </div>

        {/* Right-edge fade signals scrollability on desktop */}
        <div className="relative">
          <div className="pointer-events-none absolute top-0 right-0 w-24 h-full z-10 bg-gradient-to-l from-[#030303] to-transparent" />
          <div className="flex overflow-x-auto gap-6 pb-8 pt-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {employees.map((emp, index) => (
              <NavLink to={`/app/employee/${emp.id}`} key={emp.id} data-cursor="View Node">
                <motion.div
                  initial={{ opacity: 0, x: 50, rotateY: -10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1), duration: 0.8, ease: "easeOut" }}
                  whileHover={{ y: -20, scale: 1.02 }}
                  className="group relative w-[260px] h-[370px] shrink-0 rounded-[2rem] overflow-hidden bg-[#111] snap-center cursor-crosshair border border-white/5 hover:border-white/20 transition-all duration-500"
                >
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

                  {/* Risk dot */}
                  <div className="absolute top-5 left-5 flex items-center gap-2 pointer-events-none">
                    <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] ${emp.attritionRisk === 'High' ? 'bg-rose-500 text-rose-500' :
                        emp.attritionRisk === 'Medium' ? 'bg-amber-500 text-amber-500' : 'bg-emerald-500 text-emerald-500'
                      }`} />
                    <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">{emp.stage}</span>
                  </div>

                  {/* ROI badge */}
                  <div className="absolute top-5 right-5 pointer-events-none">
                    <div className="px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-white/60">
                      ROI {emp.roi}%
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 pointer-events-none">
                    <h3 className="text-2xl font-light text-white leading-none mb-0.5 group-hover:text-cyan-400 transition-colors">{emp.name.split(' ')[0]}</h3>
                    <h3 className="text-2xl font-serif italic text-white/50 leading-none mb-4">{emp.name.split(' ')[1]}</h3>

                    <div className="flex justify-between items-end border-t border-white/10 pt-3">
                      <div>
                        <span className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-0.5">Performance</span>
                        <span className="text-xl font-light text-white">{emp.performanceScore}<span className="text-sm text-white/30">pt</span></span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-0.5">Learning</span>
                        <span className="text-xl font-light text-white">{emp.learningProgress}<span className="text-sm text-white/30">%</span></span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-[0.2em] text-white/40 mb-0.5">Welfare</span>
                        <span className="text-xl font-light text-white">{emp.welfareScore}<span className="text-sm text-white/30">pt</span></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </NavLink>
            ))}
          </div>
        </div>
      </motion.div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:col-span-8 bg-white/5 border border-white/5 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:bg-white/[0.04] transition-colors"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-1000" />
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h3 className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold flex items-center gap-4 border-b border-white/10 pb-4">Vector Quality Trend</h3>
              <p className="text-white/20 text-xs mt-1">15-day rolling performance signal</p>
            </div>
            <TrendingUp size={14} className="text-cyan-400" />
          </div>

          <div className="h-56 flex items-end justify-between gap-2 relative z-10">
            {[45, 60, 35, 75, 50, 85, 95, 65, 80, 40, 90, 70, 85, 60, 95].map((val, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${val}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.04, type: "spring" }}
                className="w-full relative rounded-t-md overflow-hidden bg-white/5 group-hover:bg-white/8 transition-colors"
              >
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${val}%`,
                    background: `linear-gradient(to top, #0891b2, #7c3aed)`,
                    opacity: 0.7
                  }}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex justify-between text-xs uppercase tracking-widest text-white/30 border-t border-white/5 pt-4 relative z-10">
            <span>T-15</span>
            <span>Today</span>
          </div>
        </motion.div>

        {/* Alert Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:col-span-4 bg-white/5 border border-white/5 rounded-[2rem] p-8 md:p-10 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold flex items-center gap-4 border-b border-white/10 pb-4">Live Feed</h3>
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
                    <p className="text-xs font-light text-white/70 group-hover:text-white transition-colors leading-relaxed">{alert.message}</p>
                    <p className="text-xs uppercase tracking-widest text-white/30 mt-1.5 font-mono">
                      {alert.user} // T-0
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* At-Risk Panel */}
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
              <h3 className="text-rose-400 uppercase tracking-[0.2em] text-xs font-semibold flex items-center gap-4 border-b border-white/10 pb-4">At-Risk Employees</h3>
            </div>
            <div className="space-y-4">
              {atRisk.map(emp => (
                <NavLink to={`/app/employee/${emp.id}`} key={emp.id}
                  className="flex items-center gap-4 group hover:bg-rose-500/5 -mx-2 px-2 py-2 rounded-xl transition-colors"
                >
                  <img src={emp.avatar} alt={emp.name} loading="lazy" decoding="async" className="w-9 h-9 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />

                  <div className="text-right flex-shrink-0">
                    <p className="text-rose-400 text-sm font-mono">{emp.attritionRiskPercentage}%</p>
                    <p className="text-xs uppercase tracking-widest text-white/30">risk</p>
                  </div>
                  <ChevronRight size={12} className="text-white/20 group-hover:text-rose-400 transition-colors flex-shrink-0" />
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="md:col-span-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Star size={14} className="text-amber-400" />
            <h3 className="text-amber-400 uppercase tracking-[0.2em] text-xs font-semibold flex items-center gap-4 border-b border-white/10 pb-4">Top Performers</h3>
          </div>
          <div className="space-y-4">
            {topPerformers.map((emp, i) => (
              <NavLink to={`/app/employee/${emp.id}`} key={emp.id}
                className="flex items-center gap-4 group hover:bg-amber-500/5 -mx-2 px-2 py-2 rounded-xl transition-colors"
              >
                <div className="w-6 text-center flex-shrink-0 text-xs font-mono text-white/30">{i === 0 ? '01' : '02'}</div>
                <img src={emp.avatar} alt={emp.name} loading="lazy" decoding="async" className="w-9 h-9 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="flex-1">
                  <p className="text-white text-sm font-light">{emp.name}</p>
                  <p className="text-white/40 text-xs">{emp.role}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-emerald-400 text-sm font-mono">{emp.performanceScore}</p>
                  <p className="text-xs uppercase tracking-widest text-white/30">score</p>
                </div>
                <ChevronRight size={12} className="text-white/20 group-hover:text-amber-400 transition-colors flex-shrink-0" />
              </NavLink>
            ))}
          </div>

          <NavLink to="/app/leaderboard" className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-white/30 hover:text-amber-400 transition-colors">
            <Trophy size={10} /> Signal Hierarchy <ChevronRight size={10} />
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
}
