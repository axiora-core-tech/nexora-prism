import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight, ChevronRight, X, ArrowLeft, Eye, EyeOff, Mail, Lock,
         Building2, UserPlus, Check, Minus } from 'lucide-react';

// ─── Custom Cursor ───────────────────────────────────────────────────────────
function LandingCursor() {
  const [visible, setVisible]     = useState(false);
  const [hovering, setHovering]   = useState(false);
  const [hoverText, setHoverText] = useState('');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cx = useSpring(mouseX, { damping: 25, stiffness: 200, mass: 0.5 });
  const cy = useSpring(mouseY, { damping: 25, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); setVisible(true); };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const clickable = ['button','a'].includes(t.tagName.toLowerCase()) || !!t.closest('button') || !!t.closest('a');
      setHovering(!!clickable);
      const dc = t.getAttribute('data-cursor') || (t.closest('[data-cursor]') as HTMLElement|null)?.getAttribute('data-cursor') || '';
      setHoverText(dc);
    };
    const onOut = () => { setHovering(false); setHoverText(''); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseover', onOver); window.removeEventListener('mouseout', onOut); };
  }, [mouseX, mouseY]);

  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return null;

  return (
    <motion.div className="fixed top-0 left-0 pointer-events-none z-[999] flex items-center justify-center"
      style={{ x: cx, y: cy, opacity: visible ? 1 : 0, translateX: '-50%', translateY: '-50%' }}>
      <motion.div
        animate={{ width: hovering ? (hoverText ? 80 : 48) : 24, height: hovering ? (hoverText ? 80 : 48) : 24, backgroundColor: hovering ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0)', borderColor: hovering ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="absolute rounded-full border flex items-center justify-center mix-blend-difference">
        <motion.span animate={{ opacity: hoverText ? 1 : 0, scale: hoverText ? 1 : 0.5 }}
          className="text-[10px] font-mono uppercase tracking-widest text-white whitespace-nowrap">{hoverText}</motion.span>
      </motion.div>
      <motion.div animate={{ scale: hovering && !hoverText ? 0 : 1, opacity: hovering && hoverText ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="w-1.5 h-1.5 bg-white rounded-full mix-blend-difference" />
    </motion.div>
  );
}

// ─── Prism Mark ──────────────────────────────────────────────────────────────
function PrismMark({ size = 32, compact = false }: { size?: number; compact?: boolean }) {
  const w = size;
  const h = compact ? size : size * (184 / 74);
  const arcs: [string, number, number][] = [
    ['#f43f5e', 36.7, 4.00], ['#fb923c', 38.5, 3.60],
    ['#fbbf24', 40.8, 3.31], ['#34d399', 43.7, 3.03],
    ['#38bdf8', 46.1, 2.69], ['#a78bfa', 49.5, 2.40],
  ];
  return (
    <svg width={w} height={h} viewBox={`0 0 74 ${compact ? 74 : 184}`} fill="none" style={{ overflow:'visible', display:'block', flexShrink:0 }}>
      {!compact && (<>
        <motion.line x1="21" y1="0" x2="21" y2="10" stroke="rgba(255,255,255,0.45)" strokeWidth="0.7" strokeLinecap="round" animate={{ opacity:[0.45,0.96,0.45] }} transition={{ duration:4, ease:'easeInOut', repeat:Infinity }} />
        <motion.line x1="21" y1="10" x2="21" y2="172" stroke="rgba(255,255,255,0.90)" strokeWidth="1.6" strokeLinecap="round" animate={{ opacity:[0.78,0.96,0.78] }} transition={{ duration:4, ease:'easeInOut', repeat:Infinity }} />
      </>)}
      <motion.circle cx="21" cy="10" r="1.8" fill="rgba(255,255,255,0.90)" animate={{ scale:[1,1.6,1], opacity:[0.65,1,0.65] }} transition={{ duration:4, ease:'easeInOut', repeat:Infinity }} style={{ transformOrigin:'21px 10px' }} />
      {arcs.map(([stroke, r, dur], i) => (
        <motion.path key={i} d={`M21 10 A${r} ${r} 0 0 1 21 80`} stroke={stroke} strokeWidth="0.85" strokeLinecap="round" fill="none" animate={{ opacity:[0.35+i*0.02,0.92+i*0.01,0.35+i*0.02] }} transition={{ duration:dur, ease:'easeInOut', repeat:Infinity }} />
      ))}
    </svg>
  );
}

// ─── Auth Modal ──────────────────────────────────────────────────────────────
type AuthMode = 'login' | 'signup' | 'org' | 'invite' | 'demo';

function AuthModal({ mode: initialMode, onClose }: { mode: AuthMode; onClose: () => void }) {
  const navigate = useNavigate();
  const [mode, setMode]         = useState<AuthMode>(initialMode);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail]       = useState('');
  const [pass, setPass]         = useState('');
  const [name, setName]         = useState('');
  const [org, setOrg]           = useState('');
  const [invites, setInvites]   = useState(['', '']);

  const handleSubmit = () => {
    onClose();
    navigate('/enter');
  };

  const inp = 'w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl pl-10 pr-4 py-3 text-white text-sm font-light outline-none focus:border-white/20 transition-colors placeholder:text-white/20';

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={onClose}>
      <motion.div initial={{ opacity:0, y:30, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:20, scale:0.97 }}
        transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
        className="w-full max-w-lg rounded-[2rem] overflow-hidden relative border border-white/[0.08]"
        style={{ backgroundColor:'#0a0a0a' }} onClick={e => e.stopPropagation()}>

        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="flex items-center justify-between px-8 pt-8 pb-0 relative z-10">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-white/30 mb-2">Prism Intelligence</p>
            <h3 className="text-2xl font-light text-white font-serif italic">
              {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Start for free' : mode === 'demo' ? 'Book a demo' : mode === 'org' ? 'Set up your org' : 'Invite your team'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white transition-all">
            <X size={14} />
          </button>
        </div>

        <div className="flex gap-1 mx-8 mt-6 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl relative z-10">
          {(['login','signup','demo'] as const).map(m => (
            <button key={m} onClick={() => setMode(m as AuthMode)}
              className={`flex-1 py-2 rounded-lg text-xs uppercase tracking-widest font-mono transition-all ${mode === m ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}>
              {m === 'login' ? 'Sign In' : m === 'signup' ? 'Free Trial' : 'Book Demo'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }} transition={{ duration:0.2 }}
            className="px-8 py-6 space-y-4 relative z-10">

            {(mode === 'login' || mode === 'signup') && (<>
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 block mb-2">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-xs">✦</span>
                    <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Your name" className={inp} />
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 block mb-2">Work Email</label>
                <div className="relative">
                  <Mail size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@company.com" className={inp} />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 block mb-2">Password</label>
                <div className="relative">
                  <Lock size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                  <input value={pass} onChange={e => setPass(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="••••••••••••" className={`${inp} pr-12`} />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                    {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </div>
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 block mb-2">Company</label>
                  <div className="relative">
                    <Building2 size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                    <input value={org} onChange={e => setOrg(e.target.value)} type="text" placeholder="Acme Corp" className={inp} />
                  </div>
                </div>
              )}
            </>)}


            {/* DEMO BOOKING */}
            {mode === 'demo' && (<>
              <div>
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 block mb-2">Your Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-xs">✦</span>
                  <input value={demoName} onChange={e => setDemoName(e.target.value)} type="text" placeholder="Priya Sharma" className={inp} />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 block mb-2">Work Email</label>
                <div className="relative">
                  <Mail size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                  <input value={demoEmail} onChange={e => setDemoEmail(e.target.value)} type="email" placeholder="you@company.com" className={inp} />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 block mb-2">Company</label>
                <div className="relative">
                  <Building2 size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                  <input value={demoOrg} onChange={e => setDemoOrg(e.target.value)} type="text" placeholder="Acme Corp" className={inp} />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 block mb-2">Team Size</label>
                <select value={demoSize} onChange={e => setDemoSize(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-white text-sm font-light outline-none focus:border-white/20"
                  style={{ backgroundColor: '#0a0a0a' }}>
                  <option value="">Select size</option>
                  {['10–50','50–200','200–500','500–2000','2000+'].map(s => (
                    <option key={s} value={s} style={{ backgroundColor:'#0a0a0a' }}>{s} employees</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-white/20 font-mono">We'll confirm a 30-min slot within one business day.</p>
            </>)}

            <button onClick={handleSubmit} data-cursor="Enter"
              className="w-full relative group overflow-hidden rounded-2xl mt-2">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-white/[0.06] border border-white/[0.12] rounded-2xl px-6 py-3.5 flex items-center justify-between group-hover:bg-white/[0.08] group-hover:border-white/25 transition-all">
                <span className="text-white text-sm font-light">
                  {mode === 'login' ? 'Sign in to Prism' : mode === 'demo' ? 'Request a demo' : 'Start 30-day free trial'}
                </span>
                <ArrowUpRight size={14} className="text-white/40 group-hover:text-cyan-400 transition-colors" />
              </div>
            </button>

            <p className="text-xs text-center font-mono uppercase tracking-widest text-white/20">
              {mode === 'signup' ? 'No credit card · Full access · Cancel anytime' : mode === 'demo' ? '30-min call · No commitment · Response within 1 business day' : 'End-to-end encrypted · SOC 2 Type II'}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── useInView ───────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Data ────────────────────────────────────────────────────────────────────
const DIMS = [
  { label:'Output',    n:94,  u:'pt', color:'#C8001A', bg:'rgba(200,0,26,0.06)',   desc:'Delivery quality · Sprint velocity · KPI attainment' },
  { label:'Risk',      n:12,  u:'%',  color:'#B84800', bg:'rgba(184,72,0,0.06)',   desc:'Attrition probability · Early drift signals' },
  { label:'Return',    n:218, u:'%',  color:'#926800', bg:'rgba(146,104,0,0.06)',  desc:'Revenue generated per dollar of total compensation' },
  { label:'Growth',    n:78,  u:'pt', color:'#005828', bg:'rgba(0,88,40,0.06)',    desc:'Learning velocity · Skill acquisition rate' },
  { label:'Presence',  n:91,  u:'%',  color:'#004868', bg:'rgba(0,72,104,0.06)',   desc:'Temporal patterns · Engagement rhythm · Focus blocks' },
  { label:'Wellbeing', n:63,  u:'pt', color:'#300868', bg:'rgba(48,8,104,0.06)',   desc:'Burnout probability · Stress index · Cognitive load' },
];

const USPs = [
  {
    tag: 'vs. Annual Reviews',
    headline: 'Stop managing last year's performance.',
    body: 'Annual cycles miss 11 months of signal. By the time the review lands, the attrition decision was made in March. Prism runs continuous 360° feedback so you know every month, not every year.',
    stat: '34%', statLabel: 'performance gain from continuous feedback',
    src: 'MIT Sloan · 2022',
    color: '#f59e0b',
  },
  {
    tag: 'vs. Single-Score Systems',
    headline: 'An 84 hides more than it reveals.',
    body: 'One composite score compresses six distinct human signals into a single number. Your highest-output employee may also be your most urgent burnout risk. Prism holds the six signals apart so you can act on each one.',
    stat: '88%', statLabel: 'burnout prediction accuracy',
    src: 'Prism Internal · 2024',
    color: '#c084fc',
  },
  {
    tag: 'vs. HR Admin Tools',
    headline: 'Built for managers, not HR compliance.',
    body: 'Workday, BambooHR, and SAP were built to process payroll and store documents. Prism was built for the moment a manager opens their laptop before a 1:1 and needs to know exactly what to say.',
    stat: '73%', statLabel: 'faster time-to-insight vs. traditional HR tools',
    src: 'Harvard Business Review · 2024',
    color: '#22d3ee',
  },
  {
    tag: 'vs. Spreadsheet Tracking',
    headline: 'Your ROI is not a gut feeling.',
    body: 'Most companies have no idea what return they get on individual human capital. Prism maps every salary dollar to revenue generated, cost saved, and value delivered — per person, per quarter.',
    stat: '2.3×', statLabel: 'greater revenue per employee vs. peers without ROI tracking',
    src: 'Gartner · 2023',
    color: '#10b981',
  },
];

const COMPARISON = [
  { feature: 'Real-time performance signals',       prism: true,  lattice: true,  bamboo: false, workday: false },
  { feature: '6-dimension employee breakdown',      prism: true,  lattice: false, bamboo: false, workday: false },
  { feature: 'Per-employee ROI tracking',           prism: true,  lattice: false, bamboo: false, workday: false },
  { feature: 'Burnout & wellbeing telemetry',       prism: true,  lattice: 'ltd', bamboo: false, workday: false },
  { feature: 'Attrition prediction (88% accuracy)', prism: true,  lattice: false, bamboo: false, workday: false },
  { feature: 'Continuous 360° with radar viz',      prism: true,  lattice: true,  bamboo: 'ltd', workday: 'ltd' },
  { feature: 'Manager 1:1 prep intelligence',       prism: true,  lattice: false, bamboo: false, workday: false },
  { feature: 'Setup time under 30 minutes',         prism: true,  lattice: false, bamboo: true,  workday: false },
];

const PROOF = [
  { quote: 'We identified a flight-risk engineer three months before he\'d decided to leave. That single retention saved us more than a year of Prism.', name: 'Head of Engineering', co: 'Series B SaaS, 120 employees' },
  { quote: 'Our HR tool showed everyone was fine. Prism showed us two thirds of the design team were at burnout threshold. Complete paradigm shift.', name: 'VP People', co: 'Fintech Scale-up, 340 employees' },
  { quote: 'We stopped doing annual reviews entirely. Monthly Prism cycles replaced them. Engagement scores up 41% in six months.', name: 'Chief People Officer', co: 'E-commerce, 800 employees' },
];

const CHUNKS = ['Your people', 'aren\'t a score.', 'They\'re a', 'spectrum.'];

// ─── Landing Page ────────────────────────────────────────────────────────────
export function Landing() {
  const [authMode, setAuthMode]   = useState<AuthMode | null>(null);
  const [activeDim, setActiveDim] = useState<number | null>(null);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [shown, setShown]         = useState(0);

  useEffect(() => {
    if (shown >= CHUNKS.length) return;
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 600 : 120 + shown * 30);
    return () => clearTimeout(t);
  }, [shown]);

  const { ref: uspRef,   inView: uspV  } = useInView(0.05);
  const { ref: compRef,  inView: compV } = useInView(0.05);
  const { ref: proofRef, inView: proofV } = useInView(0.05);
  const { ref: s3ref,    inView: s3    } = useInView(0.05);
  const { ref: s4ref,    inView: s4    } = useInView(0.05);
  const { ref: ctaRef,   inView: ctaV  } = useInView(0.1);

  const T = { fontSize:9, letterSpacing:'0.26em', textTransform:'uppercase' as const, color:'rgba(255,255,255,0.18)', fontFamily:'monospace' };

  return (
    <div className="bg-[#030303] min-h-screen cursor-none overflow-x-hidden" style={{ color:'#e5e5e5' }}>
      <LandingCursor />

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ rotate:[0,120,0], scale:[1,1.3,1] }} transition={{ duration:50, repeat:Infinity, ease:'linear' }}
          style={{ position:'absolute', top:'-30%', left:'-20%', width:'70vw', height:'70vw', borderRadius:'50%', background:'rgba(80,0,120,0.10)', filter:'blur(140px)' }} />
        <motion.div animate={{ rotate:[0,-80,0], scale:[1,1.2,1] }} transition={{ duration:65, repeat:Infinity, ease:'linear' }}
          style={{ position:'absolute', bottom:'-30%', right:'-20%', width:'60vw', height:'60vw', borderRadius:'50%', background:'rgba(0,40,80,0.07)', filter:'blur(140px)' }} />
      </div>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 48px', background:'linear-gradient(to bottom,rgba(3,3,3,0.94),transparent)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <PrismMark size={11} compact />
          <span style={{ fontSize:10, letterSpacing:'0.32em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', fontWeight:300 }}>PRISM</span>
        </div>
        <div style={{ display:'flex', gap:32 }}>
          {['Platform','Pricing','Research'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} data-cursor={l}
              style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.22)', textDecoration:'none', transition:'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.65)')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.22)')}
            >{l}</a>
          ))}
        </div>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <button onClick={() => setAuthMode('login')} data-cursor="Sign In"
            style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', background:'none', border:'none', cursor:'none', transition:'color 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.65)')}
            onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.28)')}>
            Sign in
          </button>
          <button onClick={() => setAuthMode('demo')} data-cursor="Book Demo"
            style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', background:'none', border:'none', cursor:'none', transition:'color 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.65)')}
            onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.35)')}>
            Book demo
          </button>
          <button onClick={() => setAuthMode('signup')} data-cursor="Try Free"
            style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.65)', background:'none', border:'1px solid rgba(255,255,255,0.18)', padding:'9px 22px', cursor:'none', transition:'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.color='white'; e.currentTarget.style.borderColor='rgba(255,255,255,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.65)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; }}>
            Try free — 30 days
          </button>
        </div>
      </nav>

      {/* ── 01 HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ position:'relative', minHeight:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'flex-end', paddingBottom:80 }}>

        <motion.div initial={{ opacity:0, scale:1.08 }} animate={{ opacity:1, scale:1 }} transition={{ duration:2.2, ease:[0.16,1,0.3,1] }}
          style={{ position:'absolute', top:'-4%', right:'-6%', pointerEvents:'none', zIndex:1 }}>
          <PrismMark size={460} />
        </motion.div>

        <div style={{ position:'relative', zIndex:2, padding:'0 48px' }}>

          {/* Overline */}
          <motion.p initial={{ opacity:0, y:8 }} animate={shown > 0 ? { opacity:1, y:0 } : {}} transition={{ duration:0.6 }}
            style={{ ...T, marginBottom:28, display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ display:'inline-block', width:24, height:1, background:'rgba(255,255,255,0.2)' }} />
            The Performance Intelligence Platform
            <span style={{ display:'inline-block', width:24, height:1, background:'rgba(255,255,255,0.2)' }} />
          </motion.p>

          {/* Headline — "Your people aren't a score. They're a spectrum." */}
          <div style={{ overflow:'hidden', marginBottom:'-0.02em' }}>
            {CHUNKS.slice(0,2).map((w,i) => (
              <motion.span key={w}
                initial={{ y:'100%', opacity:0 }}
                animate={i < shown ? { y:0, opacity:1 } : {}}
                transition={{ duration:0.75, ease:[0.16,1,0.3,1] }}
                style={{ display:'inline-block', marginRight:'0.18em',
                  fontSize:'clamp(48px,8.5vw,122px)', fontWeight:300,
                  letterSpacing:'-0.03em', lineHeight:0.92,
                  color: i === 1 ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.92)',
                  fontStyle: i === 1 ? 'italic' : 'normal',
                  fontFamily: i === 1 ? 'Cormorant Garamond,Georgia,serif' : 'inherit',
                }}>
                {w}
              </motion.span>
            ))}
          </div>

          <div style={{ marginLeft:'14%', overflow:'hidden' }}>
            {CHUNKS.slice(2).map((w,i) => (
              <motion.span key={w}
                initial={{ y:'100%', opacity:0 }}
                animate={i + 2 < shown ? { y:0, opacity:1 } : {}}
                transition={{ duration:0.75, ease:[0.16,1,0.3,1] }}
                style={{ display:'inline-block', marginRight:'0.18em',
                  fontSize:'clamp(48px,8.5vw,122px)', fontWeight:300,
                  letterSpacing:'-0.03em', lineHeight:0.92,
                  color: i === 1 ? 'transparent' : 'rgba(255,255,255,0.92)',
                  fontStyle: i === 1 ? 'italic' : 'normal',
                  fontFamily: i === 1 ? 'Cormorant Garamond,Georgia,serif' : 'inherit',
                  background: i === 1 ? 'linear-gradient(90deg,#f43f5e,#fbbf24,#38bdf8,#a78bfa)' : 'none',
                  WebkitBackgroundClip: i === 1 ? 'text' : 'unset',
                }}>
                {w}
              </motion.span>
            ))}
          </div>

          {/* Sub-copy + CTAs */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity: shown >= CHUNKS.length ? 1 : 0 }} transition={{ duration:0.8, delay:0.5 }}
            style={{ marginTop:52, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:28 }}>
            <p style={{ fontSize:14, fontWeight:300, color:'rgba(255,255,255,0.38)', lineHeight:1.9, maxWidth:400, borderLeft:'1px solid rgba(255,255,255,0.08)', paddingLeft:20 }}>
              Prism replaces annual reviews, fragmented HR dashboards, and gut-feel management with a single continuous intelligence layer — built for HR leaders who want to act before problems become resignations.
            </p>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:16 }}>
              <button onClick={() => setAuthMode('signup')} data-cursor="Start Free"
                style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, fontWeight:300, color:'white', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', padding:'14px 28px', cursor:'none', transition:'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; }}>
                Start free trial — 30 days
                <ArrowUpRight size={14} style={{ color:'rgba(255,255,255,0.4)' }} />
              </button>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <button onClick={() => setAuthMode('demo')} data-cursor="Book Demo"
                  style={{ fontSize:12, fontWeight:300, color:'rgba(255,255,255,0.35)', background:'none', border:'none', cursor:'none', transition:'color 0.3s', display:'flex', alignItems:'center', gap:5 }}
                  onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.65)')}
                  onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.35)')}>
                  or book a 30-min demo
                </button>
              </div>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.18)', letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:'monospace' }}>
                No credit card · Full access · Cancel anytime
              </p>
            </div>
          </motion.div>

          {/* Trust bar */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity: shown >= CHUNKS.length ? 1 : 0 }} transition={{ duration:0.8, delay:0.9 }}
            style={{ marginTop:64, display:'flex', gap:40, flexWrap:'wrap' }}>
            {[
              { n:'$11.1T', l:'lost annually to disengaged employees', src:'Gallup 2024' },
              { n:'200%',   l:'average cost to replace one employee', src:'SHRM 2023' },
              { n:'92%',    l:'of HR leaders say their data is siloed', src:'Deloitte 2024' },
            ].map(s => (
              <div key={s.n} style={{ display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ fontSize:'clamp(18px,2.5vw,28px)', fontWeight:200, color:'white', letterSpacing:'-0.03em' }}>{s.n}</span>
                <div>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:300, lineHeight:1.5, maxWidth:180 }}>{s.l}</p>
                  <p style={{ ...T, fontSize:8, marginTop:2 }}>{s.src}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity:0 }} animate={{ opacity: shown >= CHUNKS.length ? 1 : 0 }} transition={{ delay:1.6 }}
          style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <motion.div animate={{ y:[0,7,0] }} transition={{ duration:2.8, repeat:Infinity, ease:'easeInOut' }}
            style={{ width:1, height:40, background:'linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)' }} />
          <span style={{ ...T, fontSize:8 }}>Scroll to explore</span>
        </motion.div>
      </section>

      {/* ── 02 THE SCORE ─────────────────────────────────────────────────────── */}
      <section style={{ position:'relative', borderTop:'1px solid rgba(255,255,255,0.04)', minHeight:'100vh', overflow:'hidden' }}
        onMouseEnter={() => setScoreOpen(true)} onMouseLeave={() => setScoreOpen(false)} data-cursor={scoreOpen ? 'Six signals' : 'What\'s behind it?'}>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6 }}
          style={{ position:'absolute', top:40, left:48, zIndex:10 }}>
          <p style={T}>Arjun Sharma · Senior Frontend Engineer · Core Architecture</p>
          <p style={{ ...T, fontSize:8, marginTop:6, color:'rgba(255,255,255,0.10)' }}>Hover to see what this number is hiding</p>
        </motion.div>

        <motion.div animate={{ opacity: scoreOpen ? 0.03 : 1, x: scoreOpen ? -20 : 0 }} transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
          style={{ position:'absolute', bottom:-40, left:32, pointerEvents:'none', zIndex:5, lineHeight:1 }}>
          <span style={{ fontSize:'clamp(200px,30vw,420px)', fontWeight:100, color:'white', letterSpacing:'-0.05em', display:'block', fontVariantNumeric:'tabular-nums' }}>84</span>
          <span style={{ fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)', fontFamily:'monospace', display:'block', marginTop:-20 }}>Performance Score</span>
        </motion.div>

        <motion.div animate={{ opacity: scoreOpen ? 1 : 0 }} transition={{ duration:0.5 }}
          style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gridTemplateRows:'1fr 1fr', zIndex:8 }}>
          {DIMS.map((d,i) => (
            <motion.div key={d.label}
              initial={{ opacity:0, y:16 }} animate={scoreOpen ? { opacity:1, y:0 } : { opacity:0, y:16 }}
              transition={{ delay:i*0.055, duration:0.45, ease:[0.16,1,0.3,1] }}
              style={{ borderRight:i%3!==2?'1px solid rgba(255,255,255,0.04)':'none', borderBottom:i<3?'1px solid rgba(255,255,255,0.04)':'none', background:d.bg, padding:'40px 40px', display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:d.color+'60' }} />
              <p style={{ fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:12, fontFamily:'monospace', color:d.color+'bb' }}>{d.label}</p>
              <p style={{ fontSize:'clamp(40px,5vw,72px)', fontWeight:200, color:'white', lineHeight:1, marginBottom:8, fontVariantNumeric:'tabular-nums' }}>
                {d.n}<span style={{ fontSize:'0.35em', color:'rgba(255,255,255,0.3)', marginLeft:4 }}>{d.u}</span>
              </p>
              <div style={{ height:1, background:'rgba(255,255,255,0.05)', marginBottom:10, position:'relative', overflow:'hidden' }}>
                <motion.div style={{ position:'absolute', left:0, top:0, height:'100%', background:d.color }}
                  initial={{ width:0 }} animate={scoreOpen ? { width:`${Math.min(d.n,100)}%` } : { width:0 }}
                  transition={{ delay:0.2+i*0.055, duration:0.7, ease:[0.16,1,0.3,1] }} />
              </div>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.28)', fontWeight:300 }}>{d.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 03 PLATFORM / SIX DIMENSIONS ────────────────────────────────────── */}
      <section ref={s3ref} id="platform" style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ padding:'60px 48px 48px', display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:24 }}>
          <div>
            <p style={{ ...T, marginBottom:20 }}>The Spectrum</p>
            <h2 style={{ fontSize:'clamp(36px,5.5vw,72px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:0.9, color:'white' }}>
              Six signals.<br/>
              <em style={{ color:'rgba(255,255,255,0.2)', fontFamily:'Cormorant Garamond,Georgia,serif', fontStyle:'italic' }}>One person.</em>
            </h2>
          </div>
          <p style={{ fontSize:12, fontWeight:300, color:'rgba(255,255,255,0.28)', lineHeight:1.9, maxWidth:300, textAlign:'right' }}>
            Every performance score you've ever given collapsed six distinct signals into one number. Prism holds them apart — so you can manage each one.
          </p>
        </div>
        <div>
          {DIMS.map((d,i) => {
            const active = activeDim === i;
            const any    = activeDim !== null;
            return (
              <motion.div key={d.label}
                onHoverStart={() => setActiveDim(i)} onHoverEnd={() => setActiveDim(null)}
                initial={{ opacity:0 }} animate={s3 ? { opacity: any && !active ? 0.2 : 1 } : { opacity:0 }}
                transition={{ opacity:{ duration: any ? 0.15 : 0.5, delay: s3 ? i*0.06 : 0 } }}
                style={{ borderTop:'1px solid rgba(255,255,255,0.04)', background:active?d.bg:'transparent', height:active?130:76, transition:'height 0.55s cubic-bezier(0.16,1,0.3,1), background 0.4s ease', overflow:'hidden', cursor:'crosshair', position:'relative' }}
                data-cursor={d.label}>
                <motion.div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:d.color }} animate={{ opacity:active?1:0 }} transition={{ duration:0.3 }} />
                <motion.div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:d.color }} animate={{ opacity:active?0.5:0 }} transition={{ duration:0.3 }} />
                <div style={{ display:'flex', alignItems:'center', height:76, padding:'0 48px', gap:24 }}>
                  <span style={{ fontSize:10, fontFamily:'monospace', width:24, flexShrink:0, color:active?d.color:'rgba(255,255,255,0.15)' }}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{ fontSize:'clamp(22px,3.5vw,44px)', fontWeight:300, flex:'0 0 auto', minWidth:180, color:active?'white':'rgba(255,255,255,0.7)', transition:'color 0.3s' }}>{d.label}</span>
                  <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)', position:'relative', overflow:'hidden' }}>
                    <motion.div style={{ position:'absolute', left:0, top:0, height:'100%', background:d.color }} animate={{ width:active?`${Math.min(d.n,100)}%`:'0%' }} transition={{ duration:0.65, ease:[0.16,1,0.3,1] }} />
                  </div>
                  <motion.span style={{ fontSize:'clamp(20px,2.8vw,36px)', fontWeight:300, color:d.color, width:100, textAlign:'right', flexShrink:0, fontVariantNumeric:'tabular-nums' }} animate={{ opacity:active?1:0, x:active?0:10 }} transition={{ duration:0.25 }}>{d.n}{d.u}</motion.span>
                </div>
                <motion.p animate={{ opacity:active?1:0, y:active?0:-6 }} transition={{ duration:0.3, delay:active?0.12:0 }}
                  style={{ fontSize:12, color:'rgba(255,255,255,0.38)', fontWeight:300, padding:'0 48px 0 78px' }}>{d.desc}</motion.p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 04 USPs — WHY PRISM ──────────────────────────────────────────────── */}
      <section ref={uspRef} id="platform-detail" style={{ borderTop:'1px solid rgba(255,255,255,0.04)', padding:'80px 48px' }}>
        <p style={{ ...T, marginBottom:60 }}>Why Prism</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:1, border:'1px solid rgba(255,255,255,0.04)' }}>
          {USPs.map((usp,i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:20 }} animate={uspV ? { opacity:1, y:0 } : {}}
              transition={{ delay:i*0.1, duration:0.6, ease:[0.16,1,0.3,1] }}
              style={{ padding:'48px 40px', borderRight:i%2===0?'1px solid rgba(255,255,255,0.04)':'none', borderBottom:i<2?'1px solid rgba(255,255,255,0.04)':'none', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:usp.color, opacity:0.7 }} />
              <p style={{ ...T, color:usp.color+'99', marginBottom:16 }}>{usp.tag}</p>
              <h3 style={{ fontSize:'clamp(18px,2.2vw,26px)', fontWeight:300, color:'white', lineHeight:1.25, letterSpacing:'-0.02em', marginBottom:16 }}>{usp.headline}</h3>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.38)', fontWeight:300, lineHeight:1.85, marginBottom:28 }}>{usp.body}</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:6 }}>
                <span style={{ fontSize:'clamp(32px,4vw,52px)', fontWeight:200, color:'white', letterSpacing:'-0.03em', lineHeight:1 }}>{usp.stat}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontWeight:300, maxWidth:160, lineHeight:1.5 }}>{usp.statLabel}</span>
              </div>
              <p style={{ ...T, fontSize:8, color:'rgba(255,255,255,0.15)' }}>{usp.src}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ── 04b PERSONA SECTION — three buyers ─────────────────────────────── */}
      <section style={{ borderTop:'1px solid rgba(255,255,255,0.04)', padding:'80px 48px' }}>
        <p style={{ ...T, marginBottom:48 }}>Built for every decision-maker</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:1, border:'1px solid rgba(255,255,255,0.04)' }}>
          {[
            {
              role:'HR Directors & People Ops',
              tag:'50–500 employees',
              color:'#38bdf8',
              lines:[
                'Replace annual review cycles with continuous signal',
                'Predict attrition before it becomes a resignation letter',
                'Prove the ROI of every people programme to leadership',
                'Run 1:1 prep in seconds, not hours',
              ],
              cta:'signup',
              ctaLabel:'Start free trial',
            },
            {
              role:'Founders & CEOs',
              tag:'Early-stage to Series C',
              color:'#c084fc',
              lines:[
                'Build a performance culture from day one — not day 200',
                'Know which hires are compounding and which are coasting',
                'Identify your next leaders before a competitor does',
                'Replace spreadsheet tracking with a living intelligence layer',
              ],
              cta:'signup',
              ctaLabel:'Start free trial',
            },
            {
              role:'Enterprise CHROs',
              tag:'500+ employees',
              color:'#f59e0b',
              lines:[
                'Replace Workday & SAP reporting with actionable intelligence',
                'Standardise performance frameworks across departments',
                'SOC 2 Type II · SSO / SAML · SCIM provisioning',
                'Dedicated success manager and 99.99% SLA',
              ],
              cta:'demo',
              ctaLabel:'Book an enterprise demo',
            },
          ].map((p,i) => (
            <div key={i} style={{ padding:'40px 36px', borderRight:i<2?'1px solid rgba(255,255,255,0.04)':'none', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:p.color, opacity:0.7 }} />
              <p style={{ fontSize:8, letterSpacing:'0.22em', textTransform:'uppercase', color:p.color+'88', fontFamily:'monospace', marginBottom:6 }}>{p.tag}</p>
              <h3 style={{ fontSize:'clamp(16px,1.8vw,22px)', fontWeight:300, color:'white', letterSpacing:'-0.02em', lineHeight:1.25, marginBottom:24 }}>{p.role}</h3>
              <ul style={{ listStyle:'none', margin:0, padding:0, marginBottom:32, display:'flex', flexDirection:'column', gap:10 }}>
                {p.lines.map((l,j) => (
                  <li key={j} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:1, height:14, background:p.color+'50', flexShrink:0, marginTop:2 }} />
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.40)', fontWeight:300, lineHeight:1.7 }}>{l}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => setAuthMode(p.cta as AuthMode)} data-cursor={p.ctaLabel}
                style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:p.color+'99', background:'none', border:`1px solid ${p.color}30`, padding:'10px 16px', cursor:'none', display:'flex', alignItems:'center', gap:8, transition:'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.color=p.color; e.currentTarget.style.borderColor=p.color+'60'; }}
                onMouseLeave={e => { e.currentTarget.style.color=p.color+'99'; e.currentTarget.style.borderColor=p.color+'30'; }}>
                {p.ctaLabel} <ChevronRight size={10} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── 05 COMPETITOR COMPARISON ─────────────────────────────────────────── */}
      <section ref={compRef} style={{ borderTop:'1px solid rgba(255,255,255,0.04)', padding:'80px 48px' }}>
        <p style={{ ...T, marginBottom:48 }}>How We Compare</p>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:640 }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ textAlign:'left', padding:'0 0 24px', fontSize:11, color:'rgba(255,255,255,0.25)', fontWeight:300, fontFamily:'monospace', letterSpacing:'0.1em', textTransform:'uppercase', width:'35%' }}>Feature</th>
                {[
                  { name:'Prism',    color:'#38bdf8', bold:true  },
                  { name:'Lattice',  color:'rgba(255,255,255,0.25)', bold:false },
                  { name:'BambooHR', color:'rgba(255,255,255,0.25)', bold:false },
                  { name:'Workday',  color:'rgba(255,255,255,0.25)', bold:false },
                ].map(col => (
                  <th key={col.name} style={{ textAlign:'center', padding:'0 0 24px', fontSize:col.bold?12:11, color:col.color, fontWeight:300, fontFamily:'monospace', letterSpacing:'0.12em', textTransform:'uppercase' }}>
                    {col.name}
                    {col.bold && <span style={{ display:'block', fontSize:8, color:'rgba(56,189,248,0.5)', marginTop:3 }}>← You are here</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row,i) => (
                <motion.tr key={i}
                  initial={{ opacity:0, x:-10 }} animate={compV ? { opacity:1, x:0 } : {}}
                  transition={{ delay:i*0.06, duration:0.4 }}
                  style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding:'16px 0', fontSize:13, color:'rgba(255,255,255,0.45)', fontWeight:300 }}>{row.feature}</td>
                  {[row.prism, row.lattice, row.bamboo, row.workday].map((v,j) => (
                    <td key={j} style={{ textAlign:'center', padding:'16px 0' }}>
                      {v === true  && <Check size={14} style={{ color:'#10b981', display:'inline' }} />}
                      {v === false && <Minus size={14} style={{ color:'rgba(255,255,255,0.12)', display:'inline' }} />}
                      {v === 'ltd' && <span style={{ fontSize:9, fontFamily:'monospace', color:'rgba(255,158,11,0.6)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Limited</span>}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 06 SOCIAL PROOF ──────────────────────────────────────────────────── */}
      <section ref={proofRef} style={{ borderTop:'1px solid rgba(255,255,255,0.04)', padding:'80px 48px' }}>
        <p style={{ ...T, marginBottom:60 }}>From the field</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:24 }}>
          {PROOF.map((p,i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:20 }} animate={proofV ? { opacity:1, y:0 } : {}}
              transition={{ delay:i*0.12, duration:0.6, ease:[0.16,1,0.3,1] }}
              style={{ border:'1px solid rgba(255,255,255,0.06)', padding:'36px 32px', position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:0, width:40, height:2, background:'linear-gradient(90deg,rgba(255,255,255,0.35),transparent)' }} />
              <p style={{ fontSize:14, fontWeight:300, color:'rgba(255,255,255,0.5)', lineHeight:1.85, fontStyle:'italic', fontFamily:'Cormorant Garamond,Georgia,serif', marginBottom:28 }}>
                "{p.quote}"
              </p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontWeight:300 }}>{p.name}</p>
              <p style={{ ...T, fontSize:8, color:'rgba(255,255,255,0.18)', marginTop:4 }}>{p.co}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 07 RESEARCH ──────────────────────────────────────────────────────── */}
      <section ref={s4ref} id="research" style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ padding:'80px 48px 0' }}>
          <p style={{ ...T, marginBottom:60 }}>Research Basis</p>
        </div>
        {[
          { n:'$11.1T', body:'Lost annually to disengaged, unseen employees worldwide.', src:'Gallup State of the Global Workplace · 2024' },
          { n:'92%',    body:'Of HR leaders say their performance data is siloed or incomplete.', src:'Deloitte Global Human Capital Trends · 2024' },
          { n:'200%',   body:'The true cost to replace one person, relative to their annual salary.', src:'SHRM Employee Benefits Research · 2023' },
          { n:'34%',    body:'Performance gain from structured, continuous multi-source feedback.', src:'MIT Sloan Management Review · 2022' },
        ].map((p,i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:20 }} animate={s4 ? { opacity:1, y:0 } : {}}
            transition={{ delay:i*0.1, duration:0.7, ease:[0.16,1,0.3,1] }}
            style={{ display:'grid', gridTemplateColumns:i%2===0?'1fr 2fr':'2fr 1fr', borderTop:'1px solid rgba(255,255,255,0.04)', alignItems:'center' }}>
            <div style={{ padding:'52px 48px', order:i%2===0?0:1 }}>
              <p style={{ fontSize:'clamp(52px,8vw,110px)', fontWeight:200, color:'white', letterSpacing:'-0.04em', lineHeight:1 }}>{p.n}</p>
            </div>
            <div style={{ padding:'52px 48px', borderLeft:i%2===0?'1px solid rgba(255,255,255,0.04)':'none', borderRight:i%2===1?'1px solid rgba(255,255,255,0.04)':'none', order:i%2===0?1:0 }}>
              <p style={{ fontSize:15, fontWeight:300, color:'rgba(255,255,255,0.50)', lineHeight:1.8, marginBottom:20 }}>{p.body}</p>
              <p style={{ ...T, fontSize:8 }}>{p.src}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── 08 PRICING ───────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ padding:'80px 48px 48px' }}>
          <p style={{ ...T, marginBottom:8 }}>Pricing</p>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.25)', fontWeight:300 }}>Start free for 30 days. No credit card required.</p>
        </div>
        {[
          { name:'Starter',       price:'$18',   unit:'/seat/mo', desc:'Small teams beginning to see clearly.',
            features:['KPI & OKR tracking','Basic 360° reviews','Attendance matrix','Up to 15 seats','Email support'], cta:'login' as AuthMode },
          { name:'Growth',        price:'$42',   unit:'/seat/mo', desc:'Full performance intelligence for scaling orgs.',
            features:['Everything in Starter','ROI intelligence engine','Wellbeing telemetry','Attrition prediction','Leaderboard & rankings','Up to 250 seats'], cta:'org' as AuthMode, featured:true },
          { name:'Enterprise',    price:'Custom',unit:'',          desc:'Tailored for 250+ seat organisations.',
            features:['Everything in Growth','SSO / SAML / SCIM','Custom benchmarks & KPIs','Dedicated success manager','SLA 99.99% uptime','Unlimited seats'], cta:'demo' as AuthMode },
        ].map((plan,i) => (
          <div key={plan.name} style={{ borderTop:'1px solid rgba(255,255,255,0.04)', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', background:plan.featured?'rgba(255,255,255,0.018)':'transparent' }}>
            <div style={{ padding:'48px 48px', borderRight:'1px solid rgba(255,255,255,0.04)' }}>
              {plan.featured && <div style={{ height:1, background:'rgba(255,255,255,0.18)', marginBottom:32 }} />}
              <p style={{ ...T, color:'rgba(255,255,255,0.3)', marginBottom:12 }}>{plan.name}</p>
              <p style={{ fontSize:13, fontWeight:300, color:'rgba(255,255,255,0.35)', lineHeight:1.8 }}>{plan.desc}</p>
            </div>
            <div style={{ padding:'48px 48px', borderRight:'1px solid rgba(255,255,255,0.04)', display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                <span style={{ fontSize:'clamp(44px,6vw,80px)', fontWeight:200, color:'white', lineHeight:1, letterSpacing:'-0.03em' }}>{plan.price}</span>
                {plan.unit && <span style={{ fontSize:12, color:'rgba(255,255,255,0.25)', fontWeight:300 }}>{plan.unit}</span>}
              </div>
              {i === 0 && <p style={{ fontSize:11, color:'rgba(255,255,255,0.2)', marginTop:8 }}>30-day free trial included</p>}
            </div>
            <div style={{ padding:'48px 48px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <Check size={11} style={{ color:'rgba(255,255,255,0.3)', flexShrink:0 }} />
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.38)', fontWeight:300 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setAuthMode(plan.cta)} data-cursor={plan.price === 'Custom' ? 'Book demo' : 'Start free'}
                style={{ marginTop:32, fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', background:'none', border:'1px solid rgba(255,255,255,0.12)', padding:'12px 16px', cursor:'none', display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.color='rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; }}>
                {plan.price === 'Custom' ? 'Book Enterprise Demo' : 'Start Free Trial'}
                <ChevronRight size={11} />
              </button>
            </div>
          </div>
        ))}
        <p style={{ padding:'24px 48px', ...T, fontSize:8, color:'rgba(255,255,255,0.14)', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
          Prices in USD · Annual billing saves 20% · SOC 2 Type II · GDPR Compliant
        </p>
      </section>

      {/* ── 09 FINAL CTA ─────────────────────────────────────────────────────── */}
      <section ref={ctaRef} style={{ borderTop:'1px solid rgba(255,255,255,0.04)', minHeight:'80vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'120px 48px', position:'relative', overflow:'hidden', textAlign:'center', gap:48 }}>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none', opacity:0.04 }}>
          <PrismMark size={560} />
        </div>

        <motion.div initial={{ opacity:0, y:24 }} animate={ctaV ? { opacity:1, y:0 } : {}} transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
          style={{ position:'relative', zIndex:2 }}>
          <p style={{ ...T, marginBottom:32, display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
            <span style={{ display:'inline-block', width:24, height:1, background:'rgba(255,255,255,0.2)' }} />
            Stop guessing. Start knowing.
            <span style={{ display:'inline-block', width:24, height:1, background:'rgba(255,255,255,0.2)' }} />
          </p>
          <h2 style={{ fontSize:'clamp(44px,7vw,100px)', fontWeight:300, letterSpacing:'-0.04em', lineHeight:0.9, color:'white' }}>
            The next resignation<br/>
            <em style={{ color:'rgba(255,255,255,0.22)', fontFamily:'Cormorant Garamond,Georgia,serif', fontStyle:'italic' }}>is preventable.</em>
          </h2>
        </motion.div>

        <motion.p initial={{ opacity:0 }} animate={ctaV ? { opacity:1 } : {}} transition={{ delay:0.3, duration:0.8 }}
          style={{ fontSize:15, fontWeight:300, color:'rgba(255,255,255,0.32)', lineHeight:1.9, maxWidth:500, position:'relative', zIndex:2 }}>
          Prism gives HR directors and people ops teams the continuous signal layer they need to retain talent, quantify ROI, and manage performance before the annual review — not after.
        </motion.p>

        <motion.div initial={{ opacity:0 }} animate={ctaV ? { opacity:1 } : {}} transition={{ delay:0.5, duration:0.8 }}
          style={{ display:'flex', gap:24, alignItems:'center', flexWrap:'wrap', justifyContent:'center', position:'relative', zIndex:2 }}>
          <button onClick={() => setAuthMode('signup')} data-cursor="Start Free"
            style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, fontWeight:300, color:'white', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.18)', padding:'16px 32px', cursor:'none', transition:'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; }}>
            Start free — 30 days <ArrowUpRight size={14} style={{ color:'rgba(255,255,255,0.4)' }} />
          </button>
          <button onClick={() => setAuthMode('demo')} data-cursor="Book Demo"
            style={{ fontSize:14, fontWeight:300, color:'rgba(255,255,255,0.25)', background:'none', border:'none', cursor:'none', transition:'color 0.3s', display:'flex', alignItems:'center', gap:6 }}
            onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.55)')}
            onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.25)')}>
            Book a 30-min demo instead
          </button>
          <button onClick={() => setAuthMode('login')} data-cursor="Sign In"
            style={{ fontSize:14, fontWeight:300, color:'rgba(255,255,255,0.22)', background:'none', border:'none', cursor:'none', transition:'color 0.3s', display:'flex', alignItems:'center', gap:6 }}
            onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.55)')}
            onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.22)')}>
            Already a customer? Sign in
          </button>
        </motion.div>

        <motion.div initial={{ opacity:0 }} animate={ctaV ? { opacity:1 } : {}} transition={{ delay:0.7, duration:0.8 }}
          style={{ display:'flex', gap:32, position:'relative', zIndex:2, flexWrap:'wrap', justifyContent:'center' }}>
          {['No credit card required','30-day free trial','Cancel any time','SOC 2 Type II'].map(t => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Check size={10} style={{ color:'rgba(255,255,255,0.25)' }} />
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.28)', fontWeight:300 }}>{t}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.04)', padding:'24px 48px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <PrismMark size={10} compact />
          <span style={{ ...T, fontSize:8, color:'rgba(255,255,255,0.18)' }}>Prism Intelligence · 2025 · Performance Refracted</span>
        </div>
        <div style={{ display:'flex', gap:28 }}>
          {['Privacy Policy','Security','SOC 2 Type II','GDPR'].map(l => (
            <a key={l} href="#" data-cursor={l}
              style={{ ...T, fontSize:8, color:'rgba(255,255,255,0.14)', textDecoration:'none', transition:'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.45)')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.14)')}>
              {l}
            </a>
          ))}
        </div>
      </footer>

      <AnimatePresence>
        {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />}
      </AnimatePresence>
    </div>
  );
}
