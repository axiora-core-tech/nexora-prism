import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight, ChevronRight, Target, Network, DollarSign, Brain, Heart, Shield, Zap, Users, BarChart2, CheckCircle2, X, ArrowLeft, Eye, EyeOff, Mail, Lock, Building2, UserPlus, Send, Sparkles } from 'lucide-react';

// ─── Custom Cursor (same as app) ────────────────────────────────────────────
function LandingCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 200, mass: 0.5 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); setVisible(true); };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const clickable = ['button','a'].includes(t.tagName.toLowerCase()) || t.closest('button') || t.closest('a');
      setHovering(!!clickable);
      const dc = t.getAttribute('data-cursor') || (t.closest('[data-cursor]') as HTMLElement)?.getAttribute('data-cursor') || '';
      setHoverText(dc);
    };
    const onOut = () => { setHovering(false); setHoverText(''); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseover', onOver); window.removeEventListener('mouseout', onOut); };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <motion.div className="fixed top-0 left-0 pointer-events-none z-[999] flex items-center justify-center"
      style={{ x: cursorX, y: cursorY, opacity: visible ? 1 : 0, translateX: '-50%', translateY: '-50%' }}>
      <motion.div
        animate={{ width: hovering ? (hoverText ? 80 : 48) : 24, height: hovering ? (hoverText ? 80 : 48) : 24, backgroundColor: hovering ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0)', borderColor: hovering ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)', backdropFilter: hovering ? 'blur(4px)' : 'blur(0px)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="absolute rounded-full border border-white/50 flex items-center justify-center mix-blend-difference"
      >
        <motion.span animate={{ opacity: hoverText ? 1 : 0, scale: hoverText ? 1 : 0.5 }}
          className="text-[10px] font-mono uppercase tracking-widest text-white whitespace-nowrap">{hoverText}</motion.span>
      </motion.div>
      <motion.div animate={{ scale: hovering && !hoverText ? 0 : 1, opacity: hovering && hoverText ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="w-1.5 h-1.5 bg-white rounded-full mix-blend-difference" />
    </motion.div>
  );
}


// ─── Prism Mark ─────────────────────────────────────────────────────────────
// Six spectral arcs forming the bowl of a P.
// Animations use Framer Motion so they work reliably in React.
// compact=true → arc-fan only (no stem) used in the nav lockup beside "PRISM"
// compact=false → full letterform (stem + bowl) used standalone
function PrismMark({ size = 32, compact = false }: { size?: number; compact?: boolean }) {
  const w = size;
  const h = compact ? size : size * (184 / 74);
  const vbW = 74;
  const vbH = compact ? 74 : 184;

  // Arc specs: [stroke, radius, period-seconds]
  const arcs: [string, number, number][] = [
    ['#f43f5e', 36.7, 4.00],
    ['#fb923c', 38.5, 3.60],
    ['#fbbf24', 40.8, 3.31],
    ['#34d399', 43.7, 3.03],
    ['#38bdf8', 46.1, 2.69],
    ['#a78bfa', 49.5, 2.40],
  ];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${vbW} ${vbH}`} fill="none"
      style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}>

      {/* Entry ray + stem — only in full mode */}
      {!compact && (
        <>
          <motion.line x1="21" y1="0" x2="21" y2="10"
            stroke="rgba(255,255,255,0.45)" strokeWidth="0.7" strokeLinecap="round"
            animate={{ opacity: [0.45, 0.96, 0.45] }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }} />
          <motion.line x1="21" y1="10" x2="21" y2="172"
            stroke="rgba(255,255,255,0.90)" strokeWidth="1.6" strokeLinecap="round"
            animate={{ opacity: [0.78, 0.96, 0.78] }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }} />
        </>
      )}

      {/* Refraction node */}
      <motion.circle cx="21" cy="10" r="1.8" fill="rgba(255,255,255,0.90)"
        animate={{ scale: [1, 1.6, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
        style={{ transformOrigin: '21px 10px' }} />

      {/* Spectral arcs — each breathes at its own frequency */}
      {arcs.map(([stroke, r, dur], i) => (
        <motion.path
          key={i}
          d={`M21 10 A${r} ${r} 0 0 1 21 80`}
          stroke={stroke}
          strokeWidth="0.85"
          strokeLinecap="round"
          fill="none"
          animate={{ opacity: [0.35 + i * 0.02, 0.92 + i * 0.01, 0.35 + i * 0.02] }}
          transition={{ duration: dur, ease: 'easeInOut', repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

// ─── Auth Modal ──────────────────────────────────────────────────────────────
type AuthMode = 'login' | 'signup' | 'org' | 'invite';

function AuthModal({ mode: initialMode, onClose }: { mode: AuthMode; onClose: () => void }) {
  const [mode, setMode]           = useState<AuthMode>(initialMode);
  const [showPass, setShowPass]   = useState(false);
  const [email, setEmail]         = useState('');
  const [pass, setPass]           = useState('');
  const [name, setName]           = useState('');
  const [org, setOrg]             = useState('');
  const [invites, setInvites]     = useState(['', '', '']);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-[#0a0a0b] border border-white/10 rounded-[2rem] p-10 relative overflow-hidden text-center"
          onClick={e => e.stopPropagation()}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/8 blur-[80px] rounded-full pointer-events-none" />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={24} className="text-emerald-400" />
          </motion.div>
          <h3 className="text-2xl font-light text-white mb-2">
            {mode === 'invite' ? 'Invitations' : 'Signal'} <span className="italic font-serif text-white/40">Transmitted</span>
          </h3>
          <p className="text-white/40 text-xs uppercase tracking-widest font-mono mb-8">
            {mode === 'login' ? 'Redirecting to dashboard...' :
             mode === 'signup' || mode === 'org' ? 'Organisation node initialised' :
             `${invites.filter(Boolean).length} team nodes invited`}
          </p>
          <NavLink to="/enter" onClick={onClose}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-light hover:bg-white/[0.04] hover:border-white/20 transition-all"
            data-cursor="Enter App">
            Enter Dashboard <ArrowUpRight size={14} />
          </NavLink>
        </motion.div>
      </motion.div>
    );
  }

  const tabs: { id: AuthMode; label: string }[] = [
    { id: 'login',  label: 'Sign In'      },
    { id: 'signup', label: 'Create Account'},
    { id: 'org',    label: 'Organisation'  },
    { id: 'invite', label: 'Invite Team'   },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{ opacity: 0, y: 20,  scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg bg-[#0a0a0b] border border-white/10 rounded-[2rem] overflow-hidden relative"
        onClick={e => e.stopPropagation()}>

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 blur-[60px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between p-8 pb-0 relative z-10">
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold mb-2">Prism Intelligence</p>
            <h3 className="text-2xl font-light text-white">
              {mode === 'login'  ? 'Welcome' :
               mode === 'signup' ? 'New' :
               mode === 'org'    ? 'Organisation' :
               'Team'} <span className="font-serif italic text-white/40">
                {mode === 'login'  ? 'Back'    :
                 mode === 'signup' ? 'Node'    :
                 mode === 'org'    ? 'Protocol':
                 'Constellation'}
              </span>
            </h3>
          </div>
          <button onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/[0.04] transition-all"
            data-cursor="Close">
            <X size={14} />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 mx-8 mt-6 p-1 bg-white/5 border border-white/5 rounded-xl relative z-10">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setMode(tab.id)}
              className={`flex-1 py-2 rounded-lg text-[10px] uppercase tracking-widest font-medium transition-all ${
                mode === tab.id ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
              }`} data-cursor={tab.label}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.div key={mode}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.25 }}
            className="p-8 pt-6 space-y-4 relative z-10">

            {/* LOGIN */}
            {mode === 'login' && (<>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@company.com"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Passphrase</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={pass} onChange={e => setPass(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-12 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors" data-cursor="Toggle">
                    {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono">Forgot passphrase?</span>
                <button onClick={() => setMode('signup')} className="text-[9px] uppercase tracking-widest text-cyan-400/70 hover:text-cyan-400 transition-colors font-mono" data-cursor="Create">
                  New account →
                </button>
              </div>
            </>)}

            {/* SIGNUP */}
            {mode === 'signup' && (<>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Full Name</label>
                <div className="relative">
                  <Users size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Your full name"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@company.com"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Passphrase</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={pass} onChange={e => setPass(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="Min 12 characters"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-12 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors" data-cursor="Toggle">
                    {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              <button onClick={() => setMode('org')} className="text-[9px] uppercase tracking-widest text-amber-400/70 hover:text-amber-400 transition-colors font-mono" data-cursor="Continue">
                Continue to organisation setup →
              </button>
            </>)}

            {/* ORG SETUP */}
            {mode === 'org' && (<>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Organisation Name</label>
                <div className="relative">
                  <Building2 size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={org} onChange={e => setOrg(e.target.value)} type="text" placeholder="Acme Corp"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Organisation Domain</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xs font-mono">@</span>
                  <input type="text" placeholder="acme.com"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">Team Size</label>
                <select className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-white/20">
                  {['1–10 nodes', '11–50 nodes', '51–200 nodes', '201–500 nodes', '500+ nodes'].map(s => (
                    <option key={s} className="bg-[#0a0a0b]">{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button onClick={() => setMode('signup')} className="px-5 py-2.5 rounded-2xl border border-white/5 text-white/40 text-xs hover:text-white hover:bg-white/[0.04] transition-all" data-cursor="Back">
                  <ArrowLeft size={13} />
                </button>
                <button onClick={() => setMode('invite')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-light hover:bg-white/[0.04] hover:border-white/20 transition-all" data-cursor="Invite Team">
                  Continue to Invitations <ChevronRight size={12} />
                </button>
              </div>
            </>)}

            {/* INVITE */}
            {mode === 'invite' && (<>
              <div className="flex items-center gap-3 mb-2">
                <UserPlus size={12} className="text-cyan-400" />
                <p className="text-white/40 text-xs font-light">Invite team members by email. They'll receive a secure onboarding link.</p>
              </div>
              {invites.map((inv, i) => (
                <div key={i}>
                  <label className="text-[9px] uppercase tracking-widest text-white/30 font-mono block mb-2">
                    Node {String(i + 1).padStart(2, '0')} — Email
                  </label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input value={inv} onChange={e => { const n = [...invites]; n[i] = e.target.value; setInvites(n); }}
                      type="email" placeholder={`colleague${i + 1}@company.com`}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                  </div>
                </div>
              ))}
              <button onClick={() => setInvites([...invites, ''])}
                className="text-[9px] uppercase tracking-widest text-white/30 hover:text-white/60 font-mono transition-colors flex items-center gap-1"
                data-cursor="Add Node">
                + Add another node
              </button>
            </>)}

            {/* Primary CTA */}
            <button onClick={handleSubmit}
              className="w-full relative group overflow-hidden rounded-2xl mt-2"
              data-cursor={mode === 'login' ? 'Transmit' : mode === 'invite' ? 'Send Invitations' : 'Continue'}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 flex items-center justify-between group-hover:bg-white/[0.04] group-hover:border-white/20 transition-all">
                <span className="text-white text-sm font-light">
                  {mode === 'login'  ? 'Transmit Credentials' :
                   mode === 'signup' ? 'Initialise Node'      :
                   mode === 'org'    ? 'Deploy Organisation'  :
                   'Broadcast Invitations'}
                </span>
                <Send size={14} className="text-white/40 group-hover:text-cyan-400 transition-colors" />
              </div>
            </button>

            <p className="text-[8px] text-white/20 text-center font-mono uppercase tracking-widest">
              End-to-end encrypted · SOC 2 Type II · GDPR compliant
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Research stats data ─────────────────────────────────────────────────────
const researchStats = [
  { value: '$11.1T', label: 'Lost annually to disengaged employees globally', source: 'Gallup State of the Global Workplace, 2023' },
  { value: '92%',   label: 'Of HR leaders say performance data is siloed or incomplete', source: 'Deloitte Global Human Capital Trends, 2024' },
  { value: '200%',  label: 'Cost of replacing an employee relative to annual salary', source: 'SHRM Employee Benefits Research, 2023' },
  { value: '34%',   label: 'Productivity gain from structured continuous feedback cycles', source: 'MIT Sloan Management Review, 2022' },
];

const featureBlocks = [
  {
    icon: Target, color: '#f59e0b', glow: 'rgba(245,158,11,0.1)',
    label: 'Signal Calibration', tag: 'KPI · OKR · Goals',
    headline: 'Every employee, every signal, in one system',
    body: 'Real-time KPI tracking with weighted composite scoring. Set objectives that cascade from organisation to individual, with live progress signals that flag drift before it becomes attrition.',
    stat: '34%', statLabel: 'avg. performance gain',
  },
  {
    icon: Network, color: '#c084fc', glow: 'rgba(192,132,252,0.1)',
    label: 'Network Resonance', tag: '360° · Peer · Manager',
    headline: 'Feedback that reveals what surveys cannot',
    body: 'Multi-dimensional 360° reviews with radar visualisation across five competency axes. Anonymous peer channels surface the signals that one-to-ones miss.',
    stat: '2.4×', statLabel: 'more accurate attrition prediction',
  },
  {
    icon: DollarSign, color: '#10b981', glow: 'rgba(16,185,129,0.1)',
    label: 'Capital Matrix', tag: 'ROI · Investment · Value',
    headline: 'Quantify the human capital return',
    body: 'Map every salary dollar to revenue generated, cost saved, and project value delivered. Quarterly ROI curves per employee, per department, per initiative.',
    stat: '$246%', statLabel: 'median org ROI on Prism teams',
  },
  {
    icon: Brain, color: '#38bdf8', glow: 'rgba(56,189,248,0.1)',
    label: 'Bio-Rhythm Telemetry', tag: 'Burnout · Wellbeing · Stress',
    headline: 'Intervene before burnout, not after',
    body: 'Psychometric signals from work pattern data: focus block density, cognitive load index, and burnout probability. Mandated PTO recommendations trigger before 70% threshold.',
    stat: '88%', statLabel: 'burnout prediction accuracy',
  },
];

const citations = [
  {
    quote: 'Organisations that invest in continuous performance management see 14% higher employee performance and 60% lower regrettable turnover.',
    source: 'McKinsey & Company', year: '2023', link: '#',
  },
  {
    quote: 'Real-time people analytics reduces time-to-insight for HR decision-making by 73%, enabling proactive rather than reactive talent management.',
    source: 'Harvard Business Review', year: '2024', link: '#',
  },
  {
    quote: 'Companies using ROI-linked performance tools see 2.3× greater revenue per employee than peers using traditional annual review cycles.',
    source: 'Gartner Workforce Insights', year: '2023', link: '#',
  },
];

const pricingPlans = [
  {
    name: 'Signal', price: '$18', unit: '/node/mo', color: '#52525b',
    desc: 'For individuals and small teams getting started',
    features: ['KPI & OKR tracking', 'Basic 360° reviews', 'Attendance matrix', 'Up to 10 nodes'],
    cta: 'login' as AuthMode,
  },
  {
    name: 'Constellation', price: '$42', unit: '/node/mo', color: '#38bdf8',
    desc: 'Full performance intelligence for growing teams',
    features: ['All Signal features', 'ROI Intelligence engine', 'Bio-rhythm telemetry', 'Leaderboard & rankings', 'Team invitations', 'Up to 200 nodes'],
    cta: 'org' as AuthMode,
    featured: true,
  },
  {
    name: 'Prism', price: 'Custom', unit: '', color: '#c084fc',
    desc: 'Enterprise-grade for 200+ node organisations',
    features: ['All Constellation features', 'SSO / SAML integration', 'Custom benchmarks', 'Dedicated CSM', 'SLA 99.99%', 'Unlimited nodes'],
    cta: 'org' as AuthMode,
  },
];

// ─── Landing Page ────────────────────────────────────────────────────────────
export function Landing() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.2], ['0%', '12%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div className="min-h-screen bg-[#030303] text-[#e5e5e5] font-sans selection:bg-purple-500/30 selection:text-white cursor-none overflow-hidden relative">
      <LandingCursor />

      {/* ── Ambient background orbs (identical to Layout) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
        <motion.div
          animate={{ rotate: [0, 90, 0], scale: [1, 1.2, 1], x: [0, 50, -50, 0], y: [0, 50, -50, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-900/20 blur-[120px]"
        />
        <motion.div
          animate={{ rotate: [0, -90, 0], scale: [1, 1.3, 1], x: [0, -50, 50, 0], y: [0, -50, 50, 0] }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/10 blur-[120px]"
        />
      </div>

      {/* ── Scrollable content ── */}
      <div ref={containerRef} className="relative z-10 h-screen overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none' }}>
        <style dangerouslySetInnerHTML={{ __html: '::-webkit-scrollbar { display: none; }' }} />

        {/* ════════════════════════════════════════════
            NAV
        ════════════════════════════════════════════ */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-12 py-6"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-crosshair" data-cursor="Prism">
            <PrismMark size={18} compact={true} />
            <span className="text-white text-sm font-light tracking-widest uppercase">PRISM</span>
            <span className="text-white/20 text-[9px] font-mono uppercase tracking-widest border border-white/10 px-1.5 py-0.5 rounded-full">Intelligence</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Research',  href: '#research'  },
              { label: 'Features',  href: '#features'  },
              { label: 'Pricing',   href: '#pricing'   },
            ].map(link => (
              <a key={link.label} href={link.href}
                className="text-white/40 text-xs uppercase tracking-widest hover:text-white transition-colors font-light"
                data-cursor={link.label}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuthMode('login')}
              className="px-4 py-2 rounded-full text-xs uppercase tracking-widest text-white/40 border border-white/5 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all font-light"
              data-cursor="Sign In">
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className="px-4 py-2 rounded-full text-xs uppercase tracking-widest text-white bg-white/5 border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all font-light flex items-center gap-2"
              data-cursor="Get Started">
              Get Started <ArrowUpRight size={11} />
            </button>
          </div>
        </motion.nav>

        {/* ════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════ */}
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-24 relative">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="w-full max-w-[1400px] mx-auto">

            {/* Hero mark */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16"
            >
              <PrismMark size={48} />
            </motion.div>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-10"
            >
              <span className="text-cyan-400 uppercase tracking-[0.3em] text-[10px] font-bold border-l-2 border-cyan-400 pl-4 py-1">
                Performance Intelligence Platform
              </span>
              <span className="px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/8 text-[9px] uppercase tracking-widest font-mono">
                v2.4 — Now in Production
              </span>
            </motion.div>

            {/* H1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <h1 className="text-[clamp(3.5rem,10vw,9rem)] font-light tracking-tighter text-white leading-[0.88] mb-6">
                Your people are<br />
                your <span className="text-white/30 italic font-serif">greatest</span><br />
                signal.
              </h1>
            </motion.div>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="text-white/50 text-lg font-light leading-relaxed max-w-xl mb-12"
            >
              Prism transforms scattered HR data into precision performance intelligence. 
              Real-time KPIs, 360° resonance, ROI mapping, and burnout telemetry — 
              all in a single obsidian interface.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="flex flex-wrap items-center gap-4 mb-20"
            >
              <button
                onClick={() => setAuthMode('signup')}
                className="group relative overflow-hidden px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.04] hover:border-white/20 transition-all flex items-center gap-3"
                data-cursor="Deploy Node">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="relative text-white text-sm font-light">Deploy Your Organisation</span>
                <ArrowUpRight size={14} className="relative text-white/40 group-hover:text-cyan-400 transition-colors" />
              </button>
              <button
                onClick={() => setAuthMode('login')}
                className="px-8 py-4 rounded-2xl border border-white/5 text-white/50 text-sm font-light hover:text-white hover:border-white/10 transition-all"
                data-cursor="Sign In">
                Sign in to Dashboard
              </button>
            </motion.div>

            {/* Hero stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { val: '246%',    label: 'Median org ROI', color: '#10b981' },
                { val: '88%',     label: 'Burnout prediction accuracy', color: '#f59e0b' },
                { val: '34%',     label: 'Performance uplift', color: '#38bdf8' },
                { val: '2.4×',    label: 'Attrition prediction', color: '#c084fc' },
              ].map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 overflow-hidden group hover:bg-white/[0.04] hover:border-white/10 transition-colors cursor-crosshair"
                  data-cursor="Research Data"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: s.color + '20' }} />
                  <p className="text-3xl font-light text-white mb-1">{s.val}</p>
                  <p className="text-[9px] uppercase tracking-widest text-white/30 font-mono">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
            <span className="text-[8px] uppercase tracking-widest text-white/20 font-mono">Scroll to explore</span>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════
            RESEARCH STATS TICKER
        ════════════════════════════════════════════ */}
        <section className="border-y border-white/5 py-12 px-6 md:px-12" id="research">
          <div className="w-full max-w-[1400px] mx-auto">
            <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold mb-10 flex items-center gap-2">
              <BarChart2 size={12} className="text-amber-400" /> Peer-Reviewed Research Basis
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {researchStats.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative bg-white/5 border border-white/5 rounded-[2rem] p-6 overflow-hidden group hover:bg-white/[0.04] transition-colors cursor-crosshair"
                  data-cursor="Source"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-amber-500/8 transition-all duration-700" />
                  <p className="text-4xl font-light text-white mb-3">{s.value}</p>
                  <p className="text-xs text-white/50 font-light leading-relaxed mb-4">{s.label}</p>
                  <p className="text-[8px] uppercase tracking-widest text-white/25 font-mono border-t border-white/5 pt-3">{s.source}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FEATURES
        ════════════════════════════════════════════ */}
        <section className="py-32 px-6 md:px-12" id="features">
          <div className="w-full max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-12"
            >
              <div>
                <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-2">
                  <Sparkles size={12} className="text-cyan-400" /> Module Architecture
                </p>
                <h2 className="text-7xl md:text-9xl font-light tracking-tighter text-white leading-[0.9]">
                  Four <span className="text-white/30 italic font-serif">Engines</span>
                </h2>
              </div>
              <p className="text-white/40 text-sm font-light leading-relaxed max-w-sm">
                Each module is independently powerful. Together they form a complete 
                performance intelligence layer for your organisation.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featureBlocks.map((f, i) => (
                <motion.div key={f.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative bg-white/5 border border-white/5 rounded-[2rem] p-8 overflow-hidden group hover:bg-white/[0.04] hover:border-white/10 transition-colors cursor-crosshair"
                  data-cursor="Explore"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-700" style={{ background: f.glow }} />

                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: f.color + '15' }}>
                        <f.icon size={16} style={{ color: f.color }} />
                      </div>
                      <div>
                        <p className="text-white/40 text-[9px] uppercase tracking-widest font-mono">{f.tag}</p>
                        <p className="text-white text-sm font-light mt-0.5">{f.label}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-light" style={{ color: f.color }}>{f.stat}</p>
                      <p className="text-[9px] uppercase tracking-widest text-white/30 font-mono mt-0.5">{f.statLabel}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-light text-white/90 mb-4 leading-snug relative z-10">{f.headline}</h3>
                  <p className="text-xs text-white/40 font-light leading-relaxed relative z-10">{f.body}</p>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 relative z-10">
                    <button
                      onClick={() => setAuthMode('signup')}
                      className="text-[9px] uppercase tracking-widest font-mono transition-colors flex items-center gap-1.5"
                      style={{ color: f.color }}
                      data-cursor="Deploy"
                    >
                      Deploy this module <ChevronRight size={9} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CITATIONS
        ════════════════════════════════════════════ */}
        <section className="py-24 px-6 md:px-12 border-t border-white/5">
          <div className="w-full max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16"
            >
              <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold flex items-center gap-2">
                <Shield size={12} className="text-purple-400" /> Academic & Industry Citations
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {citations.map((c, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative bg-white/5 border border-white/5 rounded-[2rem] p-8 overflow-hidden group hover:bg-white/[0.04] transition-colors cursor-crosshair"
                  data-cursor="Read Source"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 blur-[60px] rounded-full pointer-events-none" />
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500/40 to-transparent rounded-l-[2rem]" />

                  <p className="text-white/60 text-sm font-light font-serif italic leading-relaxed mb-6 relative z-10">
                    "{c.quote}"
                  </p>
                  <div className="flex items-center justify-between relative z-10 border-t border-white/5 pt-4">
                    <p className="text-white/40 text-xs font-light">{c.source}</p>
                    <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest">{c.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            PRICING
        ════════════════════════════════════════════ */}
        <section className="py-32 px-6 md:px-12 border-t border-white/5" id="pricing">
          <div className="w-full max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-12"
            >
              <div>
                <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold mb-6 flex items-center gap-2">
                  <Zap size={12} className="text-amber-400" /> Deployment Tiers
                </p>
                <h2 className="text-7xl md:text-9xl font-light tracking-tighter text-white leading-[0.9]">
                  Choose <span className="text-white/30 italic font-serif">Protocol</span>
                </h2>
              </div>
              <p className="text-white/40 text-sm font-light max-w-xs text-right">
                All plans include a 30-day full-access trial. No credit card required to initialise.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, i) => (
                <motion.div key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative rounded-[2rem] overflow-hidden border transition-colors ${
                    plan.featured
                      ? 'bg-white/5 border-white/10'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, transparent, ${plan.color}, transparent)` }} />
                  )}
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[70px] pointer-events-none" style={{ background: plan.color + (plan.featured ? '12' : '08') }} />

                  <div className="p-8 relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest font-mono mb-1" style={{ color: plan.color }}>
                          {plan.featured ? '★ Most Popular' : plan.name}
                        </p>
                        <h3 className="text-xl font-light text-white">{plan.featured ? plan.name : plan.name}</h3>
                        <p className="text-white/30 text-xs font-light mt-1">{plan.desc}</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <span className="text-4xl font-light text-white">{plan.price}</span>
                      {plan.unit && <span className="text-white/30 text-sm font-light ml-1">{plan.unit}</span>}
                    </div>

                    <div className="space-y-3 mb-8">
                      {plan.features.map(f => (
                        <div key={f} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: plan.color }} />
                          <span className="text-xs text-white/50 font-light">{f}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setAuthMode(plan.cta)}
                      className="w-full py-3 rounded-2xl border text-sm font-light transition-all flex items-center justify-center gap-2"
                      style={plan.featured
                        ? { borderColor: plan.color + '40', background: plan.color + '12', color: 'white' }
                        : {}}
                      data-cursor="Deploy"
                    >
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Deploy Now'}
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FINAL CTA
        ════════════════════════════════════════════ */}
        <section className="py-40 px-6 md:px-12 border-t border-white/5">
          <div className="w-full max-w-[1400px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex justify-center mb-10">
                <PrismMark size={28} />
              </div>
              <p className="text-white/40 uppercase tracking-[0.2em] text-xs font-semibold mb-8 flex items-center justify-center gap-2">
                <Heart size={12} className="text-rose-400" /> Ready to Amplify Your Signal
              </p>
              <h2 className="text-[clamp(3rem,8vw,7rem)] font-light tracking-tighter text-white leading-[0.9] mb-8">
                Your people deserve<br />
                <span className="text-white/30 italic font-serif">better intelligence.</span>
              </h2>
              <p className="text-white/40 text-sm font-light max-w-lg mx-auto mb-12 leading-relaxed">
                Join 2,400+ organisations using Prism to turn HR data into competitive advantage. 
                30-day trial. No card required. Full-access from day one.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setAuthMode('signup')}
                  className="group relative overflow-hidden px-10 py-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.04] hover:border-white/20 transition-all flex items-center gap-3"
                  data-cursor="Deploy Node">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative text-white text-sm font-light">Deploy Your Organisation</span>
                  <ArrowUpRight size={14} className="relative text-white/40 group-hover:text-cyan-400 transition-colors" />
                </button>
                <button
                  onClick={() => setAuthMode('invite')}
                  className="px-10 py-5 rounded-2xl border border-white/5 text-white/40 text-sm font-light hover:text-white hover:border-white/10 transition-all flex items-center gap-2"
                  data-cursor="Invite Team">
                  <UserPlus size={14} /> Invite Your Team
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════ */}
        <footer className="border-t border-white/5 px-6 md:px-12 py-12">
          <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <PrismMark size={14} compact={true} />
              <span className="text-white/40 text-xs font-light tracking-widest uppercase">Prism Intelligence</span>
              <span className="text-white/20 text-[8px] font-mono uppercase tracking-widest">v2.4.1</span>
            </div>

            <div className="flex flex-wrap gap-6">
              {['Privacy Matrix', 'Security Protocol', 'Compliance', 'API Reference', 'Status'].map(link => (
                <a key={link} href="#"
                  className="text-white/25 text-[9px] uppercase tracking-widest font-mono hover:text-white/60 transition-colors"
                  data-cursor={link}>
                  {link}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setAuthMode('login')}
                className="text-[9px] uppercase tracking-widest font-mono text-white/25 hover:text-white/60 transition-colors"
                data-cursor="Sign In">
                Sign In
              </button>
              <span className="text-white/10">·</span>
              <button onClick={() => setAuthMode('signup')}
                className="text-[9px] uppercase tracking-widest font-mono text-cyan-400/50 hover:text-cyan-400 transition-colors"
                data-cursor="Deploy">
                Deploy
              </button>
            </div>
          </div>

          <div className="w-full max-w-[1400px] mx-auto mt-8 pt-6 border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[8px] font-mono uppercase tracking-widest text-white/15">
              © 2025 Prism Intelligence Ltd. All signals reserved.
            </p>
            <p className="text-[8px] font-mono uppercase tracking-widest text-white/15">
              Built with peer-reviewed methodology · SOC 2 Type II · ISO 27001
            </p>
          </div>
        </footer>
      </div>

      {/* ── Auth Modal ── */}
      <AnimatePresence>
        {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />}
      </AnimatePresence>
    </div>
  );
}
