/**
 * THE SANCTUM — Jarvis-class Immersive Intelligence HUD
 * 
 * Volumetric light atmosphere, glassy draggable/expandable panels,
 * conversation-driven data visualization, Claude AI + smart mock engine,
 * VoiceInput for speech, browser TTS for avatar voice.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { useCompanyConfig } from '../stores/companyConfigStore';
import { useSanctumTasks } from '../stores/taskStore';
import { VoiceInput } from './ui/VoiceInput';

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════
type Expression = 'idle' | 'thinking' | 'speaking' | 'smiling';
type Msg = { role: 'prism' | 'user'; text: string };
type Task = { id: string; text: string; status: 'agreed' | 'pending' };
type PanelId = 'velocity' | 'sprint' | 'team' | 'milestones' | 'welfare' | 'revenue';

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=512&auto=format&fit=crop&crop=face';

// ═══════════════════════════════════════════════════════
// HUD DATA
// ═══════════════════════════════════════════════════════
const HUD = {
  velocity: { value: 92, delta: 8, trend: [72, 78, 85, 88, 92], details: [{ label: 'Code reviews', value: '18h avg' }, { label: 'PR merge', value: '94%' }, { label: 'Deploy freq', value: '3.2/wk' }] },
  sprint: { done: 14, total: 18, velocity: '112%', daysLeft: 4, tasks: [{ name: 'API cache layer', pts: 5, done: true }, { name: 'Auth proxy', pts: 8, done: true }, { name: 'Load testing', pts: 5, done: false }, { name: 'CDN setup', pts: 3, done: false }] },
  team: [
    { name: 'Arjun S.', score: 92, risk: false, role: 'Sr. Frontend' },
    { name: 'Priya M.', score: 85, risk: false, role: 'Backend Lead' },
    { name: 'Ravi K.', score: 68, risk: true, role: 'Full Stack' },
    { name: 'Neha G.', score: 78, risk: false, role: 'Design Eng' },
  ],
  milestones: [
    { name: 'API Gateway', pct: 85, color: '#38bdf8' },
    { name: 'Auth System', pct: 60, color: '#c084fc' },
    { name: 'User Research', pct: 40, color: '#10b981' },
    { name: 'CDN Config', pct: 15, color: '#f59e0b' },
  ],
  welfare: { value: 91, delta: 5, trend: [78, 82, 86, 89, 91], details: [{ label: 'Work-life', value: '9.1/10' }, { label: 'Stress', value: 'Low' }, { label: 'PTO used', value: '8/15d' }] },
  revenue: { projected: 2.3, target: 3.2, gap: 0.18 },
};

// ═══════════════════════════════════════════════════════
// SMART REPLY ENGINE
// ═══════════════════════════════════════════════════════
function smartReply(text: string, count: number): string {
  const u = text.toLowerCase();
  if (u.match(/block|stuck|issue|problem|bug/)) return `I see — that's a blocker. I'll flag it for the next Checkpoint review. The CDN configuration task is unblocked if you need to context-switch. Shall I reassign the blocked work?`;
  if (u.match(/done|finished|completed|shipped|merged/)) return `Excellent. Sprint velocity is at ${HUD.sprint.velocity} — well above target. ${HUD.sprint.daysLeft} days out with ${HUD.sprint.total - HUD.sprint.done} tasks remaining. Want me to pull the next priority from backlog?`;
  if (u.match(/help|support|struggle|overwhelm/)) return `You're at 78% capacity with 3 active tasks. Ravi is at 52% — I can redistribute the documentation task. Shall I draft that reassignment?`;
  if (u.match(/meeting|1:1|standup|calendar/)) return `You have 2 meetings today: standup at 10am and 1:1 with Priya at 2pm. I'd suggest discussing the auth proxy completion. Want me to prepare talking points?`;
  if (u.match(/performance|score|review|feedback|dimension/)) return `Six-dimension score is 87/100, up 4 from last quarter. Velocity at ${HUD.velocity.value}, welfare at ${HUD.welfare.value}. Knowledge sharing at 72 is the growth edge. Shall I set a weekly docs session?`;
  if (u.match(/team|priya|arjun|ravi|neha|people/)) return `Team pulse: Arjun at ${HUD.team[0].score} (leading), Priya at ${HUD.team[1].score}, Neha at ${HUD.team[3].score}. Ravi flagged at ${HUD.team[2].score} — welfare dropped 12 points. Want me to schedule a check-in?`;
  if (u.match(/roadmap|milestone|meridian|timeline/)) return `${HUD.milestones.filter(m => m.pct >= 50).length} of ${HUD.milestones.length} milestones past halfway. API Gateway at ${HUD.milestones[0].pct}% (ahead). User Research at ${HUD.milestones[2].pct}% — risk. Shall I flag the delay?`;
  if (u.match(/revenue|money|budget|cost|forecast/)) return `Revenue signal: $${HUD.revenue.projected}M projected against $${HUD.revenue.target}M target. Gap of $${HUD.revenue.gap}M tied to Growth team's content roadmap. Engineering costs on track.`;
  if (u.match(/sprint|task|velocity|progress|backlog/)) return `Sprint: ${HUD.sprint.done}/${HUD.sprint.total} tasks done, ${HUD.sprint.daysLeft} days left. Velocity at ${HUD.sprint.velocity}. Execution velocity: ${HUD.velocity.value}/100, up ${HUD.velocity.delta}. Want me to break down remaining tasks?`;
  if (u.match(/welfare|wellbeing|stress|burnout|health/)) return `Welfare score is ${HUD.welfare.value}/100, up ${HUD.welfare.delta}. Work-life balance at 9.1/10, stress level low. PTO: 8 of 15 days used. Overall in a healthy zone.`;
  if (u.match(/yes|sure|go ahead|do it|please|approve|agree|okay/)) return `Done. I've created that as an action item. You'll see it in Tasks. Anything else?`;
  if (u.match(/no|not now|later|skip|next/)) return `Understood. ${HUD.sprint.total - HUD.sprint.done} tasks remaining with ${HUD.sprint.daysLeft} days left. What would you like to focus on?`;
  if (u.match(/thank|thanks|great|awesome/)) return `You're welcome. Your trajectory is strong — consistent upward momentum across all dimensions.`;
  const fb = [
    `Noted. You're at ${HUD.sprint.velocity} velocity with ${HUD.sprint.done}/${HUD.sprint.total} tasks done. Shall I break the next priority into sub-tasks?`,
    `Your execution velocity is ${HUD.velocity.value}/100, up ${HUD.velocity.delta}. The auth proxy milestone is complete — want me to mark it and notify the team?`,
    `The Meridian shows your team 2 weeks ahead on API gateway. That creates space for this. Shall I create a task for it?`,
  ];
  return fb[count % fb.length];
}

function detectPanels(text: string): PanelId[] {
  const u = text.toLowerCase();
  const panels: PanelId[] = [];
  if (u.match(/velocity|execution|speed|pace/)) panels.push('velocity');
  if (u.match(/sprint|task|backlog|progress/)) panels.push('sprint');
  if (u.match(/team|arjun|priya|ravi|neha|people|member/)) panels.push('team');
  if (u.match(/milestone|roadmap|meridian|timeline|gateway|auth/)) panels.push('milestones');
  if (u.match(/welfare|wellbeing|stress|burnout|health/)) panels.push('welfare');
  if (u.match(/revenue|money|budget|cost|forecast|financial/)) panels.push('revenue');
  if (u.match(/performance|score|review|feedback|dimension|overall/)) { panels.push('velocity'); panels.push('welfare'); }
  return panels;
}

// ═══════════════════════════════════════════════════════
// GLASS CARD WRAPPER
// ═══════════════════════════════════════════════════════
function GlassCard({ children, width, color, dragging, hover }: { children: React.ReactNode; width: number; color: string; dragging: boolean; hover: boolean }) {
  return (
    <div className="rounded-2xl relative overflow-hidden" style={{
      width, transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
      background: `linear-gradient(135deg, rgba(255,255,255,${dragging ? 0.07 : hover ? 0.05 : 0.03}), rgba(255,255,255,${dragging ? 0.03 : 0.01}))`,
      backdropFilter: 'blur(24px) saturate(1.4)', WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
      border: `1px solid rgba(255,255,255,${dragging ? 0.14 : hover ? 0.1 : 0.06})`,
      boxShadow: dragging ? `0 25px 70px rgba(0,0,0,0.5), 0 0 40px ${color}12, inset 0 1px 1px rgba(255,255,255,0.08)` : hover ? `0 12px 40px rgba(0,0,0,0.35), 0 0 20px ${color}08, inset 0 1px 1px rgba(255,255,255,0.06)` : `0 4px 20px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.04)`,
    }}>
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)', transform: 'rotate(-15deg)' }} />
      </div>
      <div className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, rgba(56,189,248,0.2), rgba(192,132,252,0.15), rgba(16,185,129,0.1), transparent)` }} />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] rounded-b-2xl" style={{ background: `linear-gradient(90deg, transparent, ${color}15, transparent)` }} />
      <div className="absolute top-2 bottom-2 left-0 w-[2px] rounded-full" style={{ background: `linear-gradient(to bottom, transparent, ${color}30, transparent)`, boxShadow: `0 0 8px ${color}15` }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PANEL CONTENT RENDERERS
// ═══════════════════════════════════════════════════════
function VelocityPanel({ expanded }: { expanded: boolean }) {
  const d = HUD.velocity;
  return (
    <div className="p-4">
      <div className="text-[8px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: '#38bdf880' }}>Velocity</div>
      <div className="flex items-end gap-1.5 mb-3">
        <span className={`font-mono font-extralight leading-none ${expanded ? 'text-3xl' : 'text-2xl'}`} style={{ color: '#38bdf8' }}>{d.value}</span>
        <span className="text-[8px] font-mono mb-1" style={{ color: 'rgba(255,255,255,0.15)' }}>/100</span>
        <span className="text-[8px] font-mono mb-1 px-1.5 py-0.5 rounded-full" style={{ color: '#10b981', background: 'rgba(16,185,129,0.08)' }}>↑{d.delta}</span>
      </div>
      {expanded && <>
        <div className="flex gap-[3px] items-end h-8 mb-3">{d.trend.map((v, i) => (
          <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(v / Math.max(...d.trend)) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.05 }}
            className="flex-1 rounded-t-sm" style={{ background: `linear-gradient(180deg, #38bdf860, #38bdf815)` }} />
        ))}</div>
        {d.details.map((r, i) => (
          <div key={i} className="flex justify-between py-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
            <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{r.label}</span>
            <span className="text-[9px] font-mono" style={{ color: '#38bdf8' }}>{r.value}</span>
          </div>
        ))}
      </>}
    </div>
  );
}

function SprintPanel({ expanded }: { expanded: boolean }) {
  const s = HUD.sprint, pct = Math.round(s.done / s.total * 100), r = expanded ? 32 : 28, circ = 2 * Math.PI * r, sz = expanded ? 80 : 72;
  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-2">
        <div className="relative flex-shrink-0">
          <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
            <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
            <motion.circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="#c084fc" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
              transition={{ duration: 1 }} transform={`rotate(-90 ${sz/2} ${sz/2})`} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center"><span className={`font-mono ${expanded ? 'text-lg' : 'text-sm'}`} style={{ color: '#c084fc' }}>{pct}%</span></div>
        </div>
        <div>
          <div className="text-[8px] font-mono uppercase tracking-[0.15em] mb-1" style={{ color: '#c084fc70' }}>Sprint</div>
          <div className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.done}/{s.total}</div>
          <div className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>{s.daysLeft}d · {s.velocity}</div>
        </div>
      </div>
      {expanded && s.tasks.map((t, i) => (
        <div key={i} className="flex items-center gap-2 py-1.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.done ? '#10b981' : 'rgba(255,255,255,0.15)' }} />
          <span className="text-[9px] flex-1" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.name}</span>
          <span className="text-[8px] font-mono" style={{ color: t.done ? '#10b981' : 'rgba(255,255,255,0.15)' }}>{t.pts}pt</span>
        </div>
      ))}
    </div>
  );
}

function TeamPanel({ expanded }: { expanded: boolean }) {
  return (
    <div className="p-3.5 space-y-1.5">
      <div className="text-[8px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: '#10b98170' }}>Team Health</div>
      {HUD.team.map((m, i) => expanded ? (
        <div key={i} className="rounded-lg p-2.5" style={{ background: `rgba(${m.risk ? '244,63,94' : '255,255,255'},0.02)`, border: `1px solid rgba(${m.risk ? '244,63,94' : '255,255,255'},0.04)` }}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.risk ? '#f43f5e' : '#10b981' }} />
            <span className="text-[10px] flex-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{m.name}</span>
            <span className="text-[10px] font-mono" style={{ color: m.risk ? '#f43f5e' : '#10b981' }}>{m.score}</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="h-full rounded-full" style={{ width: `${m.score}%`, background: m.risk ? '#f43f5e' : '#10b981' }} />
          </div>
          <div className="text-[8px] mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>{m.role} · {m.risk ? '⚠ At risk' : 'On track'}</div>
        </div>
      ) : (
        <div key={i} className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.risk ? '#f43f5e' : '#10b981' }} />
          <span className="text-[10px] flex-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{m.name}</span>
          <span className="text-[10px] font-mono" style={{ color: m.risk ? '#f43f5e' : '#10b981' }}>{m.score}</span>
        </div>
      ))}
    </div>
  );
}

function MilestonePanel({ expanded }: { expanded: boolean }) {
  const items = expanded ? [...HUD.milestones, { name: 'Analytics v2', pct: 70, color: '#f43f5e' }, { name: 'Mobile SDK', pct: 25, color: '#fb923c' }] : HUD.milestones;
  return (
    <div className="p-3.5 space-y-2.5">
      <div className="text-[8px] font-mono uppercase tracking-[0.2em] mb-1" style={{ color: '#f59e0b70' }}>Milestones</div>
      {items.map((m, i) => (
        <div key={i}>
          <div className="flex justify-between text-[8px] font-mono mb-1">
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>{m.name}</span><span style={{ color: m.color }}>{m.pct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 0.8, delay: i * 0.08 }}
              className="h-full rounded-full relative overflow-hidden" style={{ background: `linear-gradient(90deg, ${m.color}80, ${m.color})` }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25), transparent 60%)' }} />
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}

function WelfarePanel({ expanded }: { expanded: boolean }) {
  const d = HUD.welfare;
  return (
    <div className="p-4">
      <div className="text-[8px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: '#f43f5e80' }}>Welfare</div>
      <div className="flex items-end gap-1.5 mb-3">
        <span className={`font-mono font-extralight leading-none ${expanded ? 'text-3xl' : 'text-2xl'}`} style={{ color: '#f43f5e' }}>{d.value}</span>
        <span className="text-[8px] font-mono mb-1" style={{ color: 'rgba(255,255,255,0.15)' }}>/100</span>
        <span className="text-[8px] font-mono mb-1 px-1.5 py-0.5 rounded-full" style={{ color: '#10b981', background: 'rgba(16,185,129,0.08)' }}>↑{d.delta}</span>
      </div>
      {expanded && <>
        <div className="flex gap-[3px] items-end h-8 mb-3">{d.trend.map((v, i) => (
          <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(v / Math.max(...d.trend)) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.05 }}
            className="flex-1 rounded-t-sm" style={{ background: 'linear-gradient(180deg, #f43f5e60, #f43f5e15)' }} />
        ))}</div>
        {d.details.map((r, i) => (
          <div key={i} className="flex justify-between py-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
            <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{r.label}</span>
            <span className="text-[9px] font-mono" style={{ color: '#f43f5e' }}>{r.value}</span>
          </div>
        ))}
      </>}
    </div>
  );
}

function RevenuePanel() {
  return (
    <div className="p-3.5">
      <div className="text-[8px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: '#fb923c70' }}>Revenue Signal</div>
      {[{ label: 'Projected', val: `$${HUD.revenue.projected}M`, c: '#10b981' }, { label: 'Target', val: `$${HUD.revenue.target}M`, c: '#fb923c' }, { label: 'Gap Risk', val: `$${HUD.revenue.gap}M`, c: '#f43f5e' }].map((r, i) => (
        <div key={i} className="flex justify-between py-1.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
          <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{r.label}</span>
          <span className="text-[10px] font-mono" style={{ color: r.c }}>{r.val}</span>
        </div>
      ))}
    </div>
  );
}

// Panel config
const PANEL_CFG: Record<PanelId, { color: string; w: number; ew: number; side: 'left' | 'right' }> = {
  velocity:   { color: '#38bdf8', w: 150, ew: 240, side: 'left' },
  sprint:     { color: '#c084fc', w: 210, ew: 280, side: 'right' },
  team:       { color: '#10b981', w: 160, ew: 260, side: 'left' },
  milestones: { color: '#f59e0b', w: 180, ew: 260, side: 'right' },
  welfare:    { color: '#f43f5e', w: 155, ew: 220, side: 'left' },
  revenue:    { color: '#fb923c', w: 165, ew: 220, side: 'right' },
};

function PanelContent({ id, expanded }: { id: PanelId; expanded: boolean }) {
  switch (id) {
    case 'velocity': return <VelocityPanel expanded={expanded} />;
    case 'sprint': return <SprintPanel expanded={expanded} />;
    case 'team': return <TeamPanel expanded={expanded} />;
    case 'milestones': return <MilestonePanel expanded={expanded} />;
    case 'welfare': return <WelfarePanel expanded={expanded} />;
    case 'revenue': return <RevenuePanel />;
  }
}

// ═══════════════════════════════════════════════════════
// DRAGGABLE EXPANDABLE PANEL
// ═══════════════════════════════════════════════════════
function DPanel({ id, index, onDismiss }: { id: PanelId; index: number; onDismiss: (id: PanelId) => void }) {
  const cfg = PANEL_CFG[id];
  const [expanded, setExpanded] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });

  // Calculate initial position
  useEffect(() => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const x = cfg.side === 'left' ? 16 : vw - cfg.w - 20;
    const y = 60 + index * Math.min(90, (vh - 200) / 6);
    setPos({ x, y });
  }, [cfg.side, cfg.w, index]);

  const onDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-btn]')) return;
    e.preventDefault(); setDragging(true);
    if (!pos) return;
    dragStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    const onMove = (ev: PointerEvent) => setPos({ x: dragStart.current.px + (ev.clientX - dragStart.current.x), y: dragStart.current.py + (ev.clientY - dragStart.current.y) });
    const onUp = () => { setDragging(false); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
  }, [pos]);

  if (!pos) return null;
  const w = expanded ? cfg.ew : cfg.w;

  return (
    <motion.div
      initial={{ opacity: 0, x: cfg.side === 'left' ? -200 : 200 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: cfg.side === 'left' ? -200 : 200, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="absolute select-none"
      style={{
        left: pos.x, top: pos.y, zIndex: dragging ? 50 : expanded ? 40 : 10 + index,
        cursor: dragging ? 'grabbing' : 'grab',
        transform: dragging ? 'scale(1.04)' : hover ? 'scale(1.02)' : 'scale(1)',
        transition: dragging ? 'none' : 'transform 0.3s',
      }}
      onPointerDown={onDown}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <GlassCard width={w} color={cfg.color} dragging={dragging} hover={hover}>
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-20">
          <button data-btn onClick={() => setExpanded(v => !v)} className="w-5 h-5 rounded-md flex items-center justify-center hover:scale-110" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke={expanded ? 'rgba(255,255,255,0.5)' : `${cfg.color}60`} strokeWidth="1.5" strokeLinecap="round">
              {expanded ? <><line x1="3" y1="3" x2="9" y2="3" /><line x1="3" y1="3" x2="3" y2="9" /><line x1="3" y1="9" x2="9" y2="9" /><line x1="9" y1="9" x2="9" y2="3" /></> : <><path d="M2 1L6 1L6 5" /><path d="M6 7L6 11L10 11" /></>}
            </svg>
          </button>
          <button data-btn onClick={() => onDismiss(id)} className="w-5 h-5 rounded-md flex items-center justify-center hover:scale-110" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
            <svg width="7" height="7" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round">
              <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
            </svg>
          </button>
          <div className="grid grid-cols-2 gap-[3px] opacity-15 ml-0.5">{[0,1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white" />)}</div>
        </div>
        <PanelContent id={id} expanded={expanded} />
      </GlassCard>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export function SanctumPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { config } = useCompanyConfig();
  const { addTask: addSanctumTask } = useSanctumTasks();

  const [mode, setMode] = useState<'gateway' | 'session'>('gateway');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [expression, setExpression] = useState<Expression>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [activePanels, setActivePanels] = useState<PanelId[]>([]);
  const [entered, setEntered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgCount = useRef(0);

  const photo = config.personaPhoto || DEFAULT_PHOTO;
  const pName = config.personaName || 'Luminary';
  const pGreeting = config.personaGreeting || 'Welcome to The Sanctum.';
  const userName = user?.name?.split(' ')[0] || 'there';
  const vRate = config.personaVoiceRate || 0.95;
  const vPitch = config.personaVoicePitch || 0.95;
  const pTone = config.personaTone || 'balanced';
  const pTraits = (config.personaTraits || ['empathetic', 'analytical']).join(', ');
  const toneMap: Record<string, string> = { warm: 'warm, empathetic', direct: 'direct, data-focused', coaching: 'Socratic', balanced: 'adaptive' };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { setTimeout(() => setEntered(true), 300); }, []);
  useEffect(() => { msgCount.current = messages.length; }, [messages]);
  useEffect(() => { return () => { if (typeof window !== 'undefined') window.speechSynthesis?.cancel(); }; }, [mode]);
  useEffect(() => { if (typeof window !== 'undefined' && window.speechSynthesis) { window.speechSynthesis.getVoices(); window.speechSynthesis.addEventListener?.('voiceschanged', () => window.speechSynthesis.getVoices()); } }, []);

  // TTS
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setExpression('speaking'); setIsSpeaking(true);
      setTimeout(() => { setIsSpeaking(false); setExpression('smiling'); setTimeout(() => setExpression('idle'), 1000); }, 2000 + text.length * 18);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = vRate; u.pitch = vPitch; u.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const pick = voices.find(v => /Google.*US|Samantha|Daniel|Karen|Zira|David/i.test(v.name) && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en') && !v.name.includes('espeak')) || voices[0];
    if (pick) u.voice = pick;
    setExpression('speaking'); setIsSpeaking(true);
    u.onend = () => { setIsSpeaking(false); setExpression('smiling'); setTimeout(() => setExpression('idle'), 1000); };
    u.onerror = () => { setIsSpeaking(false); setExpression('idle'); };
    window.speechSynthesis.speak(u);
  }, [vRate, vPitch]);

  // AI reply
  const genReply = useCallback(async (userText: string): Promise<string> => {
    try {
      const { streamChat } = await import('../services/aiService');
      const sys = `You are ${pName}, AI manager in Nexora Prism. Style: ${toneMap[pTone]}. Traits: ${pTraits}. Session with ${userName}. Context: perf 87/100, velocity ${HUD.velocity.value}, sprint ${HUD.sprint.done}/${HUD.sprint.total}, ${HUD.milestones.length} milestones. Under 100 words. Use "shall I..." for actions. No markdown.`;
      const chat = messages.concat({ role: 'user', text: userText }).map(m => ({ role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant', content: m.text }));
      let out = '';
      await streamChat(sys, chat, s => { out = s; });
      if (!out || out.includes('demo mode') || out.includes('API key')) return smartReply(userText, msgCount.current);
      return out;
    } catch { return smartReply(userText, msgCount.current); }
  }, [messages, pName, pTone, pTraits, userName]);

  // Process input
  const process = useCallback((text: string) => {
    if (!text.trim() || isThinking || isSpeaking) return;
    const t = text.trim();
    setMessages(prev => [...prev, { role: 'user', text: t }]);
    setIsThinking(true); setExpression('thinking');

    // Detect panels to show from user message
    const panels = detectPanels(t);
    if (panels.length > 0) setActivePanels(prev => [...new Set([...prev, ...panels])]);

    genReply(t).then(r => {
      setMessages(prev => [...prev, { role: 'prism', text: r }]);
      // Also detect from reply
      const rp = detectPanels(r);
      if (rp.length > 0) setActivePanels(prev => [...new Set([...prev, ...rp])]);
      // Extract tasks
      if (r.match(/shall I|want me to|suggest|recommend|schedule|flag|reassign|break/i)) {
        const s = r.split(/[.!?]/).find(x => x.match(/shall I|want me to|suggest|schedule|flag|reassign|break/i));
        if (s) setTasks(prev => [...prev, { id: `t${Date.now()}`, text: s.trim().slice(0, 80), status: 'pending' }]);
      }
      setIsThinking(false);
      speak(r);
    });
  }, [isThinking, isSpeaking, genReply, speak]);

  const [voiceInterim, setVoiceInterim] = useState('');
  const onVoice = useCallback((t: string) => { setVoiceInterim(''); process(t); }, [process]);
  const onListenChange = useCallback((l: boolean) => { setIsListening(l); if (!l) setVoiceInterim(''); }, []);
  const onSend = useCallback(() => { if (!input.trim()) return; process(input); setInput(''); }, [input, process]);
  const dismissPanel = useCallback((id: PanelId) => setActivePanels(prev => prev.filter(p => p !== id)), []);

  const enterSession = useCallback(() => {
    setMode('session'); setTasks([]); setActivePanels([]);
    const h = new Date().getHours();
    const g = `${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'}, ${userName}. ${pGreeting} What would you like to discuss?`;
    setMessages([{ role: 'prism', text: g }]);
    speak(g);
  }, [userName, pGreeting, speak]);

  const exitSession = useCallback(() => {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    setIsSpeaking(false); setIsThinking(false); setIsListening(false); setExpression('idle'); setMode('gateway');
  }, []);

  const agreeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const due = new Date(); due.setDate(due.getDate() + 7);
      addSanctumTask({
        id: `sanctum-${id}`,
        title: t.text,
        desc: 'Agreed in The Sanctum',
        status: 'active',
        priority: 'medium',
        owner: user?.name || userName,
        ownerId: user?.employeeId || 'e1',
        due: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tags: ['Sanctum'],
        storyPoints: 3,
        estimatedHours: 4,
        loggedHours: 0,
        parentId: null,
        source: 'sanctum',
        comments: [],
        attachments: [],
      });
      return { ...t, status: 'agreed' as const };
    }));
  }, [addSanctumTask, userName, user?.name, user?.employeeId]);

  // ═══════ GATEWAY ═══════
  if (mode === 'gateway') return (
    <div className="page-wrap pb-32 flex flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full mb-16 border-b pb-10" style={{ borderColor: 'var(--p-border)' }}>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm mb-4 group" style={{ color: 'var(--p-text-dim)' }}>
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--p-text-lo)' }}>Private intelligence channel</p>
        <h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>The <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Sanctum</span></h1>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: entered ? 1 : 0, scale: entered ? 1 : 0.6 }} transition={{ duration: 1.5, delay: 0.2 }} className="relative mb-14">
        <div className="absolute inset-0 -m-24 rounded-full blur-[100px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.08), rgba(192,132,252,0.05), transparent)' }} />
        <div className="w-48 h-48 rounded-full relative overflow-hidden" style={{ border: '2px solid rgba(56,189,248,0.15)' }}>
          {[4, 8, 12, 16, 20].map((s, i) => <motion.div key={i} animate={{ scale: [1, 1 + 0.02 * (i + 1), 1], opacity: [0.12 - i * 0.02, 0.25 - i * 0.03, 0.12 - i * 0.02] }} transition={{ duration: 5, repeat: Infinity, delay: i * 0.4 }} className="absolute rounded-full" style={{ inset: `-${s * 4}px`, border: `1px solid rgba(56,189,248,${0.12 - i * 0.02})` }} />)}
          <img src={photo} alt={pName} className="w-full h-full object-cover rounded-full" />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center mb-14 max-w-md">
        <p className="text-xl font-light mb-2" style={{ color: 'var(--p-text-body)' }}>{userName}, meet <span className="italic font-serif" style={{ color: '#38bdf8' }}>{pName}</span></p>
        <p className="text-xs" style={{ color: 'var(--p-text-ghost)' }}>Your private intelligence. Ready when you are.</p>
      </motion.div>
      <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
        onClick={enterSession} className="rounded-full px-12 py-4 text-sm font-light transition-all hover:scale-[1.04] group relative overflow-hidden" style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)', color: 'var(--p-text-hi)', cursor: 'pointer' }}>
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.1), transparent)' }} />
        <span className="relative">Enter The Sanctum</span>
      </motion.button>
    </div>
  );

  // ═══════ SESSION ═══════
  return (
    <div className="relative flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 90px)', background: '#050810' }}>
      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {[{ left: '8%', w: '12%', skew: -12, op: 0.025 }, { left: '28%', w: '10%', skew: -6, op: 0.035 }, { left: '48%', w: '14%', skew: 2, op: 0.04 }, { left: '68%', w: '10%', skew: 8, op: 0.03 }, { left: '85%', w: '8%', skew: 14, op: 0.02 }].map((r, i) => (
          <div key={i} className="absolute top-0" style={{ left: r.left, width: r.w, height: '100%', background: `linear-gradient(180deg, rgba(56,189,248,${r.op}) 0%, rgba(56,189,248,${r.op * 0.3}) 40%, transparent 75%)`, transform: `skewX(${r.skew}deg)`, transformOrigin: 'top', filter: 'blur(18px)' }} />
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: 'linear-gradient(to top, rgba(56,189,248,0.02), transparent)' }} />
        {Array.from({ length: 20 }).map((_, i) => <div key={i} className="absolute rounded-full" style={{ width: 1.5, height: 1.5, background: `rgba(255,255,255,${0.06 + Math.random() * 0.1})`, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `dustF ${10 + Math.random() * 12}s ease-in-out infinite ${Math.random() * 8}s` }} />)}
      </div>

      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 z-20">
        <button onClick={exitSession} className="flex items-center gap-2 text-sm group" style={{ color: 'var(--p-text-dim)', cursor: 'pointer' }}>
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Exit</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.15)' }}>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full" style={{ background: '#38bdf8' }} />
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#38bdf8' }}>{pName}</span>
        </div>
      </div>

      {/* Avatar center */}
      <div className="absolute inset-0 flex flex-col items-center z-[8]" style={{ paddingTop: '8%' }}>
        <div className="absolute rounded-full blur-[90px]" style={{ width: 300, height: 300, top: '5%', background: 'radial-gradient(circle, rgba(56,189,248,0.06), rgba(192,132,252,0.02), transparent)' }} />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
          <div className="w-40 h-40 rounded-full overflow-hidden relative" style={{ border: `2px solid rgba(56,189,248,${isSpeaking ? 0.25 : 0.12})`, boxShadow: '0 0 80px rgba(56,189,248,0.06), inset 0 0 40px rgba(0,0,0,0.4)', transition: 'border-color 0.3s' }}>
            <motion.div animate={{ scale: expression === 'speaking' ? [1, 1.015, 0.99, 1.01, 1] : [1, 1.005, 1] }} transition={{ duration: expression === 'speaking' ? 0.35 : 3, repeat: Infinity }} className="w-full h-full">
              <img src={photo} alt={pName} className="w-full h-full object-cover rounded-full" />
            </motion.div>
            <AnimatePresence>{isSpeaking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bottom-0 left-0 right-0 h-[28%] pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)', borderRadius: '0 0 100px 100px' }}>
                <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex items-end gap-[2px]">
                  {[0, 1, 2, 3, 4, 3, 2, 1, 0].map((b, i) => <motion.div key={i} animate={{ height: [2 + b, 6 + b * 2, 2 + b] }} transition={{ duration: 0.12, repeat: Infinity, delay: i * 0.015 }} style={{ width: 2, borderRadius: 1, background: '#38bdf8', opacity: 0.7 }} />)}
                </div>
              </motion.div>
            )}</AnimatePresence>
            {expression === 'thinking' && <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(56,189,248,0.06)' }} />}
          </div>
          {[4, 8, 12].map((s, i) => <div key={i} className="absolute rounded-full" style={{ inset: -s * 4, border: `1px solid rgba(56,189,248,${0.08 - i * 0.02})`, animation: `breathe ${4 + i * 0.5}s ease-in-out infinite ${i * 0.4}s` }} />)}
          <AnimatePresence>{expression === 'thinking' && [0, 1, 2].map(i => (
            <motion.div key={i} initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 0.5, 0], y: [-8, -30] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
              className="absolute rounded-full" style={{ width: 3, height: 3, background: ['#38bdf8', '#c084fc', '#10b981'][i], top: '20%', left: `${35 + i * 15}%` }} />
          ))}</AnimatePresence>
        </motion.div>
        <motion.p animate={{ opacity: expression !== 'idle' ? 1 : 0 }} className="mt-3 text-[9px] font-mono uppercase tracking-widest z-10" style={{ color: expression === 'speaking' ? '#38bdf8' : '#c084fc' }}>
          {expression === 'speaking' ? 'speaking' : expression === 'thinking' ? 'processing' : ''}
        </motion.p>
        <p className="mt-1 text-[10px] tracking-[0.25em] uppercase" style={{ color: 'rgba(56,189,248,0.35)' }}>{pName}</p>
        {/* Orb */}
        <div className="mt-4 relative w-10 h-10 flex items-center justify-center">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 4, repeat: Infinity }} className="absolute w-12 h-12 rounded-full" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.2), transparent)' }} />
          <div className="w-3.5 h-3.5 rounded-full" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.9), rgba(56,189,248,0.3))', boxShadow: '0 0 15px rgba(56,189,248,0.4)' }} />
        </div>
      </div>

      {/* Dynamic panels */}
      <AnimatePresence>
        {activePanels.map((id, i) => <DPanel key={id} id={id} index={i} onDismiss={dismissPanel} />)}
      </AnimatePresence>

      {/* Chat box */}
      <AnimatePresence>
        {showChat ? (
          <motion.div key="chatbox" initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-4 z-30 w-72">
            <div className="flex items-center gap-2 px-3 py-2 rounded-t-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(56,189,248,0.06)' }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)' }} />
              <div className="w-1.5 h-1.5 rounded-full relative z-10" style={{ background: '#38bdf8', boxShadow: '0 0 6px rgba(56,189,248,0.4)' }} />
              <span className="text-[8px] font-mono uppercase tracking-[0.2em] relative z-10" style={{ color: 'rgba(56,189,248,0.5)' }}>Conversation</span>
              <span className="text-[8px] font-mono ml-auto relative z-10" style={{ color: 'rgba(255,255,255,0.12)' }}>{messages.length}</span>
              <button onClick={() => setShowChat(false)} className="relative z-10 w-5 h-5 rounded-md flex items-center justify-center hover:scale-110" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"><line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" /></svg>
              </button>
            </div>
            <div className="px-3 py-2 space-y-2 overflow-y-auto" style={{ maxHeight: 200, background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', backdropFilter: 'blur(24px)', borderLeft: '1px solid rgba(255,255,255,0.04)', borderRight: '1px solid rgba(255,255,255,0.04)', scrollbarWidth: 'thin', scrollbarColor: 'rgba(56,189,248,0.12) transparent' }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%]">
                    <div className={`text-[7px] font-mono uppercase tracking-[0.15em] mb-0.5 px-1 ${m.role === 'user' ? 'text-right' : ''}`} style={{ color: m.role === 'prism' ? 'rgba(56,189,248,0.45)' : 'rgba(192,132,252,0.45)' }}>
                      {m.role === 'prism' ? pName : 'You'}
                    </div>
                    <div className="rounded-xl px-2.5 py-1.5 relative overflow-hidden" style={{
                      background: m.role === 'prism' ? 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(56,189,248,0.03))' : 'linear-gradient(135deg, rgba(192,132,252,0.12), rgba(192,132,252,0.04))',
                      border: `1px solid ${m.role === 'prism' ? 'rgba(56,189,248,0.12)' : 'rgba(192,132,252,0.15)'}`,
                      borderRadius: m.role === 'prism' ? '4px 12px 12px 12px' : '12px 4px 12px 12px', backdropFilter: 'blur(8px)',
                    }}>
                      <p className="text-[10px] leading-relaxed relative z-10" style={{ color: m.role === 'prism' ? 'rgba(180,230,255,0.7)' : 'rgba(220,200,255,0.7)' }}>{m.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Action items in chat */}
              {tasks.filter(t => t.status === 'pending').map(t => (
                <div key={t.id} className="flex justify-start">
                  <div className="max-w-[85%] rounded-xl px-2.5 py-2 relative" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: '4px 12px 12px 12px' }}>
                    <p className="text-[9px] leading-relaxed mb-1.5" style={{ color: 'rgba(180,255,220,0.7)' }}>{t.text}</p>
                    <button onClick={() => agreeTask(t.id)} className="text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded hover:scale-105" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', cursor: 'pointer' }}>Agree</button>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="h-[2px] rounded-b-xl" style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.2), rgba(192,132,252,0.15), transparent)' }} />
          </motion.div>
        ) : (
          <motion.button key="chatbtn" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
            onClick={() => setShowChat(true)} className="absolute bottom-20 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110"
            style={{ background: 'linear-gradient(135deg, rgba(192,132,252,0.08), rgba(56,189,248,0.04))', backdropFilter: 'blur(16px)', border: '1px solid rgba(192,132,252,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(192,132,252,0.6)" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Spacer pushes input to bottom */}
      <div className="flex-1" />

      {/* Input bar */}
      <div className="flex-shrink-0 px-6 py-3 mb-2 z-20">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2 h-4">
            {isListening && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <div className="flex gap-[2px]">{[0, 1, 2, 3, 4].map(i => <motion.div key={i} animate={{ height: [3, 10 + Math.random() * 5, 3] }} transition={{ duration: 0.35, repeat: Infinity, delay: i * 0.07 }} style={{ width: 2, borderRadius: 1, background: '#38bdf8', opacity: 0.7 }} />)}</div>
              <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: '#38bdf8' }}>Listening</span>
            </motion.div>}
            {isThinking && <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: '#c084fc' }}>Processing</span>}
            {isSpeaking && <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: '#38bdf8' }}>{pName} speaking</span>}
          </div>
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))', backdropFilter: 'blur(24px) saturate(1.3)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.04)' }}>
            <div className="absolute top-0 left-4 right-4 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.15), rgba(192,132,252,0.1), transparent)' }} />
            <div className="flex-shrink-0 w-11 overflow-hidden">
              <VoiceInput onTranscript={onVoice} onListeningChange={onListenChange} size="md" accent="#38bdf8" />
            </div>
            <div className="flex-1 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') onSend(); }}
                placeholder={isListening ? 'Listening…' : `Speak or type to ${pName}…`} className="w-full bg-transparent text-sm font-light outline-none" style={{ color: 'rgba(255,255,255,0.7)' }} />
            </div>
            <button onClick={onSend} disabled={!input.trim() || isThinking || isSpeaking} className="w-9 h-9 rounded-lg flex items-center justify-center hover:scale-105 flex-shrink-0"
              style={{ background: input.trim() ? 'rgba(56,189,248,0.08)' : 'transparent', border: `1px solid ${input.trim() ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.06)'}`, color: input.trim() ? '#38bdf8' : 'rgba(255,255,255,0.15)', cursor: 'pointer' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes breathe { 0%,100% { transform:scale(1); opacity:0.5; } 50% { transform:scale(1.03); opacity:1; } }
        @keyframes dustF { 0%,100% { transform:translateY(0); opacity:0.06; } 50% { transform:translateY(-30px); opacity:0.2; } }
      `}</style>
    </div>
  );
}
