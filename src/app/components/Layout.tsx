import React, { useRef, useEffect, useState, createContext, useContext, useCallback } from 'react';
import { useTheme } from '../auth/ThemeContext';
import { Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Dock } from './ui/Dock';
import { CustomCursor } from './ui/CustomCursor';
import { LuminaryButton } from './ui/LuminaryButton';
import { NotificationBell } from './ui/NotificationBell';

/* ═══ LUMINARY CONTEXT — persists across route changes ═══ */
interface LuminaryContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
const LuminaryContext = createContext<LuminaryContextType>({ isOpen: false, open: () => {}, close: () => {}, toggle: () => {} });
export function useLuminary() { return useContext(LuminaryContext); }

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSITION CHOREOGRAPHY
   
   Navigation type determines animation:
   • Lateral (same depth)  → slide left or right
   • Deeper  (into detail) → scale up from center, slight blur
   • Back    (out of detail)→ scale down to center, reverse
   • Default               → soft fade
   ═══════════════════════════════════════════════════════════════════════════ */

// Depth map — higher number = deeper into the app
const depthMap: Record<string, number> = {
  '/app': 0,          // Spectrum (landing)
  '/app/spectrum': 0,
  '/app/team': 0,
  '/app/tasks': 0,
  '/app/analytics': 0,
  '/app/kpis': 1,
  '/app/attendance': 1,
  '/app/roi': 1,
  '/app/leaderboard': 1,
  '/app/review': 1,
  '/app/reviews': 1,
  '/app/settings': 1,
  // v3 additions
  '/app/onboard': 0,
  '/app/roadmap': 1,
  '/app/approvals': 1,
  '/app/reports': 1,
  '/app/admin': 1,
};

// Position map for lateral sliding — left-to-right order
const posMap: Record<string, number> = {
  '/app': 0,
  '/app/spectrum': 0,
  '/app/team': 1,
  '/app/tasks': 2,
  '/app/analytics': 0,
  '/app/kpis': 3,
  '/app/attendance': 4,
  '/app/roi': 0,
  '/app/leaderboard': 5,
  '/app/review': 6,
  '/app/reviews': 6,
  '/app/settings': 7,
  // v3 additions
  '/app/onboard': -1,
  '/app/roadmap': 8,
  '/app/approvals': 9,
  '/app/reports': 10,
  '/app/admin': 11,
};

function getDepth(path: string): number {
  // Employee detail is always depth 2
  if (path.startsWith('/app/employee/')) return 2;
  return depthMap[path] ?? 1;
}

function getPos(path: string): number {
  if (path.startsWith('/app/employee/')) return 1.5; // between team and analytics
  return posMap[path] ?? 5;
}

type TransitionType = 'lateral-left' | 'lateral-right' | 'dive' | 'surface' | 'fade';

function getTransitionType(from: string, to: string): TransitionType {
  const fromDepth = getDepth(from);
  const toDepth = getDepth(to);
  
  if (toDepth > fromDepth) return 'dive';
  if (toDepth < fromDepth) return 'surface';
  
  // Same depth → lateral slide
  const fromPos = getPos(from);
  const toPos = getPos(to);
  if (fromPos === toPos) return 'fade';
  return toPos > fromPos ? 'lateral-left' : 'lateral-right';
}

