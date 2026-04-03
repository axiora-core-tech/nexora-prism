/**
 * The Sanctum — Immersive Avatar Intelligence Experience
 *
 * Features:
 *   - Photo-based avatar with lip-sync animation, expressions, breathing
 *   - Voice + text conversation with Prism manager
 *   - HUD overlay: left = chat transcript, right = agreed tasks
 *   - Reads persona settings from Calibration (name, tone, traits)
 *   - Three ritual modes: Morning Signal, Deep Resonance, Prism Reflection
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { PrismSpark } from './ui/PrismIcons';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { useCompanyConfig } from '../stores/companyConfigStore';
import { startSpeechRecognition, isSpeechRecognitionSupported } from '../services/voiceService';

type SessionMode = 'gateway' | 'standup' | 'resonance' | 'reflection';
type Expression = 'idle' | 'thinking' | 'speaking' | 'smiling';
type Message = { role: 'prism' | 'user'; text: string };
type Task = { id: string; text: string; status: 'agreed' | 'pending' };

const RITUALS = [
  { id: 'standup' as const, label: 'Morning Signal', tagline: 'Share your pulse — what flows, what blocks', color: '#38bdf8',
    prompts: ['What did you accomplish yesterday?', 'What are you working on today?', 'Any blockers or things you need help with?'] },
  { id: 'resonance' as const, label: 'Deep Resonance', tagline: 'Open channel — speak freely', color: '#c084fc',
    prompts: ['What\'s on your mind today?'] },
  { id: 'reflection' as const, label: 'Prism Reflection', tagline: 'Performance decoded and discussed', color: '#10b981',
    prompts: ['I\'ve reviewed your recent performance signals. Sprint velocity at 112% — exceptional. Documentation at 87%, three points below target. Shall we discuss strategies?'] },
];

const RESPONSES: Record<string, string[]> = {
  standup: [
    'Noted. I\'ve logged your update against the Meridian. You\'re tracking 8% above sprint target. The API gateway task is highest priority — shall I break it into sub-tasks?',
    'Good. I\'ll flag that blocker for the next Checkpoint review. CDN configuration is unblocked if you need to context-switch.',
    'Solid standup. I\'ve synced with the Meridian. You have a 1:1 with Priya at 2pm — want me to prepare talking points?',
  ],
  resonance: [
    'That\'s thoughtful. Based on your trajectory, you\'re well-positioned for Principal Engineer. The key gap is mentorship hours — 4 of 8 per month.',
    'I understand. Your peer feedback scores are top quartile. The perception gap you feel might not be as wide as you think.',
    'Let me connect that to the bigger picture. The Meridian shows your team is 2 weeks ahead on auth. That creates space for what you\'re describing.',
  ],
  reflection: [
    'Code review turnaround at 18 hours is 25% better than target. That\'s creating a positive ripple — Priya mentioned your reviews have been particularly thorough.',
    'For the documentation gap, I\'d suggest 30 minutes at the end of each PR for inline docs. Friday afternoons have the most slack time.',
    'Overall, your six-dimension score is 87/100 — up 4 points. Biggest growth area: knowledge sharing. Everything else is green.',
  ],
};

const PHOTO_KEY = 'prism_sanctum_avatar_photo';

export function SanctumPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { config } = useCompanyConfig();
  const [mode, setMode] = useState<SessionMode>('gateway');
  const [messages, setMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [promptIdx, setPromptIdx] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [expression, setExpression] = useState<Expression>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [entered, setEntered] = useState(false);
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(() => {
    try { return localStorage.getItem(PHOTO_KEY); } catch { return null; }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingSendRef = useRef<string | null>(null);


  // Default manager photo (professional portrait) — used when no custom photo uploaded
  const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=512&auto=format&fit=crop&crop=face';
  const displayPhoto = avatarPhoto || DEFAULT_PHOTO;

  const userName = user?.name?.split(' ')[0] || 'there';
  const ritual = RITUALS.find(r => r.id === mode) || RITUALS[0];
  const personaName = config.personaName || 'Luminary';
  const personaTone = config.personaTone || 'balanced';
  const personaTraits = (config.personaTraits || ['empathetic', 'analytical']).slice(0, 3);
  const personaGreeting = config.personaGreeting || 'Welcome to The Sanctum.';
  const toneLabels: Record<string, string> = { warm: 'Warm', direct: 'Direct', coaching: 'Coaching', balanced: 'Balanced' };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { const t = setTimeout(() => setEntered(true), 300); return () => clearTimeout(t); }, []);
  // Cancel speech on unmount or mode change
  useEffect(() => {
    return () => { if (typeof window !== 'undefined') window.speechSynthesis?.cancel(); };
  }, [mode]);

  // Preload browser voices (Chrome needs voiceschanged event)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener?.('voiceschanged', () => window.speechSynthesis.getVoices());
    }
  }, []);

  // ─── SPEAK: Direct window.speechSynthesis — no import chain ───
  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setExpression('speaking'); setIsSpeaking(true);
      setTimeout(() => {
        setIsSpeaking(false); setExpression('smiling');
        setTimeout(() => { setExpression('idle'); autoListen(); }, 1200);
      }, 2000 + text.length * 18);
      return;
    }

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95; utter.pitch = 0.95; utter.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const pick = voices.find(v => /Google.*US|Samantha|Daniel|Karen|Zira|David/i.test(v.name) && v.lang.startsWith('en'))
      || voices.find(v => v.lang.startsWith('en') && !v.name.includes('espeak'))
      || voices[0];
    if (pick) utter.voice = pick;

    setExpression('speaking'); setIsSpeaking(true);
    utter.onend = () => {
      setIsSpeaking(false); setExpression('smiling');
      setTimeout(() => { setExpression('idle'); autoListen(); }, 1200);
    };
    utter.onerror = () => { setIsSpeaking(false); setExpression('idle'); };

    window.speechSynthesis.speak(utter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── LISTEN: Auto-start mic after avatar finishes speaking ───
  const recRef = useRef<{ stop: () => void } | null>(null);
  const silenceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoListenEnabled = useRef(true);

  const stopListening = useCallback(() => {
    recRef.current?.stop();
    recRef.current = null;
    if (silenceRef.current) { clearTimeout(silenceRef.current); silenceRef.current = null; }
    setIsListening(false);
  }, []);

  const autoListen = useCallback(() => {
    if (!autoListenEnabled.current) return;
    if (!isSpeechRecognitionSupported()) return;

    // Small delay so browser releases audio output before starting input
    setTimeout(() => {
      const rec = startSpeechRecognition(
        (text, isFinal) => {
          if (silenceRef.current) clearTimeout(silenceRef.current);

          if (isFinal) {
            // Got final transcript — stop listening + auto-send
            stopListening();
            if (text.trim()) {
              // Directly submit (processed in next tick to allow state updates)
              pendingSendRef.current = text.trim();
            }
          } else {
            // Interim — set a silence timer to auto-submit
            silenceRef.current = setTimeout(() => {
              stopListening();
              if (text.trim()) {
                pendingSendRef.current = text.trim();
              }
            }, 2500);
          }
        },
        () => {
          // Recognition ended (browser stopped it)
          setIsListening(false);
        }
      );
      if (rec) {
        recRef.current = rec;
        setIsListening(true);
      }
    }, 500);
  }, [stopListening]);

  // Process pending voice send (decoupled from recognition callback to avoid stale closures)
  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingSendRef.current && !isThinking && !isSpeaking) {
        const text = pendingSendRef.current;
        pendingSendRef.current = null;
        // Add user message + trigger reply
        setMessages(prev => [...prev, { role: 'user', text }]);
        setIsThinking(true);
        setExpression('thinking');

        setTimeout(() => {
          const r = RITUALS.find(ri => ri.id === mode);
          const nextIdx = promptIdx + 1;
          let reply: string;
          if (r && nextIdx < r.prompts.length) {
            setPromptIdx(nextIdx);
            reply = r.prompts[nextIdx];
          } else {
            const pool = RESPONSES[mode] || RESPONSES.standup;
            reply = pool[(messages.length + 1) % pool.length];
          }
          setMessages(prev => [...prev, { role: 'prism', text: reply }]);

          if (reply.match(/shall I|want me to|suggest|recommend|break it|prepare|flag|block/i)) {
            const taskText = reply.split('.')[0] + '.';
            setTasks(prev => [...prev, { id: `t${Date.now()}`, text: taskText.length > 80 ? taskText.slice(0, 77) + '…' : taskText, status: 'pending' }]);
          }

          setIsThinking(false);
          speakText(reply); // This will auto-listen again after speaking
        }, 800 + Math.random() * 600);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isThinking, isSpeaking, mode, promptIdx, messages.length, speakText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      autoListenEnabled.current = false;
      recRef.current?.stop();
      if (silenceRef.current) clearTimeout(silenceRef.current);
    };
  }, []);

  // Photo upload handler
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result as string;
      setAvatarPhoto(data);
      try { localStorage.setItem(PHOTO_KEY, data); } catch {}
    };
    reader.readAsDataURL(file);
  }, []);

  const startRitual = useCallback((type: SessionMode) => {
    const r = RITUALS.find(ri => ri.id === type);
    if (!r) return;
    setMode(type); setPromptIdx(0); setTasks([]);
    autoListenEnabled.current = true;
    const greeting = type === 'reflection' ? r.prompts[0] : `${personaGreeting} Let's begin the ${r.label}. ${r.prompts[0]}`;
    setMessages([{ role: 'prism', text: greeting }]);
    speakText(greeting); // After greeting → auto-listen starts
  }, [personaGreeting, speakText]);

  const endSession = useCallback(() => {
    autoListenEnabled.current = false;
    stopListening();
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    setIsSpeaking(false); setIsThinking(false); setExpression('idle');
    setMode('gateway');
  }, [stopListening]);

  const handleSend = useCallback((overrideText?: string) => {
    const text = (overrideText || input).trim();
    if (!text || isThinking || isSpeaking) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsThinking(true);
    setExpression('thinking');

    setTimeout(() => {
      const r = RITUALS.find(ri => ri.id === mode);
      const nextIdx = promptIdx + 1;
      let reply: string;
      if (r && nextIdx < r.prompts.length) {
        setPromptIdx(nextIdx);
        reply = r.prompts[nextIdx];
      } else {
        const pool = RESPONSES[mode] || RESPONSES.standup;
        reply = pool[messages.length % pool.length];
      }
      setMessages(prev => [...prev, { role: 'prism', text: reply }]);

      // Extract tasks from response
      if (reply.match(/shall I|want me to|suggest|recommend|break it|prepare|flag|block/i)) {
        const taskText = reply.split('.')[0] + '.';
        setTasks(prev => [...prev, { id: `t${Date.now()}`, text: taskText.length > 80 ? taskText.slice(0, 77) + '…' : taskText, status: 'pending' }]);
      }

      setIsThinking(false);
      speakText(reply);
    }, 800 + Math.random() * 600);
  }, [input, isThinking, isSpeaking, mode, promptIdx, messages.length, speakText]);

  const agreeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'agreed' as const } : t));
  }, []);

  // ═══════════════════════════════════════════════════════
  // GATEWAY
  // ═══════════════════════════════════════════════════════
  if (mode === 'gateway') {
    return (
      <div className="page-wrap pb-32 flex flex-col items-center">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mb-12 border-b pb-10" style={{ borderColor: 'var(--p-border)' }}>
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm mb-4 transition-colors group" style={{ color: 'var(--p-text-dim)' }}>
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2" style={{ color: 'var(--p-text-lo)' }}>
            <PrismSpark size={14} style={{ color: '#c084fc' }} /> Private intelligence channel
          </p>
          <h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>
            The <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Sanctum</span>
          </h1>
        </motion.div>

        {/* Avatar setup + display */}
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: entered ? 1 : 0, scale: entered ? 1 : 0.7 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative mb-12">
          {/* Ambient glow */}
          <div className="absolute inset-0 -m-20 rounded-full blur-[100px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.08), rgba(56,189,248,0.04), transparent)' }} />

          {/* The avatar circle */}
          <div className="w-44 h-44 rounded-full relative flex items-center justify-center overflow-hidden"
            style={{ border: '2px solid rgba(192,132,252,0.15)' }}>

            {/* Breathing rings */}
            <motion.div animate={{ scale: [1, 1.03, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -inset-3 rounded-full" style={{ border: '1px solid rgba(192,132,252,0.1)' }} />
            <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              className="absolute -inset-6 rounded-full" style={{ border: '1px solid rgba(56,189,248,0.08)' }} />
            <motion.div animate={{ scale: [1, 1.09, 1], opacity: [0.06, 0.12, 0.06] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -inset-10 rounded-full" style={{ border: '1px solid rgba(16,185,129,0.06)' }} />

            {/* Always show a face — default or custom uploaded */}
            <img src={displayPhoto} alt={personaName} className="w-full h-full object-cover rounded-full" />
          </div>

          {/* Change photo button — always visible */}
          <button onClick={() => fileRef.current?.click()}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all hover:scale-105"
            style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)', color: 'var(--p-text-ghost)', cursor: 'pointer' }}>
            {avatarPhoto ? 'Change photo' : 'Upload your photo'}
          </button>

          <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
        </motion.div>

        {/* Greeting */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center mb-12 max-w-md">
          <p className="text-lg font-light mb-2" style={{ color: 'var(--p-text-body)' }}>
            {userName}, meet <span className="italic font-serif" style={{ color: '#c084fc' }}>{personaName}</span>
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--p-text-ghost)' }}>
            Your private Prism manager. Choose a ritual to begin.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(192,132,252,0.04)', border: '1px solid rgba(192,132,252,0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c084fc' }} />
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--p-text-ghost)' }}>
              {toneLabels[personaTone]} · {personaTraits.join(' · ')}
            </span>
          </div>
        </motion.div>

        {/* Ritual cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
          {RITUALS.map((r, i) => (
            <motion.button key={r.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => startRitual(r.id)}
              className="rounded-[2rem] p-7 text-left transition-all hover:scale-[1.02] group relative overflow-hidden"
              style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)', cursor: 'pointer' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: `${r.color}08` }} />
              <div className="absolute top-0 left-8 right-8 h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${r.color}20, transparent)` }} />
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ background: `${r.color}06`, border: `1px solid ${r.color}12` }}>
                <div className="w-3 h-3 rounded-full" style={{ background: r.color, opacity: 0.5 }} />
              </div>
              <p className="text-sm font-light mb-1.5" style={{ color: 'var(--p-text-hi)' }}>{r.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--p-text-dim)' }}>{r.tagline}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // ACTIVE SESSION — Immersive with HUD
  // ═══════════════════════════════════════════════════════
  return (
    <div className="relative flex flex-col" style={{ height: 'calc(100vh - 100px)' }}>

      {/* ─── TOP BAR ─── */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 z-20">
        <button onClick={endSession} className="flex items-center gap-2 text-sm transition-colors group" style={{ color: 'var(--p-text-dim)', cursor: 'pointer' }}>
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-mono uppercase tracking-widest">End session</span>
        </button>
        <div className="flex items-center gap-3">
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full" style={{ background: ritual.color }} />
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: ritual.color }}>{personaName} · {ritual.label}</span>
        </div>
      </div>

      {/* ─── MAIN AREA: Avatar center + HUD sides ─── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* LEFT HUD: Chat transcript */}
        <div className="w-80 flex-shrink-0 overflow-y-auto px-4 py-4 z-10" style={{ scrollbarWidth: 'none' }}>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: 'var(--p-text-ghost)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: ritual.color }} /> Transcript
          </p>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i === messages.length - 1 ? 0.1 : 0 }}
              className="mb-3">
              <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: msg.role === 'prism' ? ritual.color : 'rgba(255,255,255,0.25)' }}>
                {msg.role === 'prism' ? personaName : userName}
              </p>
              <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--p-text-mid)', opacity: i === messages.length - 1 ? 1 : 0.6 }}>
                {msg.text}
              </p>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* CENTER: Avatar */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* Contextual ambient glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.04, 0.08, 0.04] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="w-[50vw] h-[50vw] rounded-full blur-[120px]" style={{ background: ritual.color }} />
          </div>

          {/* The Avatar */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10">

            <div className={`w-36 h-36 rounded-full relative overflow-hidden ${expression === 'thinking' ? '' : ''}`}
              style={{ border: `2px solid ${isSpeaking ? ritual.color + '40' : 'rgba(192,132,252,0.15)'}`, transition: 'border-color 0.3s' }}>

              {/* Breathing animation */}
              <motion.div animate={{ scale: expression === 'speaking' ? [1, 1.02, 0.99, 1.01, 1] : [1, 1.01, 1] }}
                transition={{ duration: expression === 'speaking' ? 0.4 : 3, repeat: Infinity }}
                className="w-full h-full">
                {/* Always show face */}
                <img src={displayPhoto} alt={personaName} className="w-full h-full object-cover rounded-full" />
              </motion.div>

              {/* Lip sync overlay — semi-transparent bar at bottom of avatar that pulses when speaking */}
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)', borderRadius: '0 0 100px 100px' }}>
                    {/* Animated "mouth" bars */}
                    <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex items-end gap-[2px]">
                      {[0, 1, 2, 3, 4, 3, 2, 1, 0].map((base, i) => (
                        <motion.div key={i}
                          animate={{ height: [2 + base, 6 + base * 2 + Math.random() * 4, 2 + base] }}
                          transition={{ duration: 0.15 + Math.random() * 0.1, repeat: Infinity, delay: i * 0.02 }}
                          style={{ width: 2, borderRadius: 1, background: ritual.color, opacity: 0.7 }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expression overlay — subtle color tints */}
              {expression === 'thinking' && (
                <div className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ background: 'rgba(56,189,248,0.05)' }} />
              )}
              {expression === 'smiling' && (
                <div className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ background: 'rgba(16,185,129,0.05)' }} />
              )}
            </div>

            {/* Pulsing rings around avatar */}
            <motion.div animate={{ scale: [1, 1.08, 1], opacity: isSpeaking ? [0.2, 0.4, 0.2] : [0.1, 0.15, 0.1] }}
              transition={{ duration: isSpeaking ? 0.5 : 3, repeat: Infinity }}
              className="absolute -inset-3 rounded-full" style={{ border: `1px solid ${ritual.color}20` }} />
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              className="absolute -inset-7 rounded-full" style={{ border: `1px solid ${ritual.color}10` }} />

            {/* Thinking particles */}
            <AnimatePresence>
              {expression === 'thinking' && [0, 1, 2, 3].map(i => (
                <motion.div key={`tp-${i}`}
                  initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.6, 0], y: [-10, -40], scale: [0, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
                  className="absolute rounded-full"
                  style={{ width: 3, height: 3, background: ['#38bdf8', '#c084fc', '#10b981', '#f59e0b'][i], top: '15%', left: `${30 + i * 12}%` }} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Expression label */}
          <motion.p animate={{ opacity: expression !== 'idle' ? 1 : 0 }}
            className="mt-4 text-[10px] font-mono uppercase tracking-widest z-10"
            style={{ color: expression === 'speaking' ? ritual.color : expression === 'thinking' ? '#38bdf8' : '#10b981' }}>
            {expression === 'speaking' ? 'speaking' : expression === 'thinking' ? 'processing' : expression === 'smiling' ? '' : ''}
          </motion.p>

          {/* Persona name */}
          <p className="mt-2 text-sm font-light z-10" style={{ color: 'var(--p-text-mid)' }}>
            <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>{personaName}</span>
          </p>
        </div>

        {/* RIGHT HUD: Agreed tasks */}
        <div className="w-72 flex-shrink-0 overflow-y-auto px-4 py-4 z-10" style={{ scrollbarWidth: 'none' }}>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-4 flex items-center gap-2" style={{ color: 'var(--p-text-ghost)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} /> Action items
          </p>
          {tasks.length === 0 ? (
            <p className="text-xs font-light" style={{ color: 'var(--p-text-ghost)' }}>
              Tasks will appear here as {personaName} suggests actions during your conversation.
            </p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <motion.div key={task.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl p-3" style={{ background: task.status === 'agreed' ? 'rgba(16,185,129,0.04)' : 'var(--p-bg-card)',
                    border: `1px solid ${task.status === 'agreed' ? 'rgba(16,185,129,0.15)' : 'var(--p-border)'}` }}>
                  <p className="text-xs font-light leading-relaxed mb-2" style={{ color: 'var(--p-text-mid)' }}>{task.text}</p>
                  {task.status === 'pending' ? (
                    <button onClick={() => agreeTask(task.id)}
                      className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-lg transition-all hover:scale-105"
                      style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', cursor: 'pointer' }}>
                      Agree
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#10b981' }}>✓ Agreed</span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── INPUT BAR — shows conversation state, text fallback ─── */}
      <div className="flex-shrink-0 px-6 py-3 mb-4 z-20">
        <div className="max-w-xl mx-auto">
          {/* Conversation state indicator */}
          <div className="flex items-center justify-center gap-3 mb-3">
            {isListening && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <div className="flex items-center gap-[2px]">
                  {[0, 1, 2, 3, 4].map(i => (
                    <motion.div key={i}
                      animate={{ height: [3, 10 + Math.random() * 6, 3] }}
                      transition={{ duration: 0.4 + Math.random() * 0.2, repeat: Infinity, delay: i * 0.08 }}
                      style={{ width: 2, borderRadius: 1, background: ritual.color, opacity: 0.7 }} />
                  ))}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: ritual.color }}>Listening…</span>
              </motion.div>
            )}
            {isThinking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-3 h-3 rounded-full" style={{ border: `1.5px solid ${ritual.color}`, borderTopColor: 'transparent' }} />
                <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: ritual.color }}>Processing…</span>
              </motion.div>
            )}
            {isSpeaking && (
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: ritual.color }}>{personaName} is speaking…</span>
            )}
            {!isListening && !isThinking && !isSpeaking && expression === 'idle' && messages.length > 0 && (
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--p-text-ghost)' }}>
                {isSpeechRecognitionSupported() ? 'Mic will auto-start after response' : 'Type your message below'}
              </span>
            )}
          </div>

          {/* Text input fallback + manual mic toggle + send */}
          <div className="flex items-center gap-3">
            {/* Manual mic toggle */}
            <button onClick={() => { if (isListening) stopListening(); else autoListen(); }}
              disabled={isThinking || isSpeaking}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
              style={{
                background: isListening ? `${ritual.color}15` : 'var(--p-bg-card)',
                border: `1px solid ${isListening ? ritual.color + '40' : 'var(--p-border)'}`,
                color: isListening ? ritual.color : 'var(--p-text-ghost)',
                cursor: 'pointer', opacity: (isThinking || isSpeaking) ? 0.3 : 1,
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
                <path d="M9 12 A 3 3 0 0 0 15 12" /><path d="M7 12 A 5 5 0 0 0 17 12" />
                <line x1="12" y1="15" x2="12" y2="20" /><line x1="9" y1="20" x2="15" y2="20" />
              </svg>
            </button>

            <div className="flex-1 rounded-xl px-4 py-3" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                placeholder={isListening ? 'Listening — speak now…' : `Or type to ${personaName}…`}
                className="w-full bg-transparent text-sm font-light outline-none"
                style={{ color: 'var(--p-text-body)' }} />
            </div>

            <button onClick={() => handleSend()} disabled={!input.trim() || isThinking || isSpeaking}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
              style={{ background: input.trim() ? `${ritual.color}15` : 'transparent',
                border: `1px solid ${input.trim() ? ritual.color + '30' : 'var(--p-border)'}`,
                color: input.trim() ? ritual.color : 'var(--p-text-ghost)', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
