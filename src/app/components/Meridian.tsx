/**
 * Meridian — Company Roadmap
 * "The guiding reference line"
 *
 * Three view modes: Signal Path (SVG timeline) | Cascade (vertical tree) | Kanban
 * Uses roadmapStore for data. Prism card patterns throughout.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronRight,Target, AlertTriangle, Circle } from 'lucide-react';
import { PrismMeridian, PrismCascade, PrismKanban, PrismRisk, PrismTarget, PrismTime, PrismComplete, PrismEmpty, PrismFilter } from './ui/PrismIcons';
import { useNavigate } from 'react-router';
import { useRoadmap } from '../stores/roadmapStore';
import { useRoleAccess } from '../auth/useRoleAccess';
import { EmptyState } from './ui/EmptyState';

type ViewMode = 'signal-path' | 'cascade' | 'kanban';

const statusConfig = {
  completed: { color: '#38bdf8', label: 'Completed', icon: Circle },
  in_progress: { color: '#10b981', label: 'On Track', icon: Target },
  at_risk: { color: '#f59e0b', label: 'At Risk', icon: AlertTriangle },
  not_started: { color: 'var(--p-text-ghost)', label: 'Not Started', icon: Circle },
};

export function MeridianPage() {
  const navigate = useNavigate();
  const { roadmap } = useRoadmap();
  const { role, isCeo, isDeptHeadOrAbove } = useRoleAccess();
  const [viewMode, setViewMode] = useState<ViewMode>('signal-path');
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const [filterDept, setFilterDept] = useState<string | null>(null);

  // Role-based milestone scoping (PA §6.2):
  // CEO/DeptHead: see all milestones
  // Manager: see their department only (demo: show 'core-arch')
  // Employee: see only milestones whose OKRs are parents of their tasks (demo: show 2 milestones)
  const allMilestones = roadmap?.milestones || [];
  const milestones = useMemo(() => {
    if (isCeo || isDeptHeadOrAbove) return allMilestones;
    if (role === 'manager') return allMilestones.filter(m => m.departmentId === 'core-arch'); // demo: manager's dept
    // Employee: only milestones with OKRs linked to their tasks
    return allMilestones.filter(m => m.okrs && m.okrs.length > 0).slice(0, 3);
  }, [allMilestones, role, isCeo, isDeptHeadOrAbove]);

  const departments = useMemo(() => {
    return [...new Set(milestones.map(m => m.departmentId))];
  }, [milestones]);

  const filtered = useMemo(() => {
    if (!filterDept) return milestones;
    return milestones.filter(m => m.departmentId === filterDept);
  }, [milestones, filterDept]);

  const stats = useMemo(() => ({
    total: milestones.length,
    onTrack: milestones.filter(m => m.status === 'in_progress' || m.status === 'completed').length,
    atRisk: milestones.filter(m => m.status === 'at_risk').length,
    completion: milestones.length ? Math.round(milestones.reduce((s, m) => s + m.progress, 0) / milestones.length) : 0,
  }), [milestones]);

  if (!roadmap || roadmap.status === 'archived') {
    return (
      <div className="page-wrap pb-32">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 border-b pb-10" style={{ borderColor: 'var(--p-border)' }}>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm mb-4 transition-colors group" style={{ color: 'var(--p-text-dim)' }}>
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2" style={{ color: 'var(--p-text-lo)' }}>
            <PrismMeridian size={14} style={{ color: '#10b981' }} /> Company roadmap
          </p>
          <h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>
            The <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Meridian</span>
          </h1>
        </motion.div>
        <EmptyState variant="meridian" action={{ label: 'Start Genesis', onClick: () => navigate('/app/onboard') }} />
      </div>
    );
  }

  return (
    <div className="page-wrap pb-32">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 border-b pb-10" style={{ borderColor: 'var(--p-border)' }}>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm mb-4 transition-colors group" style={{ color: 'var(--p-text-dim)' }}>
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2" style={{ color: 'var(--p-text-lo)' }}>
          <PrismMeridian size={14} style={{ color: '#10b981' }} /> Company roadmap
        </p>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>
            The <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Meridian</span>
          </h1>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--p-text-lo)' }}>Milestones</p>
              <p className="text-2xl font-light font-mono" style={{ color: '#10b981' }}>{stats.total}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--p-text-lo)' }}>On track</p>
              <p className="text-2xl font-light font-mono" style={{ color: '#10b981' }}>{stats.onTrack}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--p-text-lo)' }}>At risk</p>
              <p className="text-2xl font-light font-mono" style={{ color: stats.atRisk > 0 ? '#f59e0b' : 'var(--p-text-ghost)' }}>{stats.atRisk}</p>
            </div>
            {/* Completion ring */}
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--p-border)" strokeWidth="2" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="2"
                  strokeDasharray={`${stats.completion * 0.94} 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono" style={{ color: '#10b981' }}>{stats.completion}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Auto-generated narrative */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="text-xs font-light mb-8 max-w-2xl" style={{ color: 'var(--p-text-dim)' }}>
        {(() => {
          const onTrack = milestones.filter(m => m.status === 'in_progress' || m.status === 'completed').length;
          const atRisk = milestones.filter(m => m.status === 'at_risk');
          const depts = [...new Set(milestones.map(m => m.departmentId))];
          const leadDept = depts.reduce((best, d) => {
            const deptAvg = milestones.filter(m => m.departmentId === d).reduce((s, m) => s + m.progress, 0) / Math.max(milestones.filter(m => m.departmentId === d).length, 1);
            const bestAvg = milestones.filter(m => m.departmentId === best).reduce((s, m) => s + m.progress, 0) / Math.max(milestones.filter(m => m.departmentId === best).length, 1);
            return deptAvg > bestAvg ? d : best;
          }, depts[0] || '');
          return `${onTrack} of ${milestones.length} milestones on track. ${leadDept.replace('-', ' ')} is leading.${atRisk.length > 0 ? ` ${atRisk.length} ${atRisk.length === 1 ? 'milestone' : 'milestones'} at risk.` : ''}`;
        })()}
      </motion.p>

      {/* View mode toggle */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex gap-2">
          {([
            { id: 'signal-path' as ViewMode, icon: PrismMeridian, label: 'Signal Path' },
            { id: 'cascade' as ViewMode, icon: PrismCascade, label: 'Cascade' },
            { id: 'kanban' as ViewMode, icon: PrismKanban, label: 'Kanban' },
          ]).map(v => (
            <button key={v.id} onClick={() => setViewMode(v.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all"
              style={{
                background: viewMode === v.id ? 'rgba(56,189,248,0.08)' : 'var(--p-bg-card)',
                border: `1px solid ${viewMode === v.id ? 'rgba(56,189,248,0.25)' : 'var(--p-border)'}`,
                color: viewMode === v.id ? '#38bdf8' : 'var(--p-text-dim)',
              }}>
              <v.icon size={13} /> {v.label}
            </button>
          ))}
        </div>

        {/* Department filter */}
        <div className="flex items-center gap-2">
          <PrismFilter size={12} style={{ color: 'var(--p-text-ghost)' }} />
          <div className="flex gap-1">
            <button onClick={() => setFilterDept(null)}
              className="px-3 py-1 rounded-lg text-[10px] font-mono uppercase transition-all"
              style={{
                background: !filterDept ? 'rgba(56,189,248,0.08)' : 'transparent',
                color: !filterDept ? '#38bdf8' : 'var(--p-text-ghost)',
              }}>All</button>
            {departments.map(d => (
              <button key={d} onClick={() => setFilterDept(d)}
                className="px-3 py-1 rounded-lg text-[10px] font-mono uppercase transition-all"
                style={{
                  background: filterDept === d ? 'rgba(56,189,248,0.08)' : 'transparent',
                  color: filterDept === d ? '#38bdf8' : 'var(--p-text-ghost)',
                }}>{d.replace('-', ' ')}</button>
            ))}
          </div>
        </div>
      </div>

      {/* View content */}
      <AnimatePresence mode="wait">
        {/* Signal Path View */}
        {viewMode === 'signal-path' && (
          <motion.div key="signal-path" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}>
            <SignalPathView milestones={filtered} expandedId={expandedMilestone} onToggle={setExpandedMilestone} navigate={navigate} />
          </motion.div>
        )}

        {/* Cascade View */}
        {viewMode === 'cascade' && (
          <motion.div key="cascade" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}>
            <CascadeView milestones={filtered} expandedId={expandedMilestone} onToggle={setExpandedMilestone} />
          </motion.div>
        )}

        {/* Kanban View */}
        {viewMode === 'kanban' && (
          <motion.div key="kanban" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}>
            <KanbanView milestones={filtered} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Risks panel */}
      {roadmap.risks.length > 0 && (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-12 rounded-[2rem] p-6 md:p-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
          <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-3 border-b pb-4"
            style={{ color: 'var(--p-text-ghost)', borderColor: 'var(--p-border)' }}>
            <PrismRisk size={11} style={{ color: '#f59e0b' }} /> Identified risks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {roadmap.risks.map(r => (
              <div key={r.id} className="rounded-xl p-4" style={{
                background: r.severity === 'high' ? 'rgba(244,63,94,0.04)' : 'rgba(245,158,11,0.04)',
                border: `1px solid ${r.severity === 'high' ? 'rgba(244,63,94,0.12)' : 'rgba(245,158,11,0.12)'}`,
              }}>
                <p className="text-sm font-light mb-1" style={{ color: 'var(--p-text-hi)' }}>{r.title}</p>
                <p className="text-xs" style={{ color: 'var(--p-text-dim)' }}>{r.mitigation}</p>
                <span className="text-[10px] font-mono uppercase mt-2 inline-block px-2 py-0.5 rounded"
                  style={{
                    color: r.severity === 'high' ? '#f43f5e' : '#f59e0b',
                    background: r.severity === 'high' ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)',
                  }}>{r.severity}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ═══ SIGNAL PATH VIEW — SVG Timeline ═══ */
function SignalPathView({ milestones, expandedId, onToggle, navigate }: any) {
  const sorted = [...milestones].sort((a: any, b: any) => a.targetDate.localeCompare(b.targetDate));
  if (sorted.length === 0) return <p className="text-sm p-text-ghost text-center py-12">No milestones match the filter.</p>;

  const startDate = new Date(sorted[0].startDate || sorted[0].targetDate);
  const endDate = new Date(sorted[sorted.length - 1].targetDate);
  const totalDays = Math.max((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24), 1);
  const todayPct = ((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
  const showToday = todayPct > 0 && todayPct < 100;
  const clampedTodayPct = Math.min(Math.max(todayPct, 0), 100);

  // Group milestones by department for swim lanes
  const departments = [...new Set(sorted.map((m: any) => m.departmentId))];
  const laneH = 60;
  const headerH = 50;
  const svgW = 900;
  const svgH = headerH + departments.length * laneH + 40;

  // Assign each milestone a y position based on its department lane
  const getMilestoneY = (m: any) => {
    const laneIdx = departments.indexOf(m.departmentId);
    return headerH + laneIdx * laneH + laneH / 2;
  };

  return (
    <div className="rounded-[2rem] p-6 md:p-8 overflow-x-auto" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)', scrollbarWidth: 'none' }}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ minWidth: 600 }}>
        {/* Time axis */}
        <line x1="100" y1="30" x2={svgW - 20} y2="30" stroke="var(--p-border)" strokeWidth="0.5" />

        {/* Today marker */}
        {showToday && <>
        <line x1={100 + clampedTodayPct * (svgW - 120) / 100} y1="20" x2={100 + clampedTodayPct * (svgW - 120) / 100} y2={svgH - 10}
          stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
        <text x={100 + clampedTodayPct * (svgW - 120) / 100} y="14" fill="#38bdf8" fontSize="10" fontFamily="Space Mono, monospace" textAnchor="middle">TODAY</text>
        </>}

        {/* Department swim lanes — ambient horizontal bands */}
        {departments.map((dept: string, i: number) => {
          const y = headerH + i * laneH;
          return (
            <g key={dept}>
              {/* Lane background — alternating subtle opacity */}
              <rect x="0" y={y} width={svgW} height={laneH} fill="var(--p-bg-card)" opacity={i % 2 === 0 ? 0.3 : 0.15} rx="4" />
              {/* Department label */}
              <text x="10" y={y + laneH / 2 + 3} fill="var(--p-text-ghost)" fontSize="10" fontFamily="Space Mono, monospace" transform="uppercase" letterSpacing="0.1em">
                {dept.replace('-', ' ').slice(0, 12)}
              </text>
              {/* Lane separator */}
              {i < departments.length - 1 && (
                <line x1="100" y1={y + laneH} x2={svgW - 20} y2={y + laneH} stroke="var(--p-border)" strokeWidth="0.3" opacity="0.3" />
              )}
            </g>
          );
        })}

        {/* Milestone nodes — pop in sequentially after time axis draws */}
        {sorted.map((m: any, mIdx: number) => {
          const mDate = new Date(m.targetDate);
          const pct = ((mDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays;
          const x = 100 + pct * (svgW - 120);
          const y = getMilestoneY(m);
          const cfg = (statusConfig as any)[m.status] || statusConfig.not_started;

          return (
            <motion.g key={m.id} style={{ cursor: 'pointer' }} onClick={() => onToggle(expandedId === m.id ? null : m.id)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + mIdx * 0.1, duration: 0.5 }}>
              {/* Ambient glow */}
              <circle cx={x} cy={y} r="16" fill={cfg.color} opacity="0.05" />
              {/* Node — scales in */}
              <motion.circle cx={x} cy={y} fill={cfg.color} opacity="0.9"
                initial={{ r: 0 }} animate={{ r: 6 }}
                transition={{ delay: 0.4 + mIdx * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
              {/* Progress ring — draws itself */}
              <motion.circle cx={x} cy={y} r="10" fill="none" stroke={cfg.color} strokeWidth="1.5" opacity="0.3"
                strokeDasharray={`${m.progress * 0.628} 100`} transform={`rotate(-90 ${x} ${y})`}
                initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 0 }}
                transition={{ delay: 0.5 + mIdx * 0.1, duration: 0.8 }} />
              {/* Label below node */}
              <text x={x} y={y + 20} fill="var(--p-text-mid)" fontSize="10" fontFamily="Outfit, sans-serif" textAnchor="middle" fontWeight="300">
                {m.title.length > 18 ? m.title.slice(0, 16) + '…' : m.title}
              </text>
              {/* Date */}
              <text x={x} y={y - 16} fill="var(--p-text-ghost)" fontSize="10" fontFamily="Space Mono, monospace" textAnchor="middle">
                {mDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </text>
            </motion.g>
          );
        })}

        {/* Dependency threads — Bézier curves that draw themselves */}
        {sorted.map((m: any, mIdx: number) => {
          if (!m.dependencies?.length) return null;
          return m.dependencies.map((depId: string) => {
            const dep = sorted.find((s: any) => s.id === depId);
            if (!dep) return null;
            const fromDate = new Date(dep.targetDate);
            const toDate = new Date(m.targetDate);
            const fromPct = ((fromDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays;
            const toPct = ((toDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays;
            const x1 = 100 + fromPct * (svgW - 120);
            const x2 = 100 + toPct * (svgW - 120);
            const y1 = getMilestoneY(dep);
            const y2 = getMilestoneY(m);
            const cx = (x1 + x2) / 2;
            return (
              <motion.path key={`${dep.id}-${m.id}`}
                d={`M ${x1 + 6} ${y1} Q ${cx} ${Math.min(y1, y2) - 20} ${x2 - 6} ${y2}`}
                fill="none" stroke="var(--p-text-ghost)" strokeWidth="0.8" opacity="0.3"
                strokeDasharray="200"
                initial={{ strokeDashoffset: 200 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.2, delay: 0.5 + mIdx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          });
        })}
      </svg>

      {/* Expanded milestone detail */}
      <AnimatePresence>
        {expandedId && (() => {
          const m = milestones.find((ms: any) => ms.id === expandedId);
          if (!m) return null;
          const cfg = (statusConfig as any)[m.status] || statusConfig.not_started;
          return (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-xl p-5" style={{ background: `${cfg.color}06`, border: `1px solid ${cfg.color}12` }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--p-text-hi)' }}>{m.title}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--p-text-dim)' }}>{m.description}</p>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded" style={{ color: cfg.color, background: `${cfg.color}12` }}>{cfg.label}</span>
              </div>
              {m.okrs?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {m.okrs.map((okr: any) => (
                    <div key={okr.id} className="flex items-center gap-3">
                      <PrismTarget size={10} style={{ color: cfg.color }} />
                      <span className="text-xs flex-1" style={{ color: 'var(--p-text-mid)' }}>{okr.title}</span>
                      <span className="font-mono text-xs" style={{ color: cfg.color }}>{okr.current}/{okr.target} {okr.unit}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

/* ═══ CASCADE VIEW — Vertical tree ═══ */
function CascadeView({ milestones, expandedId, onToggle }: any) {
  const sorted = [...milestones].sort((a: any, b: any) => a.targetDate.localeCompare(b.targetDate));
  return (
    <div className="space-y-3">
      {sorted.map((m: any, i: number) => {
        const cfg = (statusConfig as any)[m.status] || statusConfig.not_started;
        const Icon = cfg.icon;
        const isExpanded = expandedId === m.id;
        return (
          <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="rounded-[2rem] p-6 transition-all hover:scale-[1.002]"
              style={{ background: 'var(--p-bg-card)', border: `1px solid ${isExpanded ? cfg.color + '25' : 'var(--p-border)'}`, cursor: 'pointer' }}
              onClick={() => onToggle(isExpanded ? null : m.id)}>
              <div className="flex items-center gap-4">
                <Icon size={16} style={{ color: cfg.color }} />
                <div className="flex-1">
                  <p className="text-sm font-light" style={{ color: 'var(--p-text-hi)' }}>{m.title}</p>
                  <p className="text-xs" style={{ color: 'var(--p-text-dim)' }}>{m.departmentId.replace('-', ' ')} · Due {new Date(m.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs" style={{ color: cfg.color }}>{m.progress}%</span>
                  <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--p-border)' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${m.progress}%`, background: cfg.color }} />
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--p-text-ghost)', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
                </div>
              </div>
              <AnimatePresence>
                {isExpanded && m.okrs?.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-4 ml-8 space-y-2 border-l pl-4" style={{ borderColor: `${cfg.color}20` }}>
                    {m.okrs.map((okr: any) => (
                      <div key={okr.id} className="text-xs flex items-center gap-2" style={{ color: 'var(--p-text-mid)' }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                        {okr.title} — <span className="font-mono" style={{ color: cfg.color }}>{okr.current}/{okr.target}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ═══ KANBAN VIEW — Four columns ═══ */
function KanbanView({ milestones }: any) {
  const columns: { status: string; label: string; color: string }[] = [
    { status: 'not_started', label: 'Not Started', color: 'var(--p-text-ghost)' },
    { status: 'in_progress', label: 'In Progress', color: '#10b981' },
    { status: 'at_risk', label: 'At Risk', color: '#f59e0b' },
    { status: 'completed', label: 'Completed', color: '#38bdf8' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {columns.map(col => {
        const items = milestones.filter((m: any) => m.status === col.status);
        return (
          <div key={col.status}>
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-4 flex items-center gap-2"
              style={{ color: col.color }}>
              <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
              {col.label} <span style={{ color: 'var(--p-text-ghost)' }}>({items.length})</span>
            </p>
            <div className="space-y-3 min-h-[200px]">
              {items.map((m: any, i: number) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl p-4 transition-all hover:scale-[1.01]"
                  style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
                  <p className="text-sm font-light mb-1" style={{ color: 'var(--p-text-hi)' }}>{m.title}</p>
                  <p className="text-[10px] font-mono" style={{ color: 'var(--p-text-ghost)' }}>
                    {m.departmentId.replace('-', ' ')} · {new Date(m.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  {m.progress > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--p-border)' }}>
                        <div className="h-full rounded-full" style={{ width: `${m.progress}%`, background: col.color }} />
                      </div>
                      <span className="text-[10px] font-mono" style={{ color: col.color }}>{m.progress}%</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
