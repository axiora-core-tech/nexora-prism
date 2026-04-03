/**
 * Calibration — System Configuration (CEO-only)
 * "Tuning the instrument to produce accurate readings"
 *
 * Scroll-spy sections with floating dot sidebar (same pattern as Employee Detail).
 * 7 sections: Company, People, Avatars, Privacy, Notifications, Integrations, Financial.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Check, X, Building2, Users, Bot, Shield, Bell, Link2, DollarSign } from 'lucide-react';
import { PrismCompany, PrismPeople, PrismAvatar, PrismShield, PrismAlert, PrismConnect, PrismCapital, PrismEdit, PrismMetric, PrismKnowledge, PrismChat, PrismCalendar, PrismConfig } from './ui/PrismIcons';
import { useNavigate, Navigate } from 'react-router';
import { useCompanyConfig } from '../stores/companyConfigStore';
import { useRoadmap } from '../stores/roadmapStore';
import { useAuth } from '../auth/AuthContext';
import { employees } from '../mockData';

const SECTIONS = [
  { id: 'company', label: 'Company', icon: Building2, color: '#38bdf8' },
  { id: 'people', label: 'People', icon: Users, color: '#10b981' },
  { id: 'avatars', label: 'Avatars', icon: Bot, color: '#c084fc' },
  { id: 'privacy', label: 'Privacy', icon: Shield, color: '#f59e0b' },
  { id: 'notifications', label: 'Alerts', icon: Bell, color: '#f43f5e' },
  { id: 'integrations', label: 'Signals', icon: Link2, color: '#fb923c' },
  { id: 'financial', label: 'Capital', icon: DollarSign, color: '#10b981' },
];

const integrations: { name: string; status: string; Icon: typeof PrismMetric }[] = [
  { name: 'QuickBooks', status: 'disconnected', Icon: PrismMetric },
  { name: 'Xero', status: 'disconnected', Icon: PrismCapital },
  { name: 'BambooHR', status: 'disconnected', Icon: PrismKnowledge },
  { name: 'Slack', status: 'coming_soon', Icon: PrismChat },
  { name: 'Google Calendar', status: 'coming_soon', Icon: PrismCalendar },
];

export function Calibration() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { config, updateConfig } = useCompanyConfig();
  const { roadmap, vision } = useRoadmap();

  // ALL hooks must be declared before any conditional return (React rules of hooks)
  const [activeSection, setActiveSection] = useState('company');
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [connectedServices, setConnectedServices] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll-spy: track which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      }
    }, { rootMargin: '-30% 0px -60% 0px' });

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const scrollTo = useCallback((id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  // CEO-only: redirect non-CEO users to Settings (AFTER all hooks)
  if (user?.role_level !== 'ceo') {
    return React.createElement(Navigate, { to: '/app/settings', replace: true });
  }

  const departments = ['Core Architecture', 'UX Design', 'Data Infrastructure', 'Growth'];
  const deptEmployees: Record<string, string[]> = {
    'Core Architecture': employees.filter(e => e.department === 'Engineering' || e.department === 'Core Architecture').map(e => e.name).slice(0, 3),
    'UX Design': employees.filter(e => e.department === 'Design' || e.department === 'UX').map(e => e.name).slice(0, 2),
    'Data Infrastructure': employees.filter(e => e.department === 'Data' || e.department === 'Infrastructure').map(e => e.name).slice(0, 2),
    'Growth': employees.filter(e => e.department === 'Marketing' || e.department === 'Growth' || e.department === 'Sales').map(e => e.name).slice(0, 2),
  };
  const privacyLevels = [
    { value: 'full_transparency', label: 'Full Transparency', desc: 'Manager sees full transcripts and AI summaries' },
    { value: 'summary_only', label: 'Summary Only', desc: 'Manager sees AI-generated summaries, not raw transcripts' },
    { value: 'layered', label: 'Layered', desc: 'Employee can tag topics as private/HR-only' },
  ];

  return (
    <div className="page-wrap pb-32 relative">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 border-b pb-10" style={{ borderColor: 'var(--p-border)' }}>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm mb-4 transition-colors group" style={{ color: 'var(--p-text-dim)' }}>
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2" style={{ color: 'var(--p-text-lo)' }}>
          <PrismConfig size={14} style={{ color: '#38bdf8' }} /> System configuration
        </p>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>
            System <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Calibration</span>
          </h1>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--p-text-lo)' }}>Employees</p>
              <p className="text-2xl font-light font-mono" style={{ color: '#38bdf8' }}>8</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--p-text-lo)' }}>Meridian</p>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                {roadmap?.status || 'none'}
              </span>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--p-text-lo)' }}>Privacy</p>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                {config.privacyLevel.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ SYSTEM DIAGRAM — interactive node-link visualization ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <svg viewBox="0 0 700 100" width="100%" style={{ minWidth: 500, maxWidth: 700 }}>
          {/* Connection spine */}
          <motion.line x1="50" y1="50" x2="650" y2="50"
            stroke="var(--p-border)" strokeWidth="1" strokeOpacity="0.2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }} />

          {/* Section nodes */}
          {SECTIONS.map((s, i) => {
            const x = 50 + i * (600 / (SECTIONS.length - 1));
            const isActive = activeSection === s.id;
            return (
              <g key={s.id} style={{ cursor: 'pointer' }} onClick={() => scrollTo(s.id)}>
                {/* Pulse ring on active */}
                {isActive && (
                  <motion.circle cx={x} cy={50} r={20} fill="none" stroke={s.color} strokeWidth="0.5"
                    animate={{ r: [16, 22, 16], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }} />
                )}
                {/* Ambient glow */}
                <circle cx={x} cy={50} r={isActive ? 18 : 12} fill={s.color} opacity={isActive ? 0.06 : 0.02} />
                {/* Node */}
                <motion.circle cx={x} cy={50} r={isActive ? 8 : 5}
                  fill={isActive ? s.color : 'transparent'}
                  stroke={s.color} strokeWidth={isActive ? 1.5 : 0.8}
                  opacity={isActive ? 0.9 : 0.35}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }} />
                {/* Label */}
                <text x={x} y={78} textAnchor="middle" fill={isActive ? s.color : 'var(--p-text-ghost)'}
                  fontSize="10" fontFamily="Space Mono, monospace"
                  style={{ transition: 'fill 0.3s' }}>
                  {s.label}
                </text>
              </g>
            );
          })}

          {/* Active segment highlight — line from previous to next node */}
          {(() => {
            const idx = SECTIONS.findIndex(s => s.id === activeSection);
            if (idx < 0) return null;
            const x = 50 + idx * (600 / (SECTIONS.length - 1));
            const prevX = idx > 0 ? 50 + (idx - 1) * (600 / (SECTIONS.length - 1)) : x;
            const nextX = idx < SECTIONS.length - 1 ? 50 + (idx + 1) * (600 / (SECTIONS.length - 1)) : x;
            const color = SECTIONS[idx].color;
            return (
              <>
                <line x1={prevX} y1={50} x2={x} y2={50} stroke={color} strokeWidth="1.5" opacity="0.3" />
                <line x1={x} y1={50} x2={nextX} y2={50} stroke={color} strokeWidth="1.5" opacity="0.15" />
              </>
            );
          })()}
        </svg>
      </motion.div>

      {/* Floating dot sidebar — scroll-spy (kept for narrow screens, hidden when diagram visible) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-3">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            className="group flex items-center gap-2 transition-all" data-cursor={s.label}>
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: activeSection === s.id ? s.color : 'var(--p-text-ghost)' }}>{s.label}</span>
            <div className="w-2 h-2 rounded-full transition-all"
              style={{
                background: activeSection === s.id ? s.color : 'var(--p-text-ghost)',
                transform: activeSection === s.id ? 'scale(1.5)' : 'scale(1)',
                opacity: activeSection === s.id ? 1 : 0.3,
              }} />
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-8 max-w-4xl">

        {/* Section 1: Company */}
        <div id="company" ref={el => { sectionRefs.current.company = el; }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[2rem] p-6 md:p-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-4 mb-6"
              style={{ color: 'var(--p-text-ghost)', borderColor: 'var(--p-border)' }}>
              <PrismCompany size={11} style={{ color: '#38bdf8' }} /> Company identity
            </h3>
            <p className="text-2xl font-light mb-4" style={{ color: 'var(--p-text-hi)' }}>{config.name}</p>
            {vision?.mission && (
              <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(56,189,248,0.03)', border: '1px solid rgba(56,189,248,0.08)' }}>
                <p className="text-sm italic font-serif leading-relaxed" style={{ color: 'var(--p-text-dim)' }}>
                  "{vision.mission}"
                </p>
              </div>
            )}
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                Meridian: {roadmap?.status || 'none'}
              </span>
              <button onClick={() => navigate('/app/onboard')} className="text-xs transition-colors hover:text-rose-400" style={{ color: 'var(--p-text-ghost)', cursor: 'pointer' }}>
                Re-run Genesis →
              </button>
            </div>
          </motion.div>
        </div>

        {/* Section 2: People */}
        <div id="people" ref={el => { sectionRefs.current.people = el; }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[2rem] p-6 md:p-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-4 mb-6"
              style={{ color: 'var(--p-text-ghost)', borderColor: 'var(--p-border)' }}>
              <PrismPeople size={11} style={{ color: '#10b981' }} /> Roles &amp; departments
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {departments.map(d => (
                <button key={d} onClick={() => setExpandedDept(expandedDept === d ? null : d)}
                  className="text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105 cursor-pointer"
                  style={{
                    background: expandedDept === d ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.06)',
                    border: `1px solid ${expandedDept === d ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.12)'}`,
                    color: '#10b981',
                  }}>
                  {d}
                </button>
              ))}
              <button onClick={() => showToast('Add department — coming in production')}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)', color: '#10b981', cursor: 'pointer' }}>
                <Plus size={12} />
              </button>
            </div>
            {/* Expanded department — show employees */}
            <AnimatePresence>
              {expandedDept && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-4 rounded-xl p-4" style={{ background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.08)' }}>
                  <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--p-text-lo)' }}>{expandedDept} team</p>
                  <div className="flex flex-wrap gap-2">
                    {(deptEmployees[expandedDept] || ['No employees assigned']).map((name, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--p-bg-card-2)', border: '1px solid var(--p-border)', color: 'var(--p-text-mid)' }}>
                        {name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-xs" style={{ color: 'var(--p-text-dim)' }}>Click a department to view team members.</p>
          </motion.div>
        </div>

        {/* Section 3: Avatars */}
        <div id="avatars" ref={el => { sectionRefs.current.avatars = el; }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[2rem] p-6 md:p-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-4 mb-6"
              style={{ color: 'var(--p-text-ghost)', borderColor: 'var(--p-border)' }}>
              <PrismAvatar size={11} style={{ color: '#c084fc' }} /> Avatar configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Manager 1', 'Manager 2', 'Default Prism'].map((name, i) => (
                <div key={i} className="rounded-xl p-5 text-center transition-all hover:scale-[1.01]"
                  style={{ background: 'var(--p-bg-card-2)', border: '1px solid var(--p-border)' }}>
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                    style={{ background: i < 2 ? 'rgba(192,132,252,0.06)' : 'rgba(56,189,248,0.06)', border: `1px solid ${i < 2 ? 'rgba(192,132,252,0.15)' : 'rgba(56,189,248,0.15)'}` }}>
                    <PrismAvatar size={20} style={{ color: i < 2 ? '#c084fc' : '#38bdf8' }} />
                  </div>
                  <p className="text-sm font-light mb-1" style={{ color: 'var(--p-text-hi)' }}>{name}</p>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded"
                    style={{ background: i === 2 ? 'rgba(56,189,248,0.12)' : 'rgba(245,158,11,0.12)', color: i === 2 ? '#38bdf8' : '#f59e0b' }}>
                    {i === 2 ? 'Active' : 'Not set'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Section 4: Privacy */}
        <div id="privacy" ref={el => { sectionRefs.current.privacy = el; }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[2rem] p-6 md:p-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-4 mb-6"
              style={{ color: 'var(--p-text-ghost)', borderColor: 'var(--p-border)' }}>
              <PrismShield size={11} style={{ color: '#f59e0b' }} /> Signal privacy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              {privacyLevels.map(p => {
                const isActive = config.privacyLevel === p.value;
                return (
                  <button key={p.value} onClick={() => updateConfig({ privacyLevel: p.value as any })}
                    className="rounded-xl p-5 text-left transition-all hover:scale-[1.01]"
                    style={{
                      background: isActive ? 'rgba(56,189,248,0.04)' : 'var(--p-bg-card-2)',
                      border: `1px solid ${isActive ? 'rgba(56,189,248,0.25)' : 'var(--p-border)'}`,
                    }}>
                    <div className="flex items-center gap-2 mb-2">
                      {isActive && <Check size={12} style={{ color: '#38bdf8' }} />}
                      <p className="text-sm font-medium" style={{ color: isActive ? '#38bdf8' : 'var(--p-text-hi)' }}>{p.label}</p>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--p-text-dim)' }}>{p.desc}</p>
                  </button>
                );
              })}
            </div>
            <div>
              <p className="text-xs mb-3" style={{ color: 'var(--p-text-mid)' }}>Conversation memory window</p>
              <div className="flex items-center gap-4">
                {([7, 30, 90, -1] as const).map(d => (
                  <button key={d} onClick={() => updateConfig({ conversationMemoryDays: d })}
                    className="px-4 py-2 rounded-xl text-sm font-mono transition-all"
                    style={{
                      background: config.conversationMemoryDays === d ? 'rgba(245,158,11,0.08)' : 'transparent',
                      border: `1px solid ${config.conversationMemoryDays === d ? 'rgba(245,158,11,0.25)' : 'var(--p-border)'}`,
                      color: config.conversationMemoryDays === d ? '#f59e0b' : 'var(--p-text-dim)',
                    }}>
                    {d === -1 ? '∞' : `${d}d`}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section 5: Notifications */}
        <div id="notifications" ref={el => { sectionRefs.current.notifications = el; }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[2rem] p-6 md:p-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-4 mb-6"
              style={{ color: 'var(--p-text-ghost)', borderColor: 'var(--p-border)' }}>
              <PrismAlert size={11} style={{ color: '#f43f5e' }} /> Alert thresholds
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs mb-2" style={{ color: 'var(--p-text-mid)' }}>Standup reminder time</p>
                <p className="font-mono text-2xl" style={{ color: '#f43f5e' }}>{config.standupReminderTime}</p>
                <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--p-text-ghost)' }}>{config.standupTimezone}</p>
              </div>
              <div>
                <p className="text-xs mb-2" style={{ color: 'var(--p-text-mid)' }}>Escalation after</p>
                <p className="font-mono text-2xl" style={{ color: '#f43f5e' }}>{config.missedStandupEscalationHours}<span className="text-sm" style={{ color: 'var(--p-text-ghost)' }}>h</span></p>
                <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--p-text-ghost)' }}>of no standup</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs mb-3" style={{ color: 'var(--p-text-mid)' }}>Email frequency</p>
              <div className="flex gap-2">
                {['Instant', 'Daily digest', 'Weekly digest'].map(f => (
                  <button key={f} className="px-4 py-2 rounded-xl text-xs font-mono transition-all"
                    style={{ background: f === 'Daily digest' ? 'rgba(244,63,94,0.08)' : 'transparent', border: `1px solid ${f === 'Daily digest' ? 'rgba(244,63,94,0.25)' : 'var(--p-border)'}`, color: f === 'Daily digest' ? '#f43f5e' : 'var(--p-text-dim)' }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section 6: Integrations */}
        <div id="integrations" ref={el => { sectionRefs.current.integrations = el; }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[2rem] p-6 md:p-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-4 mb-6"
              style={{ color: 'var(--p-text-ghost)', borderColor: 'var(--p-border)' }}>
              <PrismConnect size={11} style={{ color: '#fb923c' }} /> External signals
            </h3>
            <div className="space-y-3">
              {integrations.map(int => {
                const isConnected = connectedServices.has(int.name);
                return (
                <div key={int.name} className="rounded-xl p-4 flex items-center gap-4 transition-all"
                  style={{ background: 'var(--p-bg-card-2)', border: '1px solid var(--p-border)', opacity: int.status === 'coming_soon' ? 0.4 : 1 }}>
                  <int.Icon size={18} className={`${isConnected ? '' : 'opacity-40'} transition-all`} style={{ color: isConnected ? '#38bdf8' : 'var(--p-text-ghost)' }} />
                  <div className="flex-1">
                    <p className="text-sm font-light" style={{ color: 'var(--p-text-hi)' }}>{int.name}</p>
                    {isConnected && <p className="text-[10px] font-mono" style={{ color: 'var(--p-text-ghost)' }}>Connected — last sync: just now</p>}
                  </div>
                  {int.status === 'coming_soon' ? (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded" style={{ background: 'rgba(148,163,184,0.1)', color: 'var(--p-text-ghost)' }}>Signal pending</span>
                  ) : isConnected ? (
                    <button onClick={() => { setConnectedServices(prev => { const next = new Set(prev); next.delete(int.name); return next; }); showToast(`${int.name} disconnected`); }}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                      style={{ color: 'var(--p-text-ghost)', cursor: 'pointer' }}>
                      Disconnect
                    </button>
                  ) : (
                    <button onClick={() => { setConnectedServices(prev => new Set(prev).add(int.name)); showToast(`${int.name} connected (demo)`); }}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                      style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', cursor: 'pointer' }}>
                      Connect
                    </button>
                  )}
                </div>
              );})}
            </div>
          </motion.div>
        </div>

        {/* Section 7: Financial */}
        <div id="financial" ref={el => { sectionRefs.current.financial = el; }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[2rem] p-6 md:p-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-4 mb-6"
              style={{ color: 'var(--p-text-ghost)', borderColor: 'var(--p-border)' }}>
              <PrismCapital size={11} style={{ color: '#10b981' }} /> Capital configuration
            </h3>
            <div className="mb-6">
              <p className="text-xs mb-2" style={{ color: 'var(--p-text-mid)' }}>Annual revenue target</p>
              <p className="font-mono text-3xl" style={{ color: '#10b981' }}>
                ${(config.annualRevenueTarget / 1000000).toFixed(1)}<span className="text-sm" style={{ color: 'var(--p-text-ghost)' }}>M</span>
              </p>
            </div>
            <div>
              <p className="text-xs mb-3" style={{ color: 'var(--p-text-mid)' }}>Department budgets</p>
              <div className="flex flex-wrap gap-2">
                {config.departmentBudgets.map(db => (
                  <span key={db.departmentId} className="text-xs px-3 py-2 rounded-xl font-mono"
                    style={{ background: 'var(--p-bg-card-2)', border: '1px solid var(--p-border)', color: 'var(--p-text-mid)' }}>
                    {db.departmentId.replace('-', ' ')} <span style={{ color: '#10b981' }}>${(db.budget / 1000).toFixed(0)}K</span>
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[10px] mt-4" style={{ color: 'var(--p-text-ghost)' }}>
              Connect QuickBooks or Xero in Integrations for automatic financial data.
            </p>
          </motion.div>
        </div>

      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full"
            style={{ background: 'var(--p-bg-surface)', border: '1px solid var(--p-border)', backdropFilter: 'blur(20px)' }}
          >
            <Check size={12} style={{ color: '#10b981' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--p-text-mid)' }}>{toast}</span>
            <button onClick={() => setToast(null)} style={{ color: 'var(--p-text-ghost)', cursor: 'pointer' }}><X size={12} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
