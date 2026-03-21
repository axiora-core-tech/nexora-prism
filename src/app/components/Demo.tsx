import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, CheckCircle2, Building2, Users, Mail, Phone, Globe } from 'lucide-react';

const CREAM = '#F5F0E8';
const INK   = '#0F0F0D';
const GOLD  = '#C8973A';

export function Demo() {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [company, setCompany] = useState('');
  const [size,    setSize]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [website, setWebsite] = useState('');
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  const inp =
    'w-full rounded-2xl text-sm font-light outline-none transition-colors' +
    ' bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/25 focus:border-white/25';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#0A0A08' }}
    >
      {/* ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(200,151,58,0.05) 0%, transparent 70%)',
        }}
      />

      <NavLink
        to="/"
        className="fixed top-8 left-8 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest transition-colors z-10"
        style={{ color: 'rgba(245,240,232,0.3)' }}
      >
        <ArrowLeft size={12} /> Back
      </NavLink>

      <AnimatePresence mode="wait">
        {done ? (
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
              className="text-[8px] font-mono uppercase tracking-[0.28em] mb-3"
              style={{ color: GOLD }}
            >
              Request Received
            </p>
            <h3
              className="text-3xl font-light mb-4"
              style={{
                color: CREAM,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
              }}
            >
              We'll be in touch.
            </h3>
            <p
              className="text-sm font-light mb-10 leading-relaxed"
              style={{ color: 'rgba(245,240,232,0.4)' }}
            >
              Expect a personalised demo within 1 business day.
            </p>
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-mono uppercase tracking-widest font-bold hover:opacity-85 transition-opacity"
              style={{ background: GOLD, color: INK }}
            >
              Back to Home
            </NavLink>
            <NavLink
              to="/sign-in"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-mono uppercase tracking-widest transition-colors mt-3"
              style={{ border: `1px solid rgba(245,240,232,0.1)`, color: 'rgba(245,240,232,0.4)' }}
            >
              Create an account →
            </NavLink>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg overflow-hidden relative rounded-[2rem]"
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

            <div className="p-8 pb-0 relative z-10">
              <p
                className="text-[8px] font-mono uppercase tracking-[0.28em] mb-3"
                style={{ color: GOLD }}
              >
                Prism Intelligence
              </p>
              <h3
                className="text-2xl font-light mb-1"
                style={{
                  color: CREAM,
                  fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontStyle: 'italic',
                }}
              >
                Request a Demo
              </h3>
              <p
                className="text-xs font-light mb-6"
                style={{ color: 'rgba(245,240,232,0.35)' }}
              >
                See Prism in action with a walkthrough tailored to your team.
              </p>
            </div>

            <div className="p-8 pt-4 space-y-3.5 relative z-10">
              {/* name + email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p
                    className="text-[8px] font-mono uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(245,240,232,0.3)' }}
                  >
                    Full name
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
                      placeholder="Alex Mercer"
                      className={`${inp} pl-10 pr-4 py-3`}
                    />
                  </div>
                </div>
                <div>
                  <p
                    className="text-[8px] font-mono uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(245,240,232,0.3)' }}
                  >
                    Work email
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
              </div>

              {/* company + size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p
                    className="text-[8px] font-mono uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(245,240,232,0.3)' }}
                  >
                    Company
                  </p>
                  <div className="relative">
                    <Building2
                      size={12}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgba(245,240,232,0.25)' }}
                    />
                    <input
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      type="text"
                      placeholder="Acme Corp"
                      className={`${inp} pl-10 pr-4 py-3`}
                    />
                  </div>
                </div>
                <div>
                  <p
                    className="text-[8px] font-mono uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(245,240,232,0.3)' }}
                  >
                    Team size
                  </p>
                  <select
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    className={`${inp} px-4 py-3`}
                    style={{ appearance: 'none' }}
                  >
                    <option value="" style={{ background: INK }}>Select…</option>
                    {['1–10', '11–50', '51–200', '200+'].map(s => (
                      <option key={s} value={s} style={{ background: INK }}>
                        {s} people
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* phone + website */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p
                    className="text-[8px] font-mono uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(245,240,232,0.3)' }}
                  >
                    Phone (optional)
                  </p>
                  <div className="relative">
                    <Phone
                      size={12}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgba(245,240,232,0.25)' }}
                    />
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      type="tel"
                      placeholder="+1 555 000 0000"
                      className={`${inp} pl-10 pr-4 py-3`}
                    />
                  </div>
                </div>
                <div>
                  <p
                    className="text-[8px] font-mono uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(245,240,232,0.3)' }}
                  >
                    Website (optional)
                  </p>
                  <div className="relative">
                    <Globe
                      size={12}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgba(245,240,232,0.25)' }}
                    />
                    <input
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                      type="url"
                      placeholder="acme.com"
                      className={`${inp} pl-10 pr-4 py-3`}
                    />
                  </div>
                </div>
              </div>

              {/* submit */}
              {error && (
                <p className="text-[9px] font-mono text-rose-400/80 text-center uppercase tracking-widest -mb-1">
                  {error}
                </p>
              )}
              <button
                onClick={() => {
                  setError('');
                  if (!name.trim())    { setError('Full name is required.');   return; }
                  if (!email.trim())   { setError('Work email is required.');  return; }
                  if (!company.trim()) { setError('Company is required.');     return; }
                  if (!size)           { setError('Please select a team size.'); return; }
                  setDone(true);
                }}
                className="w-full mt-1 py-3.5 rounded-2xl flex items-center justify-between px-6 hover:opacity-90 transition-opacity"
                style={{ background: GOLD }}
              >
                <span
                  className="text-xs font-mono uppercase tracking-widest font-bold"
                  style={{ color: INK }}
                >
                  Request Demo
                </span>
                <Send size={13} style={{ color: INK }} />
              </button>

              <p
                className="text-[7px] text-center font-mono uppercase tracking-widest"
                style={{ color: 'rgba(245,240,232,0.14)' }}
              >
                No commitment · Personalised walkthrough · Response within 24h
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
