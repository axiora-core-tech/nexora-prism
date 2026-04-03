/**
 * Checkpoint — Approval Queue + Negotiations
 * "Verified before moving forward"
 *
 * Card grid with focus-dim disclosure model.
 * All actions visible by default. On hover: focused card full opacity, others dim.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, X, ChevronRight } from 'lucide-react';
import { PrismShield, PrismDiscuss, PrismTime, PrismRisk, PrismSpark, PrismPerson } from './ui/PrismIcons';
import { useNavigate, Navigate } from 'react-router';
import { pendingApprovals } from '../mockData';
import { EmptyState } from './ui/EmptyState';
import { useLuminary } from './Layout';
import { useRoleAccess } from '../auth/useRoleAccess';

const typeLabels: Record<string, { label: string; color: string }> = {
  task_assignment: { label: 'Task Assignment', color: '#10b981' },
  deadline_extension: { label: 'Deadline Extension', color: '#f59e0b' },
  scope_change: { label: 'Scope Change', color: '#c084fc' },
  reassignment: { label: 'Reassignment', color: '#38bdf8' },
};

const priorityConfig: Record<string, { color: string }> = {
  critical: { color: '#f43f5e' },
  high: { color: '#f59e0b' },
  medium: { color: '#38bdf8' },
  low: { color: 'var(--p-text-ghost)' },
};

export function Checkpoint() {
  const navigate = useNavigate();
  const { open: openLuminary } = useLuminary();
  const { canAccessCheckpoint } = useRoleAccess();
  const [approvals, setApprovals] = useState(pendingApprovals);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!filter) return approvals;
    return approvals.filter(a => a.type === filter);
  }, [approvals, filter]);

  const pending = approvals.filter(a => a.status === 'pending').length;

  const handleApprove = useCallback((id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' as const } : a));
  }, []);

  const handleReject = useCallback((id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const } : a));
  }, []);

  const toggleSelect = useCallback((id: string, e: React.MouseEvent) => {
    if (e.shiftKey) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }
  }, []);

  const bulkApprove = useCallback(() => {
    setApprovals(prev => prev.map(a => selectedIds.has(a.id) ? { ...a, status: 'approved' as const } : a));
    setSelectedIds(new Set());
  }, [selectedIds]);

  // Role gate: Manager+ only (after all hooks)
  if (!canAccessCheckpoint) {
    return <Navigate to="/app" replace />;
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
          <PrismShield size={14} style={{ color: '#f59e0b' }} /> Approval queue
        </p>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>
            Signal <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Checkpoint</span>
          </h1>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--p-text-lo)' }}>Pending</p>
              <p className="text-2xl font-light font-mono" style={{ color: pending > 0 ? '#f59e0b' : '#10b981' }}>{pending}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ APPROVAL CONSTELLATION — radial burst visualization ═══ */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center mb-12">
        <svg viewBox="0 0 320 320" width="280" height="280" className="overflow-visible">
          {/* Center pulse */}
          <motion.circle cx="160" cy="160" r="8" fill="#f59e0b" opacity="0.15"
            animate={{ r: [8, 14, 8], opacity: [0.15, 0.05, 0.15] }}
            transition={{ duration: 3, repeat: Infinity }} />
          <circle cx="160" cy="160" r="3" fill="#f59e0b" opacity="0.6" />

          {/* Orbital rings */}
          <circle cx="160" cy="160" r="50" fill="none" stroke="var(--p-border)" strokeWidth="0.5" opacity="0.3" />
          <circle cx="160" cy="160" r="100" fill="none" stroke="var(--p-border)" strokeWidth="0.3" opacity="0.2" />
          <circle cx="160" cy="160" r="140" fill="none" stroke="var(--p-border)" strokeWidth="0.3" opacity="0.1" />

          {/* Approval nodes — positioned radially by priority */}
          {approvals.filter(a => a.status === 'pending').map((a, i, arr) => {
            const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
            const radius = a.priority === 'high' ? 50 : a.priority === 'medium' ? 100 : 140;
            const x = 160 + Math.cos(angle) * radius;
            const y = 160 + Math.sin(angle) * radius;
            const color = a.priority === 'high' ? '#f43f5e' : a.priority === 'medium' ? '#f59e0b' : '#38bdf8';
            const nodeR = a.priority === 'high' ? 8 : 6;
            return (
              <g key={a.id} style={{ cursor: 'pointer' }} onClick={() => setHoveredId(hoveredId === a.id ? null : a.id)}>
                {/* Connection line to center */}
                <line x1="160" y1="160" x2={x} y2={y} stroke={color} strokeWidth="0.5" opacity="0.15" />
                {/* Glow */}
                <circle cx={x} cy={y} r={nodeR + 6} fill={color} opacity="0.04" />
                {/* Node */}
                <motion.circle cx={x} cy={y} r={nodeR} fill={color} opacity="0.7"
                  animate={hoveredId === a.id ? { r: [nodeR, nodeR + 3, nodeR] } : {}}
                  transition={{ duration: 1, repeat: Infinity }} />
                {/* Label */}
                <text x={x} y={y + nodeR + 14} fill="var(--p-text-ghost)" fontSize="9" fontFamily="Space Mono, monospace" textAnchor="middle">
                  {a.title.length > 18 ? a.title.slice(0, 16) + '…' : a.title}
                </text>
              </g>
            );
          })}

          {/* Approved items — collapsed to center with green trail */}
          {approvals.filter(a => a.status === 'approved').map((a, i) => {
            const angle = (i * 1.2) + 0.5;
            const x = 160 + Math.cos(angle) * 20;
            const y = 160 + Math.sin(angle) * 20;
            return <circle key={a.id} cx={x} cy={y} r="3" fill="#10b981" opacity="0.4" />;
          })}

          {/* Legend */}
          <circle cx="20" cy="290" r="4" fill="#f43f5e" opacity="0.7" />
          <text x="30" y="293" fill="var(--p-text-ghost)" fontSize="9" fontFamily="Space Mono, monospace">High</text>
          <circle cx="70" cy="290" r="4" fill="#f59e0b" opacity="0.7" />
          <text x="80" y="293" fill="var(--p-text-ghost)" fontSize="9" fontFamily="Space Mono, monospace">Medium</text>
          <circle cx="130" cy="290" r="4" fill="#38bdf8" opacity="0.7" />
          <text x="140" y="293" fill="var(--p-text-ghost)" fontSize="9" fontFamily="Space Mono, monospace">Low</text>
          <circle cx="185" cy="290" r="3" fill="#10b981" opacity="0.4" />
          <text x="195" y="293" fill="var(--p-text-ghost)" fontSize="9" fontFamily="Space Mono, monospace">Approved</text>
        </svg>
      </motion.div>

      {/* Data narrative */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="text-center text-xs font-light mb-10" style={{ color: 'var(--p-text-dim)' }}>
        {(() => {
          const high = approvals.filter(a => a.status === 'pending' && a.priority === 'high').length;
          const oldest = approvals.filter(a => a.status === 'pending').sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
          const daysOld = oldest ? Math.floor((Date.now() - new Date(oldest.createdAt).getTime()) / 86400000) : 0;
          return `${high} high-priority ${high === 1 ? 'approval requires' : 'approvals require'} attention. ${daysOld > 2 ? `Oldest has been waiting ${daysOld} days.` : 'All recent.'}`;
        })()}
      </motion.p>

      {/* Filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <button onClick={() => setFilter(null)}
          className="px-4 py-2 rounded-xl text-[11px] font-mono uppercase tracking-widest transition-all"
          style={{ background: !filter ? 'rgba(56,189,248,0.08)' : 'var(--p-bg-card)', border: `1px solid ${!filter ? 'rgba(56,189,248,0.25)' : 'var(--p-border)'}`, color: !filter ? '#38bdf8' : 'var(--p-text-dim)' }}>
          All ({approvals.length})
        </button>
        {Object.entries(typeLabels).map(([key, cfg]) => {
          const count = approvals.filter(a => a.type === key).length;
          if (count === 0) return null;
          return (
            <button key={key} onClick={() => setFilter(key)}
              className="px-4 py-2 rounded-xl text-[11px] font-mono uppercase tracking-widest transition-all"
              style={{ background: filter === key ? `${cfg.color}12` : 'var(--p-bg-card)', border: `1px solid ${filter === key ? cfg.color + '25' : 'var(--p-border)'}`, color: filter === key ? cfg.color : 'var(--p-text-dim)' }}>
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Card grid — focus-dim model */}
      {filtered.filter(a => a.status === 'pending').length === 0 ? (
        <EmptyState variant="checkpoint" />
      ) : (
        <>
        <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--p-text-lo)' }}>
          Hold <span className="px-1.5 py-0.5 rounded" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>Shift</span> + click to select multiple
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.filter(a => a.status === 'pending').map((approval, i) => {
            const typeCfg = typeLabels[approval.type] || { label: approval.type, color: '#94a3b8' };
            const priCfg = priorityConfig[approval.priority] || priorityConfig.medium;
            const isHovered = hoveredId === approval.id;
            const isSelected = selectedIds.has(approval.id);

            return (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredId(approval.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => toggleSelect(approval.id, e)}
                className="rounded-[2rem] p-6 relative overflow-hidden transition-all duration-300"
                style={{
                  background: 'var(--p-bg-card)',
                  border: `1px solid ${isSelected ? '#38bdf8' + '40' : 'var(--p-border)'}`,
                  opacity: hoveredId && !isHovered ? 0.4 : 1,
                  transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                  outline: isSelected ? '2px solid rgba(56,189,248,0.3)' : 'none',
                  outlineOffset: '2px',
                }}
              >
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] pointer-events-none"
                  style={{ background: `${typeCfg.color}06` }} />

                {/* Priority accent bar — left edge */}
                <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full"
                  style={{ background: priCfg.color, opacity: approval.priority === 'high' ? 0.7 : 0.3 }} />

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 rounded"
                      style={{ background: `${typeCfg.color}12`, color: typeCfg.color }}>{typeCfg.label}</span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 rounded"
                      style={{ background: `${priCfg.color}12`, color: priCfg.color }}>{approval.priority}</span>
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--p-text-ghost)' }}>
                    {new Date(approval.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Title + employee */}
                <p className="text-sm font-light mb-1" style={{ color: 'var(--p-text-hi)' }}>{approval.title}</p>
                <div className="flex items-center gap-2 mb-3">
                  <PrismPerson size={10} style={{ color: 'var(--p-text-ghost)' }} />
                  <span className="text-xs" style={{ color: 'var(--p-text-mid)' }}>{approval.employeeName} · {approval.department}</span>
                </div>

                {/* Milestone reference */}
                <p className="text-[10px] font-mono flex items-center gap-1 mb-4" style={{ color: 'var(--p-text-ghost)' }}>
                  <PrismTime size={9} /> Milestone: {approval.milestoneTitle}
                </p>

                {/* Bot recommendation */}
                <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.08)' }}>
                  <div className="flex items-start gap-2">
                    <PrismSpark size={10} className="flex-shrink-0 mt-0.5" style={{ color: '#38bdf8' }} />
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--p-text-mid)' }}>{approval.botRecommendation}</p>
                  </div>
                </div>

                {/* Action buttons — always visible (focus-dim model) */}
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleApprove(approval.id); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>
                    <Check size={12} /> Approve
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleReject(approval.id); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)', color: '#f43f5e' }}>
                    <X size={12} /> Reject
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); openLuminary(); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{ background: 'var(--p-bg-card-2)', border: '1px solid var(--p-border)', color: 'var(--p-text-dim)' }}>
                    <PrismDiscuss size={12} /> Discuss
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
        </>
      )}

      {/* Multi-select floating pill */}
      <AnimatePresence>
        {selectedIds.size > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-6 py-3 rounded-full"
            style={{ background: 'var(--p-bg-surface)', border: '1px solid var(--p-border)', backdropFilter: 'blur(20px)' }}
          >
            <span className="text-xs font-mono" style={{ color: 'var(--p-text-mid)' }}>{selectedIds.size} selected</span>
            <button onClick={bulkApprove} className="text-xs font-mono px-3 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>Approve all</button>
            <button onClick={() => setSelectedIds(new Set())} className="text-xs font-mono px-3 py-1 rounded-lg" style={{ color: 'var(--p-text-ghost)' }}>Clear</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
