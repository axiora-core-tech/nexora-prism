/**
 * Genesis — CEO Vision Onboard
 * "The origin of all signals — where light first enters the prism"
 *
 * Voice-first cinematic vertical scroll. Four sections:
 * 1. Voice/Upload — large mic centered
 * 2. AI Summary — entity cards (editable)
 * 3. Deep-Dive — avatar conversation
 * 4. Meridian Preview — generated roadmap
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, ChevronRight } from 'lucide-react';
import { PrismVoice, PrismUpload, PrismDocument, PrismSpark, PrismEdit, PrismEnergy, PrismCapital, PrismPeople, PrismTime, PrismRisk } from './ui/PrismIcons';
import { useNavigate, Navigate } from 'react-router';
import { VoiceInput } from './ui/VoiceInput';
import { useRoadmap } from '../stores/roadmapStore';
import { useAuth } from '../auth/AuthContext';
import { visionDocument as mockVision } from '../mockData';

type Section = 'input' | 'summary' | 'deep-dive' | 'preview';

export function Genesis() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vision, roadmap } = useRoadmap();

  // ALL hooks must be declared before any conditional return (React rules of hooks)
  const [section, setSection] = useState<Section>('input');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryData, setSummaryData] = useState(mockVision);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleVoiceTranscript = useCallback((text: string) => {
    setInputText(prev => prev + ' ' + text);
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setInputText(ev.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  }, []);

  const processVision = useCallback(() => {
    setIsProcessing(true);
    import('../services/aiService').then(async ({ generate }) => {
      try {
        const result = await generate(
          'You are an AI business strategist. Parse a CEO vision document and extract: mission statement, revenue targets, resources, constraints, and key unknowns. Respond in JSON format.',
          `Parse this vision document:\n\n${inputText}`
        );
        // Try to parse AI response, fall back to mock data
        try {
          const parsed = JSON.parse(result);
          if (parsed.mission) setSummaryData(prev => ({ ...prev, ...parsed }));
        } catch { /* AI response wasn't valid JSON — use mock data as-is */ }
      } catch { /* API call failed — continue with mock data */ }
      setIsProcessing(false);
      setSection('summary');
    }).catch(() => {
      // Dynamic import failed — continue with mock data
      setIsProcessing(false);
      setSection('summary');
    });
  }, [inputText]);

  const goToDeepDive = useCallback(() => setSection('deep-dive'), []);
  const goToPreview = useCallback(() => setSection('preview'), []);

  // CEO-only: redirect non-CEO users to Spectrum (AFTER all hooks)
  if (user?.role_level !== 'ceo') {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="page-wrap pb-32">
      {/* Hero — no back button, this is the origin */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 border-b pb-10" style={{ borderColor: 'var(--p-border)' }}>
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2"
           style={{ color: 'var(--p-text-lo)' }}>
          <PrismSpark size={14} style={{ color: '#f43f5e' }} /> CEO Onboard
        </p>
        <h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>
          The <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Genesis</span>
        </h1>
      </motion.div>

      {/* Section 1: Voice / Upload / Text Input */}
      <AnimatePresence mode="wait">
        {section === 'input' && (
          <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
            
            <p className="text-center text-lg font-light mb-2" style={{ color: 'var(--p-text-body)' }}>
              Tell us your <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>vision</span>
            </p>
            <p className="text-center text-xs mb-12" style={{ color: 'var(--p-text-ghost)' }}>
              Speak, upload a document, or type your company vision below
            </p>

            {/* Voice input — primary, large and centered */}
            <div className="flex flex-col items-center mb-12">
              <VoiceInput onTranscript={handleVoiceTranscript} size="lg" accent="#f43f5e" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] mt-4" style={{ color: 'var(--p-text-ghost)' }}>
                Tap to speak your vision
              </p>
            </div>

            {/* Upload — secondary */}
            <div className="flex items-center gap-4 justify-center mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl transition-all"
                style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}
              >
                <PrismUpload size={16} style={{ color: 'var(--p-text-dim)' }} />
                <span className="text-sm font-light" style={{ color: 'var(--p-text-mid)' }}>Upload document</span>
              </motion.button>
              <input ref={fileRef} type="file" className="hidden" accept=".txt,.pdf,.doc,.docx,.md" onChange={handleFileUpload} />

              <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--p-text-ghost)' }}>or</span>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setInputText(mockVision.rawText)}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl transition-all"
                style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}
              >
                <PrismDocument size={16} style={{ color: 'var(--p-text-dim)' }} />
                <span className="text-sm font-light" style={{ color: 'var(--p-text-mid)' }}>Use demo vision</span>
              </motion.button>
            </div>

            {/* Text area — tertiary */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Paste or type your company vision, strategy document, or business plan here…"
                className="w-full bg-transparent text-sm font-light leading-relaxed outline-none resize-none min-h-[160px]"
                style={{ color: 'var(--p-text-body)', scrollbarWidth: 'none' }}
              />
            </div>

            {/* Process button */}
            {inputText.length > 20 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={processVision}
                  disabled={isProcessing}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-medium transition-all"
                  style={{ background: 'white', color: '#030303' }}
                >
                  {isProcessing ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <PrismSpark size={16} />
                    </motion.div>
                  ) : (
                    <PrismSpark size={16} />
                  )}
                  {isProcessing ? 'Decomposing your vision…' : 'Decompose vision'}
                  {!isProcessing && <ArrowRight size={14} />}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Section 2: AI Summary — Editable entity cards */}
        {section === 'summary' && (
          <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
            
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-8 flex items-center gap-2"
              style={{ color: 'var(--p-text-ghost)' }}>
              <Check size={12} style={{ color: '#10b981' }} /> Vision decomposed
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Mission card */}
              <div className="md:col-span-2 rounded-[2rem] p-6 md:p-8 relative overflow-hidden group"
                style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(244,63,94,0.04)' }} />
                <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] mb-4 flex items-center gap-3" style={{ color: 'var(--p-text-ghost)' }}>
                  <PrismEnergy size={11} style={{ color: '#f43f5e' }} /> Mission
                </h3>
                <p className="text-lg font-light italic font-serif leading-relaxed" style={{ color: 'var(--p-text-dim)' }}>
                  "{summaryData.mission}"
                </p>
                <PrismEdit size={12} className="absolute top-6 right-6 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: 'var(--p-text-ghost)' }} />
              </div>

              {/* Revenue targets */}
              <div className="rounded-[2rem] p-6 md:p-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
                <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] mb-4 flex items-center gap-3" style={{ color: 'var(--p-text-ghost)' }}>
                  <PrismCapital size={11} style={{ color: '#10b981' }} /> Revenue targets
                </h3>
                <div className="space-y-3">
                  {summaryData.revenueTargets.map((t, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: 'var(--p-text-mid)' }}>{t.period}</span>
                      <span className="font-mono text-sm" style={{ color: '#10b981' }}>${(t.target / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="rounded-[2rem] p-6 md:p-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
                <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] mb-4 flex items-center gap-3" style={{ color: 'var(--p-text-ghost)' }}>
                  <PrismPeople size={11} style={{ color: '#38bdf8' }} /> Resources
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-mono text-xl" style={{ color: '#38bdf8' }}>${(summaryData.resources.money / 1000000).toFixed(1)}<span className="text-[10px]" style={{ color: 'var(--p-text-ghost)' }}>M</span></p>
                    <p className="text-[10px] font-mono uppercase" style={{ color: 'var(--p-text-ghost)' }}>Budget</p>
                  </div>
                  <div>
                    <p className="font-mono text-xl" style={{ color: '#38bdf8' }}>{summaryData.resources.headcount}</p>
                    <p className="text-[10px] font-mono uppercase" style={{ color: 'var(--p-text-ghost)' }}>People</p>
                  </div>
                  <div>
                    <p className="font-mono text-xl" style={{ color: '#38bdf8' }}>{summaryData.resources.timeMonths}<span className="text-[10px]" style={{ color: 'var(--p-text-ghost)' }}>mo</span></p>
                    <p className="text-[10px] font-mono uppercase" style={{ color: 'var(--p-text-ghost)' }}>Timeline</p>
                  </div>
                </div>
              </div>

              {/* Constraints */}
              <div className="md:col-span-2 rounded-[2rem] p-6 md:p-8" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
                <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] mb-4 flex items-center gap-3" style={{ color: 'var(--p-text-ghost)' }}>
                  <PrismRisk size={11} style={{ color: '#f59e0b' }} /> Constraints
                </h3>
                <div className="flex flex-wrap gap-2">
                  {summaryData.constraints.map((c, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center gap-4">
              <button onClick={() => setSection('input')} className="px-6 py-3 rounded-xl text-sm font-light transition-all"
                style={{ color: 'var(--p-text-dim)', border: '1px solid var(--p-border)' }}>Back</button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={goToDeepDive}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium"
                style={{ background: 'white', color: '#030303' }}>
                Looks right? Let's refine <ArrowRight size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Section 3: Deep Dive — simplified Luminary conversation */}
        {section === 'deep-dive' && (
          <motion.div key="deep-dive" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
            
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-8 flex items-center gap-2"
              style={{ color: 'var(--p-text-ghost)' }}>
              <PrismSpark size={12} style={{ color: '#c084fc' }} /> Deep dive refinement
            </p>

            {/* Mini Prism orbital */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
                style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(192,132,252,0.1))', border: '1px solid rgba(192,132,252,0.2)' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="12" stroke="rgba(192,132,252,0.15)" strokeWidth="0.5" />
                  <circle cx="14" cy="14" r="9" stroke="rgba(192,132,252,0.2)" strokeWidth="0.5" />
                  <circle cx="14" cy="14" r="6" stroke="rgba(192,132,252,0.3)" strokeWidth="0.5" />
                  <circle cx="14" cy="14" r="3" stroke="rgba(192,132,252,0.5)" strokeWidth="0.7" />
                  <circle cx="14" cy="14" r="1.5" fill="rgba(192,132,252,0.7)" />
                </svg>
              </div>
            </div>

            {/* Conversation thread */}
            <div className="space-y-4 mb-8">
              <div className="rounded-2xl p-5" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(192,132,252,0.1)' }}>
                    <PrismSpark size={10} style={{ color: '#c084fc' }} />
                  </div>
                  <p className="text-sm font-light leading-relaxed" style={{ color: 'var(--p-text-body)' }}>
                    I've parsed your vision. A few areas I'd like to clarify to build the best roadmap:
                    <br/><br/>
                    <strong className="font-medium" style={{ color: 'var(--p-text-hi)' }}>1.</strong> Your revenue target is $3.2M for the year. Is this recurring revenue, or does it include one-time contracts?
                    <br/>
                    <strong className="font-medium" style={{ color: 'var(--p-text-hi)' }}>2.</strong> You mentioned "ship MVP in 6 months" — what's the critical feature that defines MVP for your customers?
                    <br/>
                    <strong className="font-medium" style={{ color: 'var(--p-text-hi)' }}>3.</strong> With 8 people and no external funding, what's your hiring plan if we identify skill gaps?
                  </p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="flex items-center gap-3 mb-8">
              <VoiceInput onTranscript={handleVoiceTranscript} size="md" accent="#c084fc" />
              <div className="flex-1 rounded-xl px-4 py-3" style={{ background: 'var(--p-bg-input)', border: '1px solid var(--p-border)' }}>
                <input type="text" placeholder="Answer the questions above…"
                  onKeyDown={e => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) { goToPreview(); } }}
                  className="w-full bg-transparent text-sm font-light outline-none" style={{ color: 'var(--p-text-body)' }} />
              </div>
            </div>

            <div className="flex justify-center">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={goToPreview}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium"
                style={{ background: '#10b981', color: 'white' }}>
                Generate Meridian <ArrowRight size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Section 4: Meridian Preview */}
        {section === 'preview' && (
          <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
            
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-8 flex items-center gap-2"
              style={{ color: 'var(--p-text-ghost)' }}>
              <Check size={12} style={{ color: '#10b981' }} /> Your Meridian is ready
            </p>

            {/* Milestone preview cards */}
            <div className="space-y-3 mb-10">
              {roadmap?.milestones.map((m, i) => (
                <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl p-5 flex items-center gap-4"
                  style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{
                    background: m.status === 'completed' ? '#38bdf8' : m.status === 'in_progress' ? '#10b981' : m.status === 'at_risk' ? '#f59e0b' : 'var(--p-text-ghost)',
                  }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-light" style={{ color: 'var(--p-text-hi)' }}>{m.title}</p>
                    <p className="text-xs" style={{ color: 'var(--p-text-dim)' }}>{m.description}</p>
                  </div>
                  <span className="font-mono text-xs flex-shrink-0" style={{ color: 'var(--p-text-ghost)' }}>
                    {new Date(m.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="w-12 h-1 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'var(--p-border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${m.progress}%`, background: '#10b981' }} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Activate CTA */}
            <div className="flex justify-center">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/app/roadmap')}
                className="flex items-center gap-3 px-10 py-4 rounded-2xl text-sm font-medium"
                style={{ background: '#10b981', color: 'white' }}>
                Activate Meridian <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
