import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDays, Clock, MapPin, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { employees } from '../mockData';
import { NavLink } from 'react-router';

type DayType = 'present' | 'wfh' | 'leave' | 'absent' | 'weekend';

const dayConfig: Record<DayType, { label: string; color: string; bg: string }> = {
  present: { label: 'In Orbit',   color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  wfh:     { label: 'Remote',     color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' },
  leave:   { label: 'Leave',      color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  absent:  { label: 'Dark',       color: '#f43f5e', bg: 'rgba(244,63,94,0.15)'  },
  weekend: { label: 'Standby',    color: '#3f3f46', bg: 'rgba(63,63,70,0.1)'    },
};

function TemporalGrid({ calendar }: { calendar: any[] }) {
  const [hoveredDay, setHoveredDay] = useState<any>(null);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        {(Object.keys(dayConfig) as DayType[]).filter(t => t !== 'weekend').map(t => (
          <div key={t} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm" style={{ background: dayConfig[t].color }} />
            <div>
              <span className="text-sm uppercase tracking-[0.12em] text-white/30 font-mono">{dayConfig[t].label}</span>
              <span className="text-xs text-white/15 font-light ml-1.5">
                {({'In Orbit':'present','Remote':'work from home','Leave':'on leave','Dark':'absent','Standby':'weekend'} as Record<string,string>)[dayConfig[t].label]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} className="text-center text-sm uppercase tracking-[0.12em] text-white/20 font-mono pb-2">{d}</div>
        ))}
        {calendar.map((day, i) => {
          const type = (day.type in dayConfig ? day.type : 'weekend') as DayType;
          const cfg = dayConfig[type];
          const dayNum = parseInt(day.date.split('-')[2]);

          return (
            <div key={i} className="relative group">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.015, duration: 0.3, ease: [0.16,1,0.3,1] }}
                onMouseEnter={() => type !== 'weekend' && setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-mono transition-all ${
                  type === 'weekend' ? 'opacity-20' : 'hover:scale-110 cursor-crosshair'
                }`}
                style={{ background: cfg.bg, color: cfg.color }}
                data-cursor={type !== 'weekend' ? cfg.label : undefined}
              >
                {dayNum}
              </motion.div>

              {hoveredDay === day && type !== 'weekend' && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
                  <div className="bg-[#0a0a0c] border border-white/10 rounded-xl p-3 whitespace-nowrap shadow-2xl">
                    <p className="text-sm uppercase tracking-[0.12em] font-mono mb-1.5" style={{ color: cfg.color }}>{cfg.label}</p>
                    {day.checkIn && (
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <Clock size={8} /><span>{day.checkIn} — {day.checkOut}</span>
                      </div>
                    )}
                    {day.leaveType && <p className="text-xs text-white/30 mt-1 capitalize font-mono">{day.leaveType} protocol</p>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Attendance() {
  const [selectedEmp, setSelectedEmp] = useState(employees[0].id);
  const emp = employees.find(e => e.id === selectedEmp)!;
  const att = emp.attendance;
  const lb = emp.leaveBalance;
  const totalDays = att.present + att.wfh + att.leave + att.absent;
  const presenceRate = Math.round((att.present + att.wfh) / totalDays * 100);

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
          <p className="text-white/40 uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-2">
            <CalendarDays size={14} className="text-cyan-400" /> Workforce Temporal Dynamics
          </p>
          <h1 className="text-7xl md:text-9xl font-light tracking-tighter text-white leading-[0.9]">
            Orbital <span className="text-white/30 italic font-serif">Presence</span>
          </h1>
        </div>
        <div className="flex gap-16 text-right">
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-xs mb-2">Org Presence Rate</p>
            <p className="text-4xl font-light text-emerald-400">94.2%</p>
          </div>
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-xs mb-2">Remote Ratio</p>
            <p className="text-4xl font-light text-cyan-400">31%</p>
          </div>
        </div>
      </motion.div>

      {/* Node selector row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {employees.map((e, empIdx) => {
          const a = e.attendance;
          const rate = Math.round((a.present + a.wfh) / (a.present + a.wfh + a.leave + a.absent) * 100);
          const flag = a.absent >= 3 || rate < 80;
          return (
            <motion.button
              key={e.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: empIdx * 0.07, duration: 0.5 }}
              onClick={() => setSelectedEmp(e.id)}
              className={`relative p-5 rounded-[2rem] border text-left transition-all duration-500 overflow-hidden group hover:border-white/10 ${
                selectedEmp === e.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'
              }`}
              data-cursor="Set Node"
            >
              {selectedEmp === e.id && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />
              )}
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <img src={e.avatar} alt={e.name} className="w-8 h-8 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                {flag && <AlertTriangle size={10} className="text-rose-400" />}
              </div>
              <p className="text-white/80 text-sm font-light truncate relative z-10">{e.name.split(' ')[0]}</p>
              <p className="text-sm uppercase tracking-[0.12em] text-white/20 mt-0.5 truncate font-mono relative z-10">{e.department}</p>
              <div className="mt-3 flex items-end justify-between relative z-10">
                <span className={`text-xl font-light ${rate >= 90 ? 'text-emerald-400' : rate >= 80 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {rate}%
                </span>
                {a.absent > 0 && (
                  <span className="text-xs text-rose-400 font-mono">{a.absent} dark</span>
                )}
              </div>
              <div className="mt-2 h-px bg-white/5 relative z-10">
                <div className="h-full" style={{
                  width: `${rate}%`,
                  background: rate >= 90 ? '#10b981' : rate >= 80 ? '#f59e0b' : '#f43f5e'
                }} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedEmp}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Calendar */}
          <div className="lg:col-span-2 relative bg-white/5 border border-white/5 rounded-[2rem] p-8 overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-cyan-500/8 transition-all duration-1000" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-white text-xl font-light leading-none">{emp.name.split(' ')[0]}</h2>
                    <h2 className="text-white/30 font-serif italic text-sm leading-none mt-0.5">{emp.name.split(' ')[1]}</h2>
                  </div>
                  <NavLink
                    to={`/app/employee/${emp.id}`}
                    className="flex-shrink-0 p-1.5 rounded-full bg-white/5 border border-white/10 text-white/30 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
                  >
                    <ArrowUpRight size={12} />
                  </NavLink>
                </div>
                <p className="text-sm uppercase tracking-[0.12em] text-white/20 mt-2 font-mono">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} — Temporal Log</p>
              </div>
              <div className="text-right">
                <p className="text-sm uppercase tracking-[0.12em] text-white/30 mb-1">Presence Rate</p>
                <p className={`text-3xl font-light ${presenceRate >= 90 ? 'text-emerald-400' : presenceRate >= 80 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {presenceRate}%
                </p>
              </div>
            </div>
            <div className="relative z-10">
              <TemporalGrid calendar={att.calendar} />
            </div>
          </div>

          {/* Stats column */}
          <div className="space-y-4">
            {/* Breakdown */}
            <div className="relative bg-white/5 border border-white/5 rounded-[2rem] p-6 overflow-hidden group">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-500/8 blur-[40px] rounded-full pointer-events-none" />
              <h3 className="text-white/30 uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-3 border-b border-white/10 pb-3"><CalendarDays size={10} className="text-cyan-400" /> Temporal Breakdown</h3>
              <div className="space-y-4 relative z-10">
                {[
                  { label: 'In Orbit', val: att.present, color: '#10b981' },
                  { label: 'Remote',   val: att.wfh,     color: '#38bdf8' },
                  { label: 'Leave',    val: att.leave,   color: '#f59e0b' },
                  { label: 'Dark',     val: att.absent,  color: '#f43f5e' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white/50">{s.label}</span>
                      <span className="font-mono" style={{ color: s.color }}>{s.val}d</span>
                    </div>
                    <div className="h-px bg-white/5">
                      <div className="h-full transition-all" style={{ width: `${(s.val / totalDays) * 100}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave balance */}
            <div className="relative bg-white/5 border border-white/5 rounded-[2rem] p-6 overflow-hidden group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 blur-[40px] rounded-full pointer-events-none" />
              <h3 className="text-white/40 uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-3 border-b border-white/10 pb-3">
                <CalendarDays size={10} className="text-amber-400" /> Leave Matrix
              </h3>
              <div className="space-y-5 relative z-10">
                {[
                  { label: 'PTO Protocol',  used: lb.ptoUsed,  total: lb.ptoTotal,  color: '#c084fc' },
                  { label: 'Sick Protocol', used: lb.sickUsed, total: lb.sickTotal, color: '#f59e0b' },
                ].map(l => (
                  <div key={l.label}>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-white/50">{l.label}</span>
                      <span className="font-mono text-white/40">{l.used} / {l.total}</span>
                    </div>
                    <div className="h-px bg-white/5">
                      <div className="h-full" style={{ width: `${(l.used / l.total) * 100}%`, background: l.color }} />
                    </div>
                    <p className="text-xs text-white/20 mt-1 font-mono">{l.total - l.used} units remaining</p>
                  </div>
                ))}
                {lb.sabbaticalEligible && (
                  <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                    <span className="text-sm uppercase tracking-[0.12em] text-purple-400 font-mono flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-purple-400 inline-block"/>Sabbatical Protocol Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Work pattern */}
            <div className="relative bg-white/5 border border-white/5 rounded-[2rem] p-6 overflow-hidden group" data-cursor="Scan Pattern">
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-emerald-500/5 blur-[30px] rounded-full pointer-events-none" />
              <h3 className="text-white/40 uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-3 border-b border-white/10 pb-3">
                <MapPin size={10} className="text-rose-400" /> Location Pattern
              </h3>
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative w-16 h-16 flex-shrink-0" data-cursor="Scan Bio">
                  <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"/>
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={`${(att.present / (att.present + att.wfh)) * 175.9} 175.9`}/>
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={`${(att.wfh / (att.present + att.wfh)) * 175.9} 175.9`}
                      strokeDashoffset={-((att.present / (att.present + att.wfh)) * 175.9)}/>
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>
                    <span className="text-xs text-white/50">Office {Math.round(att.present / (att.present + att.wfh) * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"/>
                    <span className="text-xs text-white/50">Remote {Math.round(att.wfh / (att.present + att.wfh) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
