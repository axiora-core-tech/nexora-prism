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
  { id: 'ai', label: 'AI Engine', icon: Bot, color: '#38bdf8' },
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

  const [emailFreq, setEmailFreq] = useState('Daily digest');

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
    { value: 'summary_only', label: 'Summary Only', desc: 'Manager sees Prism-generated summaries, not raw transcripts' },
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

      {/* Two-column layout: Fixed left nav + scrollable content */}
      <div className="flex gap-8">
        {/* Fixed left sidebar — always visible section nav */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-8">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--p-text-ghost)' }}>Sections</p>
            <nav className="space-y-1">
              {SECTIONS.map(s => {
                const isActive = activeSection === s.id;
                return (
                  <button key={s.id} onClick={() => scrollTo(s.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group"
                    style={{
                      background: isActive ? `${s.color}08` : 'transparent',
                      border: `1px solid ${isActive ? s.color + '20' : 'transparent'}`,
                      cursor: 'pointer',
                    }}
                    data-cursor={s.label}>
                    {/* Accent dot */}
                    <div className="w-2 h-2 rounded-full flex-shrink-0 transition-all"
                      style={{
                        background: isActive ? s.color : 'var(--p-text-ghost)',
                        opacity: isActive ? 1 : 0.3,
                        transform: isActive ? 'scale(1.3)' : 'scale(1)',
                      }} />
                    <span className="text-xs font-mono uppercase tracking-[0.1em] transition-colors"
                      style={{ color: isActive ? s.color : 'var(--p-text-ghost)' }}>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 space-y-8 max-w-4xl">

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

        {/* Section 3: Sanctum Persona — Manager personality, tone, voice */}
        <div id="avatars" ref={el => { sectionRefs.current.avatars = el; }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[2rem] p-6 md:p-8 relative overflow-hidden" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(192,132,252,0.04)' }} />
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-4 mb-6"
              style={{ color: 'var(--p-text-ghost)', borderColor: 'var(--p-border)' }}>
              <PrismAvatar size={11} style={{ color: '#c084fc' }} /> Sanctum persona
            </h3>

            {/* Persona name */}
            <div className="mb-6">
              <p className="text-xs mb-2" style={{ color: 'var(--p-text-mid)' }}>Manager name</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(192,132,252,0.06)', border: '1px solid rgba(192,132,252,0.15)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8" stroke="rgba(192,132,252,0.3)" strokeWidth="0.8" />
                    <circle cx="12" cy="12" r="4" stroke="rgba(192,132,252,0.5)" strokeWidth="0.8" />
                    <circle cx="12" cy="12" r="1.5" fill="rgba(192,132,252,0.6)" />
                  </svg>
                </div>
                <input type="text" value={config.personaName || 'Luminary'}
                  onChange={e => updateConfig({ personaName: e.target.value })}
                  className="flex-1 bg-transparent text-lg font-light outline-none rounded-xl px-4 py-2"
                  style={{ color: 'var(--p-text-hi)', background: 'var(--p-bg-input)', border: '1px solid var(--p-border)' }} />
              </div>
            </div>

            {/* Communication Tone */}
            <div className="mb-6">
              <p className="text-xs mb-3" style={{ color: 'var(--p-text-mid)' }}>Communication tone</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {([
                  { value: 'warm', label: 'Warm & Supportive', desc: 'Empathetic, encouraging, nurturing growth', color: '#f59e0b' },
                  { value: 'direct', label: 'Direct & Data-driven', desc: 'Facts first, minimal padding, efficient', color: '#38bdf8' },
                  { value: 'coaching', label: 'Coaching & Challenging', desc: 'Pushes boundaries, Socratic, growth-focused', color: '#10b981' },
                  { value: 'balanced', label: 'Balanced', desc: 'Adapts to context — warm when needed, direct when required', color: '#c084fc' },
                ] as const).map(t => {
                  const isActive = (config.personaTone || 'balanced') === t.value;
                  return (
                    <button key={t.value} onClick={() => updateConfig({ personaTone: t.value })}
                      className="rounded-xl p-4 text-left transition-all hover:scale-[1.01]"
                      style={{
                        background: isActive ? `${t.color}08` : 'var(--p-bg-card-2)',
                        border: `1px solid ${isActive ? t.color + '30' : 'var(--p-border)'}`,
                        cursor: 'pointer',
                      }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: t.color, opacity: isActive ? 1 : 0.3 }} />
                        <p className="text-xs font-mono uppercase tracking-[0.1em]" style={{ color: isActive ? t.color : 'var(--p-text-dim)' }}>{t.label}</p>
                      </div>
                      <p className="text-[10px] leading-relaxed" style={{ color: 'var(--p-text-ghost)' }}>{t.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Voice Style */}
            <div className="mb-6">
              <p className="text-xs mb-3" style={{ color: 'var(--p-text-mid)' }}>Voice style</p>
              <div className="flex gap-2 flex-wrap">
                {([
                  { value: 'professional', label: 'Professional', color: '#38bdf8' },
                  { value: 'casual', label: 'Casual', color: '#10b981' },
                  { value: 'formal', label: 'Formal', color: '#f59e0b' },
                  { value: 'mentor', label: 'Mentor-like', color: '#c084fc' },
                ] as const).map(v => {
                  const isActive = (config.personaVoice || 'mentor') === v.value;
                  return (
                    <button key={v.value} onClick={() => updateConfig({ personaVoice: v.value })}
                      className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-widest transition-all hover:scale-105"
                      style={{
                        background: isActive ? `${v.color}10` : 'transparent',
                        border: `1px solid ${isActive ? v.color + '30' : 'var(--p-border)'}`,
                        color: isActive ? v.color : 'var(--p-text-ghost)',
                        cursor: 'pointer',
                      }}>
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Response Length */}
            <div className="mb-6">
              <p className="text-xs mb-3" style={{ color: 'var(--p-text-mid)' }}>Response length</p>
              <div className="flex gap-2">
                {([
                  { value: 'concise', label: 'Concise', desc: 'Under 60 words' },
                  { value: 'detailed', label: 'Detailed', desc: 'Full context, 120+ words' },
                  { value: 'adaptive', label: 'Adaptive', desc: 'Matches your energy' },
                ] as const).map(l => {
                  const isActive = (config.personaLength || 'adaptive') === l.value;
                  return (
                    <button key={l.value} onClick={() => updateConfig({ personaLength: l.value })}
                      className="flex-1 rounded-xl p-3 text-center transition-all hover:scale-[1.01]"
                      style={{
                        background: isActive ? 'rgba(192,132,252,0.06)' : 'var(--p-bg-card-2)',
                        border: `1px solid ${isActive ? 'rgba(192,132,252,0.25)' : 'var(--p-border)'}`,
                        cursor: 'pointer',
                      }}>
                      <p className="text-xs font-mono mb-0.5" style={{ color: isActive ? '#c084fc' : 'var(--p-text-dim)' }}>{l.label}</p>
                      <p className="text-[10px]" style={{ color: 'var(--p-text-ghost)' }}>{l.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personality Traits — toggle pills */}
            <div className="mb-6">
              <p className="text-xs mb-3" style={{ color: 'var(--p-text-mid)' }}>Personality traits <span style={{ color: 'var(--p-text-ghost)' }}>(select up to 4)</span></p>
              <div className="flex gap-2 flex-wrap">
                {['empathetic', 'analytical', 'encouraging', 'honest', 'patient', 'strategic', 'humorous', 'challenging'].map(trait => {
                  const traits = config.personaTraits || [];
                  const isActive = traits.includes(trait);
                  return (
                    <button key={trait} onClick={() => {
                      if (isActive) {
                        updateConfig({ personaTraits: traits.filter(t => t !== trait) });
                      } else if (traits.length < 4) {
                        updateConfig({ personaTraits: [...traits, trait] });
                      }
                    }}
                      className="px-4 py-2 rounded-full text-xs font-mono capitalize transition-all hover:scale-105"
                      style={{
                        background: isActive ? 'rgba(192,132,252,0.08)' : 'transparent',
                        border: `1px solid ${isActive ? 'rgba(192,132,252,0.25)' : 'var(--p-border)'}`,
                        color: isActive ? '#c084fc' : 'var(--p-text-ghost)',
                        cursor: 'pointer',
                        opacity: !isActive && traits.length >= 4 ? 0.3 : 1,
                      }}>
                      {isActive && <span style={{ color: '#c084fc' }}>✓ </span>}{trait}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Avatar photo */}
            <div className="mb-6">
              <p className="text-xs mb-3" style={{ color: 'var(--p-text-mid)' }}>Avatar photo</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(192,132,252,0.2)' }}>
                  <img src={config.personaPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=512&auto=format&fit=crop&crop=face'}
                    alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <button onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file'; input.accept = 'image/*';
                    input.onchange = (e: any) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const data = ev.target?.result as string;
                        updateConfig({ personaPhoto: data });
                        try { localStorage.setItem('prism_sanctum_avatar_photo', data); } catch {}
                      };
                      reader.readAsDataURL(file);
                    };
                    input.click();
                  }}
                    className="px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-widest transition-all hover:scale-105"
                    style={{ background: 'rgba(192,132,252,0.06)', border: '1px solid rgba(192,132,252,0.15)', color: '#c084fc', cursor: 'pointer' }}>
                    Upload photo
                  </button>
                  <p className="text-[10px] mt-1.5" style={{ color: 'var(--p-text-ghost)' }}>This face appears in The Sanctum during conversations.</p>
                </div>
              </div>
            </div>

            {/* Voice tuning */}
            <div className="mb-6">
              <p className="text-xs mb-3" style={{ color: 'var(--p-text-mid)' }}>Voice tuning</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1.5">
                    <span style={{ color: 'var(--p-text-ghost)' }}>Speed</span>
                    <span style={{ color: '#c084fc' }}>{(config.personaVoiceRate || 0.95).toFixed(2)}</span>
                  </div>
                  <input type="range" min="0.7" max="1.3" step="0.05" value={config.personaVoiceRate || 0.95}
                    onChange={e => updateConfig({ personaVoiceRate: parseFloat(e.target.value) })}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#c084fc', background: 'var(--p-border)' }} />
                  <div className="flex justify-between text-[9px] mt-1" style={{ color: 'var(--p-text-ghost)' }}>
                    <span>Slow</span><span>Fast</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono mb-1.5">
                    <span style={{ color: 'var(--p-text-ghost)' }}>Pitch</span>
                    <span style={{ color: '#c084fc' }}>{(config.personaVoicePitch || 0.95).toFixed(2)}</span>
                  </div>
                  <input type="range" min="0.5" max="1.5" step="0.05" value={config.personaVoicePitch || 0.95}
                    onChange={e => updateConfig({ personaVoicePitch: parseFloat(e.target.value) })}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#c084fc', background: 'var(--p-border)' }} />
                  <div className="flex justify-between text-[9px] mt-1" style={{ color: 'var(--p-text-ghost)' }}>
                    <span>Low</span><span>High</span>
                  </div>
                </div>
              </div>
              <button onClick={() => {
                const u = new SpeechSynthesisUtterance('Hello, I am your Prism manager. How can I help you today?');
                u.rate = config.personaVoiceRate || 0.95; u.pitch = config.personaVoicePitch || 0.95;
                const voices = window.speechSynthesis?.getVoices() || [];
                const pick = voices.find(v => /Google.*US|Samantha|Daniel|Karen/i.test(v.name) && v.lang.startsWith('en'))
                  || voices.find(v => v.lang.startsWith('en')) || voices[0];
                if (pick) u.voice = pick;
                window.speechSynthesis?.cancel();
                window.speechSynthesis?.speak(u);
              }}
                className="mt-3 px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all hover:scale-105"
                style={{ background: 'rgba(192,132,252,0.04)', border: '1px solid rgba(192,132,252,0.1)', color: 'var(--p-text-ghost)', cursor: 'pointer' }}>
                ▶ Preview voice
              </button>
            </div>

            {/* Default greeting */}
            <div>
              <p className="text-xs mb-2" style={{ color: 'var(--p-text-mid)' }}>Default greeting</p>
              <textarea
                value={config.personaGreeting || 'Welcome to The Sanctum. I\'m here to help you grow.'}
                onChange={e => updateConfig({ personaGreeting: e.target.value })}
                className="w-full bg-transparent text-sm font-light outline-none resize-none rounded-xl p-4 leading-relaxed"
                style={{ color: 'var(--p-text-body)', background: 'var(--p-bg-input)', border: '1px solid var(--p-border)', minHeight: '60px' }}
                rows={2} />
              <p className="text-[10px] mt-2" style={{ color: 'var(--p-text-ghost)' }}>
                This greeting opens every Sanctum session. The Prism will adapt it based on time of day and employee context.
              </p>
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
                  <button key={f} onClick={() => { setEmailFreq(f); showToast(`Email frequency: ${f}`); }}
                    className="px-4 py-2 rounded-xl text-xs font-mono transition-all"
                    style={{ background: f === emailFreq ? 'rgba(244,63,94,0.08)' : 'transparent', border: `1px solid ${f === emailFreq ? 'rgba(244,63,94,0.25)' : 'var(--p-border)'}`, color: f === emailFreq ? '#f43f5e' : 'var(--p-text-dim)', cursor: 'pointer' }}>
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
      </div>{/* end two-column flex */}


        {/* Section 8: AI Engine */}
        <div id="ai" ref={el => { sectionRefs.current.ai = el; }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[2rem] p-6 md:p-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
            <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-4 mb-6"
              style={{ color: 'var(--p-text-ghost)', borderColor: 'var(--p-border)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4m-7.07-15.07 2.83 2.83m8.49 8.49 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.49-8.49 2.83-2.83"/></svg>
              AI Engine Configuration
            </h3>

            <div className="mb-6">
              <p className="text-xs mb-2" style={{ color: 'var(--p-text-mid)' }}>Anthropic API Key</p>
              <p className="text-[10px] mb-3" style={{ color: 'var(--p-text-ghost)' }}>
                Connect The Sanctum to Claude for real AI conversations. Get your key from <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>console.anthropic.com</a>
              </p>
              <div className="flex gap-3">
                <input
                  type="password"
                  placeholder="sk-ant-api03-..."
                  defaultValue={(() => { try { return localStorage.getItem('prism_anthropic_key') || ''; } catch { return ''; } })()}
                  onChange={e => {
                    const val = e.target.value.trim();
                    try {
                      if (val) localStorage.setItem('prism_anthropic_key', val);
                      else localStorage.removeItem('prism_anthropic_key');
                    } catch {}
                  }}
                  className="flex-1 bg-transparent text-sm font-mono outline-none rounded-xl px-4 py-3"
                  style={{ color: 'var(--p-text-body)', background: 'var(--p-bg-input)', border: '1px solid var(--p-border)' }}
                />
                <button
                  onClick={() => {
                    const key = localStorage.getItem('prism_anthropic_key') || '';
                    if (!key || key.length < 20) { setToast('Enter a valid API key first'); return; }
                    fetch('https://api.anthropic.com/v1/messages', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
                      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 10, messages: [{ role: 'user', content: 'hi' }] }),
                    }).then(r => {
                      if (r.ok) setToast('API key verified — Claude is connected');
                      else setToast('API key invalid or expired');
                    }).catch(() => setToast('Connection failed — check your network'));
                  }}
                  className="px-5 py-3 rounded-xl text-xs font-mono uppercase tracking-widest transition-all hover:scale-105"
                  style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', color: '#38bdf8', cursor: 'pointer' }}
                >
                  Test
                </button>
              </div>
              <p className="text-[10px] mt-2" style={{ color: 'var(--p-text-ghost)' }}>
                Stored in your browser only. Never sent to our servers. Used for direct Sanctum conversations.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-xs mb-2" style={{ color: 'var(--p-text-mid)' }}>Model</p>
              <div className="flex gap-2">
                {['claude-sonnet-4-20250514', 'claude-haiku-4-5-20251001'].map(m => {
                  const current = (() => { try { return localStorage.getItem('prism_ai_model') || 'claude-sonnet-4-20250514'; } catch { return 'claude-sonnet-4-20250514'; } })();
                  const isActive = current === m;
                  return (
                    <button key={m} onClick={() => { try { localStorage.setItem('prism_ai_model', m); setToast('Model updated to ' + m.split('-').slice(0,2).join(' ')); } catch {} }}
                      className="px-4 py-2.5 rounded-xl text-[10px] font-mono transition-all hover:scale-[1.02]"
                      style={{ background: isActive ? 'rgba(56,189,248,0.06)' : 'transparent', border: `1px solid ${isActive ? 'rgba(56,189,248,0.2)' : 'var(--p-border)'}`, color: isActive ? '#38bdf8' : 'var(--p-text-ghost)', cursor: 'pointer' }}>
                      {m.includes('sonnet') ? 'Sonnet 4' : 'Haiku 4.5'}
                      {isActive && <span className="ml-2" style={{ color: '#10b981' }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

          </motion.div>
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