const transitions: Record<TransitionType, {
  initial: Record<string, any>;
  animate: Record<string, any>;
  exit: Record<string, any>;
}> = {
  'lateral-left': {
    initial: { opacity: 0, x: 60, filter: 'blur(2px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit:    { opacity: 0, x: -40, filter: 'blur(2px)' },
  },
  'lateral-right': {
    initial: { opacity: 0, x: -60, filter: 'blur(2px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit:    { opacity: 0, x: 40, filter: 'blur(2px)' },
  },
  'dive': {
    initial: { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit:    { opacity: 0, scale: 1.04, filter: 'blur(4px)' },
  },
  'surface': {
    initial: { opacity: 0, scale: 1.06, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit:    { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
  },
  'fade': {
    initial: { opacity: 0, y: 16, filter: 'blur(3px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit:    { opacity: 0, y: -8, filter: 'blur(2px)' },
  },
};

export function Layout() {
  const location = useLocation();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const prevPath = useRef(location.pathname);
  const [transType, setTransType] = useState<TransitionType>('fade');

  // Luminary state — messages persist across open/close cycles
  const [luminaryOpen, setLuminaryOpen] = useState(false);
  const [luminaryMessages, setLuminaryMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);
  const luminaryCtx: LuminaryContextType = {
    isOpen: luminaryOpen,
    open: useCallback(() => setLuminaryOpen(true), []),
    close: useCallback(() => setLuminaryOpen(false), []),
    toggle: useCallback(() => setLuminaryOpen(p => !p), []),
  };

  // Hide dock on Genesis
  const hideDock = location.pathname === '/app/onboard';

  useEffect(() => {
    const type = getTransitionType(prevPath.current, location.pathname);
    setTransType(type);
    prevPath.current = location.pathname;
  }, [location.pathname]);

  const t = transitions[transType];

  return (
    <LuminaryContext.Provider value={luminaryCtx}>
    <div
      className={`prism-shell min-h-screen font-sans overflow-hidden relative cursor-none p-bg ${isLight ? 'prism-light' : 'prism-dark'}`}
      style={{ backgroundColor: 'var(--p-bg)', color: 'var(--p-text-hi)' }}
    >
      <CustomCursor />
      
      {/* ═══ THE PRISM ATMOSPHERE — noise + gradient mesh + depth particles ═══ */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes app-blob-a {
          0%,100% { transform: rotate(0deg)   scale(1)   translate(0px,0px); }
          33%     { transform: rotate(30deg)  scale(1.15) translate(40px,30px); }
          66%     { transform: rotate(-20deg) scale(1.05) translate(-30px,50px); }
        }
        @keyframes app-blob-b {
          0%,100% { transform: rotate(0deg)   scale(1)   translate(0px,0px); }
          33%     { transform: rotate(-30deg) scale(1.2) translate(-40px,-30px); }
          66%     { transform: rotate(15deg)  scale(0.95) translate(30px,-50px); }
        }
        @keyframes app-blob-c {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(60px,-40px) scale(1.1); }
        }
        @keyframes prism-float {
          0%,100% { transform: translateY(0px); opacity: var(--float-a); }
          50%     { transform: translateY(var(--float-y)); opacity: var(--float-b); }
        }
        @media (prefers-reduced-motion: reduce) {
          .app-blob, .prism-particle { animation: none !important; }
        }
      `}} />

      {/* Gradient mesh — 3 blobs in dimension colors */}
      <div className={`fixed inset-0 z-0 pointer-events-none ${isLight ? 'opacity-20' : 'opacity-40 mix-blend-screen'}`}>
        <div className="app-blob absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
          style={{ animation: 'app-blob-a 45s linear infinite', willChange: 'transform', backgroundColor: isLight ? 'rgba(99,102,241,0.12)' : 'rgba(88,28,135,0.18)' }} />
        <div className="app-blob absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
          style={{ animation: 'app-blob-b 55s linear infinite', willChange: 'transform', backgroundColor: isLight ? 'rgba(6,182,212,0.08)' : 'rgba(6,182,212,0.08)' }} />
        <div className="app-blob absolute top-[30%] right-[20%] w-[40vw] h-[40vw] rounded-full blur-[140px]"
          style={{ animation: 'app-blob-c 60s linear infinite', willChange: 'transform', backgroundColor: isLight ? 'rgba(244,63,94,0.04)' : 'rgba(244,63,94,0.05)' }} />
      </div>

      {/* SVG noise texture — adds tactile quality to the dark surface */}
      <svg className="fixed inset-0 z-[1] pointer-events-none w-full h-full" style={{ opacity: isLight ? 0.03 : 0.025 }}>
        <filter id="prism-noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#prism-noise)" />
      </svg>

      {/* Depth particles — floating dots at varying speeds/opacities */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        {[
          { x: '12%', y: '18%', s: 2, a: 0.15, b: 0.25, fy: '-12px', d: '8s' },
          { x: '78%', y: '32%', s: 1.5, a: 0.1, b: 0.2, fy: '-8px', d: '11s' },
          { x: '45%', y: '72%', s: 2.5, a: 0.08, b: 0.18, fy: '-15px', d: '14s' },
          { x: '88%', y: '68%', s: 1, a: 0.12, b: 0.22, fy: '-6px', d: '9s' },
          { x: '25%', y: '85%', s: 1.5, a: 0.06, b: 0.14, fy: '-10px', d: '13s' },
          { x: '62%', y: '15%', s: 2, a: 0.1, b: 0.2, fy: '-12px', d: '10s' },
          { x: '35%', y: '45%', s: 1, a: 0.08, b: 0.16, fy: '-7px', d: '12s' },
          { x: '92%', y: '90%', s: 1.5, a: 0.05, b: 0.12, fy: '-9px', d: '15s' },
        ].map((p, i) => (
          <div key={i} className="prism-particle absolute rounded-full"
            style={{
              left: p.x, top: p.y, width: p.s, height: p.s,
              background: ['#38bdf8', '#c084fc', '#10b981', '#f59e0b', '#f43f5e', '#fb923c', '#38bdf8', '#c084fc'][i],
              '--float-a': p.a, '--float-b': p.b, '--float-y': p.fy,
              animation: `prism-float ${p.d} ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            } as React.CSSProperties} />
        ))}
      </div>

      {/* Cursor overrides for form elements */}
      <style dangerouslySetInnerHTML={{ __html: `
        input, textarea, select { cursor: text !important; }
        input[type="range"]     { cursor: ew-resize !important; }
        input[type="checkbox"],
        input[type="radio"]     { cursor: pointer !important; }
        select                  { cursor: pointer !important; }
      `}} />

      {/* Main content — blurs when Luminary is open */}
      <main
        className="relative z-10 h-screen overflow-y-auto overflow-x-hidden"
        style={{
          scrollbarWidth: 'none', msOverflowStyle: 'none', backgroundColor: 'var(--p-bg)',
          filter: luminaryOpen ? 'blur(8px)' : 'none',
          transform: luminaryOpen ? 'scale(0.96)' : 'scale(1)',
          opacity: luminaryOpen ? 0.4 : 1,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `main::-webkit-scrollbar { display: none; }`}} />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={t.initial}
            animate={t.animate}
            exit={{ ...t.exit, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Notification bell — fixed top right, above everything */}
      <div className="fixed top-6 right-6 z-[60]" style={{ cursor: 'pointer' }}>
        <NotificationBell />
      </div>

      {/* Luminary floating button */}
      {!hideDock && !luminaryOpen && <LuminaryButton onOpen={luminaryCtx.open} hasPending />}

      {/* Dock — hidden on Genesis, NO wrapper div with transforms (breaks fixed positioning) */}
      {!hideDock && !luminaryOpen && <Dock />}

      {/* Luminary overlay — full conversation experience */}
      <AnimatePresence>
        {luminaryOpen && (
          <LuminaryOverlay onClose={luminaryCtx.close} messages={luminaryMessages} setMessages={setLuminaryMessages} />
        )}
      </AnimatePresence>
    </div>
    </LuminaryContext.Provider>
  );
}

/* ═══ LUMINARY OVERLAY — Full conversation experience ═══ */
function LuminaryOverlay({ onClose, messages, setMessages }: {
  onClose: () => void;
  messages: { role: 'ai' | 'user'; text: string }[];
  setMessages: React.Dispatch<React.SetStateAction<{ role: 'ai' | 'user'; text: string }[]>>;
}) {
  const [input, setInput] = React.useState('');
  const [isThinking, setIsThinking] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Generate dynamic greeting on first open (references real employee data)
  React.useEffect(() => {
    if (messages.length === 0) {
      import('../mockData').then(({ employees, roadmap }) => {
        const emp = employees[0]; // First employee for demo
        const activeTasks = 3; // Would come from task store in production
        const onTrackMilestones = roadmap?.milestones?.filter((m: any) => m.status === 'in_progress' || m.status === 'completed').length || 0;
        const hour = new Date().getHours();
        const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
        setMessages([{
          role: 'ai',
          text: `${timeGreeting}, ${emp?.name?.split(' ')[0] || 'there'}. You have ${activeTasks} tasks in progress and ${onTrackMilestones} milestones on track. What would you like to focus on today?`
        }]);
      });
    }
  }, []); // Only runs on mount (first open)

  // ESC key handler (Fix #5)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll when overlay is open (Fix #17)
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Auto-scroll to latest message
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = React.useCallback(() => {
    const text = input.trim();
    if (!text || isThinking) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsThinking(true);

    // Try real AI, fallback to mock
    import('../services/aiService').then(async ({ streamChat, buildLuminaryPrompt }) => {
      try {
        const systemPrompt = 'You are Luminary, the AI manager in Nexora Prism. Be warm, concise, and reference the employee\'s tasks and milestones. Keep responses under 120 words.';
        const chatMessages = [...messages, { role: 'user' as const, text }].map(m => ({
          role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        }));
        let aiText = '';
        setMessages(prev => [...prev, { role: 'ai', text: '...' }]);
        await streamChat(systemPrompt, chatMessages, (full) => {
          aiText = full;
          setMessages(prev => [...prev.slice(0, -1), { role: 'ai', text: full }]);
        });
        if (!aiText) throw new Error('empty');
        // Speak the response (TTS) — fire-and-forget
        speakResponse(aiText);
      } catch {
        // Fallback: mock response
        const mockResponses = [
          'I see you\'re making great progress on the API gateway. The caching layer looks solid at sub-80ms p95. Let me create a task to track the security review sign-off — shall I set the deadline for end of day?',
          'Good update. I\'ll note that the auth proxy is complete. Your next priority from the Meridian is the load testing phase. Want me to break that down into sub-tasks?',
          'Thanks for sharing that. I\'ve logged this as a potential blocker. I\'ll flag it to your manager in the next Checkpoint review. In the meantime, is there anything I can help unblock?',
        ];
        const mockReply = mockResponses[messages.length % mockResponses.length];
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.text === '...') return [...prev.slice(0, -1), { role: 'ai' as const, text: mockReply }];
          return [...prev, { role: 'ai' as const, text: mockReply }];
        });
        speakResponse(mockReply);
      }
      setIsThinking(false);
    });
  }, [input, isThinking, messages]);

  // TTS: attempt to speak AI responses via ElevenLabs, graceful no-op without API key
  const speakResponse = React.useCallback((text: string) => {
    import('../services/voiceService').then(async ({ textToSpeech, playAudio }) => {
      try {
        const audio = await textToSpeech(text);
        if (audio) await playAudio(audio);
      } catch { /* TTS not configured — silent fallback */ }
    }).catch(() => {});
  }, []);

  const handleVoiceTranscript = React.useCallback((text: string) => {
    setInput(prev => (prev + ' ' + text).trim());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[70] flex items-center justify-center"
    >
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} style={{ cursor: 'pointer' }} />

      {/* Warm glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.04), rgba(244,63,94,0.02), transparent)' }} />
      </div>

      {/* Central content */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Avatar — Prism orbital form with thinking particles */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center relative mb-3"
            style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(192,132,252,0.1))', border: '1px solid rgba(56,189,248,0.2)' }}>
            {/* Pulsing outer rings — speed varies when thinking */}
            <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: isThinking ? 1.5 : 3, repeat: Infinity }}
              className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(56,189,248,0.15)' }} />
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: isThinking ? 1.2 : 3, repeat: Infinity, delay: 0.3 }}
              className="absolute -inset-2 rounded-full" style={{ border: '1px solid rgba(192,132,252,0.1)' }} />
            <motion.div animate={{ scale: [1, 1.22, 1], opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: isThinking ? 1 : 4, repeat: Infinity, delay: 0.6 }}
              className="absolute -inset-4 rounded-full" style={{ border: '1px solid rgba(244,63,94,0.06)' }} />

            {/* Thinking particles — float upward from avatar when processing */}
            <AnimatePresence>
              {isThinking && [0, 1, 2, 3, 4].map(i => (
                <motion.div key={`tp-${i}`}
                  initial={{ opacity: 0, y: 0, x: 0 }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    y: [-10, -40 - Math.random() * 20],
                    x: [0, (Math.random() - 0.5) * 30],
                  }}
                  transition={{ duration: 1.5 + Math.random() * 0.8, repeat: Infinity, delay: i * 0.3 }}
                  className="absolute rounded-full"
                  style={{
                    width: 3 + Math.random() * 2, height: 3 + Math.random() * 2,
                    background: ['#38bdf8', '#c084fc', '#10b981', '#f59e0b', '#f43f5e'][i],
                    top: '30%', left: `${40 + Math.random() * 20}%`,
                  }}
                />
              ))}
            </AnimatePresence>

            {/* Prism orbital SVG — 6 concentric rings in dimension colors */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="rgba(244,63,94,0.12)" strokeWidth="0.5" />
              <circle cx="14" cy="14" r="11" stroke="rgba(16,185,129,0.15)" strokeWidth="0.5" />
              <circle cx="14" cy="14" r="9"  stroke="rgba(245,158,11,0.18)" strokeWidth="0.5" />
              <circle cx="14" cy="14" r="7"  stroke="rgba(192,132,252,0.2)" strokeWidth="0.5" />
              <circle cx="14" cy="14" r="5"  stroke="rgba(56,189,248,0.25)" strokeWidth="0.5" />
              <circle cx="14" cy="14" r="3"  stroke="rgba(251,146,60,0.3)" strokeWidth="0.5" />
              <circle cx="14" cy="14" r="1.2" fill="rgba(56,189,248,0.6)" />
            </svg>
          </div>
          <p className="text-sm font-light" style={{ color: 'var(--p-text-mid)' }}>
            <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Luminary</span>
            {isThinking && <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-2 text-xs" style={{ color: 'var(--p-text-ghost)' }}>synthesizing…</motion.span>}
          </p>
        </div>

        {/* Conversation thread */}
        <div className="rounded-2xl p-4 mb-4 max-h-[50vh] overflow-y-auto"
          style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)', backdropFilter: 'blur(20px)', scrollbarWidth: 'none' }}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i === messages.length - 1 ? 0.1 : 0 }}
              className={`flex items-start gap-3 mb-4 last:mb-0 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'ai' ? (
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.1)' }}>
                  {/* Mini Prism orbital */}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="rgba(56,189,248,0.3)" strokeWidth="0.5" />
                    <circle cx="6" cy="6" r="3" stroke="rgba(56,189,248,0.5)" strokeWidth="0.5" />
                    <circle cx="6" cy="6" r="1" fill="rgba(56,189,248,0.8)" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'rgba(192,132,252,0.1)' }}>
                  {/* Signal emission — outgoing beam from point */}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(192,132,252,0.7)" strokeWidth="0.8">
                    <circle cx="3" cy="6" r="1.5" fill="rgba(192,132,252,0.4)" stroke="none" />
                    <line x1="5" y1="6" x2="10" y2="4" /><line x1="5" y1="6" x2="10" y2="6" /><line x1="5" y1="6" x2="10" y2="8" />
                  </svg>
                </div>
              )}
              <div className={`rounded-xl px-4 py-2.5 max-w-[80%]`}
                style={{
                  background: msg.role === 'user' ? 'rgba(192,132,252,0.06)' : 'transparent',
                  border: msg.role === 'user' ? '1px solid rgba(192,132,252,0.12)' : 'none',
                }}>
                <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--p-text-body)' }}>
                  {msg.text === '...' ? (
                    /* G2: Prism pulse rings instead of generic ●●● typing dots */
                    <span className="inline-flex items-center gap-1">
                      {[0, 0.2, 0.4].map(d => (
                        <motion.span key={d} animate={{ scale: [0.6, 1, 0.6], opacity: [0.2, 0.8, 0.2] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: d }}
                          className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#38bdf8' }} />
                      ))}
                    </span>
                  ) : msg.text}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area with VoiceInput */}
        <div className="flex items-center gap-3">
          <LuminaryVoiceButton onTranscript={handleVoiceTranscript} />
          <div className="flex-1 rounded-xl px-4 py-3" style={{ background: 'var(--p-bg-input)', border: '1px solid var(--p-border)' }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Type your update…"
              className="w-full bg-transparent text-sm font-light outline-none"
              style={{ color: 'var(--p-text-body)', cursor: 'text' }}
              autoFocus />
          </div>
          {/* Send button — proper send arrow icon */}
          <button onClick={handleSend} disabled={!input.trim() || isThinking}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105"
            style={{
              background: input.trim() ? 'rgba(56,189,248,0.15)' : 'rgba(56,189,248,0.05)',
              border: `1px solid ${input.trim() ? 'rgba(56,189,248,0.3)' : 'rgba(56,189,248,0.1)'}`,
              cursor: 'pointer',
              opacity: input.trim() ? 1 : 0.5,
            }}>
            {/* Signal emission — Prism-branded send icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="4" cy="8" r="2.5" stroke="#38bdf8" strokeWidth="1" opacity="0.5" />
              <circle cx="4" cy="8" r="1" fill="#38bdf8" />
              <line x1="6.5" y1="8" x2="14" y2="5" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="6.5" y1="8" x2="14" y2="8" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="6.5" y1="8" x2="14" y2="11" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Close hint */}
        <p className="text-center text-[10px] font-mono uppercase tracking-[0.2em] mt-3" style={{ color: 'var(--p-text-ghost)' }}>
          Press <span style={{ color: 'var(--p-text-dim)' }}>ESC</span> to close
        </p>
      </motion.div>
    </motion.div>
  );
}

/* Inline voice button for Luminary (avoids full VoiceInput import complexity) */
function LuminaryVoiceButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [listening, setListening] = React.useState(false);
  const recRef = React.useRef<{ stop: () => void } | null>(null);

  const toggle = React.useCallback(() => {
    if (listening) {
      recRef.current?.stop();
      recRef.current = null;
      setListening(false);
    } else {
      import('../services/voiceService').then(({ startSpeechRecognition, isSpeechRecognitionSupported }) => {
        if (!isSpeechRecognitionSupported()) return;
        const rec = startSpeechRecognition((text, isFinal) => { if (isFinal) onTranscript(text); }, () => setListening(false));
        if (rec) { recRef.current = rec; setListening(true); }
      });
    }
  }, [listening, onTranscript]);

  return (
    <button onClick={toggle}
      className="w-11 h-11 rounded-full flex items-center justify-center transition-all relative"
      style={{
        background: listening ? 'rgba(244,63,94,0.15)' : 'rgba(56,189,248,0.05)',
        border: `1px solid ${listening ? 'rgba(244,63,94,0.3)' : 'rgba(56,189,248,0.1)'}`,
        cursor: 'pointer',
      }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={listening ? '#f43f5e' : '#38bdf8'} strokeWidth="1.2" strokeLinecap="round">
        {/* Prism signal receiver — concentric arcs receiving inward */}
        <path d="M13 4 A7 7 0 0 1 13 12" opacity="0.3" />
        <path d="M11 5.5 A5 5 0 0 1 11 10.5" opacity="0.5" />
        <path d="M9 7 A3 3 0 0 1 9 9" opacity="0.7" />
        <circle cx="6" cy="8" r="2" fill={listening ? 'rgba(244,63,94,0.3)' : 'rgba(56,189,248,0.2)'} stroke={listening ? '#f43f5e' : '#38bdf8'} strokeWidth="1" />
        <circle cx="6" cy="8" r="0.8" fill={listening ? '#f43f5e' : '#38bdf8'} />
      </svg>
      {listening && (
        <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}
          className="absolute inset-0 rounded-full" style={{ border: '2px solid #f43f5e' }} />
      )}
    </button>
  );
}
