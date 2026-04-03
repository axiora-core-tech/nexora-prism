/**
 * PrismIcons — Custom SVG icons for Nexora Prism
 * 
 * Every icon uses The Prism's visual language:
 *   • Orbital rings and concentric arcs
 *   • Signal waves and wavelength forms  
 *   • Thin strokes (1–1.5px), no heavy fills
 *   • Geometric abstraction over literal representation
 * 
 * Replaces generic Lucide icons in all v3 screens.
 * Interface matches Lucide for drop-in replacement.
 */

import React from 'react';

type IconProps = { size?: number; color?: string; strokeWidth?: number; className?: string; style?: React.CSSProperties };
const b = (sz: number, sw: number, cls?: string, st?: React.CSSProperties) => ({
  width: sz, height: sz, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: sw,
  className: cls, style: st,
});

// ── SIGNAL / AI FAMILY ──────────────────────────────────────────────────────

/** PrismSpark — replaces Sparkles. Orbital burst: center dot with 4 radiating arcs */
export function PrismSpark({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.6" />
      <path d="M12 3v2" /><path d="M12 19v2" />
      <path d="M3 12h2" /><path d="M19 12h2" />
      {/* Orbital arcs — the spark radiates */}
      <path d="M7.5 7.5 A 6 6 0 0 1 12 6" /><path d="M16.5 7.5 A 6 6 0 0 0 12 6" />
      <path d="M7.5 16.5 A 6 6 0 0 0 12 18" /><path d="M16.5 16.5 A 6 6 0 0 1 12 18" />
    </svg>
  );
}

/** PrismVoice — replaces Mic. Vertical wavelength with center node */
export function PrismVoice({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
      {/* Sound wave arcs emanating upward */}
      <path d="M9 12 A 3 3 0 0 0 15 12" />
      <path d="M7 12 A 5 5 0 0 0 17 12" />
      <path d="M5 12 A 7 7 0 0 0 19 12" />
      {/* Stem */}
      <line x1="12" y1="14" x2="12" y2="20" />
      <line x1="9" y1="20" x2="15" y2="20" />
    </svg>
  );
}

/** PrismVoiceOff — replaces MicOff. Muted wavelength */
export function PrismVoiceOff({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.2" />
      <path d="M9 12 A 3 3 0 0 0 15 12" opacity="0.3" />
      <path d="M7 12 A 5 5 0 0 0 17 12" opacity="0.2" />
      <line x1="12" y1="14" x2="12" y2="20" opacity="0.3" />
      <line x1="9" y1="20" x2="15" y2="20" opacity="0.3" />
      {/* Strike-through */}
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  );
}

