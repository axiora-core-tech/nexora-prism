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
          className="text-sm font-mono uppercase tracking-widest text-white whitespace-nowrap">{hoverText}</motion.span>
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
          <p className="text-white/40 text-sm uppercase tracking-[0.12em] font-mono mb-8">
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
            <p className="text-white/40 uppercase tracking-[0.2em] text-sm font-semibold mb-2">Prism Intelligence</p>
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
              className={`flex-1 py-2 rounded-lg text-xs uppercase tracking-widest font-medium transition-all ${
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
                <label className="text-sm uppercase tracking-[0.12em] text-white/30 font-mono block mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@company.com"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="text-sm uppercase tracking-[0.12em] text-white/30 font-mono block mb-2">Passphrase</label>
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
                <span className="text-sm uppercase tracking-[0.12em] text-white/30 font-mono">Forgot passphrase?</span>
                <button onClick={() => setMode('signup')} className="text-sm uppercase tracking-[0.12em] text-cyan-400/70 hover:text-cyan-400 transition-colors font-mono" data-cursor="Create">
                  New account →
                </button>
              </div>
            </>)}

            {/* SIGNUP */}
            {mode === 'signup' && (<>
              <div>
                <label className="text-sm uppercase tracking-[0.12em] text-white/30 font-mono block mb-2">Full Name</label>
                <div className="relative">
                  <Users size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Your full name"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="text-sm uppercase tracking-[0.12em] text-white/30 font-mono block mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@company.com"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="text-sm uppercase tracking-[0.12em] text-white/30 font-mono block mb-2">Passphrase</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={pass} onChange={e => setPass(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="Min 12 characters"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-12 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors" data-cursor="Toggle">
                    {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              <button onClick={() => setMode('org')} className="text-sm uppercase tracking-[0.12em] text-amber-400/70 hover:text-amber-400 transition-colors font-mono" data-cursor="Continue">
                Continue to organisation setup →
              </button>
            </>)}

            {/* ORG SETUP */}
            {mode === 'org' && (<>
              <div>
                <label className="text-sm uppercase tracking-[0.12em] text-white/30 font-mono block mb-2">Organisation Name</label>
                <div className="relative">
                  <Building2 size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={org} onChange={e => setOrg(e.target.value)} type="text" placeholder="Acme Corp"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="text-sm uppercase tracking-[0.12em] text-white/30 font-mono block mb-2">Organisation Domain</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm font-mono">@</span>
                  <input type="text" placeholder="acme.com"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20" />
                </div>
              </div>
              <div>
                <label className="text-sm uppercase tracking-[0.12em] text-white/30 font-mono block mb-2">Team Size</label>
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
                <button onClick={() => setMode('invite')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-light hover:bg-white/[0.04] hover:border-white/20 transition-all" data-cursor="Invite Team">
                  Continue to Invitations <ChevronRight size={12} />
                </button>
              </div>
            </>)}

            {/* INVITE */}
            {mode === 'invite' && (<>
              <div className="flex items-center gap-3 mb-2">
                <UserPlus size={12} className="text-cyan-400" />
                <p className="text-white/40 text-sm font-light">Invite team members by email. They'll receive a secure onboarding link.</p>
              </div>
              {invites.map((inv, i) => (
                <div key={i}>
                  <label className="text-sm uppercase tracking-[0.12em] text-white/30 font-mono block mb-2">
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
                className="text-sm uppercase tracking-[0.12em] text-white/30 hover:text-white/60 font-mono transition-colors flex items-center gap-1"
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

            <p className="text-xs text-white/20 text-center font-mono uppercase tracking-widest">
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

// ─── Dimensions ───────────────────────────────────────────────────────────────
const DIMS = [
  { label: 'Output',    n: 94,  u: 'pt', color: '#C8001A', bg: 'rgba(200,0,26,0.06)',   desc: 'KPI velocity · Delivery quality'        },
  { label: 'Risk',      n: 12,  u: '%',  color: '#B84800', bg: 'rgba(184,72,0,0.06)',   desc: 'Attrition probability · Early drift'    },
  { label: 'Return',    n: 218, u: '%',  color: '#926800', bg: 'rgba(146,104,0,0.06)',  desc: 'Revenue per unit of investment'         },
  { label: 'Growth',    n: 78,  u: 'pt', color: '#005828', bg: 'rgba(0,88,40,0.06)',    desc: 'Learning velocity · Skill acquisition'  },
  { label: 'Presence',  n: 91,  u: '%',  color: '#004868', bg: 'rgba(0,72,104,0.06)',   desc: 'Temporal patterns · Engagement rhythm'  },
  { label: 'Wellbeing', n: 63,  u: 'pt', color: '#300868', bg: 'rgba(48,8,104,0.06)',   desc: 'Burnout probability · Stress telemetry' },
];

// ─── useInView ────────────────────────────────────────────────────────────────
function useInView(t = 0.1) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [v, setV] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); obs.disconnect(); }
    }, { threshold: t });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView: v };
}

// ─── Landing ──────────────────────────────────────────────────────────────────
export function Landing() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [activeDim, setActiveDim] = useState<number | null>(null);
  const [scoreOpen, setScoreOpen] = useState(false);

  // Headline stagger
  const chunks = ['What', 'you', 'measure', 'is', 'not', 'who', 'they', 'are.'];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= chunks.length) return;
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 800 : 70 + shown * 22);
    return () => clearTimeout(t);
  }, [shown]);

  const { ref: s2ref, inView: s2 } = useInView(0.05);
  const { ref: s3ref, inView: s3 } = useInView(0.05);
  const { ref: s4ref, inView: s4 } = useInView();
  const { ref: ctaRef, inView: ctaV } = useInView();

  return (
    <div className="bg-[#030303] min-h-screen cursor-none overflow-x-hidden"
      style={{ color: '#e5e5e5', fontFamily: 'system-ui, sans-serif' }}>
      <LandingCursor />

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ rotate:[0,120,0], scale:[1,1.3,1] }}
          transition={{ duration:50, repeat:Infinity, ease:'linear' }}
          style={{ position:'absolute', top:'-30%', left:'-20%', width:'70vw', height:'70vw',
            borderRadius:'50%', background:'rgba(80,0,120,0.12)', filter:'blur(140px)' }} />
        <motion.div animate={{ rotate:[0,-80,0], scale:[1,1.2,1] }}
          transition={{ duration:65, repeat:Infinity, ease:'linear' }}
          style={{ position:'absolute', bottom:'-30%', right:'-20%', width:'60vw', height:'60vw',
            borderRadius:'50%', background:'rgba(0,40,80,0.08)', filter:'blur(140px)' }} />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          NAV — hairline, nearly invisible
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:50,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'20px 48px',
        background:'linear-gradient(to bottom,rgba(3,3,3,0.92),transparent)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }} data-cursor="Prism">
          <PrismMark size={11} compact />
          <span style={{ fontSize:10, letterSpacing:'0.32em', textTransform:'uppercase',
            color:'rgba(255,255,255,0.5)', fontWeight:300 }}>PRISM</span>
        </div>
        <div style={{ display:'flex', gap:32 }}>
          {['Research','Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} data-cursor={l}
              style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase',
                color:'rgba(255,255,255,0.2)', textDecoration:'none', transition:'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.2)')}
            >{l}</a>
          ))}
        </div>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <button onClick={() => setAuthMode('login')} data-cursor="Sign In"
            style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase',
              color:'rgba(255,255,255,0.25)', background:'none', border:'none', cursor:'none',
              transition:'color 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.65)')}
            onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.25)')}
          >Sign in</button>
          <button onClick={() => setAuthMode('signup')} data-cursor="Begin"
            style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase',
              color:'rgba(255,255,255,0.55)', background:'none',
              border:'1px solid rgba(255,255,255,0.12)', padding:'8px 20px', cursor:'none',
              transition:'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.color='white'; e.currentTarget.style.borderColor='rgba(255,255,255,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; }}
          >Begin</button>
        </div>
      </nav>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          01 — HERO
          Asymmetric. Mark enormous top-right.
          Headline fragments at different scales,
          scattered across the vertical.
          "not" is the only colour.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ position:'relative', minHeight:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'flex-end', paddingBottom:80 }}>

        {/* Mark — structural element, top right, partial crop */}
        <motion.div initial={{ opacity:0, scale:1.08 }} animate={{ opacity:1, scale:1 }}
          transition={{ duration:2.2, ease:[0.16,1,0.3,1] }}
          style={{ position:'absolute', top:'-4%', right:'-6%', pointerEvents:'none', zIndex:1 }}>
          <PrismMark size={460} />
        </motion.div>

        {/* Headline — NOT a flex column. Each word placed deliberately */}
        <div style={{ position:'relative', zIndex:2, padding:'0 48px' }}>

          {/* "What you measure" — left, enormous */}
          <div style={{ overflow:'hidden', marginBottom:'-0.04em' }}>
            {['What','you','measure'].map((w,i) => (
              <motion.span key={w}
                initial={{ y:'100%', opacity:0 }}
                animate={i < shown ? { y:0, opacity:1 } : { y:'100%', opacity:0 }}
                transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
                style={{ display:'inline-block', marginRight:'0.15em',
                  fontSize:'clamp(52px,9vw,128px)', fontWeight:300,
                  letterSpacing:'-0.03em', lineHeight:0.9, color:'rgba(255,255,255,0.92)' }}
              >{w}</motion.span>
            ))}
          </div>

          {/* "is not" — shifted right, spectrum coloured, smaller */}
          <div style={{ marginLeft:'28%', marginBottom:'-0.06em', overflow:'hidden' }}>
            {['is','not'].map((w,i) => (
              <motion.span key={w}
                initial={{ y:'100%', opacity:0 }}
                animate={i + 3 < shown ? { y:0, opacity:1 } : { y:'100%', opacity:0 }}
                transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
                style={{
                  display:'inline-block', marginRight:'0.18em',
                  fontSize:'clamp(40px,7vw,100px)', fontWeight:300,
                  letterSpacing:'-0.03em', lineHeight:0.92,
                  color: w === 'not' ? 'transparent' : 'rgba(255,255,255,0.38)',
                  fontStyle: w === 'not' ? 'italic' : 'normal',
                  fontFamily: w === 'not' ? 'Playfair Display,Georgia,serif' : undefined,
                  background: w === 'not' ? 'linear-gradient(90deg,#C8001A,#926800,#300868)' : undefined,
                  WebkitBackgroundClip: w === 'not' ? 'text' : undefined,
                }}
              >{w}</motion.span>
            ))}
          </div>

          {/* "who they are." — left again, with the serif */}
          <div style={{ overflow:'hidden' }}>
            {['who','they','are.'].map((w,i) => (
              <motion.span key={w}
                initial={{ y:'100%', opacity:0 }}
                animate={i + 5 < shown ? { y:0, opacity:1 } : { y:'100%', opacity:0 }}
                transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
                style={{
                  display:'inline-block', marginRight:'0.15em',
                  fontSize:'clamp(52px,9vw,128px)', fontWeight:300,
                  letterSpacing:'-0.03em', lineHeight:0.9,
                  color: w === 'are.' ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.92)',
                  fontStyle: w === 'are.' ? 'italic' : 'normal',
                  fontFamily: w === 'are.' ? 'Playfair Display,Georgia,serif' : undefined,
                }}
              >{w}</motion.span>
            ))}
          </div>

          {/* Sub + CTA — appears after headline, small, right-aligned */}
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity: shown >= chunks.length ? 1 : 0 }}
            transition={{ duration:0.8, delay:0.4 }}
            style={{ marginTop:52, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}
          >
            <p style={{ fontSize:13, fontWeight:300, color:'rgba(255,255,255,0.32)', lineHeight:1.8,
              maxWidth:340, borderLeft:'1px solid rgba(255,255,255,0.08)', paddingLeft:20 }}>
              A performance score compresses a human being into a single number.
              Prism separates that number into the six dimensions that actually compose a person.
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:28 }}>
              <button onClick={() => setAuthMode('signup')} data-cursor="Deploy"
                style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:300,
                  color:'white', background:'none', border:'none', cursor:'none',
                  borderBottom:'1px solid rgba(255,255,255,0.22)', paddingBottom:2, transition:'border-color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.22)')}
              >
                Deploy Prism
                <ArrowUpRight size={14} style={{ color:'rgba(255,255,255,0.4)' }} />
              </button>
              <button onClick={() => setAuthMode('login')} data-cursor="Sign In"
                style={{ fontSize:13, fontWeight:300, color:'rgba(255,255,255,0.22)',
                  background:'none', border:'none', cursor:'none', transition:'color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.55)')}
                onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.22)')}
              >Sign in</button>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity: shown >= chunks.length ? 1 : 0 }}
          transition={{ delay:1.4 }}
          style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <motion.div animate={{ y:[0,7,0] }} transition={{ duration:2.8, repeat:Infinity, ease:'easeInOut' }}
            style={{ width:1, height:40, background:'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)' }} />
          <span style={{ fontSize:8, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.15)', fontFamily:'monospace' }}>Scroll</span>
        </motion.div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          02 — THE SCORE
          "84" at room scale. Hover to refract.
          Not centered. Tension in the layout.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={s2ref} style={{ position:'relative', borderTop:'1px solid rgba(255,255,255,0.04)', minHeight:'100vh', overflow:'hidden' }}
        onMouseEnter={() => setScoreOpen(true)} onMouseLeave={() => setScoreOpen(false)}
        data-cursor={scoreOpen ? '6 truths' : 'Reveal'}>

        {/* Label top-left */}
        <motion.div initial={{ opacity:0 }} animate={s2 ? { opacity:1 } : {}}
          transition={{ duration:0.6 }}
          style={{ position:'absolute', top:40, left:48, zIndex:10 }}>
          <p style={{ fontSize:9, letterSpacing:'0.24em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)', fontFamily:'monospace' }}>Alex Mercer · Senior Engineer</p>
        </motion.div>

        {/* Score — huge, left-aligned, fades on hover */}
        <motion.div animate={{ opacity: scoreOpen ? 0.03 : 1, x: scoreOpen ? -20 : 0 }}
          transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
          style={{ position:'absolute', bottom:-40, left:32, pointerEvents:'none', zIndex:5, lineHeight:1 }}>
          <span style={{ fontSize:'clamp(200px,30vw,420px)', fontWeight:100, color:'white',
            letterSpacing:'-0.05em', display:'block', fontVariantNumeric:'tabular-nums' }}>84</span>
          <span style={{ fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase',
            color:'rgba(255,255,255,0.18)', fontFamily:'monospace', display:'block', marginTop:-20 }}>Composite Score</span>
        </motion.div>

        {/* Six panels — fill on hover */}
        <motion.div animate={{ opacity: scoreOpen ? 1 : 0 }}
          transition={{ duration:0.5 }}
          style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'1fr 1fr', zIndex:8 }}>
          {DIMS.map((d, i) => (
            <motion.div key={d.label}
              initial={{ opacity:0, y:16 }}
              animate={scoreOpen ? { opacity:1, y:0 } : { opacity:0, y:16 }}
              transition={{ delay: i * 0.055, duration:0.45, ease:[0.16,1,0.3,1] }}
              style={{ borderRight: i % 3 !== 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: d.bg, padding:'40px 40px',
                display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background: d.color + '60' }} />
              <p style={{ fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:12, fontFamily:'monospace', color: d.color + 'bb' }}>{d.label}</p>
              <p style={{ fontSize:'clamp(40px,5vw,72px)', fontWeight:200, color:'white', lineHeight:1, marginBottom:8, fontVariantNumeric:'tabular-nums' }}>
                {d.n}<span style={{ fontSize:'0.35em', color:'rgba(255,255,255,0.3)', marginLeft:4 }}>{d.u}</span>
              </p>
              <div style={{ height:1, background:'rgba(255,255,255,0.05)', marginBottom:10, position:'relative', overflow:'hidden' }}>
                <motion.div style={{ position:'absolute', left:0, top:0, height:'100%', background: d.color }}
                  initial={{ width:0 }}
                  animate={scoreOpen ? { width:`${Math.min(d.n,100)}%` } : { width:0 }}
                  transition={{ delay:0.2 + i * 0.055, duration:0.7, ease:[0.16,1,0.3,1] }} />
              </div>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.28)', fontWeight:300 }}>{d.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          03 — SIX DIMENSIONS
          Each row is a full-width graphic moment.
          Height expands on hover. Colour floods in.
          Nothing is decorative.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={s3ref} id="platform" style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>

        {/* Section label — ultra small, tracking, top */}
        <div style={{ padding:'60px 48px 48px', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <div>
            <p style={{ fontSize:9, letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)', fontFamily:'monospace', marginBottom:20 }}>The Spectrum</p>
            <h2 style={{ fontSize:'clamp(36px,5.5vw,72px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:0.9, color:'white' }}>
              Six truths.<br/>
              <em style={{ color:'rgba(255,255,255,0.2)', fontFamily:'Playfair Display,Georgia,serif', fontStyle:'italic' }}>One person.</em>
            </h2>
          </div>
          <p style={{ fontSize:12, fontWeight:300, color:'rgba(255,255,255,0.22)', lineHeight:1.8, maxWidth:260, textAlign:'right' }}>
            Every score you have given a person collapsed six signals into one. Prism holds them apart.
          </p>
        </div>

        {/* Dimension rows — accordion with full colour */}
        <div>
          {DIMS.map((d,i) => {
            const active = activeDim === i;
            const any    = activeDim !== null;
            return (
              <motion.div key={d.label}
                onHoverStart={() => setActiveDim(i)}
                onHoverEnd={() => setActiveDim(null)}
                initial={{ opacity:0 }}
                animate={s3 ? { opacity: any && !active ? 0.2 : 1 } : { opacity:0 }}
                transition={{ opacity:{ duration: any ? 0.15 : 0.5, delay: s3 ? i*0.06:0 } }}
                style={{
                  borderTop:'1px solid rgba(255,255,255,0.04)',
                  background: active ? d.bg : 'transparent',
                  height: active ? 130 : 76,
                  transition:'height 0.55s cubic-bezier(0.16,1,0.3,1), background 0.4s ease',
                  overflow:'hidden', cursor:'crosshair', position:'relative',
                }}
                data-cursor={d.label}
              >
                {/* Left accent */}
                <motion.div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background: d.color }}
                  animate={{ opacity: active ? 1 : 0 }} transition={{ duration:0.3 }} />

                {/* Top hairline */}
                <motion.div style={{ position:'absolute', top:0, left:0, right:0, height:1, background: d.color }}
                  animate={{ opacity: active ? 0.5 : 0 }} transition={{ duration:0.3 }} />

                {/* Main row */}
                <div style={{ display:'flex', alignItems:'center', height:76, padding:'0 48px', gap:24 }}>
                  <span style={{ fontSize:10, fontFamily:'monospace', width:24, flexShrink:0,
                    color: active ? d.color : 'rgba(255,255,255,0.15)' }}>
                    {String(i+1).padStart(2,'0')}
                  </span>
                  <span style={{ fontSize:'clamp(22px,3.5vw,44px)', fontWeight:300, flex:'0 0 auto', minWidth:180,
                    color: active ? 'white' : 'rgba(255,255,255,0.7)',
                    transition:'color 0.3s' }}>
                    {d.label}
                  </span>
                  {/* Track */}
                  <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)', position:'relative', overflow:'hidden' }}>
                    <motion.div style={{ position:'absolute', left:0, top:0, height:'100%', background: d.color }}
                      animate={{ width: active ? `${Math.min(d.n,100)}%` : '0%' }}
                      transition={{ duration:0.65, ease:[0.16,1,0.3,1] }} />
                  </div>
                  {/* Value */}
                  <motion.span style={{ fontSize:'clamp(20px,2.8vw,36px)', fontWeight:300, color: d.color,
                    width:100, textAlign:'right', flexShrink:0, fontVariantNumeric:'tabular-nums' }}
                    animate={{ opacity: active ? 1 : 0, x: active ? 0 : 10 }}
                    transition={{ duration:0.25 }}>
                    {d.n}{d.u}
                  </motion.span>
                </div>

                {/* Expanded description */}
                <motion.p animate={{ opacity: active ? 1 : 0, y: active ? 0 : -6 }}
                  transition={{ duration:0.3, delay: active ? 0.12 : 0 }}
                  style={{ fontSize:12, color:'rgba(255,255,255,0.38)', fontWeight:300, padding:'0 48px 0 78px' }}>
                  {d.desc}
                </motion.p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          04 — RESEARCH
          Numbers as the design. No cards.
          Full bleed. Extreme scale contrast.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={s4ref} id="research" style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ padding:'80px 48px 0' }}>
          <p style={{ fontSize:9, letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)', fontFamily:'monospace', marginBottom:60 }}>Research Basis</p>
        </div>

        {/* Alternating large/small layout — not equal columns */}
        {[
          { n:'$11.1T', body:'Lost annually to disengaged, unseen employees worldwide.', src:'Gallup State of the Global Workplace · 2024' },
          { n:'92%',    body:'Of HR leaders say their performance data is siloed or incomplete.', src:'Deloitte Global Human Capital Trends · 2024' },
          { n:'200%',   body:'Cost of replacing one person, relative to their annual salary.', src:'SHRM Employee Benefits Research · 2023' },
          { n:'34%',    body:'Performance gain from structured, multi-dimensional continuous feedback.', src:'MIT Sloan Management Review · 2022' },
        ].map((p, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:20 }}
            animate={s4 ? { opacity:1, y:0 } : {}}
            transition={{ delay:i*0.1, duration:0.7, ease:[0.16,1,0.3,1] }}
            style={{
              display:'grid',
              gridTemplateColumns: i % 2 === 0 ? '1fr 2fr' : '2fr 1fr',
              borderTop:'1px solid rgba(255,255,255,0.04)',
              alignItems:'center',
            }}>
            <div style={{ padding:'52px 48px', order: i%2===0 ? 0 : 1 }}>
              <p style={{ fontSize:'clamp(52px,8vw,110px)', fontWeight:200, color:'white',
                letterSpacing:'-0.04em', lineHeight:1 }}>{p.n}</p>
            </div>
            <div style={{ padding:'52px 48px', borderLeft: i%2===0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              borderRight: i%2===1 ? '1px solid rgba(255,255,255,0.04)' : 'none', order: i%2===0 ? 1 : 0 }}>
              <p style={{ fontSize:15, fontWeight:300, color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:20 }}>{p.body}</p>
              <p style={{ fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)', fontFamily:'monospace' }}>{p.src}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          05 — QUOTE
          Full-width. Massive italic. Breathe.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ borderTop:'1px solid rgba(255,255,255,0.04)', padding:'120px 48px' }}>
        <blockquote style={{ fontFamily:'Playfair Display,Georgia,serif', fontStyle:'italic',
          fontWeight:300, fontSize:'clamp(22px,3.2vw,48px)', lineHeight:1.4,
          color:'rgba(255,255,255,0.55)', maxWidth:900, marginBottom:40 }}>
          "The person with an 84 score may be your highest-output employee
          and your most urgent wellbeing intervention. The number makes both invisible."
        </blockquote>
        <cite style={{ fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase',
          color:'rgba(255,255,255,0.2)', fontFamily:'monospace', fontStyle:'normal',
          display:'block', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:20 }}>
          Prism Intelligence · 2025
        </cite>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          06 — PRICING
          Three vertical rows. Price enormous.
          No equal cards. Pure typography.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="pricing" style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ padding:'80px 48px 48px' }}>
          <p style={{ fontSize:9, letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)', fontFamily:'monospace', marginBottom:0 }}>Deployment</p>
        </div>

        {[
          { name:'Signal',        price:'$18',   unit:'/node/mo', desc:'Small teams beginning to see clearly.',
            features:['KPI & OKR tracking','Basic 360° reviews','Attendance matrix','Up to 10 nodes'], cta:'login' as AuthMode },
          { name:'Constellation', price:'$42',   unit:'/node/mo', desc:'Full intelligence for growing organisations.',
            features:['All Signal features','ROI intelligence','Bio-rhythm telemetry','Leaderboard','Up to 200 nodes'], cta:'org' as AuthMode, featured:true },
          { name:'Prism',         price:'Custom',unit:'',          desc:'Enterprise for 200+ node organisations.',
            features:['All Constellation features','SSO / SAML','Custom benchmarks','SLA 99.99%','Unlimited nodes'], cta:'org' as AuthMode },
        ].map((plan, i) => (
          <div key={plan.name} style={{
            borderTop:'1px solid rgba(255,255,255,0.04)',
            display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
            background: plan.featured ? 'rgba(255,255,255,0.018)' : 'transparent',
          }}>
            {/* Plan name + desc */}
            <div style={{ padding:'48px 48px', borderRight:'1px solid rgba(255,255,255,0.04)' }}>
              {plan.featured && <div style={{ height:1, background:'rgba(255,255,255,0.18)', marginBottom:32 }} />}
              <p style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', fontFamily:'monospace', marginBottom:12 }}>{plan.name}</p>
              <p style={{ fontSize:13, fontWeight:300, color:'rgba(255,255,255,0.4)', lineHeight:1.7 }}>{plan.desc}</p>
            </div>

            {/* Price — enormous */}
            <div style={{ padding:'48px 48px', borderRight:'1px solid rgba(255,255,255,0.04)', display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                <span style={{ fontSize:'clamp(44px,6vw,80px)', fontWeight:200, color:'white', lineHeight:1, letterSpacing:'-0.03em' }}>{plan.price}</span>
                {plan.unit && <span style={{ fontSize:12, color:'rgba(255,255,255,0.25)', fontWeight:300 }}>{plan.unit}</span>}
              </div>
            </div>

            {/* Features + CTA */}
            <div style={{ padding:'48px 48px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <div style={{ width:1, height:12, background:'rgba(255,255,255,0.18)', flexShrink:0 }} />
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.38)', fontWeight:300 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setAuthMode(plan.cta)} data-cursor="Deploy"
                style={{ marginTop:32, fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase',
                  color:'rgba(255,255,255,0.35)', background:'none',
                  border:'1px solid rgba(255,255,255,0.1)', padding:'12px 0',
                  cursor:'none', textAlign:'left', paddingLeft:16, display:'flex', alignItems:'center', justifyContent:'space-between',
                  paddingRight:16, transition:'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.color='rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; }}
              >
                {plan.price === 'Custom' ? 'Contact Sales' : 'Deploy Now'}
                <ChevronRight size={11} />
              </button>
            </div>
          </div>
        ))}
        <p style={{ padding:'24px 48px', fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.15)', fontFamily:'monospace', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
          30-day trial · No card required · Full access from day one
        </p>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          07 — FINAL CTA
          One idea. The mark as the graphic.
          White space earns it.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={ctaRef} style={{
        borderTop:'1px solid rgba(255,255,255,0.04)',
        minHeight:'80vh', display:'flex', flexDirection:'column',
        justifyContent:'center', alignItems:'center',
        padding:'120px 48px', position:'relative', overflow:'hidden',
        textAlign:'center', gap:56,
      }}>
        {/* Ghost mark — enormous behind everything */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none', opacity:0.04 }}>
          <PrismMark size={560} />
        </div>

        <motion.h2
          initial={{ opacity:0, y:24 }}
          animate={ctaV ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
          style={{ fontSize:'clamp(44px,7vw,100px)', fontWeight:300, letterSpacing:'-0.04em',
            lineHeight:0.9, color:'white', position:'relative', zIndex:2 }}>
          See your people<br/>
          <em style={{ color:'rgba(255,255,255,0.22)', fontFamily:'Playfair Display,Georgia,serif', fontStyle:'italic' }}>clearly.</em>
        </motion.h2>

        <motion.div initial={{ opacity:0 }} animate={ctaV ? { opacity:1 } : {}} transition={{ delay:0.35, duration:0.8 }}
          style={{ display:'flex', gap:32, alignItems:'center', position:'relative', zIndex:2 }}>
          <button onClick={() => setAuthMode('signup')} data-cursor="Deploy"
            style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, fontWeight:300,
              color:'white', background:'none', border:'none', cursor:'none',
              borderBottom:'1px solid rgba(255,255,255,0.25)', paddingBottom:3, transition:'border-color 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.8)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.25)')}
          >
            Deploy Prism <ArrowUpRight size={15} style={{ color:'rgba(255,255,255,0.4)' }} />
          </button>
          <button onClick={() => setAuthMode('invite')} data-cursor="Invite"
            style={{ fontSize:14, fontWeight:300, color:'rgba(255,255,255,0.22)',
              background:'none', border:'none', cursor:'none',
              display:'flex', alignItems:'center', gap:6, transition:'color 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.55)')}
            onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.22)')}
          >
            <UserPlus size={14} /> Invite your team
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.04)', padding:'20px 48px',
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <PrismMark size={10} compact />
          <span style={{ fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)', fontFamily:'monospace' }}>
            Prism Intelligence · 2025
          </span>
        </div>
        <div style={{ display:'flex', gap:24 }}>
          {['Privacy','Security','SOC 2 Type II'].map(l => (
            <a key={l} href="#" data-cursor={l}
              style={{ fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.14)',
                textDecoration:'none', fontFamily:'monospace', transition:'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.14)')}
            >{l}</a>
          ))}
        </div>
      </footer>

      <AnimatePresence>
        {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />}
      </AnimatePresence>
    </div>
  );
}
