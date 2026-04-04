/**
 * The Sanctum — Jarvis-class Immersive Intelligence HUD
 *
 * Iron Man inspired:
 *   - HUD corner brackets, scanline overlays, holographic panels
 *   - Live Claude AI streaming conversation
 *   - Real-time metric gauges + sparklines that pulse with data
 *   - Auto-listen conversation loop
 *   - Context-aware data panels appear as topics are discussed
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { PrismSpark } from './ui/PrismIcons';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { useCompanyConfig } from '../stores/companyConfigStore';
import { useSanctumTasks } from '../stores/taskStore';
import { startSpeechRecognition, isSpeechRecognitionSupported } from '../services/voiceService';

type SessionMode = 'gateway' | 'standup' | 'resonance' | 'reflection';
type Expression = 'idle' | 'thinking' | 'speaking' | 'smiling';
type Msg = { role: 'prism' | 'user'; text: string };
type Task = { id: string; text: string; status: 'agreed' | 'pending' };

// ─── HUD Corner Bracket component ───
function HudBracket({ position, color = 'rgba(56,189,248,0.3)' }: { position: 'tl' | 'tr' | 'bl' | 'br'; color?: string }) {
  const s = 14;
  const paths: Record<string, string> = {
    tl: `M0 ${s} L0 0 L${s} 0`, tr: `M${s} 0 L${2*s} 0 L${2*s} ${s}`,
    bl: `M0 0 L0 ${s} L${s} ${s}`, br: `M${s} ${s} L${2*s} ${s} L${2*s} 0`,
  };
  const pos: Record<string, string> = { tl: 'top-0 left-0', tr: 'top-0 right-0', bl: 'bottom-0 left-0', br: 'bottom-0 right-0' };
  return (
    <svg className={`absolute ${pos[position]} pointer-events-none`} width={2*s} height={s} viewBox={`0 0 ${2*s} ${s}`}>
      <path d={paths[position]} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// ─── Mini Sparkline SVG ───
function Sparkline({ data, color = '#38bdf8', w = 80, h = 24 }: { data: number[]; color?: string; w?: number; h?: number }) {
  if (!data.length) return null;
  const max = Math.max(...data); const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length-1] - min) / range) * (h - 4) - 2}
        r="2.5" fill={color} opacity="0.9" />
    </svg>
  );
}

// ─── Arc Gauge ───
function ArcGauge({ value, max = 100, color = '#38bdf8', size = 60 }: { value: number; max?: number; color?: string; size?: number }) {
  const r = size / 2 - 6; const circ = Math.PI * r; const pct = Math.min(value / max, 1);
  return (
    <svg width={size} height={size / 2 + 8} viewBox={`0 0 ${size} ${size / 2 + 8}`}>
      <path d={`M 6 ${size/2+2} A ${r} ${r} 0 0 1 ${size-6} ${size/2+2}`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" strokeLinecap="round" />
      <motion.path d={`M 6 ${size/2+2} A ${r} ${r} 0 0 1 ${size-6} ${size/2+2}`} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - pct * circ }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
      <text x={size/2} y={size/2} textAnchor="middle" fill={color} fontSize="14" fontFamily="Space Mono, monospace" fontWeight="300">{value}</text>
    </svg>
  );
}

const RITUALS = [
  { id: 'standup' as const, label: 'Morning Signal', tagline: 'Share your pulse — what flows, what blocks', color: '#38bdf8',
    prompts: ['What did you accomplish yesterday?', 'What are you working on today?', 'Any blockers or things you need help with?'] },
  { id: 'resonance' as const, label: 'Deep Resonance', tagline: 'Open channel — speak freely', color: '#c084fc',
    prompts: ["What's on your mind today?"] },
  { id: 'reflection' as const, label: 'Prism Reflection', tagline: 'Performance decoded and discussed', color: '#10b981',
    prompts: ["I've reviewed your recent performance signals. Sprint velocity at 112% — exceptional. Documentation at 87%, three points below target. Shall we discuss strategies?"] },
];

// ─── Smart mock conversation engine (used when no Claude API key) ───
function generateSmartReply(userText: string, mode: string, msgCount: number): string {
  const u = userText.toLowerCase();

  // Keyword-matched contextual responses
  if (u.match(/block|stuck|issue|problem|bug|broken/)) {
    return `I see — that sounds like a blocker. I'll flag it for the next Checkpoint review and notify your manager. In the meantime, the CDN configuration task is unblocked if you need to context-switch. Shall I reassign the blocked work?`;
  }
  if (u.match(/done|finished|completed|shipped|deployed|merged/)) {
    return `Excellent work. I've logged that completion against the Meridian. Your sprint velocity is now at 112% — well above target. That puts you ${msgCount > 3 ? '2 days' : '3 days'} ahead of schedule. Want me to pull the next priority from the backlog?`;
  }
  if (u.match(/help|support|struggle|difficult|hard|overwhelm/)) {
    return `I hear you. Let me look at your workload — you're at 78% capacity with 3 active tasks. I can redistribute the documentation task to Ravi, who's at 52% capacity. Shall I draft that reassignment?`;
  }
  if (u.match(/meeting|1:1|standup|sync|call|calendar/)) {
    return `You have 2 meetings today: a standup at 10am and a 1:1 with Priya at 2pm. Based on this week's signals, I'd suggest discussing the auth proxy completion and the load testing timeline. Want me to prepare talking points?`;
  }
  if (u.match(/performance|review|score|feedback|rating/)) {
    return `Your six-dimension score is 87/100, up 4 points from last quarter. Strongest: velocity at 92 and welfare at 91. Growth area: knowledge sharing at 72 — specifically documentation coverage. Shall I set a weekly 30-minute docs session?`;
  }
  if (u.match(/team|priya|arjun|ravi|neha|colleague|member/)) {
    return `Quick team pulse: Arjun is at 92 (leading velocity), Priya at 85 (strong on collaboration), Neha at 78 (design system on track). Ravi is flagged at 68 — welfare score dropped 12 points. I'd recommend a check-in this week. Want me to schedule it?`;
  }
  if (u.match(/roadmap|milestone|meridian|timeline|deadline|sprint/)) {
    return `Meridian status: 4 of 7 milestones on track. API Gateway at 85% — 2 weeks ahead. Auth System at 60% — on schedule. User Research at 40% — slight risk due to scheduling conflicts. Shall I flag the research delay to the Checkpoint?`;
  }
  if (u.match(/revenue|money|budget|cost|salary|raise|promotion/)) {
    return `Revenue signal shows \$2.3M projected at current velocity. Engineering cost is on track at \$1.2M. The Q2 pipeline gap is the largest risk — about \$180K exposure. This connects to the Growth team's content roadmap being 40% behind plan.`;
  }
  if (u.match(/yes|sure|go ahead|do it|please|approve|agree|okay|ok/)) {
    return `Done. I've created that as an action item and assigned it to your queue. You'll see it in your Tasks section. Is there anything else you'd like to discuss in this session?`;
  }
  if (u.match(/no|not now|later|skip|next|move on/)) {
    return `Understood. Let's move on. Based on your current context, I'd suggest we look at your sprint progress — you're at 14 of 18 tasks with 4 days left. That's strong velocity. Anything specific you want to focus on?`;
  }
  if (u.match(/thank|thanks|appreciate|great|good|awesome|nice/)) {
    return `You're welcome. Your consistent execution is really showing in the data — the Prism sees a clear upward trajectory. Keep that momentum going. Anything else before we close this session?`;
  }

  // Mode-specific fallbacks for unmatched input
  const fallbacks: Record<string, string[]> = {
    standup: [
      `Noted. I've logged your update against the Meridian. You're tracking 8% above sprint target with 14 of 18 tasks complete. The API gateway cache layer is highest priority — shall I break it into sub-tasks?`,
      `Good update. Your execution velocity is 73/100, up 8 from last quarter. I see the auth proxy is complete — want me to mark that milestone and notify the team?`,
      `Solid standup. I've synced with the Meridian. Your 1:1 with Priya is at 2pm — want me to prepare talking points from this week's signals?`,
    ],
    resonance: [
      `That's a thoughtful perspective. Based on your trajectory — 87 performance score, top-quartile peer feedback — you're well-positioned for growth. The key gap I see is mentorship hours at 4 of 8 per month. Want me to help close that?`,
      `I can see how that connects to the bigger picture. The Meridian shows your team is 2 weeks ahead on the auth milestone. That creates space for exactly this kind of initiative.`,
    ],
    reflection: [
      `Your code review turnaround at 18 hours is 25% better than target. Quality dimension: 88/100. The ripple effect is real — Priya mentioned your reviews have been particularly thorough this sprint.`,
      `Overall, your six-dimension score is 87/100, up 4 points. Velocity and welfare are your strongest at 92 and 91. Knowledge sharing at 72 is the growth edge. Shall I suggest a plan to push that above 80?`,
    ],
  };
  const pool = fallbacks[mode] || fallbacks.standup;
  return pool[msgCount % pool.length];
}

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=512&auto=format&fit=crop&crop=face';

// ─── Mock metrics for HUD ───
const METRICS = {
  ev: { value: 73, trend: [58, 65, 71, 73] },
  sprint: { value: 112, label: 'Sprint %' },
  milestones: { done: 4, total: 7 },
  tasks: { active: 3, completed: 12 },
  health: { perf: 92, welfare: 88, engagement: 85, learning: 78 },
  team: [
    { name: 'Arjun', score: 92 }, { name: 'Priya', score: 88 },
    { name: 'Ravi', score: 76 }, { name: 'Neha', score: 81 },
  ],
};

export function SanctumPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { config } = useCompanyConfig();
  const { addTask: addSanctumTask } = useSanctumTasks();
  const [mode, setMode] = useState<SessionMode>('gateway');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [promptIdx, setPromptIdx] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [expression, setExpression] = useState<Expression>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [entered, setEntered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const msgCountRef = useRef(0);

  const displayPhoto = config.personaPhoto || DEFAULT_PHOTO;
  const userName = user?.name?.split(' ')[0] || 'there';
  const ritual = RITUALS.find(r => r.id === mode) || RITUALS[0];
  const personaName = config.personaName || 'Luminary';
  const personaTone = config.personaTone || 'balanced';
  const personaTraits = (config.personaTraits || ['empathetic', 'analytical']).slice(0, 3);
  const personaGreeting = config.personaGreeting || 'Welcome to The Sanctum.';
  const voiceRate = config.personaVoiceRate || 0.95;
  const voicePitch = config.personaVoicePitch || 0.95;
  const toneDesc: Record<string, string> = { warm: 'warm, empathetic, nurturing', direct: 'direct, concise, data-focused', coaching: 'challenging, Socratic', balanced: 'adaptively warm and direct' };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { const t = setTimeout(() => setEntered(true), 300); return () => clearTimeout(t); }, []);
  useEffect(() => { return () => { if (typeof window !== 'undefined') window.speechSynthesis?.cancel(); }; }, [mode]);
  useEffect(() => { msgCountRef.current = messages.length; }, [messages]);

  // Preload voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener?.('voiceschanged', () => window.speechSynthesis.getVoices());
    }
  }, []);

  // ─── SIMPLE SPEECH SYSTEM ───
  const userActivated = useRef(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Speak text aloud. After speech ends, auto-start mic if user has activated it.
  const speakText = useCallback((text: string) => {
    setIsListening(false);

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setExpression('speaking'); setIsSpeaking(true);
      setTimeout(() => {
        setIsSpeaking(false); setExpression('smiling');
        setTimeout(() => { setExpression('idle'); if (userActivated.current) startListening(); }, 1000);
      }, 2000 + text.length * 18);
      return;
    }

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = voiceRate; u.pitch = voicePitch; u.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const pick = voices.find(v => /Google.*US|Samantha|Daniel|Karen|Zira|David/i.test(v.name) && v.lang.startsWith('en'))
      || voices.find(v => v.lang.startsWith('en') && !v.name.includes('espeak')) || voices[0];
    if (pick) u.voice = pick;

    setExpression('speaking'); setIsSpeaking(true);
    u.onend = () => {
      setIsSpeaking(false); setExpression('smiling');
      setTimeout(() => {
        setExpression('idle');
        if (userActivated.current) startListening();
      }, 800);
    };
    u.onerror = () => { setIsSpeaking(false); setExpression('idle'); };
    window.speechSynthesis.speak(u);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceRate, voicePitch]);

  // Start listening — uses the SAME startSpeechRecognition that works in VoiceInput
  const startListening = useCallback(() => {
    // Stop any existing
    recRef.current?.stop();
    recRef.current = null;
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }

    const rec = startSpeechRecognition(
      (text, isFinal) => {
        // Reset silence timer on every speech event
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        if (isFinal) {
          // Got final transcript — stop and process
          recRef.current?.stop();
          recRef.current = null;
          setIsListening(false);
          if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
          if (text.trim()) processVoiceInput(text.trim());
        } else {
          // Interim — auto-stop after 2.5s silence
          silenceTimerRef.current = setTimeout(() => {
            recRef.current?.stop();
            recRef.current = null;
            setIsListening(false);
            if (text.trim()) processVoiceInput(text.trim());
          }, 2500);
        }
      },
      () => {
        // Recognition ended
        setIsListening(false);
        recRef.current = null;
      }
    );

    if (rec) {
      recRef.current = rec;
      setIsListening(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Claude AI conversation ───
  const generateReply = useCallback(async (userText: string): Promise<string> => {
    try {
      const { streamChat } = await import('../services/aiService');
      const traits = personaTraits.join(', ');
      const tone = toneDesc[personaTone] || 'balanced';
      const systemPrompt = `You are ${personaName}, an AI manager in Nexora Prism (an AI COO platform). Your communication style is ${tone}. Your personality traits: ${traits}. You are conducting a session with ${userName}.

Context: The employee has performance score 92/100, sprint velocity 112%, 3 active tasks, 4 of 7 milestones on track. Execution velocity is 73/100. The team has 8 members across 4 departments.

Rules:
- Keep responses under 100 words, conversational
- Reference specific metrics when relevant
- If you suggest an action, phrase it as "shall I..." or "want me to..." so it can be extracted as a task
- Be ${tone} in your responses
- Don't use markdown formatting`;

      const chatMessages = messages.concat({ role: 'user', text: userText }).map(m => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.text,
      }));

      let fullText = '';
      await streamChat(systemPrompt, chatMessages, (streamed) => { fullText = streamed; });
      if (!fullText || fullText.includes('demo mode') || fullText.includes('API key')) {
        return generateSmartReply(userText, mode, msgCountRef.current);
      }
      return fullText;
    } catch {
      return generateSmartReply(userText, mode, msgCountRef.current);
    }
  }, [messages, personaName, personaTone, personaTraits, userName, mode]);

  // Process voice → generate reply → speak it
  const processVoiceInput = useCallback((text: string) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsThinking(true); setExpression('thinking');

    generateReply(text).then(reply => {
      setMessages(prev => [...prev, { role: 'prism', text: reply }]);
      if (reply.match(/shall I|want me to|suggest|recommend|break it|prepare|flag|block|schedule/i)) {
        const t = reply.split('.')[0] + '.';
        setTasks(prev => [...prev, { id: `t${Date.now()}`, text: t.length > 80 ? t.slice(0, 77) + '...' : t, status: 'pending' }]);
      }
      setIsThinking(false);
      speakText(reply);
    });
  }, [generateReply, speakText]);

  // Mic button click
  const handleMicClick = useCallback(() => {
    if (isListening) {
      recRef.current?.stop();
      recRef.current = null;
      setIsListening(false);
      if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    } else {
      userActivated.current = true;
      startListening();
    }
  }, [isListening, startListening]);

  // Cleanup
  useEffect(() => () => { recRef.current?.stop(); if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current); if (typeof window !== 'undefined') window.speechSynthesis?.cancel(); }, []);

  const startSession = useCallback(() => {
    setMode('resonance'); setPromptIdx(0); setTasks([]);
    userActivated.current = false;
    const hour = new Date().getHours();
    const timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const greeting = `${timeGreet}, ${userName}. ${personaGreeting} What would you like to discuss?`;
    setMessages([{ role: 'prism', text: greeting }]);
    speakText(greeting);
  }, [personaGreeting, userName, speakText]);

  const endSession = useCallback(() => {
    userActivated.current = false;
    recRef.current?.stop(); recRef.current = null;
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    setIsSpeaking(false); setIsThinking(false); setIsListening(false); setExpression('idle'); setMode('gateway');
  }, []);

  const handleSend = useCallback(() => {
    const text = input.trim(); if (!text || isThinking || isSpeaking) return;
    recRef.current?.stop(); setIsListening(false);
    setInput('');
    userActivated.current = true; // Typing also activates the auto-listen loop
    processVoiceInput(text);
  }, [input, isThinking, isSpeaking, processVoiceInput]);

  const agreeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      // Create real task in shared store for Tasks page
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      addSanctumTask({
        id: `sanctum-${id}`,
        title: t.text.replace(/\.$/, ''),
        desc: `Agreed during session in The Sanctum`,
        status: 'active',
        priority: 'medium',
        owner: userName,
        ownerId: user?.email || 'e1',
        due: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tags: ['Sanctum'],
        storyPoints: 3,
        estimatedHours: 4,
        loggedHours: 0,
        parentId: null,
        source: 'sanctum',
        comments: [],
        attachments: [],
      });
      return { ...t, status: 'agreed' as const };
    }));
  }, [addSanctumTask, userName, user?.email, ritual.label]);

  // ═══════════════════════════════════════════════════════
  // GATEWAY — clean entry, no rituals
  // ═══════════════════════════════════════════════════════
  if (mode === 'gateway') {
    return (
      <div className="page-wrap pb-32 flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mb-16 border-b pb-10" style={{ borderColor: 'var(--p-border)' }}>
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

        {/* Avatar — reads photo from settings, no upload here */}
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: entered ? 1 : 0, scale: entered ? 1 : 0.7 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="relative mb-12">
          <div className="absolute inset-0 -m-20 rounded-full blur-[100px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.08), rgba(56,189,248,0.04), transparent)' }} />
          <div className="w-44 h-44 rounded-full relative flex items-center justify-center overflow-hidden" style={{ border: '2px solid rgba(192,132,252,0.15)' }}>
            {[3,6,10].map((inset, i) => (
              <motion.div key={i} animate={{ scale: [1, 1+0.03*(i+1), 1], opacity: [0.15-i*0.04, 0.3-i*0.06, 0.15-i*0.04] }}
                transition={{ duration: 4, repeat: Infinity, delay: i*0.5 }}
                className="absolute rounded-full" style={{ inset: `-${inset*4}px`, border: `1px solid rgba(${i===0?'192,132,252':i===1?'56,189,248':'16,185,129'},${0.12-i*0.03})` }} />
            ))}
            <img src={displayPhoto} alt={personaName} className="w-full h-full object-cover rounded-full" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center mb-12 max-w-md">
          <p className="text-lg font-light mb-2" style={{ color: 'var(--p-text-body)' }}>
            {userName}, meet <span className="italic font-serif" style={{ color: '#c084fc' }}>{personaName}</span>
          </p>
          <p className="text-xs" style={{ color: 'var(--p-text-ghost)' }}>Your private Prism intelligence. Ready when you are.</p>
        </motion.div>

        {/* Single Enter button */}
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => startSession()}
          className="rounded-full px-10 py-4 text-sm font-light transition-all hover:scale-[1.03] group relative overflow-hidden"
          style={{ background: 'rgba(192,132,252,0.06)', border: '1px solid rgba(192,132,252,0.2)', color: 'var(--p-text-hi)', cursor: 'pointer' }}>
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.08), transparent)' }} />
          <span className="relative z-10">Enter The Sanctum</span>
        </motion.button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // ACTIVE SESSION — JARVIS HUD
  // ═══════════════════════════════════════════════════════
  const hudColor = ritual.color;
  return (
    <div className="relative flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 100px)' }}>

      {/* ─── Scanline overlay ─── */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.015]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)', backgroundSize: '100% 4px' }} />

      {/* ─── Grid dots background ─── */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* ─── TOP BAR ─── */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 z-20">
        <button onClick={endSession} className="flex items-center gap-2 text-sm transition-colors group" style={{ color: 'var(--p-text-dim)', cursor: 'pointer' }}>
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-mono uppercase tracking-widest">End session</span>
        </button>
        <div className="flex items-center gap-3">
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full" style={{ background: hudColor }} />
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: hudColor }}>{personaName} · Session</span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--p-text-ghost)' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* ─── MAIN HUD AREA ─── */}
      <div className="flex-1 flex overflow-hidden relative z-10">

        {/* ═══ LEFT HUD: Transcript ═══ */}
        <div className="w-80 flex-shrink-0 overflow-y-auto px-4 py-4 relative" style={{ scrollbarWidth: 'none' }}>
          <div className="relative rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${hudColor}12` }}>
            <HudBracket position="tl" color={`${hudColor}40`} /><HudBracket position="tr" color={`${hudColor}40`} />
            <HudBracket position="bl" color={`${hudColor}20`} /><HudBracket position="br" color={`${hudColor}20`} />
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3 flex items-center gap-2" style={{ color: hudColor }}>
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full" style={{ background: hudColor }} />
              Transcript
            </p>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i === messages.length - 1 ? 0.1 : 0 }} className="mb-3">
                <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: msg.role === 'prism' ? hudColor : 'rgba(255,255,255,0.3)' }}>
                  {msg.role === 'prism' ? personaName : userName}
                </p>
                <p className="text-xs font-light leading-relaxed" style={{ color: 'var(--p-text-mid)', opacity: i === messages.length - 1 ? 1 : 0.5 }}>
                  {msg.text}
                </p>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ═══ CENTER: Avatar ═══ */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.03, 0.07, 0.03] }} transition={{ duration: 5, repeat: Infinity }}
              className="w-[50vw] h-[50vw] rounded-full blur-[120px]" style={{ background: hudColor }} />
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="relative z-10">

            <div className="w-36 h-36 rounded-full relative overflow-hidden"
              style={{ border: `2px solid ${isSpeaking ? hudColor + '50' : 'rgba(192,132,252,0.15)'}`, transition: 'border-color 0.3s' }}>
              <motion.div animate={{ scale: expression === 'speaking' ? [1, 1.02, 0.99, 1.01, 1] : [1, 1.005, 1] }}
                transition={{ duration: expression === 'speaking' ? 0.35 : 4, repeat: Infinity }}
                className="w-full h-full">
                <img src={displayPhoto} alt={personaName} className="w-full h-full object-cover rounded-full" />
              </motion.div>

              {/* Lip sync */}
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute bottom-0 left-0 right-0 h-[28%] pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)', borderRadius: '0 0 100px 100px' }}>
                    <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 flex items-end gap-[2px]">
                      {[0,1,2,3,4,3,2,1,0].map((b, i) => (
                        <motion.div key={i} animate={{ height: [2+b, 6+b*2+Math.random()*4, 2+b] }}
                          transition={{ duration: 0.12+Math.random()*0.08, repeat: Infinity, delay: i*0.015 }}
                          style={{ width: 2, borderRadius: 1, background: hudColor, opacity: 0.8 }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {expression === 'thinking' && <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'rgba(56,189,248,0.06)' }} />}
              {expression === 'smiling' && <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'rgba(16,185,129,0.06)' }} />}
            </div>

            {/* Rings */}
            <motion.div animate={{ scale: [1, 1.08, 1], opacity: isSpeaking ? [0.2, 0.4, 0.2] : [0.08, 0.12, 0.08] }}
              transition={{ duration: isSpeaking ? 0.4 : 3, repeat: Infinity }}
              className="absolute -inset-3 rounded-full" style={{ border: `1px solid ${hudColor}20` }} />
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              className="absolute -inset-7 rounded-full" style={{ border: `1px solid ${hudColor}10` }} />

            {/* Thinking particles */}
            <AnimatePresence>
              {expression === 'thinking' && [0,1,2,3].map(i => (
                <motion.div key={`tp${i}`} initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.7, 0], y: [-8, -35], scale: [0, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i*0.2 }}
                  className="absolute rounded-full" style={{ width: 3, height: 3, background: ['#38bdf8','#c084fc','#10b981','#f59e0b'][i], top: '15%', left: `${30+i*12}%` }} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Status */}
          <motion.p animate={{ opacity: expression !== 'idle' ? 1 : 0 }} className="mt-4 text-[10px] font-mono uppercase tracking-widest z-10"
            style={{ color: expression === 'speaking' ? hudColor : expression === 'thinking' ? '#38bdf8' : '#10b981' }}>
            {expression === 'speaking' ? 'speaking' : expression === 'thinking' ? 'processing' : ''}
          </motion.p>
          <p className="mt-1 text-sm font-light z-10"><span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>{personaName}</span></p>
        </div>

        {/* ═══ RIGHT HUD: Metrics + Tasks ═══ */}
        <div className="w-72 flex-shrink-0 overflow-y-auto px-3 py-4 z-10 space-y-4" style={{ scrollbarWidth: 'none' }}>

          {/* Metric panel: EV Gauge */}
          <div className="relative rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${hudColor}12` }}>
            <HudBracket position="tl" color={`${hudColor}30`} /><HudBracket position="tr" color={`${hudColor}30`} />
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] mb-2" style={{ color: hudColor }}>Execution Velocity</p>
            <div className="flex items-center gap-3">
              <ArcGauge value={METRICS.ev.value} color={hudColor} size={56} />
              <div>
                <Sparkline data={METRICS.ev.trend} color={hudColor} w={70} h={20} />
                <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--p-text-ghost)' }}>
                  <span style={{ color: '#10b981' }}>↑ 8</span> from Q4
                </p>
              </div>
            </div>
          </div>

          {/* Sprint + Milestones */}
          <div className="relative rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${hudColor}12` }}>
            <HudBracket position="tl" color={`${hudColor}25`} /><HudBracket position="br" color={`${hudColor}25`} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-mono uppercase mb-1" style={{ color: 'var(--p-text-ghost)' }}>Sprint</p>
                <p className="text-lg font-mono" style={{ color: '#10b981' }}>{METRICS.sprint.value}<span className="text-[10px]">%</span></p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase mb-1" style={{ color: 'var(--p-text-ghost)' }}>Milestones</p>
                <p className="text-lg font-mono" style={{ color: hudColor }}>{METRICS.milestones.done}<span className="text-[10px]" style={{ color: 'var(--p-text-ghost)' }}>/{METRICS.milestones.total}</span></p>
              </div>
            </div>
          </div>

          {/* Team health bars */}
          <div className="relative rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${hudColor}12` }}>
            <HudBracket position="tl" color="rgba(16,185,129,0.3)" /><HudBracket position="tr" color="rgba(16,185,129,0.3)" />
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] mb-2" style={{ color: '#10b981' }}>Health Signals</p>
            {Object.entries(METRICS.health).map(([key, val]) => (
              <div key={key} className="mb-1.5 last:mb-0">
                <div className="flex justify-between text-[10px] font-mono mb-0.5">
                  <span style={{ color: 'var(--p-text-ghost)' }}>{key}</span>
                  <span style={{ color: (val as number) >= 85 ? '#10b981' : '#f59e0b' }}>{val as number}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${val}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    style={{ background: (val as number) >= 85 ? '#10b981' : '#f59e0b', opacity: 0.6 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Team quick view */}
          <div className="relative rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${hudColor}12` }}>
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] mb-2" style={{ color: '#c084fc' }}>Team</p>
            <div className="space-y-1.5">
              {METRICS.team.map(m => (
                <div key={m.name} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full" style={{ background: m.score >= 85 ? '#10b981' : '#f59e0b' }} />
                  <span className="text-[10px] font-mono flex-1" style={{ color: 'var(--p-text-ghost)' }}>{m.name}</span>
                  <span className="text-[10px] font-mono" style={{ color: m.score >= 85 ? '#10b981' : '#f59e0b' }}>{m.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action items */}
          <div className="relative rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(16,185,129,0.12)' }}>
            <HudBracket position="tl" color="rgba(16,185,129,0.3)" /><HudBracket position="br" color="rgba(16,185,129,0.3)" />
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] mb-2" style={{ color: '#10b981' }}>Action Items</p>
            {tasks.length === 0 ? (
              <p className="text-[10px] font-light" style={{ color: 'var(--p-text-ghost)' }}>Tasks appear as {personaName} suggests actions.</p>
            ) : tasks.map(task => (
              <motion.div key={task.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="mb-2 last:mb-0">
                <p className="text-[10px] font-light leading-relaxed mb-1" style={{ color: 'var(--p-text-mid)' }}>{task.text}</p>
                {task.status === 'pending' ? (
                  <button onClick={() => agreeTask(task.id)} className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded transition-all hover:scale-105"
                    style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', cursor: 'pointer' }}>Agree</button>
                ) : <span className="text-[9px] font-mono uppercase" style={{ color: '#10b981' }}>✓ Agreed</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── INPUT BAR ─── */}
      <div className="flex-shrink-0 px-6 py-3 mb-4 z-20">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-2 h-5">
            {isListening && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <div className="flex items-center gap-[2px]">
                {[0,1,2,3,4].map(i => <motion.div key={i} animate={{ height: [3, 10+Math.random()*6, 3] }}
                  transition={{ duration: 0.4+Math.random()*0.2, repeat: Infinity, delay: i*0.08 }}
                  style={{ width: 2, borderRadius: 1, background: hudColor, opacity: 0.7 }} />)}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: hudColor }}>Listening...</span>
            </motion.div>}
            {isThinking && <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: hudColor }}>Processing...</span>}
            {isSpeaking && <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: hudColor }}>{personaName} is speaking...</span>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleMicClick} disabled={isThinking || isSpeaking}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
              style={{ background: isListening ? `${hudColor}15` : 'var(--p-bg-card)', border: `1px solid ${isListening ? hudColor+'40' : 'var(--p-border)'}`,
                color: isListening ? hudColor : 'var(--p-text-ghost)', cursor: 'pointer', opacity: (isThinking||isSpeaking) ? 0.3 : 1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
                <path d="M9 12 A 3 3 0 0 0 15 12" /><path d="M7 12 A 5 5 0 0 0 17 12" />
                <line x1="12" y1="15" x2="12" y2="20" /><line x1="9" y1="20" x2="15" y2="20" />
              </svg>
            </button>
            <div className="flex-1 rounded-xl px-4 py-3" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${hudColor}15` }}>
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                placeholder={isListening ? 'Listening — speak now...' : `Type to ${personaName}...`}
                className="w-full bg-transparent text-sm font-light outline-none" style={{ color: 'var(--p-text-body)' }} />
            </div>
            <button onClick={handleSend} disabled={!input.trim() || isThinking || isSpeaking}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
              style={{ background: input.trim() ? `${hudColor}15` : 'transparent', border: `1px solid ${input.trim() ? hudColor+'30' : 'var(--p-border)'}`,
                color: input.trim() ? hudColor : 'var(--p-text-ghost)', cursor: 'pointer' }}>
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
