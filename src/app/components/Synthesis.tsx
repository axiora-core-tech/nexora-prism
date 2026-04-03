/**
 * Synthesis — Report Generation
 * "Combining signals into unified output"
 *
 * Template gallery + past reports + custom reports + Execution Velocity.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { PrismDocument, PrismMetric, PrismPeople, PrismTrend, PrismMeridian, PrismCapital, PrismSpark, PrismTime, PrismVoice } from './ui/PrismIcons';
import { useNavigate, Navigate } from 'react-router';
import { generatedReports, executionVelocity } from '../mockData';
import { VoiceInput } from './ui/VoiceInput';
import { useRoleAccess } from '../auth/useRoleAccess';

const reportTemplates = [
  { id: 'board', icon: PrismMetric, title: 'Board Summary', desc: 'Signals from the quarter — distilled for your board', color: '#38bdf8' },
  { id: 'dept', icon: PrismPeople, title: 'Department Review', desc: 'How each team is carrying its weight across six dimensions', color: '#10b981' },
  { id: 'perf', icon: PrismTrend, title: 'Performance Overview', desc: 'The spectrum of your people — scored, ranked, revealed', color: '#f43f5e' },
  { id: 'revenue', icon: PrismCapital, title: 'Revenue Forecast', desc: 'Where the capital flows — projection meets reality', color: '#f59e0b' },
  { id: 'attrition', icon: PrismTrend, title: 'Attrition Risk Report', desc: 'Who is drifting toward the exit — and what it costs', color: '#fb923c' },
  { id: 'meridian', icon: PrismMeridian, title: 'Meridian Progress', desc: 'Your roadmap\'s pulse — velocity, gaps, and the path ahead', color: '#c084fc' },
];

const typeColors: Record<string, string> = {
  board_summary: '#38bdf8', department_review: '#10b981', attrition_risk: '#fb923c',
  performance_overview: '#f43f5e', revenue_forecast: '#f59e0b', meridian_progress: '#c084fc',
};

export function Synthesis() {
  const navigate = useNavigate();
  const { canAccessSynthesis } = useRoleAccess();
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleGenerate = (templateId: string) => {
    setIsGenerating(templateId);
    setTimeout(() => setIsGenerating(null), 2500);
  };

  // Role gate: CEO + Dept Head only (after all hooks)
  if (!canAccessSynthesis) {
    return <Navigate to="/app" replace />;
  }

  // Execution Velocity
  const ev = executionVelocity;
  const evColor = ev.score >= 80 ? '#10b981' : ev.score >= 60 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="page-wrap pb-32">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 border-b pb-10" style={{ borderColor: 'var(--p-border)' }}>
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm mb-4 transition-colors group" style={{ color: 'var(--p-text-dim)' }}>
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2" style={{ color: 'var(--p-text-lo)' }}>
          <PrismDocument size={14} style={{ color: '#f43f5e' }} /> Report generation
        </p>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <h1 className="hero-title font-light" style={{ color: 'var(--p-text-hi)' }}>
            Signal <span className="italic font-serif" style={{ color: 'var(--p-text-dim)' }}>Synthesis</span>
          </h1>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--p-text-lo)' }}>Reports</p>
              <p className="text-2xl font-light font-mono" style={{ color: '#f43f5e' }}>{generatedReports.length}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--p-text-lo)' }}>Last report</p>
              <p className="font-mono text-sm" style={{ color: 'var(--p-text-ghost)' }}>Mar 31</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ EXECUTION VELOCITY — semicircular gauge hero visualization ═══ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-[2rem] p-6 md:p-8 mb-10 relative overflow-hidden"
        style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none" style={{ background: `${evColor}06` }} />
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(192,132,252,0.03)' }} />

        <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold flex items-center gap-3 border-b p-border-mid pb-4 mb-8"
          style={{ color: 'var(--p-text-ghost)', borderColor: 'var(--p-border)' }}>
          <PrismSpark size={11} style={{ color: evColor }} /> Execution velocity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* LEFT: Gauge */}
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 200 130" width="200" height="130" className="overflow-visible mb-4">
              {/* Background arc */}
              <path d="M 20 120 A 80 80 0 0 1 180 120" fill="none" stroke="var(--p-border)" strokeWidth="8" strokeLinecap="round" />
              {/* Score arc — animated */}
              <motion.path
                d="M 20 120 A 80 80 0 0 1 180 120"
                fill="none" stroke={evColor} strokeWidth="8" strokeLinecap="round"
                strokeDasharray="251" // circumference of half circle at r=80
                initial={{ strokeDashoffset: 251 }}
                animate={{ strokeDashoffset: 251 - (ev.score / 100) * 251 }}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Score text */}
              <text x="100" y="105" textAnchor="middle" fill={evColor} fontSize="36" fontFamily="Space Mono, monospace" fontWeight="300">
                {ev.score}
              </text>
              <text x="100" y="122" textAnchor="middle" fill="var(--p-text-ghost)" fontSize="10" fontFamily="Space Mono, monospace">
                of 100
              </text>
              {/* Trend delta */}
              {ev.trend.length >= 2 && (() => {
                const delta = ev.score - ev.trend[ev.trend.length - 2].score;
                const deltaColor = delta >= 0 ? '#10b981' : '#f43f5e';
                return (
                  <text x="100" y="60" textAnchor="middle" fill={deltaColor} fontSize="11" fontFamily="Space Mono, monospace">
                    {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)} pts from last quarter
                  </text>
                );
              })()}
              {/* Sub-score ring markers at positions around the arc */}
              {Object.entries(ev.subScores).map(([key, val], i) => {
                const angle = Math.PI + (i / (Object.keys(ev.subScores).length - 1)) * Math.PI;
                const r = 95;
                const x = 100 + Math.cos(angle) * r;
                const y = 120 + Math.sin(angle) * r;
                const dotColor = (val as number) >= 75 ? '#10b981' : (val as number) >= 60 ? '#f59e0b' : '#f43f5e';
                return (
                  <g key={key}>
                    <circle cx={x} cy={y} r="3" fill={dotColor} opacity="0.6" />
                    <text x={x} y={y - 8} textAnchor="middle" fill="var(--p-text-ghost)" fontSize="7" fontFamily="Space Mono, monospace">
                      {(val as number)}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="text-xs text-center" style={{ color: 'var(--p-text-dim)' }}>Operational momentum against Meridian plan</p>

            {/* Trend sparkline */}
            <div className="flex items-end gap-3 mt-6 h-10">
              {ev.trend.map((t, i) => (
                <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${t.score * 0.4}px` }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-1">
                  <div className="w-5 rounded-t" style={{ height: '100%', background: evColor, opacity: 0.25 + (i / ev.trend.length) * 0.75 }} />
                  <span className="text-[10px] font-mono" style={{ color: 'var(--p-text-ghost)' }}>{t.quarter.replace('Current', 'Now')}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CENTER: Sub-scores with animated bars */}
          <div className="space-y-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--p-text-ghost)' }}>Signal breakdown</p>
            {Object.entries(ev.subScores).map(([key, val], i) => {
              const barColor = (val as number) >= 75 ? '#10b981' : (val as number) >= 60 ? '#f59e0b' : '#f43f5e';
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: 'var(--p-text-mid)' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-mono" style={{ color: barColor }}>{val as number}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--p-border)' }}>
                    <motion.div className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ background: barColor, opacity: 0.6 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Revenue + AI narrative */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--p-text-ghost)' }}>Revenue signal</p>
            <p className="font-mono text-2xl font-light mb-1" style={{ color: evColor }}>
              ${(ev.revenueEstimate / 1000000).toFixed(1)}<span className="text-sm" style={{ color: 'var(--p-text-ghost)' }}>M</span>
            </p>
            <p className="text-[10px] italic mb-4" style={{ color: 'var(--p-text-ghost)' }}>
              Estimated from operational data. Market factors may apply.
            </p>
            <div className="rounded-xl p-4" style={{ background: 'rgba(56,189,248,0.03)', border: '1px solid rgba(56,189,248,0.06)' }}>
              <p className="text-[10px] font-mono uppercase tracking-[0.1em] mb-2" style={{ color: '#38bdf8' }}>AI narrative</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--p-text-mid)' }}>{ev.narrative}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Template gallery */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2" style={{ color: 'var(--p-text-ghost)' }}>
          <PrismDocument size={11} /> Report templates
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {reportTemplates.map((t, i) => (
            <motion.button key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => handleGenerate(t.id)}
              disabled={!!isGenerating}
              className="rounded-[2rem] p-6 text-left transition-all hover:scale-[1.01] group relative overflow-hidden"
              style={{ background: 'var(--p-bg-card)', border: `1px solid ${isGenerating === t.id ? t.color + '30' : 'var(--p-border)'}`, opacity: isGenerating && isGenerating !== t.id ? 0.4 : 1 }}>
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `${t.color}08` }} />
              {isGenerating === t.id ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                  <t.icon size={20} className="mb-3" style={{ color: t.color }} />
                </motion.div>
              ) : (
                <t.icon size={20} className="mb-3" style={{ color: t.color }} />
              )}
              <p className="text-sm font-light mb-1" style={{ color: 'var(--p-text-hi)' }}>{isGenerating === t.id ? 'Synthesizing…' : t.title}</p>
              <p className="text-xs" style={{ color: 'var(--p-text-dim)' }}>{t.desc}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Custom report */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-[2rem] p-6 md:p-8 mb-10" style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
        <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] mb-4 flex items-center gap-3" style={{ color: 'var(--p-text-ghost)' }}>
          <PrismSpark size={11} style={{ color: '#c084fc' }} /> Custom report
        </h3>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)}
              placeholder="Describe the report you need… e.g., 'Compare engineering output across Q1, highlighting the top contributors and any burnout risks'"
              className="w-full bg-transparent text-sm font-light outline-none resize-none min-h-[80px] rounded-xl p-4 leading-relaxed"
              style={{ color: 'var(--p-text-body)', background: 'var(--p-bg-input)', border: '1px solid var(--p-border)' }} />
          </div>
          <VoiceInput onTranscript={text => setCustomPrompt(prev => prev + ' ' + text)} size="md" accent="#c084fc" />
        </div>
        {customPrompt.length > 10 && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => handleGenerate('custom')}
            disabled={!!isGenerating}
            className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono transition-all hover:scale-105"
            style={{ background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.2)', color: '#c084fc' }}>
            <PrismSpark size={12} /> {isGenerating === 'custom' ? 'Synthesizing…' : 'Synthesize report'}
          </motion.button>
        )}
      </motion.div>

      {/* Past reports */}
      {generatedReports.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] mb-6 flex items-center gap-2" style={{ color: 'var(--p-text-ghost)' }}>
            Generated reports
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {generatedReports.map((r, i) => {
              const color = typeColors[r.type] || '#94a3b8';
              return (
                <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl p-4 flex items-center gap-4 transition-all hover:scale-[1.005] cursor-pointer"
                  style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}>
                  <PrismDocument size={16} style={{ color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-light" style={{ color: 'var(--p-text-hi)' }}>{r.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded" style={{ background: `${color}12`, color }}>{r.type.replace('_', ' ')}</span>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--p-text-ghost)' }}>
                        <PrismTime size={8} className="inline mr-1" />
                        {new Date(r.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--p-text-ghost)' }} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
