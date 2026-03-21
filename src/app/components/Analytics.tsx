import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Activity, TrendingUp, AlertTriangle, BrainCircuit, DollarSign, Target, Users, Zap, ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid, ComposedChart, Line, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { performanceData, globalRevenueForecast, globalLearningData, orgROIData, employees } from '../mockData';

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

const sparklineData = [
  { time: '00:00', value: 30 }, { time: '04:00', value: 45 }, { time: '08:00', value: 25 },
  { time: '12:00', value: 80 }, { time: '16:00', value: 65 }, { time: '20:00', value: 90 },
];

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
                    <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 p-text-dim hover:p-text-hi text-sm mb-4 transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
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
          <button
            key={v}
            onClick={() => setActiveView(v)}
            data-cursor={v}
              className={`px-6 py-2 rounded-lg text-xs uppercase tracking-widest font-medium transition-all ${
              activeView === v ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            {v === 'overview' ? 'Overview' : v === 'roi' ? 'ROI' : 'Wellbeing'}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Revenue Chart */}
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
              <div className="h-[300px] w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={globalRevenueForecast}>
                    <defs>
                      <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} dy={20} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="projected" stroke="#22d3ee" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" name="Projected Rev" />
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} name="Actual Rev" />
                    <Bar dataKey="cost" fill="#8b5cf6" opacity={0.5} radius={[4, 4, 0, 0]} barSize={20} name="Investment" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Attrition Risk */}
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
                    <div key={i} className="w-full p-bg-card rounded-t-sm relative group overflow-hidden" style={{ height: '100%' }}>
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

              {/* Performance trend */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="p-bg-card border p-border rounded-[2rem] p-8"
              >
                <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Performance Trend (6M)</h3>
                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c084fc" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="avgScore" stroke="#c084fc" strokeWidth={2} fill="url(#perfGrad)" />
                      <Line type="monotone" dataKey="target" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" strokeWidth={1} dot={false} />
                      <Tooltip content={<CustomTooltip />} />
                    </AreaChart>
                  </ResponsiveContainer>
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
                  {employees.map((emp, i) => (
                    <tr key={emp.id} onClick={() => navigate(`/app/employee/${emp.id}`)} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer" data-cursor="Deep Dive">
                      <td className="py-4 pr-8">
                        <div className="flex items-center gap-3">
                          <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
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
                          <div className="w-16 h-1 p-bg-card rounded-full">
                            <div className="h-full rounded-full bg-amber-400" style={{ width: `${emp.motivationScore}%` }} />
                          </div>
                          <span className="p-text-mid text-sm font-mono">{emp.motivationScore}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-8">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 p-bg-card rounded-full">
                            <div className="h-full rounded-full bg-rose-400" style={{ width: `${emp.welfareScore}%` }} />
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

      {/* ROI View */}
      {activeView === 'roi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-bg-card border p-border rounded-[2rem] p-8">
              <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Organisation ROI Trajectory</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={orgROIData}>
                    <defs>
                      <linearGradient id="roiValueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} dy={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="totalValue" name="Value ($M)" stroke="#10b981" strokeWidth={2} fill="url(#roiValueGrad)" />
                    <Line type="monotone" dataKey="totalInvestment" name="Investment ($M)" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-bg-card border p-border rounded-[2rem] p-8">
              <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Individual ROI Comparison</h3>
              <div className="space-y-5">
                {employees.map(emp => (
                  <div key={emp.id}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="p-text-body">{emp.name}</span>
                      <span className={`font-mono ${emp.roi >= 200 ? 'text-emerald-400' : emp.roi >= 150 ? 'text-cyan-400' : emp.roi >= 110 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {emp.roi}%
                      </span>
                    </div>
                    <div className="h-[3px] p-bg-card rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min((emp.roi / 400) * 100, 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full"
                        style={{ background: emp.roi >= 200 ? '#10b981' : emp.roi >= 150 ? '#38bdf8' : emp.roi >= 110 ? '#f59e0b' : '#f43f5e' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Org Health View */}
      {activeView === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-bg-card border p-border rounded-[2rem] p-8">
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Org Health Radar</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                  <Radar name="Score" dataKey="score" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} strokeWidth={1.5} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-bg-card border p-border rounded-[2rem] p-8">
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-4 border-b p-border-mid pb-4">Learning Domain Completion</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={globalLearningData} layout="vertical">
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                  <YAxis dataKey="domain" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} width={80} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} stackId="a" />
                  <Bar dataKey="active" name="In Progress" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={12} stackId="a" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
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
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
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
