import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Diamond, Zap, Activity, Clock, DollarSign, Target, Brain, Heart, AlertCircle, BarChart2, Shield, Crosshair, Network, Cpu, Coins, CalendarDays, Monitor, TrendingUp, TrendingDown, Minus, Star, MessageSquare } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, YAxis, LineChart, Line, RadialBarChart, RadialBar, PolarAngleAxis, Cell } from 'recharts';
import { employees } from '../mockData';

export function EmployeeDetail() {
  const { id } = useParams();
  const employee = employees.find(e => e.id === id);

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const [activeSection, setActiveSection] = useState('telemetry');
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncComplete, setSyncComplete] = useState('');

  useEffect(() => {
    const SECTION_IDS = ['telemetry', 'kpis', 'capital', 'neural', 'temporal', 'nodes', 'biorhythm', 'resonance'];

    // The scroll container is <main> (overflow-y-auto in Layout), not window
    const scrollContainer = document.querySelector('main') as HTMLElement | null;
    if (!scrollContainer) return;

    // Cache element references once
    const sectionEls = SECTION_IDS.map(id => document.getElementById(id));

    let rafPending = false;
    const handleScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        const scrollTop      = scrollContainer.scrollTop;
        const containerMid   = scrollTop + scrollContainer.clientHeight / 2;
        for (let i = 0; i < sectionEls.length; i++) {
          const el = sectionEls[i];
          if (el) {
            const offsetTop    = el.offsetTop;
            const offsetBottom = offsetTop + el.offsetHeight;
            if (containerMid >= offsetTop && containerMid < offsetBottom) {
              setActiveSection(SECTION_IDS[i]);
              break;
            }
          }
        }
      });
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  if (!employee) return <div className="p-8 text-center p-text-mid h-screen flex items-center justify-center">Node Not Found</div>;

  const sections = [
    { id: 'telemetry', icon: Diamond, label: 'Telemetry' },
    { id: 'kpis', icon: Target, label: 'KPI Goals' },
    { id: 'capital', icon: Coins, label: 'Capital Matrix' },
    { id: 'neural', icon: Brain, label: 'Neural Pathways' },
    { id: 'temporal', icon: Clock, label: 'Temporal Dynamics' },
    { id: 'nodes', icon: Target, label: 'Impact Nodes' },
    { id: 'biorhythm', icon: Heart, label: 'Bio-Rhythms' },
    { id: 'resonance', icon: Network, label: '360° Reviews' }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    const scrollContainer = document.querySelector('main') as HTMLElement | null;
    if (el && scrollContainer) {
      scrollContainer.scrollTo({ top: el.offsetTop - 50, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-screen relative" style={{ backgroundColor: 'var(--p-bg)' }}>
      
      {/* Abstract Immersive Profile Hero (Left Column) */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full xl:w-[40%] h-[60vh] xl:h-screen sticky top-0 overflow-hidden hidden xl:block" style={{ backgroundColor: '#111' }}
      >
        <motion.img
          style={{ scale, y }}
          src={employee.avatar}
          alt={employee.name}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover z-0 grayscale opacity-90"
        />
        
        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#030303] via-[#030303]/30 to-transparent" style={{ height: '35%' }} />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent to-[#030303]" />
        
        <NavLink to="/app" className="absolute top-12 left-12 z-50 p-text-lo hover:p-text-hi transition-colors p-4 rounded-full p-bg-card backdrop-blur-md border p-border-mid hover:bg-white/10" data-cursor="Return">
          <ArrowLeft size={20} />
        </NavLink>

        <div className="absolute bottom-12 left-12 right-12 z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-cyan-400 uppercase tracking-[0.3em] text-xs font-bold border-l-2 border-cyan-400 pl-4 py-1">
                {employee.department}
              </span>
              <span className={`px-2 py-0.5 text-xs uppercase tracking-widest rounded-full border ${employee.attritionRisk === 'High' ? 'border-rose-500/50 text-rose-400 bg-rose-500/10' : employee.attritionRisk === 'Medium' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' : 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'}`}>
                Risk: {employee.attritionRiskPercentage}%
              </span>
            </div>
            <h1 className="hero-title font-light text-white">{employee.name.split(' ')[0]}</h1>
            <h1 className="hero-title font-serif italic p-text-mid mb-4">{employee.name.split(' ')[1]}</h1>
            <p className="text-lg md:text-xl p-text-body font-light mb-4">{employee.role}</p>
            
            <div className="flex flex-wrap gap-2">
              {employee.skills.map(skill => (
                <span key={skill} className="px-3 py-1 rounded-full border p-border-mid text-sm uppercase tracking-[0.12em] p-text-mid backdrop-blur-sm p-bg-card">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Section Navigation */}
      <div className="floating-nav fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 hidden md:flex">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="group relative flex items-center justify-end"
            data-cursor={section.label}
          >
            <span className={`absolute right-12 text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 opacity-0 p-text-lo translate-x-4 group-hover:opacity-100 group-hover:translate-x-0`}>
              {section.label}
            </span>
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 backdrop-blur-md ${activeSection === section.id ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400 scale-110' : 'border-white/20 bg-black/40 p-text-mid hover:border-white/40 hover:text-white'}`}>
              <section.icon size={14} />
            </div>
          </button>
        ))}
      </div>

      {/* Deep Dive Content Area (Right Column) */}
      <div className="w-full xl:w-[60%] p-4 sm:p-6 md:p-12 lg:p-24 relative z-20">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="xl:hidden mb-12 pt-12">
          <NavLink to="/app" className="inline-flex p-text-lo hover:p-text-hi transition-colors mb-8" data-cursor="Return">
            <ArrowLeft size={20} />
          </NavLink>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-cyan-400 uppercase tracking-[0.3em] text-xs font-bold border-l-2 border-cyan-400 pl-4 py-1">
              {employee.department}
            </span>
          </div>
          <h1 className="text-5xl font-light tracking-tighter text-white leading-none">{employee.name.split(' ')[0]}</h1>
          <h1 className="text-5xl font-serif italic p-text-mid leading-none mb-4">{employee.name.split(' ')[1]}</h1>
          <p className="text-lg p-text-body font-light mb-6">{employee.role}</p>

          {/* Mobile horizontal section nav — scrollable pill strip */}
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs uppercase tracking-widest font-mono transition-all ${
                  activeSection === section.id
                    ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400'
                    : 'border-white/10 p-text-lo hover:p-text-hi hover:border-white/20'
                }`}
              >
                <section.icon size={9} />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto space-y-32 pb-40"
        >
          
          {/* SEC 1: TELEMETRY */}
          <section id="telemetry" className="relative pt-12 scroll-mt-24">
            <h2 className="p-text-dim uppercase tracking-[0.2em] text-sm font-semibold mb-12 flex items-center gap-4 border-b p-border-mid pb-4">
              <Diamond size={12} className="text-purple-400" /> Core Telemetry
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Efficiency', val: employee.performanceScore, color: '#c084fc', grad: 'purple-grad', icon: Target },
                { label: 'Evolution', val: employee.learningProgress, color: '#22d3ee', grad: 'cyan-grad', icon: Brain },
                { label: 'Motivation', val: employee.motivationScore, color: '#f59e0b', grad: 'amber-grad', icon: Zap },
                { label: 'Welfare', val: employee.welfareScore, color: '#10b981', grad: 'emerald-grad', icon: Heart },
              ].map((stat, i) => (
                <div key={stat.label} className="relative group cursor-crosshair flex flex-col items-center" data-cursor={`Analyze ${stat.label}`}>
                  <div className="relative w-24 h-24 md:w-32 md:h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" className="text-white/5" />
                      <motion.circle 
                        cx="50" cy="50" r="45" 
                        stroke={`url(#${stat.grad})`} 
                        strokeWidth="4" 
                        strokeLinecap="round"
                        fill="none" 
                        initial={{ strokeDasharray: "283 283", strokeDashoffset: 283 }}
                        whileInView={{ strokeDashoffset: 283 - (283 * stat.val) / 100 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.2 + (i * 0.1) }}
                      />
                      <defs>
                        <linearGradient id={stat.grad} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={stat.color} stopOpacity="0.5" />
                          <stop offset="100%" stopColor={stat.color} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl md:text-3xl font-light text-white leading-none">{stat.val}</span>
                    </div>
                  </div>
                  <span className="block text-sm uppercase tracking-[0.12em] p-text-lo mt-6 flex items-center gap-2">
                    <stat.icon size={10} /> {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </section>


          {/* SEC 1.5: KPI GOALS */}
          <section id="kpis" className="relative scroll-mt-24">
            <h2 className="p-text-dim uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b p-border-mid pb-4">
              <Target size={12} className="text-amber-400" /> KPI Performance
            </h2>
            
            <div className="space-y-4 mb-8">
              {(employee.kpis || []).map((kpi: any, i: number) => {
                const isLowerBetter = ['Bug Escape Rate', 'CAC', 'API Response Time', 'Incident Response'].includes(kpi.name);
                const good = isLowerBetter ? kpi.current <= kpi.target : kpi.current >= kpi.target;
                const pct = Math.min((kpi.current / kpi.target) * 100, 100);
                const color = good ? '#10b981' : kpi.current / kpi.target > 0.8 ? '#f59e0b' : '#f43f5e';
                return (
                  <div key={i} className="bg-white/[0.02] border p-border rounded-2xl p-5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {kpi.trend === 'up' ? <TrendingUp size={12} className="text-emerald-400" /> : kpi.trend === 'down' ? <TrendingDown size={12} className="text-rose-400" /> : <Minus size={12} className="p-text-lo" />}
                        <span className="text-base p-text-body font-light">{kpi.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm uppercase tracking-[0.12em] p-text-dim font-mono">Weight: {kpi.weight}%</span>
                        <span className="text-sm font-mono" style={{ color }}>
                          {kpi.current}{kpi.unit}
                          <span className="p-text-dim"> / {kpi.target}{kpi.unit}</span>
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-[2px] p-bg-card rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: color }} />
                    </div>
                  </div>
                );
              })}
              {(!employee.kpis || employee.kpis.length === 0) && (
                <p className="p-text-dim text-sm text-center py-8">No KPIs defined for this role.</p>
              )}
            </div>
          </section>

          {/* SEC 2: CAPITAL MATRIX */}
          <section id="capital" className="relative scroll-mt-24">
            <h2 className="p-text-dim uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b p-border-mid pb-4">
              <Coins size={12} className="text-emerald-400" /> Capital & Compensation Matrix
            </h2>

            {/* ROI Overview */}
            <div className="p-bg-card border p-border rounded-[2rem] p-8 md:p-10 relative overflow-hidden group mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12 relative z-10">
                <div>
                  <p className="text-sm uppercase tracking-[0.12em] p-text-lo mb-2">Cost Investment</p>
                  <p className="text-3xl font-light text-white">${(employee.costInvestment / 1000)}k</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.12em] p-text-lo mb-2">Revenue Generated</p>
                  <p className="text-3xl font-light text-emerald-400">${(employee.revenueContribution / 1000)}k</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm uppercase tracking-[0.12em] p-text-lo mb-2">Human Capital ROI</p>
                  <p className="text-3xl font-light text-white">{employee.roi}%</p>
                </div>
              </div>

              {/* Visual Bar for ROI */}
              <div className="w-full h-2 p-bg-card rounded-full overflow-hidden relative z-10 flex">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="h-full bg-white/20 relative"
                  style={{ width: `${(employee.costInvestment / employee.revenueContribution) * 100}%` }}
                >
                   <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50" />
                </motion.div>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-emerald-500/50 to-emerald-400 flex-1"
                />
              </div>
              <div className="flex justify-between text-sm uppercase tracking-[0.12em] p-text-dim mt-3 relative z-10">
                <span>Base Cost Vector</span>
                <span>Surplus Value Generated</span>
              </div>
            </div>

            {/* Total Comp Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-bg-card border p-border rounded-[2rem] p-8">
                <h3 className="text-sm uppercase tracking-[0.12em] p-text-lo mb-6">Payroll Ledger (Annual)</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b p-border pb-3">
                    <span className="p-text-mid">Base Salary</span>
                    <span className="text-white font-mono">${employee.compensation.base.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b p-border pb-3">
                    <span className="p-text-mid">Target Bonus</span>
                    <span className="text-emerald-400 font-mono">+${employee.compensation.bonus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-1">
                    <span className="p-text-mid">Wellness Stipend</span>
                    <span className="text-cyan-400 font-mono">${employee.compensation.utilizedStipend.toLocaleString()} / ${employee.compensation.wellnessStipend.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-bg-card border p-border rounded-[2rem] p-8 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-500/10 blur-[40px] rounded-full" />
                <h3 className="text-sm uppercase tracking-[0.12em] p-text-lo mb-6">Equity Vectors</h3>
                <div className="space-y-6 relative z-10">
                  <div>
                    <span className="block text-sm uppercase tracking-[0.12em] p-text-lo mb-1">Vested Value</span>
                    <span className="text-2xl font-light text-white">${employee.compensation.equityVested.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-sm uppercase tracking-[0.12em] p-text-lo mb-1">Unvested (Golden Handcuff)</span>
                    <span className="text-xl font-light text-purple-400">${employee.compensation.equityUnvested.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t p-border">
                    <span className="text-sm uppercase tracking-[0.12em] p-text-dim">Next Vesting Node: {employee.compensation.nextVestDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SEC 3: NEURAL PATHWAYS (LMS) */}
          <section id="neural" className="relative scroll-mt-24">
            <h2 className="p-text-dim uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b p-border-mid pb-4">
              <Brain size={12} className="text-cyan-400" /> Neural Pathways (LMS)
            </h2>

            <div className="space-y-4">
              {employee.lmsModules.map((module, i) => (
                <motion.div 
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="p-6 bg-white/[0.02] border p-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.04] transition-colors group cursor-crosshair"
                  data-cursor="Review Module"
                >
                  <div className="flex items-center gap-6">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <circle cx="18" cy="18" r="16" stroke="var(--p-chart-grid)" strokeWidth="2" fill="none" />
                        <motion.circle 
                          cx="18" cy="18" r="16" 
                          stroke={module.status === 'completed' ? '#10b981' : module.status === 'in_progress' ? '#22d3ee' : 'var(--p-chart-line-muted)'} 
                          strokeWidth="2" 
                          strokeLinecap="round"
                          fill="none"
                          strokeDasharray="100 100"
                          initial={{ strokeDashoffset: 100 }}
                          whileInView={{ strokeDashoffset: 100 - module.progress }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white text-base font-light tracking-wide">{module.title}</h4>
                      <p className="text-sm uppercase tracking-[0.12em] p-text-lo mt-1">{module.status.replace('_', ' ')} • {module.date}</p>
                    </div>
                  </div>
                  
                  {module.score && (
                    <div className="text-right">
                      <span className="block text-2xl font-light text-emerald-400">{module.score}%</span>
                      <span className="text-sm uppercase tracking-[0.12em] p-text-dim">Acquisition Score</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* SEC 4: TEMPORAL DYNAMICS */}
          <section id="temporal" className="relative scroll-mt-24">
            <h2 className="p-text-dim uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b p-border-mid pb-4">
              <Clock size={12} className="text-blue-400" /> Temporal Dynamics (WFM)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Daily Performance Chart */}
              <div className="p-bg-card border p-border rounded-[2rem] p-6">
                <h3 className="text-sm uppercase tracking-[0.12em] p-text-lo mb-6">Daily Output Velocity</h3>
                <div className="h-40 w-full -ml-4" data-cursor="Trace">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={employee.dailyPerformance}>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--p-surface)', border: '1px solid var(--p-border-mid)', borderRadius: '0.5rem', fontSize: '12px' }}
                        itemStyle={{ color: '#60a5fa' }}
                      />
                      <Line type="monotone" dataKey="score" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3, fill: '#60a5fa' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weekly Timesheets */}
              <div className="p-bg-card border p-border rounded-[2rem] p-6">
                <h3 className="text-sm uppercase tracking-[0.12em] p-text-lo mb-6">Timesheet Matrix (Hours vs Billable)</h3>
                <div className="h-40 w-full -ml-4" data-cursor="Trace">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={employee.timesheets}>
                      <Tooltip 
                        cursor={{ fill: 'var(--p-chart-cursor)' }}
                        contentStyle={{ backgroundColor: 'var(--p-surface)', border: '1px solid var(--p-border-mid)', borderRadius: '0.5rem', fontSize: '12px' }}
                      />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'var(--p-chart-axis)', fontSize: 10 }} dy={10} />
                      <Bar dataKey="hoursLogged" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={12} stackId="a" />
                      <Bar dataKey="billable" fill="#22d3ee" radius={[0, 0, 0, 0]} barSize={12} stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Leave Balances & Assets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-bg-card border p-border rounded-[2rem] p-8">
                <h3 className="text-sm uppercase tracking-[0.12em] p-text-lo mb-6 flex items-center gap-2"><CalendarDays size={12}/> Leave Matrix</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="p-text-mid">PTO (Used / Total)</span>
                      <span className="text-white font-mono">{employee.leaveBalance.ptoUsed} / {employee.leaveBalance.ptoTotal}</span>
                    </div>
                    <div className="w-full h-1 p-bg-pill rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: `${(employee.leaveBalance.ptoUsed / employee.leaveBalance.ptoTotal) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="p-text-mid">Sick Leave</span>
                      <span className="text-white font-mono">{employee.leaveBalance.sickUsed} / {employee.leaveBalance.sickTotal}</span>
                    </div>
                    <div className="w-full h-1 p-bg-pill rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${(employee.leaveBalance.sickUsed / employee.leaveBalance.sickTotal) * 100}%` }} />
                    </div>
                  </div>
                  {employee.leaveBalance.sabbaticalEligible && (
                    <div className="pt-4 mt-2 border-t p-border text-sm uppercase tracking-[0.12em] text-purple-400">
                      · Sabbatical Protocol Available
                    </div>
                  )}
                </div>
              </div>

              <div className="p-bg-card border p-border rounded-[2rem] p-8">
                <h3 className="text-sm uppercase tracking-[0.12em] p-text-lo mb-6 flex items-center gap-2"><Monitor size={12}/> Assigned Hardware Assets</h3>
                <ul className="space-y-3">
                  {employee.equipment.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm p-text-body">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* SEC 5: IMPACT NODES (OKRs) */}
          <section id="nodes" className="relative scroll-mt-24">
            <h2 className="p-text-dim uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b p-border-mid pb-4">
              <Target size={12} className="text-rose-400" /> Impact Nodes (OKRs & Promos)
            </h2>
            
            <div className="space-y-6 mb-12">
              {employee.okrs.map((okr, i) => (
                <div key={i} className="p-bg-card border p-border rounded-2xl p-6 relative overflow-hidden">
                   <div className={`absolute top-0 left-0 w-1 h-full ${okr.status === 'completed' ? 'bg-emerald-500' : okr.status === 'on_track' ? 'bg-cyan-500' : okr.status === 'at_risk' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                   
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                     <div>
                       <span className="px-2 py-0.5 rounded text-sm uppercase tracking-[0.12em] p-bg-card p-text-mid mb-2 inline-block">Weight: {okr.weight}</span>
                       <h4 className="text-white text-lg font-light">{okr.objective}</h4>
                     </div>
                     <div className="text-right">
                       <span className="text-3xl font-light text-white">{okr.progress}%</span>
                     </div>
                   </div>

                   <div className="w-full h-1 p-bg-pill rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       whileInView={{ width: `${okr.progress}%` }}
                       viewport={{ once: true }}
                       transition={{ duration: 1, delay: 0.2 }}
                       className={`h-full ${okr.status === 'completed' ? 'bg-emerald-500' : okr.status === 'on_track' ? 'bg-cyan-500' : 'bg-amber-500'}`} 
                     />
                   </div>
                </div>
              ))}
            </div>

            {/* Abstract Journey Path (Promotions) */}
            <div className="relative pl-12 border-l p-border space-y-16 before:absolute before:inset-0 before:bg-gradient-to-b before:from-rose-500/0 before:via-rose-500/20 before:to-purple-500/0 before:-left-[1px] before:w-[2px] before:h-full">
              <div className="relative">
                <div className="absolute -left-[3.25rem] w-6 h-6 rounded-full border border-rose-400 flex items-center justify-center shadow-[0_0_15px_rgba(251,113,133,0.3)]" style={{ backgroundColor: 'var(--p-bg)' }}>
                  <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-light text-white mb-2 tracking-wide">Current State</h3>
                <p className="text-sm p-text-lo leading-relaxed font-light font-serif italic">"{employee.recentFeedback}"</p>
              </div>

              {employee.projectedPromotions.map((promo, i) => (
                <div key={i} className="relative opacity-60 hover:opacity-100 transition-opacity duration-500 cursor-crosshair" data-cursor="Forecast">
                  <div className="absolute -left-[3.25rem] w-6 h-6 rounded-full border p-border-hi flex items-center justify-center" style={{ backgroundColor: 'var(--p-bg)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>
                  <h3 className="text-xl font-light text-white mb-2 tracking-wide">Projected Evolution: {promo.role}</h3>
                  <div className="flex items-center gap-6 mt-4">
                    <div>
                      <span className="block text-sm uppercase tracking-[0.12em] p-text-lo mb-1">Timeframe</span>
                      <span className="text-sm text-purple-400 font-mono">{promo.timeframe}</span>
                    </div>
                    <div>
                      <span className="block text-sm uppercase tracking-[0.12em] p-text-lo mb-1">Probability</span>
                      <span className="text-sm text-rose-400 font-mono">{promo.probability}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SEC 6: BIO-RHYTHM */}
          <section id="biorhythm" className="relative scroll-mt-24">
            <h2 className="p-text-dim uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b p-border-mid pb-4">
              <Heart size={12} className="text-rose-500" /> Bio-Rhythm & Psychometrics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 p-bg-card border p-border rounded-[2rem] p-8 flex items-center gap-8 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] pointer-events-none transition-colors duration-1000 ${employee.bioRhythm.burnoutProbability > 50 ? 'bg-rose-500/20' : 'bg-emerald-500/10'}`} />
                
                <div className="relative w-32 h-32 flex-shrink-0" data-cursor="Scan Bio">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50" cy="50" r="45"
                      stroke={employee.bioRhythm.burnoutProbability > 50 ? '#fb7185' : '#10b981'}
                      strokeWidth="2" fill="none" strokeDasharray="4 4"
                      style={{
                        transformOrigin: 'center',
                        animation: 'spin-slow 20s linear infinite',
                      }}
                    />
                    <style>{`
                      @keyframes spin-slow { to { transform: rotate(360deg); } }
                      @media (prefers-reduced-motion: reduce) { [style*="spin-slow"] { animation: none !important; } }
                    `}</style>
                    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" fill="none" className="text-white/10" />
                    <motion.circle 
                      cx="50" cy="50" r="35" 
                      stroke="url(#stressGrad)" 
                      strokeWidth="8" strokeLinecap="round" fill="none" 
                      strokeDasharray="220 220"
                      strokeDashoffset={220 - (220 * employee.bioRhythm.stressIndex) / 100}
                    />
                    <defs>
                      <linearGradient id="stressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#fb7185" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-light text-white">{employee.bioRhythm.stressIndex}</span>
                    <span className="text-sm uppercase tracking-[0.12em] p-text-lo">Stress</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-white text-lg font-light mb-2">Cognitive Load Telemetry</h3>
                  <p className="text-sm p-text-mid font-light leading-relaxed mb-4">
                    Based on focus block density ({employee.bioRhythm.focusBlocksAvg} hrs/day) and work log sentiment, systemic burnout probability is at {employee.bioRhythm.burnoutProbability}%.
                  </p>
                  <div className="flex gap-4">
                    <span className={`px-3 py-1 rounded-full border text-xs uppercase tracking-widest ${employee.bioRhythm.burnoutProbability > 50 ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'}`}>
                      {employee.bioRhythm.burnoutProbability > 50 ? 'Intervention Recommended' : 'Optimal Zone'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-bg-card border p-border rounded-[2rem] p-8 flex flex-col justify-center text-center">
                <span className="block text-sm uppercase tracking-[0.12em] p-text-lo mb-4">Sleep & Recovery Quality</span>
                <span className="text-5xl font-light text-white mb-2">{employee.bioRhythm.sleepQuality}<span className="text-2xl p-text-dim">%</span></span>
                <span className="text-xs p-text-mid font-light">Index Score</span>
              </div>
            </div>
          </section>

          {/* SEC 7: 360 REVIEWS */}
          <section id="resonance" className="relative scroll-mt-24">
            <h2 className="p-text-dim uppercase tracking-[0.2em] text-sm font-semibold mb-8 flex items-center gap-4 border-b p-border-mid pb-4">
              <Network size={12} className="text-indigo-400" /> 360° Feedback Matrix
            </h2>
            
            <div className="space-y-4">
              {(employee.reviews360 || []).map((review: any, i: number) => {
                const scoreKeys = ['communication', 'technical', 'leadership', 'collaboration', 'innovation'];
                const scoreColors: Record<string, string> = { communication: '#38bdf8', technical: '#c084fc', leadership: '#f59e0b', collaboration: '#10b981', innovation: '#f43f5e' };
                return (
                  <div key={i} className="bg-white/[0.02] border p-border rounded-[2rem] p-6 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-white font-light">{review.reviewer}</h4>
                        <p className="text-sm uppercase tracking-[0.12em] p-text-lo mt-1">{review.relation} • {review.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm uppercase tracking-[0.12em] p-text-dim mb-1">Overall</p>
                        <p className="text-3xl font-light text-white">{review.overall}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      {scoreKeys.map(k => (
                        <div key={k} className="flex items-center gap-3">
                          <span className="text-sm uppercase tracking-[0.12em] w-24 capitalize flex-shrink-0" style={{ color: scoreColors[k] }}>{k}</span>
                          <div className="flex-1 h-[2px] p-bg-card rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${review.scores[k]}%`, background: scoreColors[k] }} />
                          </div>
                          <span className="text-sm font-mono p-text-mid w-8 text-right">{review.scores[k]}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3 border-t p-border pt-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Star size={9} className="text-emerald-400" />
                          <span className="text-sm uppercase tracking-[0.12em] text-emerald-400">Strengths</span>
                        </div>
                        <p className="p-text-mid text-sm font-light font-serif italic leading-relaxed">"{review.strengths}"</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <MessageSquare size={9} className="text-amber-400" />
                          <span className="text-sm uppercase tracking-[0.12em] text-amber-400">Growth Areas</span>
                        </div>
                        <p className="p-text-mid text-sm font-light font-serif italic leading-relaxed">"{review.improvements}"</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!employee.reviews360 || employee.reviews360.length === 0) && (
                <div className="text-center py-12 p-text-dim">
                  <Network size={28} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No reviews submitted yet</p>
                </div>
              )}
            </div>
          </section>

          {/* Action Module */}
          <section className="pt-12 border-t p-border">
            <button
              onClick={() => setSyncOpen(true)}
              className="w-full relative group overflow-hidden rounded-[2rem] p-1"
              data-cursor="Sync"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-20 group-hover:opacity-100 blur transition-opacity duration-1000" />
              <div className="relative p-bg-surface rounded-[1.8rem] px-8 py-6 flex items-center justify-between border p-border-mid group-hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-6 text-left">
                  <div className="p-3 p-bg-card rounded-full text-cyan-400">
                    <BarChart2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-white text-lg font-light tracking-wide">Generate Profile Report</h4>
                    <p className="p-text-lo text-sm uppercase tracking-[0.12em] mt-1">Export full data matrix for HR review or 1:1 prep</p>
                  </div>
                </div>
                <ArrowUpRight className="p-text-lo group-hover:text-cyan-400 transition-colors" size={24} />
              </div>
            </button>

            {/* Sync / Export Modal */}
            <AnimatePresence>
              {syncOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                  onClick={() => setSyncOpen(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={e => e.stopPropagation()}
                    className="w-full max-w-md p-bg-surface border p-border-mid rounded-[2rem] p-8 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />

                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-sm uppercase tracking-[0.12em] p-text-dim font-mono mb-2">Profile Export</p>
                        <h3 className="text-xl font-light text-white">{employee.name}</h3>
                        <p className="p-text-lo text-sm">{employee.role}</p>
                      </div>
                      <button onClick={() => setSyncOpen(false)} className="p-2 rounded-full p-bg-card p-text-lo hover:p-text-hi hover:bg-white/10 transition-all">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </button>
                    </div>

                    <div className="space-y-3 mb-8">
                      {[
                        {
                          label: 'Full Performance Report',
                          desc: 'All KPIs, OKRs, scores and trends',
                          color: '#c084fc',
                          svg: (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              {/* Rising bars */}
                              <rect x="1" y="13" width="3" height="6" rx="0.8" opacity="0.5" />
                              <rect x="6" y="9"  width="3" height="10" rx="0.8" opacity="0.75" />
                              <rect x="11" y="5" width="3" height="14" rx="0.8" />
                              {/* Trend line */}
                              <polyline points="2.5,12 7.5,8 12.5,4 17,2" opacity="0.6" />
                              <circle cx="17" cy="2" r="1.2" fill="currentColor" stroke="none" />
                            </svg>
                          ),
                        },
                        {
                          label: '1:1 Prep Summary',
                          desc: 'Key talking points and risk flags',
                          color: '#38bdf8',
                          svg: (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              {/* Two speech bubbles — the 1:1 metaphor */}
                              <path d="M2 3 Q2 1.5 3.5 1.5 H11.5 Q13 1.5 13 3 V7.5 Q13 9 11.5 9 H7 L4.5 11 V9 H3.5 Q2 9 2 7.5 Z" />
                              <path d="M13 6 H15.5 Q17.5 6 17.5 7.5 V11.5 Q17.5 13 15.5 13 H14.5 V15 L12.5 13 H10.5" opacity="0.5" />
                              {/* Bullet points inside first bubble */}
                              <line x1="4.5" y1="4.5" x2="10.5" y2="4.5" opacity="0.5" />
                              <line x1="4.5" y1="6.5" x2="9"    y2="6.5" opacity="0.5" />
                            </svg>
                          ),
                        },
                        {
                          label: 'HR Compliance Pack',
                          desc: 'Compensation, leave and audit data',
                          color: '#10b981',
                          svg: (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              {/* Document with a shield — compliance metaphor */}
                              <path d="M4 2.5 Q4 1 5.5 1 H11.5 L15 4.5 V17 Q15 18.5 13.5 18.5 H5.5 Q4 18.5 4 17 Z" />
                              <polyline points="11,1 11,5 15,5" />
                              {/* Checkmark on the doc */}
                              <polyline points="7,10.5 9,12.5 13,8.5" strokeWidth="1.8" />
                              {/* Footer line */}
                              <line x1="7" y1="15" x2="12" y2="15" opacity="0.4" />
                            </svg>
                          ),
                        },
                        {
                          label: 'Copy Profile Link',
                          desc: 'Share a read-only view',
                          color: '#f59e0b',
                          svg: (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              {/* Chain link — share metaphor */}
                              <path d="M8 12 Q5 15 5 15 A3.5 3.5 0 0 1 5 8 L7 6" opacity="0.5" />
                              <path d="M12 8 Q15 5 15 5 A3.5 3.5 0 0 1 15 12 L13 14" opacity="0.5" />
                              <line x1="7.5" y1="12.5" x2="12.5" y2="7.5" />
                              {/* Arrow out */}
                              <path d="M14 3 L17 3 L17 6" />
                              <line x1="17" y1="3" x2="12" y2="8" opacity="0.6" />
                            </svg>
                          ),
                        },
                      ].map(({ label, desc, svg, color }) => (
                        <button
                          key={label}
                          onClick={() => {
                            setSyncComplete(label);
                            setTimeout(() => { setSyncComplete(''); setSyncOpen(false); }, 2000);
                          }}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border p-border hover:bg-white/[0.06] hover:p-border-mid transition-all text-left group"
                        >
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                            style={{ background: color + '15', color }}>
                            {svg}
                          </div>
                          <div className="flex-1">
                            <p className="p-text-body text-sm font-light group-hover:text-white transition-colors">{label}</p>
                            <p className="p-text-dim text-sm mt-0.5">{desc}</p>
                          </div>
                          {syncComplete === label
                            ? <span className="text-emerald-400 text-sm font-mono">✓ Done</span>
                            : <ArrowUpRight size={14} className="p-text-ghost group-hover:text-white/60 transition-colors" />
                          }
                        </button>
                      ))}
                    </div>

                    <p className="text-xs p-text-ghost font-mono uppercase tracking-widest text-center">
                      End-to-end encrypted · Access logged
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </motion.div>
      </div>
    </div>
  );
}
