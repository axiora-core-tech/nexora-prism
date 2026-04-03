/**
 * Branded empty states — on-voice, with small geometric SVG marks.
 * Each variant speaks in Prism's voice and tells the user what to do next.
 */
import React from 'react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  variant: 'tasks' | 'reviews' | 'no-results' | 'no-data' | 'kpis' | 'attendance' | 'leaderboard'
    | 'genesis' | 'meridian' | 'checkpoint' | 'synthesis' | 'calibration';
  action?: { label: string; onClick: () => void };
  className?: string;
}

const CONFIG = {
  tasks: {
    mark: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Three kanban columns, all empty */}
        <rect x="2"  y="8" width="12" height="32" rx="2" opacity="0.3" />
        <rect x="18" y="8" width="12" height="32" rx="2" opacity="0.3" />
        <rect x="34" y="8" width="12" height="32" rx="2" opacity="0.3" />
        {/* Dotted card placeholder in middle column */}
        <rect x="20" y="12" width="8" height="6" rx="1" strokeDasharray="1.5 1.5" opacity="0.5" />
        {/* Arrow pointing into first column */}
        <line x1="24" y1="2" x2="24" y2="6" opacity="0.4" />
        <path d="M22 5 L24 7 L26 5" opacity="0.4" />
      </svg>
    ),
    headline: 'No vectors in flight.',
    body: 'Your operational matrix is clear. Create a task to begin tracking progress.',
    cta: 'Create first task',
  },
  reviews: {
    mark: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Central node with no connections */}
        <circle cx="24" cy="24" r="5" opacity="0.6" />
        {/* Six empty satellite positions */}
        {[0,60,120,180,240,300].map((deg, i) => {
          const a = (deg * Math.PI) / 180;
          const x = 24 + 14 * Math.cos(a), y = 24 + 14 * Math.sin(a);
          return <circle key={i} cx={x} cy={y} r="2.5" strokeDasharray="1.5 1.5" opacity="0.3" />;
        })}
        {/* Dashed connection lines */}
        {[0,120,240].map((deg, i) => {
          const a = (deg * Math.PI) / 180;
          return <line key={i} x1={24+6*Math.cos(a)} y1={24+6*Math.sin(a)} x2={24+11*Math.cos(a)} y2={24+11*Math.sin(a)} strokeDasharray="1.5 1.5" opacity="0.25" />;
        })}
      </svg>
    ),
    headline: 'No resonance nodes yet.',
    body: 'Write the first review for this person. Multi-source feedback takes one review to begin.',
    cta: 'Write a review',
  },
  'no-results': {
    mark: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Search circle */}
        <circle cx="20" cy="20" r="11" opacity="0.4" />
        <line x1="28" y1="28" x2="44" y2="44" opacity="0.4" />
        {/* X inside the circle */}
        <line x1="16" y1="16" x2="24" y2="24" opacity="0.6" />
        <line x1="24" y1="16" x2="16" y2="24" opacity="0.6" />
      </svg>
    ),
    headline: 'No signals match.',
    body: 'Your filters returned nothing. Try broadening the search or clearing one condition.',
    cta: 'Clear filters',
  },
  'no-data': {
    mark: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Flat line chart */}
        <line x1="4" y1="36" x2="44" y2="36" opacity="0.3" />
        <line x1="4" y1="36" x2="4" y2="8" opacity="0.3" />
        {/* Dotted flat signal */}
        <line x1="8" y1="28" x2="40" y2="28" strokeDasharray="2 2" opacity="0.4" />
        {/* Small dots awaiting data */}
        {[12,20,28,36].map(x => (
          <circle key={x} cx={x} cy="28" r="1.5" fill="currentColor" stroke="none" opacity="0.3" />
        ))}
      </svg>
    ),
    headline: 'Awaiting signal.',
    body: 'Data will appear here once activity is recorded. Check back after the next cycle.',
    cta: undefined,
  },
  kpis: {
    mark: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Target with no trajectory */}
        <circle cx="30" cy="18" r="12" opacity="0.2" />
        <circle cx="30" cy="18" r="8" opacity="0.35" />
        <circle cx="30" cy="18" r="3" opacity="0.5" />
        {/* Dotted arc approaching target */}
        <path d="M4 40 Q10 28 18 22" strokeDasharray="2 2" opacity="0.4" />
        <path d="M16 20 L18 22 L20 20" opacity="0.4" />
      </svg>
    ),
    headline: 'No KPIs defined.',
    body: 'Define the first objective to start tracking what matters for this team.',
    cta: 'Add first KPI',
  },
  attendance: {
    mark: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Calendar */}
        <rect x="6" y="10" width="36" height="30" rx="3" opacity="0.4" />
        <line x1="6" y1="18" x2="42" y2="18" opacity="0.3" />
        <line x1="16" y1="6" x2="16" y2="14" opacity="0.5" />
        <line x1="32" y1="6" x2="32" y2="14" opacity="0.5" />
        {/* Empty day cells */}
        {[[12,22],[20,22],[28,22],[36,22],[12,30],[20,30],[28,30]].map(([x,y],i) => (
          <rect key={i} x={x-3} y={y-3} width="6" height="6" rx="1" strokeDasharray="1 1" opacity="0.25" />
        ))}
      </svg>
    ),
    headline: 'No attendance data.',
    body: 'Attendance will populate as team members log time through the month.',
    cta: undefined,
  },
  leaderboard: {
    mark: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Three empty podium blocks */}
        <rect x="2"  y="26" width="10" height="16" rx="1" opacity="0.3" />
        <rect x="19" y="18" width="10" height="24" rx="1" opacity="0.4" />
        <rect x="36" y="30" width="10" height="12" rx="1" opacity="0.3" />
        {/* Crown outline */}
        <path d="M20 15 L24 10 L28 15" opacity="0.3" strokeDasharray="1.5 1.5" />
        <line x1="20" y1="16" x2="28" y2="16" opacity="0.3" strokeDasharray="1.5 1.5" />
      </svg>
    ),
    headline: 'Rankings not yet calculated.',
    body: 'Signal hierarchy forms once performance data is recorded for at least two team members.',
    cta: undefined,
  },
  genesis: {
    mark: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Light beam entering prism */}
        <line x1="24" y1="2" x2="24" y2="14" opacity="0.5" />
        {/* Prism */}
        <polygon points="24,14 36,38 12,38" opacity="0.4" />
        {/* Spectrum rays */}
        <line x1="16" y1="38" x2="8" y2="46" opacity="0.3" stroke="#f43f5e" />
        <line x1="20" y1="38" x2="16" y2="46" opacity="0.3" stroke="#10b981" />
        <line x1="24" y1="38" x2="24" y2="46" opacity="0.3" stroke="#f59e0b" />
        <line x1="28" y1="38" x2="32" y2="46" opacity="0.3" stroke="#38bdf8" />
        <line x1="32" y1="38" x2="40" y2="46" opacity="0.3" stroke="#c084fc" />
      </svg>
    ),
    headline: 'Your Genesis awaits.',
    body: 'Upload your vision document or speak it aloud. Prism will decompose it into an actionable roadmap.',
    cta: 'Begin your Genesis',
  },
  meridian: {
    mark: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Vertical meridian line */}
        <line x1="24" y1="4" x2="24" y2="44" strokeDasharray="2 2" opacity="0.3" />
        {/* Empty milestone nodes */}
        <circle cx="24" cy="12" r="4" strokeDasharray="1.5 1.5" opacity="0.3" />
        <circle cx="24" cy="24" r="4" strokeDasharray="1.5 1.5" opacity="0.3" />
        <circle cx="24" cy="36" r="4" strokeDasharray="1.5 1.5" opacity="0.3" />
      </svg>
    ),
    headline: 'No roadmap active.',
    body: 'Complete Genesis to generate your Meridian — the guiding reference line for your company.',
    cta: 'Start Genesis',
  },
  checkpoint: {
    mark: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Shield */}
        <path d="M24 4 L40 12 L40 24 Q40 36 24 44 Q8 36 8 24 L8 12 Z" opacity="0.3" />
        {/* Empty check */}
        <circle cx="24" cy="22" r="6" strokeDasharray="1.5 1.5" opacity="0.4" />
      </svg>
    ),
    headline: 'All signals clear.',
    body: 'No approvals pending. When tasks need sign-off, they will appear here for review.',
    cta: undefined,
  },
  synthesis: {
    mark: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Converging lines */}
        <line x1="4" y1="10" x2="20" y2="24" opacity="0.3" />
        <line x1="4" y1="24" x2="20" y2="24" opacity="0.3" />
        <line x1="4" y1="38" x2="20" y2="24" opacity="0.3" />
        {/* Output document */}
        <rect x="26" y="14" width="16" height="20" rx="2" opacity="0.4" />
        <line x1="30" y1="20" x2="38" y2="20" opacity="0.25" />
        <line x1="30" y1="24" x2="38" y2="24" opacity="0.25" />
        <line x1="30" y1="28" x2="36" y2="28" opacity="0.25" />
      </svg>
    ),
    headline: 'No reports generated yet.',
    body: 'Choose a template or describe what you need. Prism will synthesize your data into a report.',
    cta: 'Create first report',
  },
  calibration: {
    mark: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {/* Dial */}
        <circle cx="24" cy="24" r="16" opacity="0.3" />
        <circle cx="24" cy="24" r="4" opacity="0.5" />
        <line x1="24" y1="24" x2="24" y2="10" opacity="0.6" />
        {/* Tick marks */}
        {[0,60,120,180,240,300].map((d,i) => {
          const a = (d * Math.PI) / 180;
          return <line key={i} x1={24+14*Math.cos(a)} y1={24+14*Math.sin(a)} x2={24+16*Math.cos(a)} y2={24+16*Math.sin(a)} opacity="0.3" />;
        })}
      </svg>
    ),
    headline: 'System awaiting calibration.',
    body: 'Configure your company settings, avatar preferences, and privacy model to tune the Prism instrument.',
    cta: 'Begin calibration',
  },
};

export function EmptyState({ variant, action, className = '' }: EmptyStateProps) {
  const cfg = CONFIG[variant];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col items-center justify-center text-center py-16 px-8 ${className}`}
    >
      <div className="p-text-ghost mb-5 opacity-50">
        {cfg.mark}
      </div>
      <p className="text-sm font-light text-white/70 mb-2 tracking-wide">{cfg.headline}</p>
      <p className="text-xs p-text-ghost font-light leading-relaxed max-w-[220px] mb-5">{cfg.body}</p>
      {(action || cfg.cta) && (
        <button
          onClick={action?.onClick}
          className="text-xs font-mono uppercase tracking-widest p-text-dim hover:p-text-hi border p-border hover:p-border-mid rounded-full px-4 py-2 transition-all hover:bg-white/5"
        >
          {action?.label ?? cfg.cta}
        </button>
      )}
    </motion.div>
  );
}
