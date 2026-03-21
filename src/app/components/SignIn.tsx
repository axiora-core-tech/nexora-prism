import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight, X, Eye, EyeOff, Mail, Lock,
  Building2, UserPlus, Send, CheckCircle2, Users,
  ArrowLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

/* ── palette matches the old Landing.tsx warm editorial style ── */
const CREAM = '#F5F0E8';
const INK   = '#0F0F0D';
const GOLD  = '#C8973A';

type AuthMode = 'login' | 'signup' | 'org' | 'invite';

export function SignIn() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { login }  = useAuth();

  // If we were redirected here from a protected route, go back there after login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/app';

  const [mode, setMode]       = useState<AuthMode>('login');
  const [sp, setSp]           = useState(false);
  const [email, setEmail]     = useState('');
  const [pass, setPass]       = useState('');
  const [name, setName]       = useState('');
  const [org, setOrg]         = useState('');
  const [invites, setInvites] = useState(['', '']);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState('');

  const inp =
    'w-full rounded-2xl text-sm font-light outline-none transition-colors placeholder-opacity-30' +
    ' bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/25 focus:border-white/25';

  const handleSuccess = () => {
    setError('');
    if (mode === 'login') {
      if (!email.trim())        { setError('Email is required.');    return; }
      if (!pass.trim())         { setError('Passphrase is required.'); return; }
    }
    if (mode === 'signup') {
      if (!name.trim())         { setError('Name is required.');     return; }
      if (!email.trim())        { setError('Email is required.');    return; }
      if (pass.trim().length < 6){ setError('Passphrase must be at least 6 characters.'); return; }
    }
    login(email.trim() || 'user@prism.app', name.trim() || undefined);
    setDone(true);
  };

  const handleEnterDashboard = () => {
    // Always route through /enter so ThresholdTransition plays,
    // then it auto-navigates to /app after the animation completes.
    navigate('/enter');
  };

  // Wizard steps shown only during signup flow (login is standalone)
  const signupSteps: { id: AuthMode; label: string }[] = [
    { id: 'signup', label: 'Account'  },
    { id: 'org',    label: 'Org'      },
    { id: 'invite', label: 'Invite'   },
  ];
  const currentStep = signupSteps.findIndex(s => s.id === mode);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#0A0A08' }}
    >
      {/* subtle ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(200,151,58,0.06) 0%, transparent 70%)',
        }}
      />

      {/* back to landing */}
      <NavLink
        to="/"
        className="fixed top-8 left-8 flex items-center gap-2 text-sm font-mono uppercase tracking-widest transition-colors z-10"
        style={{ color: 'rgba(245,240,232,0.3)' }}
      >
        <ArrowLeft size={12} /> Back
      </NavLink>

      <AnimatePresence mode="wait">
        {done ? (
          /* ── Success state ── */
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm p-12 text-center relative overflow-hidden rounded-[2rem]"
            style={{ background: INK, border: `1px solid rgba(245,240,232,0.08)` }}
          >
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }}
            />
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-8"
              style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}40` }}
            >
              <CheckCircle2 size={22} style={{ color: GOLD }} />
            </div>
            <p
              className="text-sm font-mono uppercase tracking-[0.28em] mb-2"
              style={{ color: GOLD }}
            >
              Welcome to Prism
            </p>
            <h3
              className="text-3xl font-light mb-8"
              style={{
                color: CREAM,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
              }}
            >
              You're in.
            </h3>
            <button
              onClick={handleEnterDashboard}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-mono uppercase tracking-widest font-bold hover:opacity-85 transition-opacity"
              style={{ background: GOLD, color: INK }}
            >
              Enter Dashboard <ArrowUpRight size={12} />
            </button>
          </motion.div>
        ) : (
          /* ── Auth panel ── */
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md overflow-hidden relative rounded-[2rem]"
            style={{ background: INK, border: '1px solid rgba(245,240,232,0.07)' }}
          >
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(90deg,transparent,${GOLD}50,transparent)` }}
            />
            <div
              className="absolute top-0 right-0 w-64 h-64 pointer-events-none rounded-full"
              style={{ background: `${GOLD}06`, filter: 'blur(60px)' }}
            />

            {/* header */}
            <div className="flex items-start justify-between p-8 pb-0 relative z-10">
              <div>
                <p
                  className="text-sm font-mono uppercase tracking-[0.28em] mb-3"
                  style={{ color: GOLD }}
                >
                  Prism Intelligence
                </p>
                <h3
                  className="text-2xl font-light"
                  style={{
                    color: CREAM,
                    fontFamily: "'Cormorant Garamond',Georgia,serif",
                    fontStyle: 'italic',
                  }}
                >
                  {mode === 'login'
                    ? 'Good to see you again'
                    : mode === 'signup'
                    ? 'Join the network'
                    : mode === 'org'
                    ? 'Set up your org'
                    : 'Grow your team'}
                </h3>
              </div>
              <NavLink
                to="/"
                className="p-2.5 rounded-full border transition-all"
                style={{
                  background: 'rgba(245,240,232,0.04)',
                  borderColor: 'rgba(245,240,232,0.06)',
                  color: 'rgba(245,240,232,0.3)',
                }}
              >
                <X size={13} />
              </NavLink>
            </div>

            {/* Login / Create toggle — only shown at top level */}
            {(mode === 'login' || mode === 'signup') && (
              <div
                className="flex gap-1 mx-8 mt-5 p-1 rounded-xl relative z-10"
                style={{ background: 'rgba(245,240,232,0.03)' }}
              >
                {(['login', 'signup'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="flex-1 py-2 rounded-lg text-sm font-mono uppercase tracking-widest transition-all"
                    style={{
                      background: mode === m ? `${GOLD}22` : 'transparent',
                      color: mode === m ? GOLD : 'rgba(245,240,232,0.25)',
                    }}
                  >
                    {m === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>
            )}

            {/* Wizard step indicator — only shown during signup flow */}
            {currentStep >= 0 && (
              <div className="flex items-center gap-2 mx-8 mt-5 relative z-10">
                {signupSteps.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-1.5"
                    >
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-sm font-mono font-bold transition-all"
                        style={{
                          background: i < currentStep ? GOLD : i === currentStep ? `${GOLD}33` : 'rgba(245,240,232,0.05)',
                          border: `1px solid ${i <= currentStep ? GOLD + '60' : 'rgba(245,240,232,0.08)'}`,
                          color: i <= currentStep ? GOLD : 'rgba(245,240,232,0.2)',
                        }}
                      >
                        {i < currentStep ? '✓' : i + 1}
                      </div>
                      <span
                        className="text-sm font-mono uppercase tracking-widest"
                        style={{ color: i === currentStep ? 'rgba(245,240,232,0.5)' : 'rgba(245,240,232,0.2)' }}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < signupSteps.length - 1 && (
                      <div className="flex-1 h-px w-6" style={{ background: i < currentStep ? GOLD + '40' : 'rgba(245,240,232,0.07)' }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* form body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="p-8 pt-5 space-y-3.5 relative z-10"
              >
                {(mode === 'login' || mode === 'signup') && (
                  <>
                    {mode === 'signup' && (
                      <div>
                        <p
                          className="text-sm font-mono uppercase tracking-widest mb-2"
                          style={{ color: 'rgba(245,240,232,0.3)' }}
                        >
                          Name
                        </p>
                        <div className="relative">
                          <Users
                            size={12}
                            className="absolute left-4 top-1/2 -translate-y-1/2"
                            style={{ color: 'rgba(245,240,232,0.25)' }}
                          />
                          <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            type="text"
                            placeholder="Your name"
                            className={`${inp} pl-10 pr-4 py-3`}
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <p
                        className="text-sm font-mono uppercase tracking-widest mb-2"
                        style={{ color: 'rgba(245,240,232,0.3)' }}
                      >
                        Email
                      </p>
                      <div className="relative">
                        <Mail
                          size={12}
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          style={{ color: 'rgba(245,240,232,0.25)' }}
                        />
                        <input
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          type="email"
                          placeholder="you@company.com"
                          className={`${inp} pl-10 pr-4 py-3`}
                        />
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-sm font-mono uppercase tracking-widest mb-2"
                        style={{ color: 'rgba(245,240,232,0.3)' }}
                      >
                        Passphrase
                      </p>
                      <div className="relative">
                        <Lock
                          size={12}
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          style={{ color: 'rgba(245,240,232,0.25)' }}
                        />
                        <input
                          value={pass}
                          onChange={e => setPass(e.target.value)}
                          type={sp ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          className={`${inp} pl-10 pr-11 py-3`}
                        />
                        <button
                          onClick={() => setSp(s => !s)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color: 'rgba(245,240,232,0.25)' }}
                        >
                          {sp ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setMode(mode === 'login' ? 'signup' : 'org')}
                      className="text-sm font-mono uppercase tracking-widest transition-colors"
                      style={{ color: GOLD }}
                    >
                      {mode === 'login' ? 'New account →' : 'Set up your org →'}
                    </button>
                  </>
                )}

                {mode === 'org' && (
                  <>
                    <div>
                      <p
                        className="text-sm font-mono uppercase tracking-widest mb-2"
                        style={{ color: 'rgba(245,240,232,0.3)' }}
                      >
                        Organisation
                      </p>
                      <div className="relative">
                        <Building2
                          size={12}
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          style={{ color: 'rgba(245,240,232,0.25)' }}
                        />
                        <input
                          value={org}
                          onChange={e => setOrg(e.target.value)}
                          type="text"
                          placeholder="Acme Corp"
                          className={`${inp} pl-10 pr-4 py-3`}
                        />
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-sm font-mono uppercase tracking-widest mb-2"
                        style={{ color: 'rgba(245,240,232,0.3)' }}
                      >
                        Team size
                      </p>
                      <select className={`${inp} px-4 py-3`}>
                        {['1–10', '11–50', '51–200', '200+'].map(s => (
                          <option key={s} style={{ background: INK }}>
                            {s} people
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2.5">
                      <button
                        onClick={() => setMode('signup')}
                        className="px-4 py-3 rounded-2xl border transition-all"
                        style={{
                          borderColor: 'rgba(245,240,232,0.07)',
                          color: 'rgba(245,240,232,0.3)',
                        }}
                      >
                        <ArrowLeft size={12} />
                      </button>
                      <button
                        onClick={() => setMode('invite')}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all"
                        style={{
                          background: 'rgba(245,240,232,0.04)',
                          border: '1px solid rgba(245,240,232,0.07)',
                          color: CREAM,
                        }}
                      >
                        <span className="text-sm font-light">Continue</span>
                        <ChevronRight size={11} />
                      </button>
                    </div>
                  </>
                )}

                {mode === 'invite' && (
                  <>
                    {invites.map((inv, i) => (
                      <div key={i}>
                        <p
                          className="text-sm font-mono uppercase tracking-widest mb-2"
                          style={{ color: 'rgba(245,240,232,0.3)' }}
                        >
                          Team member {i + 1}
                        </p>
                        <div className="relative">
                          <Mail
                            size={12}
                            className="absolute left-4 top-1/2 -translate-y-1/2"
                            style={{ color: 'rgba(245,240,232,0.25)' }}
                          />
                          <input
                            value={inv}
                            onChange={e => {
                              const n = [...invites];
                              n[i] = e.target.value;
                              setInvites(n);
                            }}
                            type="email"
                            placeholder="colleague@company.com"
                            className={`${inp} pl-10 pr-4 py-3`}
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setInvites([...invites, ''])}
                      className="text-sm font-mono uppercase tracking-widest"
                      style={{ color: GOLD }}
                    >
                      + Add another
                    </button>
                  </>
                )}

                {/* submit */}
                {error && (
                  <p className="text-sm font-mono text-rose-400/80 text-center uppercase tracking-widest -mb-1">
                    {error}
                  </p>
                )}
                <button
                  onClick={handleSuccess}
                  className="w-full mt-1 py-3.5 rounded-2xl flex items-center justify-between px-6 hover:opacity-90 transition-opacity"
                  style={{ background: GOLD }}
                >
                  <span
                    className="text-sm font-mono uppercase tracking-widest font-bold"
                    style={{ color: INK }}
                  >
                    {mode === 'login'
                      ? 'Enter workspace'
                      : mode === 'signup'
                      ? 'Create account'
                      : mode === 'org'
                      ? 'Deploy org'
                      : 'Send invites'}
                  </span>
                  <Send size={13} style={{ color: INK }} />
                </button>

                <p
                  className="text-xs text-center font-mono uppercase tracking-widest"
                  style={{ color: 'rgba(245,240,232,0.14)' }}
                >
                  End-to-end encrypted · SOC 2 Type II
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
