import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NavLink } from 'react-router';
import { Cpu, TrendingUp, ArrowUpRight, ArrowDownRight, Coins } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Area, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, BarChart } from 'recharts';
import { employees, orgROIData, departmentROI } from '../mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#050505] border border-white/10 rounded-xl p-3 text-xs">
      <p className="text-white/30 mb-2 uppercase tracking-widest font-mono text-[8px]">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.stroke || p.fill }} />
          <span className="text-white/50">{p.name}:</span>
          <span className="text-white font-mono">{typeof p.value === 'number' ? (p.name.includes('ROI') ? `${p.value}%` : `$${p.value.toFixed?.(1) ?? p.value}M`) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function ROIInvestment() {
  const [selectedEmp, setSelectedEmp] = useState<string | null>(null);
  const emp = selectedEmp ? employees.find(e => e.id === selectedEmp) : null;

  const totalInvestment = employees.reduce((s, e) => s + e.costInvestment, 0);
  const totalRevenue = employees.reduce((s, e) => s + e.revenueContribution, 0);
  const orgROI = Math.round((totalRevenue / totalInvestment) * 100);

  // Employees whose ROI is below org average — the actionable signal
  const belowAvgROI = [...employees]
    .filter(e => e.roi < orgROI)
    .sort((a, b) => a.roi - b.roi)
    .slice(0, 2);
  const topROI = [...employees].sort((a, b) => b.roi - a.roi)[0];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-12"
      >
        <div>
          <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-2">
            <Cpu size={14} className="text-emerald-400" /> Human Capital Value Engine
          </p>
          <h1 className="text-7xl md:text-9xl font-light tracking-tighter text-white leading-[0.9]">
            Capital <span className="text-white/30 italic font-serif">Surplus</span>
          </h1>
        </div>
        <div className="flex gap-16 text-right">
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] mb-2">Org ROI</p>
            <p className="text-4xl font-light text-emerald-400">{orgROI}%</p>
          </div>
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] mb-2">Surplus Generated</p>
            <p className="text-4xl font-light text-white">${(totalRevenue/1000000).toFixed(1)}M</p>
          </div>
        </div>
      </motion.div>

      {/* ROI Insight Strip — what needs action */}
      {belowAvgROI.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {/* Highest ROI — reinforce */}
          {topROI && (
            <NavLink
              to={`/app/employee/${topROI.id}`}
              className="flex items-center gap-4 p-5 rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08] transition-all group"
            >
              <img src={topROI.avatar} alt={topROI.name} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-widest text-emerald-400 mb-1 font-mono">Top ROI — Reinforce</p>
                <p className="text-white/80 text-sm font-light truncate">{topROI.name}</p>
                <p className="text-emerald-400 text-xs font-mono">{topROI.roi}% ROI</p>
              </div>
              <ArrowUpRight size={14} className="text-emerald-400/40 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
            </NavLink>
          )}

          {/* Below-average ROI employees — intervene */}
          {belowAvgROI.map(e => (
            <NavLink
              key={e.id}
              to={`/app/employee/${e.id}`}
              className="flex items-center gap-4 p-5 rounded-[1.5rem] border border-amber-500/20 bg-amber-500/[0.04] hover:bg-amber-500/[0.08] transition-all group"
            >
              <img src={e.avatar} alt={e.name} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-widest text-amber-400 mb-1 font-mono">Below Average — Review</p>
                <p className="text-white/80 text-sm font-light truncate">{e.name}</p>
                <p className="text-amber-400 text-xs font-mono">{e.roi}% ROI vs {orgROI}% avg</p>
              </div>
              <ArrowUpRight size={14} className="text-amber-400/40 group-hover:text-amber-400 transition-colors flex-shrink-0" />
            </NavLink>
          ))}
        </motion.div>
      )}

      {/* Trajectory + Department */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 relative bg-white/5 border border-white/5 rounded-[2rem] p-8 overflow-hidden group">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-emerald-500/8 transition-all duration-1000" />
          <div className="flex justify-between items-center mb-10 relative z-10">
            <div>
              <h3 className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold flex items-center gap-4 border-b border-white/10 pb-4">ROI Trajectory (6M)</h3>
              <p className="text-white/20 text-[9px] font-mono mt-1">Investment vs Value Generated ($M)</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp size={13} />
              <span className="text-[9px] font-mono">+33% YTD</span>
            </div>
          </div>
          <div className="h-72 relative z-10" data-cursor="Analyze ROI">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={orgROIData}>
                <defs>
                  <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false}/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} dy={10}/>
                <YAxis yAxisId="l" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickFormatter={v=>`$${v}M`}/>
                <YAxis yAxisId="r" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickFormatter={v=>`${v}%`}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area yAxisId="l" type="monotone" dataKey="totalValue" name="Value ($M)" stroke="#10b981" strokeWidth={2} fill="url(#valueGrad)"/>
                <Area yAxisId="l" type="monotone" dataKey="totalInvestment" name="Investment ($M)" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="5 5" fill="url(#invGrad)"/>
                <Line yAxisId="r" type="monotone" dataKey="roi" name="ROI (%)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }}/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relative bg-white/5 border border-white/5 rounded-[2rem] p-8 overflow-hidden group">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-purple-500/8 blur-[60px] rounded-full pointer-events-none" />
          <h3 className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold flex items-center gap-4 border-b border-white/10 pb-4 mb-6 relative z-10">Department Vectors</h3>
          <div className="space-y-5 relative z-10">
            {departmentROI.map((dept, i) => (
              <div key={i} data-cursor="Trace">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/60">{dept.department}</span>
                  <span className={`font-mono ${dept.roi >= 200 ? 'text-emerald-400' : dept.roi >= 150 ? 'text-cyan-400' : dept.roi >= 110 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {dept.roi}%
                  </span>
                </div>
                <div className="h-px bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min((dept.roi/400)*100, 100)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
                    className="h-full"
                    style={{ background: dept.roi >= 200 ? '#10b981' : dept.roi >= 150 ? '#38bdf8' : dept.roi >= 110 ? '#f59e0b' : '#f43f5e' }}
                  />
                </div>
                <div className="flex justify-between text-[8px] text-white/20 mt-1 font-mono">
                  <span>Cost ${(dept.investment/1000).toFixed(0)}K</span>
                  <span>Value ${(dept.value/1000).toFixed(0)}K</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual ROI profiles */}
      <h2 className="text-white/30 uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-4 border-b border-white/10 pb-4"><Coins size={10} className="text-emerald-400" /> Individual Capital Nodes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {employees.map((e, i) => {
          const surplus = e.revenueContribution - e.costInvestment;
          const positive = surplus > 0;
          return (
            <motion.button
              key={e.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedEmp(selectedEmp === e.id ? null : e.id)}
              className={`relative text-left p-6 rounded-[2rem] border overflow-hidden transition-all duration-500 group hover:border-white/15 ${
                selectedEmp === e.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'
              }`}
              data-cursor="Expand Capital"
            >
              {/* Ambient glow on hover/select */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="flex items-center gap-3 mb-5 relative z-10">
                <img src={e.avatar} alt={e.name} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"/>
                <div>
                  <p className="text-white/80 text-sm font-light leading-none">{e.name.split(' ')[0]}</p>
                  <p className="text-white/30 font-serif italic text-sm leading-none mt-0.5">{e.department}</p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/20 mb-0.5 font-mono">Investment</p>
                  <p className="text-sm font-light text-white/60 font-mono">${(e.costInvestment/1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/20 mb-0.5 font-mono">Surplus Value</p>
                  <p className="text-sm font-light text-emerald-400 font-mono">${(e.revenueContribution/1000).toFixed(0)}K</p>
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-white/20 mb-0.5 font-mono">ROI Vector</p>
                    <p className={`text-2xl font-light ${e.roi >= 200 ? 'text-emerald-400' : e.roi >= 150 ? 'text-cyan-400' : e.roi >= 110 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {e.roi}%
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {positive ? <ArrowUpRight size={11} className="text-emerald-400"/> : <ArrowDownRight size={11} className="text-rose-400"/>}
                      <p className={`text-sm font-mono ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ${Math.abs(surplus/1000).toFixed(0)}K
                      </p>
                    </div>
                    <p className="text-[7px] text-white/20 font-mono">net surplus</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 h-px bg-white/5 relative z-10">
                <div className="h-full" style={{
                  width: `${Math.min((e.costInvestment/e.revenueContribution)*100, 100)}%`,
                  background: '#f43f5e', opacity: 0.5
                }}/>
              </div>
              <p className="text-[7px] text-white/15 mt-1 font-mono relative z-10">Cost / Revenue ratio</p>
            </motion.button>
          );
        })}
      </div>

      {/* Quarterly drill-down */}
      {emp && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/5 border border-white/5 rounded-[2rem] p-8 overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-white text-xl font-light leading-none">{emp.name.split(' ')[0]}</h3>
              <h3 className="text-white/30 font-serif italic text-sm leading-relaxed mt-0.5">Quarterly Capital Trajectory</h3>
            </div>
            <button onClick={() => setSelectedEmp(null)}
              className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white transition-colors font-mono">
              // Close
            </button>
          </div>
          <div className="h-56 relative z-10" data-cursor="Trace">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emp.roiQuarterly} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false}/>
                <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} dy={10}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickFormatter={v=>`$${v/1000}K`}/>
                <Tooltip content={<CustomTooltip/>} cursor={{ fill: 'rgba(255,255,255,0.03)' }}/>
                <Bar dataKey="investment" name="Investment" fill="rgba(244,63,94,0.35)" radius={[4,4,0,0]} barSize={28}/>
                <Bar dataKey="value" name="Value ($M)" fill="#10b981" radius={[4,4,0,0]} barSize={28}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
