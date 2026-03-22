import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDays, Clock, MapPin, AlertTriangle, ArrowUpRight, ArrowLeft, Brain, Lightbulb, Eye, Flame } from 'lucide-react';
import { employees } from '../mockData';
import { NavLink } from 'react-router';
import { useNavigate } from 'react-router';

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
              <span className="text-sm uppercase tracking-[0.12em] p-text-dim font-mono">{dayConfig[t].label}</span>
              <span className="text-xs p-text-whisper font-light ml-1.5">
                {({'In Orbit':'present','Remote':'work from home','Leave':'on leave','Dark':'absent','Standby':'weekend'} as Record<string,string>)[dayConfig[t].label]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} className="text-center text-sm uppercase tracking-[0.12em] p-text-ghost font-mono pb-2">{d}</div>
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
                  <div className="border p-border-mid rounded-xl p-3 whitespace-nowrap shadow-2xl" style={{ backgroundColor: 'var(--p-surface)' }}>
                    <p className="text-sm uppercase tracking-[0.12em] font-mono mb-1.5" style={{ color: cfg.color }}>{cfg.label}</p>
                    {day.checkIn && (
                      <div className="flex items-center gap-2 text-xs p-text-mid">
                        <Clock size={8} /><span>{day.checkIn} — {day.checkOut}</span>
                      </div>
                    )}
                    {day.leaveType && <p className="text-xs p-text-dim mt-1 capitalize font-mono">{day.leaveType} protocol</p>}
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
  const navigate = useNavigate();
  const [selectedEmp, setSelectedEmp] = useState(employees[0].id);
  const emp = employees.find(e => e.id === selectedEmp)!;
  const att = emp.attendance;
  const lb = emp.leaveBalance;
  const totalDays = att.present + att.wfh + att.leave + att.absent;
  const presenceRate = Math.round((att.present + att.wfh) / totalDays * 100);

  /* ── Deep pattern detection — collective + individual ── */
  const patterns = useMemo(() => {
    const items: { type: 'critical' | 'watch' | 'opportunity'; title: string; detail: string; action: string; color: string; icon: React.ElementType; empIds?: string[] }[] = [];

    // ─ Individual patterns ─
    employees.forEach(emp => {
      const a = emp.attendance;
      const cal = a.calendar;
      const rate = Math.round((a.present + a.wfh) / (a.present + a.wfh + a.leave + a.absent) * 100);

      // Consecutive absences
      let maxConsec = 0, consec = 0;
      cal.forEach((d: any) => { if (d.type === 'absent') { consec++; maxConsec = Math.max(maxConsec, consec); } else if (d.type !== 'weekend') consec = 0; });
      if (maxConsec >= 2) items.push({
        type: 'critical', color: '#f43f5e', icon: Flame, empIds: [emp.id],
        title: `${emp.name.split(' ')[0]} — ${maxConsec} consecutive absent days`,
        detail: `Consecutive unexplained absences are a strong attrition predictor. Current flight risk: ${emp.attritionRiskPercentage}%.`,
        action: `Schedule an immediate 1:1. Frame it as a wellbeing check, not a performance review.`,
      });

      // High absence count
      if (a.absent >= 3 && maxConsec < 2) items.push({
        type: 'watch', color: '#f59e0b', icon: Eye, empIds: [emp.id],
        title: `${emp.name.split(' ')[0]} — ${a.absent} unplanned absences`,
        detail: `Above the 2-per-month threshold. Presence rate at ${rate}%.`,
        action: `Monitor next 2 weeks. If pattern continues, initiate a supportive conversation about workload.`,
      });

      // Heavy WFH pattern (>60% remote)
      const wfhRatio = a.wfh / (a.present + a.wfh);
      if (wfhRatio > 0.5 && a.present + a.wfh > 5) items.push({
        type: 'watch', color: '#38bdf8', icon: Eye, empIds: [emp.id],
        title: `${emp.name.split(' ')[0]} — ${Math.round(wfhRatio * 100)}% remote work ratio`,
        detail: `Significantly above team average. Could indicate disengagement or commute friction.`,
        action: `Discuss preferred work arrangement. Ensure they're connected to team rituals.`,
      });

      // Monday/Friday pattern detection
      const mondayAbsent = cal.filter((d: any) => {
        const dow = new Date(d.date).getDay();
        return dow === 1 && (d.type === 'absent' || d.type === 'leave' || d.type === 'wfh');
      }).length;
      const fridayAbsent = cal.filter((d: any) => {
        const dow = new Date(d.date).getDay();
        return dow === 5 && (d.type === 'absent' || d.type === 'leave' || d.type === 'wfh');
      }).length;
      if (mondayAbsent + fridayAbsent >= 3) items.push({
        type: 'watch', color: '#f59e0b', icon: Eye, empIds: [emp.id],
        title: `${emp.name.split(' ')[0]} — Monday/Friday absence pattern`,
        detail: `${mondayAbsent} Mondays and ${fridayAbsent} Fridays with absence, leave, or WFH. Classic long-weekend pattern.`,
        action: `Address directly but constructively. This pattern erodes team trust if left unchecked.`,
      });
    });

    // ─ Collective patterns ─
    // Mass bunking — check if 3+ people were absent/leave on the same date
    const dateMap: Record<string, string[]> = {};
    employees.forEach(emp => {
      emp.attendance.calendar.forEach((d: any) => {
        if (d.type === 'absent' || d.type === 'leave') {
          if (!dateMap[d.date]) dateMap[d.date] = [];
          dateMap[d.date].push(emp.name.split(' ')[0]);
        }
      });
    });
    Object.entries(dateMap).forEach(([date, names]) => {
      if (names.length >= 2) {
        items.push({
          type: 'critical', color: '#f43f5e', icon: AlertTriangle,
          title: `Mass absence on ${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          detail: `${names.join(', ')} were all absent or on leave. ${names.length} of ${employees.length} employees (${Math.round(names.length / employees.length * 100)}% of the team).`,
          action: `Investigate if this was coordinated. If recurring, review team morale and upcoming calendar.`,
        });
      }
    });

    // Collective WFH surge — check if 3+ people WFH on same day
    const wfhMap: Record<string, string[]> = {};
    employees.forEach(emp => {
      emp.attendance.calendar.forEach((d: any) => {
        if (d.type === 'wfh') {
          if (!wfhMap[d.date]) wfhMap[d.date] = [];
          wfhMap[d.date].push(emp.name.split(' ')[0]);
        }
      });
    });
    Object.entries(wfhMap).forEach(([date, names]) => {
      if (names.length >= 3) {
        items.push({
          type: 'watch', color: '#38bdf8', icon: Eye,
          title: `WFH surge on ${new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`,
          detail: `${names.join(', ')} all worked remotely. Office was effectively empty (${names.length}/${employees.length} remote).`,
          action: `If recurring on same day, consider making it an official remote day to set expectations.`,
        });
      }
    });

    // Org-wide low presence
    const orgPresence = employees.reduce((s, e) => {
      const a = e.attendance;
      return s + (a.present + a.wfh) / (a.present + a.wfh + a.leave + a.absent);
    }, 0) / employees.length;
    if (orgPresence < 0.85) items.push({
      type: 'watch', color: '#f59e0b', icon: AlertTriangle,
      title: `Org-wide presence below 85%`,
      detail: `Average presence rate is ${Math.round(orgPresence * 100)}%. Below healthy threshold for team cohesion.`,
      action: `Review team calendar, upcoming deadlines, and recent morale signals. Consider a team-building initiative.`,
    });

    return items.sort((a, b) => ({ critical: 0, watch: 1, opportunity: 2 }[a.type] - { critical: 0, watch: 1, opportunity: 2 }[b.type])).slice(0, 6);
  }, []);

  return (
    <div className="page-wrap">

      {/* Hero */}
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
            <CalendarDays size={14} className="text-cyan-400" /> Workforce Temporal Dynamics
          </p>
          <h1 className="hero-title font-light text-white">
            Orbital <span className="p-text-dim italic font-serif">Presence</span>
          </h1>
        </div>
        <div className="flex gap-16 text-right">
          <div>
            <p className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2">Org Presence Rate</p>
            <p className="text-4xl font-light text-emerald-400">94.2%</p>
          </div>
          <div>
            <p className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2">Remote Ratio</p>
            <p className="text-4xl font-light text-cyan-400">31%</p>
          </div>
        </div>
      </motion.div>

      {/* ── Temporal Intelligence — Pattern Detection ── */}
      {patterns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain size={13} className="p-text-mid" />
            <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-ghost">Pattern detection — individual & collective</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {patterns.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="rounded-xl p-4 group transition-all duration-300"
                  style={{ background: `${ins.color}06`, border: `1px solid ${ins.color}12` }}
                >
                  <div className="flex items-start gap-3">
                    <Icon size={12} className="flex-shrink-0 mt-0.5" style={{ color: ins.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 rounded"
                          style={{ background: `${ins.color}12`, color: ins.color }}>
                          {ins.type}
                        </span>
                      </div>
                      <p className="text-sm font-light text-white leading-snug mb-1">{ins.title}</p>
                      <p className="text-xs p-text-dim leading-relaxed mb-2">{ins.detail}</p>
                      <div className="flex items-start gap-1.5 p-2 rounded-lg" style={{ background: `${ins.color}06` }}>
                        <Lightbulb size={10} className="flex-shrink-0 mt-0.5" style={{ color: ins.color }} />
                        <p className="text-xs leading-relaxed" style={{ color: `${ins.color}cc` }}>{ins.action}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

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
              className={`relative p-5 rounded-[2rem] border text-left transition-all duration-500 overflow-hidden group hover:p-border-mid ${
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
              <p className="p-text-body text-sm font-light truncate relative z-10">{e.name.split(' ')[0]}</p>
              <p className="text-sm uppercase tracking-[0.12em] p-text-ghost mt-0.5 truncate font-mono relative z-10">{e.department}</p>
              <div className="mt-3 flex items-end justify-between relative z-10">
                <span className={`text-xl font-light ${rate >= 90 ? 'text-emerald-400' : rate >= 80 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {rate}%
                </span>
                {a.absent > 0 && (
                  <span className="text-xs text-rose-400 font-mono">{a.absent} dark</span>
                )}
              </div>
              <div className="mt-2 h-px p-bg-card relative z-10">
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
          <div className="lg:col-span-2 relative p-bg-card border p-border rounded-[2rem] p-8 overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-cyan-500/8 transition-all duration-1000" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-white text-xl font-light leading-none">{emp.name.split(' ')[0]}</h2>
                    <h2 className="p-text-dim font-serif italic text-sm leading-none mt-0.5">{emp.name.split(' ')[1]}</h2>
                  </div>
                  <NavLink
                    to={`/app/employee/${emp.id}`}
                    className="flex-shrink-0 p-1.5 rounded-full p-bg-card border p-border-mid p-text-dim hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
                  >
                    <ArrowUpRight size={12} />
                  </NavLink>
                </div>
                <p className="text-sm uppercase tracking-[0.12em] p-text-ghost mt-2 font-mono">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} — Temporal Log</p>
              </div>
              <div className="text-right">
                <p className="text-sm uppercase tracking-[0.12em] p-text-dim mb-1">Presence Rate</p>
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
            <div className="relative p-bg-card border p-border rounded-[2rem] p-6 overflow-hidden group">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-500/8 blur-[40px] rounded-full pointer-events-none" />
              <h3 className="p-text-dim uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-3 border-b p-border-mid pb-3"><CalendarDays size={10} className="text-cyan-400" /> Temporal Breakdown</h3>
              <div className="space-y-4 relative z-10">
                {[
                  { label: 'In Orbit', val: att.present, color: '#10b981' },
                  { label: 'Remote',   val: att.wfh,     color: '#38bdf8' },
                  { label: 'Leave',    val: att.leave,   color: '#f59e0b' },
                  { label: 'Dark',     val: att.absent,  color: '#f43f5e' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="p-text-mid">{s.label}</span>
                      <span className="font-mono" style={{ color: s.color }}>{s.val}d</span>
                    </div>
                    <div className="h-px p-bg-card">
                      <div className="h-full transition-all" style={{ width: `${(s.val / totalDays) * 100}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave balance */}
            <div className="relative p-bg-card border p-border rounded-[2rem] p-6 overflow-hidden group">
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 blur-[40px] rounded-full pointer-events-none" />
              <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-3 border-b p-border-mid pb-3">
                <CalendarDays size={10} className="text-amber-400" /> Leave Matrix
              </h3>
              <div className="space-y-5 relative z-10">
                {[
                  { label: 'PTO Protocol',  used: lb.ptoUsed,  total: lb.ptoTotal,  color: '#c084fc' },
                  { label: 'Sick Protocol', used: lb.sickUsed, total: lb.sickTotal, color: '#f59e0b' },
                ].map(l => (
                  <div key={l.label}>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="p-text-mid">{l.label}</span>
                      <span className="font-mono p-text-lo">{l.used} / {l.total}</span>
                    </div>
                    <div className="h-px p-bg-card">
                      <div className="h-full" style={{ width: `${(l.used / l.total) * 100}%`, background: l.color }} />
                    </div>
                    <p className="text-xs p-text-ghost mt-1 font-mono">{l.total - l.used} units remaining</p>
                  </div>
                ))}
                {lb.sabbaticalEligible && (
                  <div className="pt-3 border-t p-border flex items-center gap-2">
                    <span className="text-sm uppercase tracking-[0.12em] text-purple-400 font-mono flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-purple-400 inline-block"/>Sabbatical Protocol Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Work pattern */}
            <div className="relative p-bg-card border p-border rounded-[2rem] p-6 overflow-hidden group" data-cursor="Scan Pattern">
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-emerald-500/5 blur-[30px] rounded-full pointer-events-none" />
              <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-3 border-b p-border-mid pb-3">
                <MapPin size={10} className="text-rose-400" /> Location Pattern
              </h3>
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative w-16 h-16 flex-shrink-0" data-cursor="Scan Bio">
                  <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="var(--p-chart-grid)" strokeWidth="6"/>
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
                    <span className="text-xs p-text-mid">Office {Math.round(att.present / (att.present + att.wfh) * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"/>
                    <span className="text-xs p-text-mid">Remote {Math.round(att.wfh / (att.present + att.wfh) * 100)}%</span>
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
