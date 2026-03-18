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

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['telemetry', 'kpis', 'capital', 'neural', 'temporal', 'nodes', 'biorhythm', 'resonance'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const offsetTop = top + window.scrollY;
          const offsetBottom = bottom + window.scrollY;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!employee) return <div className="p-8 text-center text-white/50 h-screen flex items-center justify-center">Node Not Found</div>;

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
    if (el) {
      window.scrollTo({ top: el.offsetTop - 50, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-screen relative bg-[#030303]">
      
      {/* Abstract Immersive Profile Hero (Left Column) */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full xl:w-[40%] h-[60vh] xl:h-screen sticky top-0 overflow-hidden hidden xl:block"
      >
        <motion.img 
          style={{ scale, y }}
          src={employee.avatar} 
          alt={employee.name} 
          className="absolute inset-0 w-full h-full object-cover z-0 grayscale opacity-80 mix-blend-screen"
        />
        
        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent to-[#030303]" />
        
        <NavLink to="/" className="absolute top-12 left-12 z-50 text-white/40 hover:text-white transition-colors p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10" data-cursor="Return">
          <ArrowLeft size={20} />
        </NavLink>

        <div className="absolute bottom-12 left-12 right-12 z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-cyan-400 uppercase tracking-[0.3em] text-[10px] font-bold border-l-2 border-cyan-400 pl-4 py-1">
                {employee.department}
              </span>
              <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest rounded-full border ${employee.attritionRisk === 'High' ? 'border-rose-500/50 text-rose-400 bg-rose-500/10' : employee.attritionRisk === 'Medium' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' : 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'}`}>
                Risk: {employee.attritionRiskPercentage}%
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-white leading-none mix-blend-difference">{employee.name.split(' ')[0]}</h1>
            <h1 className="text-6xl md:text-8xl font-serif italic text-white/50 leading-none mb-6">{employee.name.split(' ')[1]}</h1>
            <p className="text-lg md:text-xl text-white/80 font-light mb-4">{employee.role}</p>
            
            <div className="flex flex-wrap gap-2">
              {employee.skills.map(skill => (
                <span key={skill} className="px-3 py-1 rounded-full border border-white/10 text-[9px] uppercase tracking-widest text-white/60 backdrop-blur-sm bg-white/5">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Section Navigation */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 hidden md:flex">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="group relative flex items-center justify-end"
            data-cursor={section.label}
          >
            <span className={`absolute right-12 text-[9px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${activeSection === section.id ? 'opacity-100 text-white translate-x-0' : 'opacity-0 text-white/40 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}>
              {section.label}
            </span>
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 backdrop-blur-md ${activeSection === section.id ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400 scale-110' : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'}`}>
              <section.icon size={14} />
            </div>
          </button>
        ))}
      </div>

      {/* Deep Dive Content Area (Right Column) */}
      <div className="w-full xl:w-[60%] p-6 md:p-12 lg:p-24 relative z-20">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="xl:hidden mb-16 pt-12">
          <NavLink to="/" className="inline-flex text-white/40 hover:text-white transition-colors mb-8" data-cursor="Return">
            <ArrowLeft size={20} />
          </NavLink>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-cyan-400 uppercase tracking-[0.3em] text-[10px] font-bold border-l-2 border-cyan-400 pl-4 py-1">
              {employee.department}
            </span>
          </div>
          <h1 className="text-5xl font-light tracking-tighter text-white leading-none">{employee.name.split(' ')[0]}</h1>
          <h1 className="text-5xl font-serif italic text-white/50 leading-none mb-4">{employee.name.split(' ')[1]}</h1>
          <p className="text-lg text-white/80 font-light mb-8">{employee.role}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto space-y-32 pb-40"
        >
          
          {/* SEC 1: TELEMETRY */}
          <section id="telemetry" className="relative pt-12 scroll-mt-24">
            <h2 className="text-white/30 uppercase tracking-[0.2em] text-xs font-semibold mb-12 flex items-center gap-4 border-b border-white/10 pb-4">
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
                  <span className="block text-[9px] uppercase tracking-widest text-white/40 mt-6 flex items-center gap-2">
                    <stat.icon size={10} /> {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </section>


          {/* SEC 1.5: KPI GOALS */}
          <section id="kpis" className="relative scroll-mt-24">
            <h2 className="text-white/30 uppercase tracking-[0.2em] text-xs font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">
              <Target size={12} className="text-amber-400" /> KPI Performance
            </h2>
            
            <div className="space-y-4 mb-8">
              {(employee.kpis || []).map((kpi: any, i: number) => {
                const isLowerBetter = ['Bug Escape Rate', 'CAC', 'API Response Time', 'Incident Response'].includes(kpi.name);
                const good = isLowerBetter ? kpi.current <= kpi.target : kpi.current >= kpi.target;
                const pct = Math.min((kpi.current / kpi.target) * 100, 100);
                const color = good ? '#10b981' : kpi.current / kpi.target > 0.8 ? '#f59e0b' : '#f43f5e';
                return (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {kpi.trend === 'up' ? <TrendingUp size={12} className="text-emerald-400" /> : kpi.trend === 'down' ? <TrendingDown size={12} className="text-rose-400" /> : <Minus size={12} className="text-white/40" />}
                        <span className="text-sm text-white/80 font-light">{kpi.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono">Weight: {kpi.weight}%</span>
                        <span className="text-sm font-mono" style={{ color }}>
                          {kpi.current}{kpi.unit}
                          <span className="text-white/30"> / {kpi.target}{kpi.unit}</span>
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: color }} />
                    </div>
                  </div>
                );
              })}
              {(!employee.kpis || employee.kpis.length === 0) && (
                <p className="text-white/30 text-sm text-center py-8">No KPIs defined for this role.</p>
              )}
            </div>
          </section>

          {/* SEC 2: CAPITAL MATRIX */}
          <section id="capital" className="relative scroll-mt-24">
            <h2 className="text-white/30 uppercase tracking-[0.2em] text-xs font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">
              <Coins size={12} className="text-emerald-400" /> Capital & Compensation Matrix
            </h2>

            {/* ROI Overview */}
            <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12 relative z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Cost Investment</p>
                  <p className="text-3xl font-light text-white">${(employee.costInvestment / 1000)}k</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Revenue Generated</p>
                  <p className="text-3xl font-light text-emerald-400">${(employee.revenueContribution / 1000)}k</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Human Capital ROI</p>
                  <p className="text-3xl font-light text-white">{employee.roi}%</p>
                </div>
              </div>

              {/* Visual Bar for ROI */}
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative z-10 flex">
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
              <div className="flex justify-between text-[8px] uppercase tracking-widest text-white/30 mt-3 relative z-10">
                <span>Base Cost Vector</span>
                <span>Surplus Value Generated</span>
              </div>
            </div>

            {/* Total Comp Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8">
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-6">Payroll Ledger (Annual)</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                    <span className="text-white/60">Base Salary</span>
                    <span className="text-white font-mono">${employee.compensation.base.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                    <span className="text-white/60">Target Bonus</span>
                    <span className="text-emerald-400 font-mono">+${employee.compensation.bonus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-1">
                    <span className="text-white/60">Wellness Stipend</span>
                    <span className="text-cyan-400 font-mono">${employee.compensation.utilizedStipend.toLocaleString()} / ${employee.compensation.wellnessStipend.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-500/10 blur-[40px] rounded-full" />
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-6">Equity Vectors</h3>
                <div className="space-y-6 relative z-10">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Vested Value</span>
                    <span className="text-2xl font-light text-white">${employee.compensation.equityVested.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">Unvested (Golden Handcuff)</span>
                    <span className="text-xl font-light text-purple-400">${employee.compensation.equityUnvested.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-[9px] uppercase tracking-widest text-white/30">Next Vesting Node: {employee.compensation.nextVestDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SEC 3: NEURAL PATHWAYS (LMS) */}
          <section id="neural" className="relative scroll-mt-24">
            <h2 className="text-white/30 uppercase tracking-[0.2em] text-xs font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">
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
                  className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.04] transition-colors group cursor-crosshair"
                  data-cursor="Review Module"
                >
                  <div className="flex items-center gap-6">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <circle cx="18" cy="18" r="16" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
                        <motion.circle 
                          cx="18" cy="18" r="16" 
                          stroke={module.status === 'completed' ? '#10b981' : module.status === 'in_progress' ? '#22d3ee' : 'rgba(255,255,255,0.2)'} 
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
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{module.status.replace('_', ' ')} • {module.date}</p>
                    </div>
                  </div>
                  
                  {module.score && (
                    <div className="text-right">
                      <span className="block text-2xl font-light text-emerald-400">{module.score}%</span>
                      <span className="text-[8px] uppercase tracking-widest text-white/30">Acquisition Score</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* SEC 4: TEMPORAL DYNAMICS */}
          <section id="temporal" className="relative scroll-mt-24">
            <h2 className="text-white/30 uppercase tracking-[0.2em] text-xs font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">
              <Clock size={12} className="text-blue-400" /> Temporal Dynamics (WFM)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Daily Performance Chart */}
              <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6">
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-6">Daily Output Velocity</h3>
                <div className="h-40 w-full -ml-4" data-cursor="Trace">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={employee.dailyPerformance}>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '12px' }}
                        itemStyle={{ color: '#60a5fa' }}
                      />
                      <Line type="monotone" dataKey="score" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3, fill: '#60a5fa' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weekly Timesheets */}
              <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6">
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-6">Timesheet Matrix (Hours vs Billable)</h3>
                <div className="h-40 w-full -ml-4" data-cursor="Trace">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={employee.timesheets}>
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '12px' }}
                      />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} dy={10} />
                      <Bar dataKey="hoursLogged" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={12} stackId="a" />
                      <Bar dataKey="billable" fill="#22d3ee" radius={[0, 0, 0, 0]} barSize={12} stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Leave Balances & Assets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8">
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2"><CalendarDays size={12}/> Leave Matrix</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white/60">PTO (Used / Total)</span>
                      <span className="text-white font-mono">{employee.leaveBalance.ptoUsed} / {employee.leaveBalance.ptoTotal}</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: `${(employee.leaveBalance.ptoUsed / employee.leaveBalance.ptoTotal) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white/60">Sick Leave</span>
                      <span className="text-white font-mono">{employee.leaveBalance.sickUsed} / {employee.leaveBalance.sickTotal}</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${(employee.leaveBalance.sickUsed / employee.leaveBalance.sickTotal) * 100}%` }} />
                    </div>
                  </div>
                  {employee.leaveBalance.sabbaticalEligible && (
                    <div className="pt-4 mt-2 border-t border-white/5 text-[10px] uppercase tracking-widest text-purple-400">
                      · Sabbatical Protocol Available
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8">
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2"><Monitor size={12}/> Assigned Hardware Assets</h3>
                <ul className="space-y-3">
                  {employee.equipment.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/70">
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
            <h2 className="text-white/30 uppercase tracking-[0.2em] text-xs font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">
              <Target size={12} className="text-rose-400" /> Impact Nodes (OKRs & Promos)
            </h2>
            
            <div className="space-y-6 mb-12">
              {employee.okrs.map((okr, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                   <div className={`absolute top-0 left-0 w-1 h-full ${okr.status === 'completed' ? 'bg-emerald-500' : okr.status === 'on_track' ? 'bg-cyan-500' : okr.status === 'at_risk' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                   
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                     <div>
                       <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-widest bg-white/5 text-white/50 mb-2 inline-block">Weight: {okr.weight}</span>
                       <h4 className="text-white text-lg font-light">{okr.objective}</h4>
                     </div>
                     <div className="text-right">
                       <span className="text-3xl font-light text-white">{okr.progress}%</span>
                     </div>
                   </div>

                   <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
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
            <div className="relative pl-12 border-l border-white/5 space-y-16 before:absolute before:inset-0 before:bg-gradient-to-b before:from-rose-500/0 before:via-rose-500/20 before:to-purple-500/0 before:-left-[1px] before:w-[2px] before:h-full">
              <div className="relative">
                <div className="absolute -left-[3.25rem] w-6 h-6 rounded-full bg-[#030303] border border-rose-400 flex items-center justify-center shadow-[0_0_15px_rgba(251,113,133,0.3)]">
                  <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-light text-white mb-2 tracking-wide">Current State</h3>
                <p className="text-sm text-white/40 leading-relaxed font-light font-serif italic">"{employee.recentFeedback}"</p>
              </div>

              {employee.projectedPromotions.map((promo, i) => (
                <div key={i} className="relative opacity-60 hover:opacity-100 transition-opacity duration-500 cursor-crosshair" data-cursor="Forecast">
                  <div className="absolute -left-[3.25rem] w-6 h-6 rounded-full bg-[#030303] border border-white/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>
                  <h3 className="text-xl font-light text-white mb-2 tracking-wide">Projected Evolution: {promo.role}</h3>
                  <div className="flex items-center gap-6 mt-4">
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">Timeframe</span>
                      <span className="text-sm text-purple-400 font-mono">{promo.timeframe}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">Probability</span>
                      <span className="text-sm text-rose-400 font-mono">{promo.probability}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SEC 6: BIO-RHYTHM */}
          <section id="biorhythm" className="relative scroll-mt-24">
            <h2 className="text-white/30 uppercase tracking-[0.2em] text-xs font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">
              <Heart size={12} className="text-rose-500" /> Bio-Rhythm & Psychometrics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/5 rounded-[2rem] p-8 flex items-center gap-8 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] pointer-events-none transition-colors duration-1000 ${employee.bioRhythm.burnoutProbability > 50 ? 'bg-rose-500/20' : 'bg-emerald-500/10'}`} />
                
                <div className="relative w-32 h-32 flex-shrink-0" data-cursor="Scan Bio">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <motion.circle 
                      cx="50" cy="50" r="45" 
                      stroke={employee.bioRhythm.burnoutProbability > 50 ? '#fb7185' : '#10b981'} 
                      strokeWidth="2" fill="none" strokeDasharray="4 4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: 'center' }}
                    />
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
                    <span className="text-[6px] uppercase tracking-widest text-white/40">Stress</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-white text-lg font-light mb-2">Cognitive Load Telemetry</h3>
                  <p className="text-sm text-white/60 font-light leading-relaxed mb-4">
                    Based on focus block density ({employee.bioRhythm.focusBlocksAvg} hrs/day) and work log sentiment, systemic burnout probability is at {employee.bioRhythm.burnoutProbability}%.
                  </p>
                  <div className="flex gap-4">
                    <span className={`px-3 py-1 rounded-full border text-[9px] uppercase tracking-widest ${employee.bioRhythm.burnoutProbability > 50 ? 'border-rose-500/30 text-rose-400 bg-rose-500/10' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'}`}>
                      {employee.bioRhythm.burnoutProbability > 50 ? 'Intervention Recommended' : 'Optimal Zone'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-center text-center">
                <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-4">Sleep & Recovery Quality</span>
                <span className="text-5xl font-light text-white mb-2">{employee.bioRhythm.sleepQuality}<span className="text-2xl text-white/30">%</span></span>
                <span className="text-xs text-white/60 font-light">Index Score</span>
              </div>
            </div>
          </section>

          {/* SEC 7: 360 REVIEWS */}
          <section id="resonance" className="relative scroll-mt-24">
            <h2 className="text-white/30 uppercase tracking-[0.2em] text-xs font-semibold mb-8 flex items-center gap-4 border-b border-white/10 pb-4">
              <Network size={12} className="text-indigo-400" /> 360° Feedback Matrix
            </h2>
            
            <div className="space-y-4">
              {(employee.reviews360 || []).map((review: any, i: number) => {
                const scoreKeys = ['communication', 'technical', 'leadership', 'collaboration', 'innovation'];
                const scoreColors: Record<string, string> = { communication: '#38bdf8', technical: '#c084fc', leadership: '#f59e0b', collaboration: '#10b981', innovation: '#f43f5e' };
                return (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-white font-light">{review.reviewer}</h4>
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{review.relation} • {review.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Overall</p>
                        <p className="text-3xl font-light text-white">{review.overall}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      {scoreKeys.map(k => (
                        <div key={k} className="flex items-center gap-3">
                          <span className="text-[9px] uppercase tracking-widest w-24 capitalize flex-shrink-0" style={{ color: scoreColors[k] }}>{k}</span>
                          <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${review.scores[k]}%`, background: scoreColors[k] }} />
                          </div>
                          <span className="text-[10px] font-mono text-white/50 w-8 text-right">{review.scores[k]}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3 border-t border-white/5 pt-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Star size={9} className="text-emerald-400" />
                          <span className="text-[9px] uppercase tracking-widest text-emerald-400">Strengths</span>
                        </div>
                        <p className="text-white/60 text-sm font-light font-serif italic leading-relaxed">"{review.strengths}"</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <MessageSquare size={9} className="text-amber-400" />
                          <span className="text-[9px] uppercase tracking-widest text-amber-400">Growth Areas</span>
                        </div>
                        <p className="text-white/60 text-sm font-light font-serif italic leading-relaxed">"{review.improvements}"</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!employee.reviews360 || employee.reviews360.length === 0) && (
                <div className="text-center py-12 text-white/30">
                  <Network size={28} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No reviews submitted yet</p>
                </div>
              )}
            </div>
          </section>

          {/* Action Module */}
          <section className="pt-12 border-t border-white/5">
            <button className="w-full relative group overflow-hidden rounded-[2rem] p-1" data-cursor="Sync">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-20 group-hover:opacity-100 blur transition-opacity duration-1000" />
              <div className="relative bg-[#050505] rounded-[1.8rem] px-8 py-6 flex items-center justify-between border border-white/10 group-hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-6 text-left">
                  <div className="p-3 bg-white/5 rounded-full text-cyan-400">
                    <BarChart2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-white text-lg font-light tracking-wide">Initiate Complete System Sync</h4>
                    <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Compile comprehensive data matrix for HR & 1:1</p>
                  </div>
                </div>
                <ArrowUpRight className="text-white/40 group-hover:text-cyan-400 transition-colors" size={24} />
              </div>
            </button>
          </section>

        </motion.div>
      </div>
    </div>
  );
}
