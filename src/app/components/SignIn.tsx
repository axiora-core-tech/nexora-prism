import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, ArrowUpRight, Eye, EyeOff, Mail, Lock,
  Building2, Users, ChevronRight, Check, Hexagon,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { CustomCursor } from './ui/CustomCursor';

type AuthMode = 'login' | 'signup' | 'org' | 'invite';

export function SignIn() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/app';
  void from;

  const [mode, setMode]       = useState<AuthMode>('login');
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail]     = useState('');
  const [pass, setPass]       = useState('');
  const [name, setName]       = useState('');
  const [org, setOrg]         = useState('');
  const [invites, setInvites] = useState(['', '']);
  const [error, setError]     = useState('');

  const handleSuccess = () => {
    setError('');
    if (mode === 'login') {
      if (!email.trim()) { setError('Email is required.'); return; }
      if (!pass.trim())  { setError('Passphrase is required.'); return; }
    }
    if (mode === 'signup') {
      if (!name.trim())  { setError('Name is required.'); return; }
      if (!email.trim()) { setError('Email is required.'); return; }
      if (pass.trim().length < 6) { setError('Passphrase must be at least 6 characters.'); return; }
    }
    login(email.trim() || 'user@prism.app', name.trim() || undefined);
    // Go straight to /enter — ThresholdTransition plays, then auto-navigates to /app
    navigate('/enter');
  };

  const signupSteps: { id: AuthMode; label: string }[] = [
    { id: 'signup', label: 'Account' },
    { id: 'org',    label: 'Org'     },
    { id: 'invite', label: 'Invite'  },
  ];
  const currentStep = signupSteps.findIndex(s => s.id === mode);

  // Shared input class — matches app's dark card style
  const inp = [
    'w-full rounded-2xl text-sm font-light outline-none transition-all',
    'bg-white/[0.04] border border-white/[0.08]',
    'text-white placeholder:text-white/20',
    'focus:border-white/20 focus:bg-white/[0.06]',
    'px-4 py-3',
  ].join(' ');

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 cursor-none"
      style={{ backgroundColor: 'var(--p-bg)' }}
    >
      <CustomCursor />
      {/* Ambient blobs matching Layout */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
          style={{ backgroundColor: 'rgba(88,28,135,0.18)' }} />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
          style={{ backgroundColor: 'rgba(6,182,212,0.08)' }} />
      </div>

      {/* Back to landing */}
      <NavLink to="/"
        className="fixed top-8 left-8 inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest p-text-dim hover:p-text-hi transition-colors z-10">
        <ArrowLeft size={12} /> Back
      </NavLink>

      {/* Brand mark */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
        <Hexagon size={18} className="text-white/60" />
        <span className="text-sm font-mono uppercase tracking-[0.25em] p-text-mid">Prism</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="relative rounded-[2rem] overflow-hidden border p-border"
          style={{ backgroundColor: 'var(--p-surface)' }}>

          {/* Top accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none"
            style={{ background: 'rgba(99,102,241,0.06)' }} />

          {/* Header */}
          <div className="px-8 pt-8 pb-0 relative z-10">
            <p className="text-xs font-mono uppercase tracking-[0.25em] p-text-ghost mb-3">
              Prism Intelligence
            </p>
            <AnimatePresence mode="wait">
              <motion.h2 key={mode}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
                className="text-2xl font-light tracking-tight text-white mb-0 font-serif italic">
                {mode === 'login'  ? 'Good to see you again'
                  : mode === 'signup' ? 'Join the network'
                  : mode === 'org'    ? 'Set up your org'
                  :                    'Grow your team'}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Login / Create toggle */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="flex gap-1 mx-8 mt-6 p-1 rounded-xl border p-border" style={{ backgroundColor: 'var(--p-bg-card)' }}>
              {(['login', 'signup'] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all ${
                    mode === m
                      ? 'bg-white/10 text-white border border-white/10'
                      : 'p-text-dim hover:p-text-mid'
                  }`}>
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
          )}

          {/* Wizard steps — signup only */}
          {currentStep >= 0 && (
            <div className="flex items-center gap-2 mx-8 mt-5 relative z-10">
              {signupSteps.map((step, i) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono transition-all ${
                      i < currentStep  ? 'bg-white/20 text-white' :
                      i === currentStep ? 'border border-white/30 text-white' :
                                          'border border-white/10 p-text-ghost'
                    }`}>
                      {i < currentStep ? <Check size={9} /> : i + 1}
                    </div>
                    <span className={`text-xs font-mono uppercase tracking-widest ${
                      i === currentStep ? 'p-text-mid' : 'p-text-ghost'
                    }`}>{step.label}</span>
                  </div>
                  {i < signupSteps.length - 1 && (
                    <div className="flex-1 h-px max-w-6" style={{
                      backgroundColor: i < currentStep ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'
                    }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Form body */}
          <AnimatePresence mode="wait">
            <motion.div key={mode}
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}
              className="px-8 py-6 space-y-4 relative z-10">

              {/* Login / Signup fields */}
              {(mode === 'login' || mode === 'signup') && (
                <>
                  {mode === 'signup' && (
                    <div>
                      <label className="text-xs font-mono uppercase tracking-[0.2em] p-text-dim block mb-2">Name</label>
                      <div className="relative">
                        <Users size={12} className="absolute left-4 top-1/2 -translate-y-1/2 p-text-ghost" />
                        <input value={name} onChange={e => setName(e.target.value)}
                          type="text" placeholder="Your name" className={`${inp} pl-10`} />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-mono uppercase tracking-[0.2em] p-text-dim block mb-2">Email</label>
                    <div className="relative">
                      <Mail size={12} className="absolute left-4 top-1/2 -translate-y-1/2 p-text-ghost" />
                      <input value={email} onChange={e => setEmail(e.target.value)}
                        type="email" placeholder="you@company.com" className={`${inp} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-[0.2em] p-text-dim block mb-2">Passphrase</label>
                    <div className="relative">
                      <Lock size={12} className="absolute left-4 top-1/2 -translate-y-1/2 p-text-ghost" />
                      <input value={pass} onChange={e => setPass(e.target.value)}
                        type={showPass ? 'text' : 'password'} placeholder="••••••••••••"
                        className={`${inp} pl-10 pr-10`} />
                      <button onClick={() => setShowPass(s => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-text-ghost hover:p-text-mid transition-colors">
                        {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Org setup */}
              {mode === 'org' && (
                <>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-[0.2em] p-text-dim block mb-2">Organisation</label>
                    <div className="relative">
                      <Building2 size={12} className="absolute left-4 top-1/2 -translate-y-1/2 p-text-ghost" />
                      <input value={org} onChange={e => setOrg(e.target.value)}
                        type="text" placeholder="Acme Corp" className={`${inp} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-[0.2em] p-text-dim block mb-2">Team size</label>
                    <select className={inp} style={{ backgroundColor: 'var(--p-bg-input)' }}>
                      {['1–10', '11–50', '51–200', '200+'].map(s => (
                        <option key={s} style={{ backgroundColor: 'var(--p-surface)' }}>{s} people</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2.5 pt-1">
                    <button onClick={() => setMode('signup')}
                      className="px-4 py-3 rounded-2xl border p-border p-text-dim hover:p-text-hi hover:p-border-mid transition-all">
                      <ArrowLeft size={12} />
                    </button>
                    <button onClick={() => setMode('invite')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl p-bg-card border p-border-mid p-text-mid hover:bg-white/10 hover:p-text-hi transition-all">
                      <span className="text-sm font-light">Continue</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </>
              )}

              {/* Invite teammates */}
              {mode === 'invite' && (
                <>
                  {invites.map((inv, i) => (
                    <div key={i}>
                      <label className="text-xs font-mono uppercase tracking-[0.2em] p-text-dim block mb-2">
                        Team member {i + 1}
                      </label>
                      <div className="relative">
                        <Mail size={12} className="absolute left-4 top-1/2 -translate-y-1/2 p-text-ghost" />
                        <input value={inv}
                          onChange={e => { const n = [...invites]; n[i] = e.target.value; setInvites(n); }}
                          type="email" placeholder="colleague@company.com"
                          className={`${inp} pl-10`} />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setInvites([...invites, ''])}
                    className="text-xs font-mono uppercase tracking-widest p-text-dim hover:p-text-mid transition-colors">
                    + Add another
                  </button>
                </>
              )}

              {/* Error */}
              {error && (
                <p className="text-xs font-mono text-rose-400/80 uppercase tracking-widest text-center">{error}</p>
              )}

              {/* Submit */}
              <button onClick={handleSuccess}
                className="w-full mt-1 py-3.5 rounded-2xl flex items-center justify-between px-6 bg-white/10 border p-border-mid p-text-body hover:bg-white/[0.15] hover:text-white hover:p-border-hi transition-all group">
                <span className="text-sm font-mono uppercase tracking-widest">
                  {mode === 'login'  ? 'Enter workspace'
                    : mode === 'signup' ? 'Create account'
                    : mode === 'org'    ? 'Continue'
                    :                    'Send invites & enter'}
                </span>
                <ArrowUpRight size={14} className="p-text-dim group-hover:text-cyan-400 transition-colors" />
              </button>

              <p className="text-xs text-center font-mono uppercase tracking-widest p-text-ghost">
                End-to-end encrypted · SOC 2 Type II
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