/** PrismAlert — replaces Bell. Concentric ripples radiating from a point */
export function PrismAlert({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="14" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
      <path d="M8.5 14 A 3.5 3.5 0 0 1 15.5 14" />
      <path d="M6 14 A 6 6 0 0 1 18 14" />
      <path d="M3.5 14 A 8.5 8.5 0 0 1 20.5 14" />
      {/* Base pulse dot */}
      <circle cx="12" cy="20" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** PrismDiscuss — replaces MessageSquare. Two overlapping signal arcs */
export function PrismDiscuss({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      {/* Left signal source */}
      <circle cx="7" cy="12" r="1" fill="currentColor" stroke="none" opacity="0.4" />
      <path d="M9 10 A 4 4 0 0 1 9 14" />
      <path d="M11 8 A 6 6 0 0 1 11 16" />
      {/* Right signal source */}
      <circle cx="17" cy="12" r="1" fill="currentColor" stroke="none" opacity="0.4" />
      <path d="M15 10 A 4 4 0 0 0 15 14" />
      <path d="M13 8 A 6 6 0 0 0 13 16" />
    </svg>
  );
}

/** PrismChat — replaces MessageCircle. Single signal source with rightward waves */
export function PrismChat({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.4" />
      <path d="M9 9 A 5 5 0 0 1 9 15" />
      <path d="M12 7 A 7 7 0 0 1 12 17" />
      <path d="M15 5 A 9 9 0 0 1 15 19" />
    </svg>
  );
}

// ── DATA / ANALYSIS FAMILY ──────────────────────────────────────────────────

/** PrismMetric — replaces BarChart3. Signal bars ascending with orbital accent */
export function PrismMetric({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="10" y1="20" x2="10" y2="10" />
      <line x1="14" y1="20" x2="14" y2="7" /><line x1="18" y1="20" x2="18" y2="4" />
      {/* Orbital dot at peak */}
      <circle cx="18" cy="4" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
      {/* Trend arc connecting peaks */}
      <path d="M6 14 Q 10 8 18 4" strokeOpacity="0.3" />
    </svg>
  );
}

/** PrismTrend — replaces TrendingDown. Wavelength with directional flow */
export function PrismTrend({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <path d="M3 8 Q 7 4 10 10 Q 13 16 17 10 L 21 14" />
      <path d="M17 14 L 21 14 L 21 10" />
      <circle cx="3" cy="8" r="1" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}

/** PrismTarget — replaces Target. Concentric rings with center — echoes ThePrism */
export function PrismTarget({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.5" />
    </svg>
  );
}

/** PrismFilter — replaces Filter. Converging lines to focal point */
export function PrismFilter({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="9" y1="18" x2="15" y2="18" />
      <circle cx="12" cy="18" r="0.8" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}

// ── STRUCTURE / ORGANIZATION FAMILY ─────────────────────────────────────────

/** PrismCompany — replaces Building2. Hexagonal structure with signal center */
export function PrismCompany({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <polygon points="12,3 20,8 20,16 12,21 4,16 4,8" />
      <line x1="12" y1="3" x2="12" y2="21" strokeOpacity="0.2" />
      <line x1="4" y1="8" x2="20" y2="16" strokeOpacity="0.2" />
      <line x1="20" y1="8" x2="4" y2="16" strokeOpacity="0.2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}

/** PrismPeople — replaces Users. Three orbital dots connected by arcs */
export function PrismPeople({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="7" r="2" /><circle cx="6" cy="17" r="2" /><circle cx="18" cy="17" r="2" />
      {/* Connecting arcs */}
      <path d="M10 8.5 Q 6 12 7 15" strokeOpacity="0.3" />
      <path d="M14 8.5 Q 18 12 17 15" strokeOpacity="0.3" />
      <path d="M8 17 L 16 17" strokeOpacity="0.3" />
      {/* Center node */}
      <circle cx="12" cy="14" r="0.8" fill="currentColor" stroke="none" opacity="0.3" />
    </svg>
  );
}

/** PrismPerson — replaces User. Single orbital dot with surrounding ring */
export function PrismPerson({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="8" r="3" /><path d="M5 20 Q 5 14 12 14 Q 19 14 19 20" />
    </svg>
  );
}

/** PrismShield — replaces Shield. Angular shield form with signal line */
export function PrismShield({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <path d="M12 3 L 20 7 L 20 13 Q 20 19 12 21 Q 4 19 4 13 L 4 7 Z" />
      {/* Signal line through center */}
      <path d="M8 12 L 11 15 L 16 9" />
    </svg>
  );
}

/** PrismCascade — replaces GitBranch. Branching signal path */
export function PrismCascade({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="6" cy="6" r="1.5" fill="currentColor" stroke="none" opacity="0.4" />
      <line x1="6" y1="7.5" x2="6" y2="18" />
      <circle cx="6" cy="18" r="1.5" fill="currentColor" stroke="none" opacity="0.4" />
      <path d="M6 12 Q 10 12 14 8" />
      <circle cx="14" cy="8" r="1.5" fill="currentColor" stroke="none" opacity="0.4" />
      <path d="M6 15 Q 10 15 18 12" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}

/** PrismKanban — replaces Columns3. Three lanes with signal dots */
export function PrismKanban({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <line x1="6" y1="4" x2="6" y2="20" strokeOpacity="0.3" />
      <line x1="12" y1="4" x2="12" y2="20" strokeOpacity="0.3" />
      <line x1="18" y1="4" x2="18" y2="20" strokeOpacity="0.3" />
      {/* Signal dots at different positions in each lane */}
      <circle cx="6" cy="8" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
      <circle cx="6" cy="13" r="1.5" fill="currentColor" stroke="none" opacity="0.3" />
      <circle cx="12" cy="10" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
      <circle cx="18" cy="7" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
      <circle cx="18" cy="15" r="1.5" fill="currentColor" stroke="none" opacity="0.3" />
    </svg>
  );
}

/** PrismMeridian — replaces Map. Horizontal wave with milestone nodes */
export function PrismMeridian({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <path d="M3 12 Q 6 6 9 12 Q 12 18 15 12 Q 18 6 21 12" />
      <circle cx="3" cy="12" r="1" fill="currentColor" stroke="none" opacity="0.3" />
      <circle cx="9" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
      <circle cx="21" cy="12" r="1" fill="currentColor" stroke="none" opacity="0.3" />
    </svg>
  );
}

/** PrismConnect — replaces Link2. Two nodes with connecting orbital arc */
export function PrismConnect({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="7" cy="12" r="3" /><circle cx="17" cy="12" r="3" />
      <path d="M10 10 Q 12 6 14 10" /><path d="M10 14 Q 12 18 14 14" />
    </svg>
  );
}

// ── DOCUMENT / CONTENT FAMILY ───────────────────────────────────────────────

/** PrismDocument — replaces FileText. Page outline with signal lines */
export function PrismDocument({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <path d="M6 3 L 14 3 L 19 8 L 19 21 L 6 21 Z" />
      <path d="M14 3 L 14 8 L 19 8" />
      <line x1="9" y1="13" x2="16" y2="13" strokeOpacity="0.4" />
      <line x1="9" y1="16" x2="14" y2="16" strokeOpacity="0.3" />
    </svg>
  );
}

/** PrismKnowledge — replaces BookOpen. Open pages with emanating signal */
export function PrismKnowledge({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <path d="M12 6 Q 8 4 3 5 L 3 19 Q 8 18 12 20" />
      <path d="M12 6 Q 16 4 21 5 L 21 19 Q 16 18 12 20" />
      <line x1="12" y1="6" x2="12" y2="20" strokeOpacity="0.2" />
      {/* Signal emanating from pages */}
      <path d="M12 3 L 12 1" strokeOpacity="0.3" />
      <path d="M9 2 L 12 1 L 15 2" strokeOpacity="0.3" />
    </svg>
  );
}

/** PrismUpload — replaces Upload. Upward arrow through orbital ring */
export function PrismUpload({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="14" r="7" strokeOpacity="0.3" />
      <line x1="12" y1="18" x2="12" y2="6" />
      <path d="M8 10 L 12 6 L 16 10" />
      <circle cx="12" cy="6" r="1" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}

/** PrismEdit — replaces Edit3. Pen nib with signal dot */
export function PrismEdit({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <path d="M16 3 L 21 8 L 8 21 L 3 21 L 3 16 Z" />
      <line x1="14" y1="5" x2="19" y2="10" strokeOpacity="0.3" />
    </svg>
  );
}

// ── TIME / STATUS FAMILY ────────────────────────────────────────────────────

/** PrismTime — replaces Clock. Orbital ring with single hand */
export function PrismTime({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="12" x2="12" y2="7" /><line x1="12" y1="12" x2="16" y2="14" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}

/** PrismCalendar — replaces CalendarDays. Grid with pulse accent */
export function PrismCalendar({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" /><line x1="16" y1="3" x2="16" y2="7" />
      {/* Pulse dot on a day */}
      <circle cx="15" cy="15" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
    </svg>
  );
}

/** PrismRisk — replaces AlertTriangle. Angular warning with signal arc */
export function PrismRisk({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <path d="M12 3 L 21 19 L 3 19 Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** PrismEmpty — replaces Circle. Thin orbital ring */
export function PrismEmpty({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="12" r="8" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" opacity="0.15" />
    </svg>
  );
}

/** PrismComplete — replaces CheckCircle. Ring with checkmark signal */
export function PrismComplete({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12 L 11 15 L 17 9" />
    </svg>
  );
}

// ── SYSTEM FAMILY ───────────────────────────────────────────────────────────

/** PrismConfig — replaces Settings. Orbital with 3 adjustment spokes */
export function PrismConfig({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
      {/* Three spokes with adjustment dots */}
      <line x1="12" y1="3" x2="12" y2="8" /><circle cx="12" cy="3" r="1" fill="currentColor" stroke="none" opacity="0.4" />
      <line x1="4.5" y1="16.5" x2="8.5" y2="14" /><circle cx="4.5" cy="16.5" r="1" fill="currentColor" stroke="none" opacity="0.4" />
      <line x1="19.5" y1="16.5" x2="15.5" y2="14" /><circle cx="19.5" cy="16.5" r="1" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}

/** PrismAvatar — replaces Bot. Concentric rings (Luminary identity) */
export function PrismAvatar({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.15" />
      <circle cx="12" cy="12" r="7" strokeOpacity="0.25" />
      <circle cx="12" cy="12" r="4" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
    </svg>
  );
}

/** PrismCapital — replaces DollarSign. Currency symbol in orbital ring */
export function PrismCapital({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
      <path d="M15 8 Q 12 6 9 8 Q 7 10 10 12 Q 14 14 14 16 Q 12 18 9 16" />
      <line x1="12" y1="5" x2="12" y2="19" strokeOpacity="0.3" />
    </svg>
  );
}

/** PrismEnergy — replaces Zap. Lightning bolt with radiating signal */
export function PrismEnergy({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <path d="M13 3 L 7 13 L 12 13 L 11 21 L 17 11 L 12 11 Z" />
    </svg>
  );
}

/** PrismLoader — replaces Loader2. Orbital ring with gap (for spinning) */
export function PrismLoader({ size=20, color='currentColor', strokeWidth=1.5, className, style }: IconProps) {
  return (
    <svg {...b(size, strokeWidth, className, { color, ...style })}>
      <path d="M12 3 A 9 9 0 1 0 21 12" />
    </svg>
  );
}
