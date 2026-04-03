/**
 * Custom SVG dock icons — conceptual metaphors, 8–12 paths each.
 * Each icon visually encodes the feature it represents.
 * All accept size + color props to match Lucide's interface.
 */

import React from 'react';

type IconProps = { size?: number; color?: string; strokeWidth?: number; className?: string };
const base = (size: number) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

// ── Overview / Dashboard — grid of live signal dots with a pulse ring ────────
export function IconOverview({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Outer ring — pulse metaphor */}
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <circle cx="12" cy="12" r="7" strokeOpacity="0.45" />
      {/* Four signal nodes at cardinal points */}
      <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      {/* Centre dot */}
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      {/* Connector lines */}
      <line x1="12" y1="7" x2="12" y2="10" strokeOpacity="0.5" />
      <line x1="17" y1="12" x2="14" y2="12" strokeOpacity="0.5" />
      <line x1="12" y1="17" x2="12" y2="14" strokeOpacity="0.5" />
      <line x1="7" y1="12" x2="10" y2="12" strokeOpacity="0.5" />
    </svg>
  );
}

// ── Team — three people with a connecting arc above ──────────────────────────
export function IconTeam({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Centre person */}
      <circle cx="12" cy="8" r="2.5" />
      <path d="M7 19c0-2.76 2.24-5 5-5s5 2.24 5 5" strokeOpacity="0.9" />
      {/* Left person — smaller */}
      <circle cx="5.5" cy="9.5" r="1.8" strokeOpacity="0.6" />
      <path d="M2 19c0-2 1.57-3.5 3.5-3.5" strokeOpacity="0.5" />
      {/* Right person — smaller */}
      <circle cx="18.5" cy="9.5" r="1.8" strokeOpacity="0.6" />
      <path d="M22 19c0-2-1.57-3.5-3.5-3.5" strokeOpacity="0.5" />
      {/* Connecting arc above — the team bond */}
      <path d="M5.5 7.5 Q12 3 18.5 7.5" strokeOpacity="0.35" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

// ── Analytics — upward trajectory + scatter cloud ────────────────────────────
export function IconAnalytics({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Axis */}
      <line x1="3" y1="20" x2="3" y2="4" strokeOpacity="0.4" />
      <line x1="3" y1="20" x2="21" y2="20" strokeOpacity="0.4" />
      {/* Rising trend line */}
      <polyline points="4,17 8,13 12,10 17,6" strokeOpacity="0.9" />
      {/* Arrow head */}
      <path d="M15 5.5 L17 6 L16.5 8" strokeOpacity="0.9" />
      {/* Scatter dots */}
      <circle cx="4" cy="16" r="1.2" fill="currentColor" stroke="none" strokeOpacity="0.7" />
      <circle cx="8" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="11" cy="11" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="8" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="6" r="1.2" fill="currentColor" stroke="none" />
      {/* Subtle forecast zone */}
      <path d="M17 6 Q19.5 4 21 5" strokeOpacity="0.3" strokeDasharray="1.5 1" />
    </svg>
  );
}

// ── Tasks — kanban columns with cards in motion ──────────────────────────────
export function IconTasks({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Three columns */}
      <rect x="2" y="3" width="5.5" height="18" rx="1.5" strokeOpacity="0.35" />
      <rect x="9.25" y="3" width="5.5" height="18" rx="1.5" strokeOpacity="0.35" />
      <rect x="16.5" y="3" width="5.5" height="18" rx="1.5" strokeOpacity="0.35" />
      {/* Cards in col 1 */}
      <rect x="3" y="5" width="3.5" height="2.5" rx="0.8" fill="currentColor" stroke="none" strokeOpacity="0.8" />
      <rect x="3" y="9" width="3.5" height="2.5" rx="0.8" fill="currentColor" stroke="none" strokeOpacity="0.5" />
      {/* Cards in col 2 */}
      <rect x="10.25" y="5" width="3.5" height="2.5" rx="0.8" fill="currentColor" stroke="none" />
      {/* Card in col 3 — completing */}
      <rect x="17.5" y="5" width="3.5" height="2.5" rx="0.8" fill="currentColor" stroke="none" strokeOpacity="0.6" />
      {/* Motion arrow between col 1 → 2 */}
      <path d="M6.5 10.25 L9.25 10.25" strokeOpacity="0.5" />
      <path d="M8.25 9.5 L9.25 10.25 L8.25 11" strokeOpacity="0.5" />
    </svg>
  );
}

// ── KPI Goals — target with rising arc trajectory ────────────────────────────
export function IconKPI({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Target rings */}
      <circle cx="14" cy="10" r="7.5" strokeOpacity="0.25" />
      <circle cx="14" cy="10" r="5" strokeOpacity="0.5" />
      <circle cx="14" cy="10" r="2.5" strokeOpacity="0.8" />
      {/* Bull's-eye */}
      <circle cx="14" cy="10" r="0.8" fill="currentColor" stroke="none" />
      {/* Trajectory arc from bottom-left hitting the target */}
      <path d="M2 20 Q4 14 8 12 Q10.5 11 11.5 10.5" strokeOpacity="0.7" />
      {/* Arrow head on trajectory */}
      <path d="M10.2 9.2 L11.5 10.5 L10 11.2" strokeOpacity="0.7" />
    </svg>
  );
}

// ── 360° Reviews — hexagonal network with bidirectional arrows ───────────────
export function IconReviews({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Central person */}
      <circle cx="12" cy="12" r="2.2" />
      {/* Six satellite nodes */}
      {[0,60,120,180,240,300].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const x = 12 + 7.5 * Math.cos(a);
        const y = 12 + 7.5 * Math.sin(a);
        const ix = 12 + 3.8 * Math.cos(a);
        const iy = 12 + 3.8 * Math.sin(a);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="1.4" fill="currentColor" stroke="none" strokeOpacity={i % 2 === 0 ? 1 : 0.5} />
            {/* Bidirectional line — shorter segment */}
            <line x1={ix} y1={iy} x2={x - 1.8 * Math.cos(a)} y2={y - 1.8 * Math.sin(a)} strokeOpacity="0.4" />
          </g>
        );
      })}
    </svg>
  );
}

// ── Attendance — calendar with a presence heat-ring ──────────────────────────
export function IconAttendance({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Calendar body */}
      <rect x="2" y="4" width="20" height="17" rx="2.5" strokeOpacity="0.9" />
      {/* Header bar */}
      <line x1="2" y1="9" x2="22" y2="9" strokeOpacity="0.5" />
      {/* Date pins */}
      <line x1="7" y1="2.5" x2="7" y2="6" />
      <line x1="17" y1="2.5" x2="17" y2="6" />
      {/* Day cells — filled = present */}
      <rect x="5" y="11.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="9" y="11.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" stroke="none" strokeOpacity="0.6" />
      <rect x="13" y="11.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="5" y="15.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" stroke="none" strokeOpacity="0.6" />
      <rect x="9" y="15.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" stroke="none" />
      {/* Absent cell — hollow */}
      <rect x="13" y="15.5" width="2.5" height="2.5" rx="0.5" strokeOpacity="0.3" />
      {/* Presence ring in corner */}
      <path d="M18 14 a3 3 0 1 1 0 0.01" strokeOpacity="0.3" />
      <path d="M18 14 a3 3 0 0 1 2.1 -2.1" strokeOpacity="0.9" />
    </svg>
  );
}

// ── ROI — capital coin with surplus arrow ────────────────────────────────────
export function IconROI({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Coin face */}
      <circle cx="10" cy="12" r="8" strokeOpacity="0.9" />
      <circle cx="10" cy="12" r="5.5" strokeOpacity="0.35" />
      {/* Currency symbol */}
      <path d="M10 8.5 L10 15.5" strokeOpacity="0.9" />
      <path d="M7.5 10 Q10 8.5 12.5 10" strokeOpacity="0.9" />
      <path d="M7.5 12.5 Q10 14 12.5 12.5" strokeOpacity="0.9" />
      {/* Surplus arrow breaking out to upper right */}
      <path d="M16 8 L21 3" strokeOpacity="0.7" />
      <path d="M18.5 3 L21 3 L21 5.5" strokeOpacity="0.7" />
      {/* Growth trail dots */}
      <circle cx="17" cy="7" r="0.7" fill="currentColor" stroke="none" strokeOpacity="0.5" />
      <circle cx="19" cy="5" r="0.7" fill="currentColor" stroke="none" strokeOpacity="0.7" />
    </svg>
  );
}

// ── Leaderboard — podium with signal bars + crown ────────────────────────────
export function IconLeaderboard({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Three podium blocks */}
      <rect x="2" y="13" width="5" height="8" rx="1" strokeOpacity="0.5" />
      <rect x="9" y="9"  width="5" height="12" rx="1" strokeOpacity="0.9" />
      <rect x="16" y="15" width="5" height="6" rx="1" strokeOpacity="0.5" />
      {/* Rank numbers */}
      <text x="4.5" y="20" fontSize="3.5" fill="currentColor" textAnchor="middle" stroke="none" opacity="0.6">2</text>
      <text x="11.5" y="20" fontSize="3.5" fill="currentColor" textAnchor="middle" stroke="none">1</text>
      <text x="18.5" y="20" fontSize="3.5" fill="currentColor" textAnchor="middle" stroke="none" opacity="0.6">3</text>
      {/* Crown on first place */}
      <path d="M9.5 7.5 L11.5 5 L13.5 7.5" strokeOpacity="0.9" />
      <path d="M9 8 L14 8" strokeOpacity="0.9" />
      <circle cx="11.5" cy="5" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── Settings — precision tuning fork / cog hybrid ────────────────────────────
export function IconSettings({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Outer ring */}
      <circle cx="12" cy="12" r="9.5" strokeOpacity="0.2" />
      {/* Gear teeth — 6 */}
      {[0,60,120,180,240,300].map((deg, i) => {
        const a = deg * Math.PI / 180;
        const ix = 12 + 9 * Math.cos(a), iy = 12 + 9 * Math.sin(a);
        const ox = 12 + 10.8 * Math.cos(a), oy = 12 + 10.8 * Math.sin(a);
        return <line key={i} x1={ix} y1={iy} x2={ox} y2={oy} strokeOpacity="0.6" strokeWidth={2} />;
      })}
      {/* Inner circle */}
      <circle cx="12" cy="12" r="5" strokeOpacity="0.8" />
      {/* Centre cross-hair */}
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" strokeOpacity="0.9" />
      <line x1="12" y1="9.5" x2="12" y2="7" strokeOpacity="0.5" />
      <line x1="14.5" y1="12" x2="17" y2="12" strokeOpacity="0.5" />
      <line x1="12" y1="14.5" x2="12" y2="17" strokeOpacity="0.5" />
      <line x1="9.5" y1="12" x2="7" y2="12" strokeOpacity="0.5" />
    </svg>
  );
}

// ── Spectrum — six diverging rays from a central prism point ─────────────────
export function IconSpectrum({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Prism triangle */}
      <polygon points="12,4 20,18 4,18" fill="none" strokeOpacity="0.7" />
      {/* Incoming ray */}
      <line x1="12" y1="0" x2="12" y2="4" strokeOpacity="0.5" />
      {/* Six spectrum rays diverging from bottom of prism */}
      <line x1="12" y1="18" x2="4"  y2="22" stroke="#f43f5e" strokeOpacity="0.9" />
      <line x1="12" y1="18" x2="7"  y2="23" stroke="#f59e0b" strokeOpacity="0.9" />
      <line x1="12" y1="18" x2="10" y2="24" stroke="#10b981" strokeOpacity="0.9" />
      <line x1="12" y1="18" x2="14" y2="24" stroke="#38bdf8" strokeOpacity="0.9" />
      <line x1="12" y1="18" x2="17" y2="23" stroke="#c084fc" strokeOpacity="0.9" />
      <line x1="12" y1="18" x2="20" y2="22" stroke="#fb923c" strokeOpacity="0.9" />
    </svg>
  );
}

// ═══ V3 ICONS ═══

// ── Meridian — longitude line with nodes along it ─────────────────────────
export function IconMeridian({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Vertical meridian line */}
      <line x1="12" y1="2" x2="12" y2="22" strokeOpacity="0.5" />
      {/* Milestone nodes along the line */}
      <circle cx="12" cy="5" r="2.5" fill="currentColor" stroke="none" opacity="0.9" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.6" />
      <circle cx="12" cy="19" r="2" fill="currentColor" stroke="none" opacity="0.4" />
      {/* Horizontal branch lines */}
      <line x1="14.5" y1="5" x2="20" y2="5" strokeOpacity="0.3" />
      <line x1="14" y1="12" x2="18" y2="12" strokeOpacity="0.25" />
      {/* Glow arc */}
      <path d="M6 3 Q4 12 6 21" strokeOpacity="0.15" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

// ── Checkpoint — shield with checkmark ────────────────────────────────────
export function IconCheckpoint({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Shield outline */}
      <path d="M12 2 L20 6 L20 12 Q20 18 12 22 Q4 18 4 12 L4 6 Z" strokeOpacity="0.5" />
      {/* Checkmark */}
      <path d="M8 12 L11 15 L16 9" strokeOpacity="0.9" strokeWidth="2" />
      {/* Signal lines */}
      <line x1="12" y1="1" x2="12" y2="3" strokeOpacity="0.3" />
    </svg>
  );
}

// ── Synthesis — converging signals into one output ────────────────────────
export function IconSynthesis({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Multiple input lines converging */}
      <line x1="3" y1="5" x2="10" y2="12" strokeOpacity="0.4" />
      <line x1="3" y1="12" x2="10" y2="12" strokeOpacity="0.5" />
      <line x1="3" y1="19" x2="10" y2="12" strokeOpacity="0.4" />
      {/* Central synthesis point */}
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" opacity="0.7" />
      {/* Output ray */}
      <line x1="15" y1="12" x2="22" y2="12" strokeOpacity="0.8" />
      <path d="M20 10 L22 12 L20 14" strokeOpacity="0.6" />
      {/* Small input dots */}
      <circle cx="3" cy="5" r="1" fill="currentColor" stroke="none" opacity="0.3" />
      <circle cx="3" cy="12" r="1" fill="currentColor" stroke="none" opacity="0.4" />
      <circle cx="3" cy="19" r="1" fill="currentColor" stroke="none" opacity="0.3" />
    </svg>
  );
}

// ── Calibration — tuning dial with markings ──────────────────────────────
export function IconCalibration({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Outer ring */}
      <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
      {/* Tick marks around the ring */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
        const a = (deg * Math.PI) / 180;
        const x1 = 12 + 7.5 * Math.cos(a), y1 = 12 + 7.5 * Math.sin(a);
        const x2 = 12 + 9 * Math.cos(a), y2 = 12 + 9 * Math.sin(a);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity="0.3" />;
      })}
      {/* Centre knob */}
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" opacity="0.6" />
      {/* Indicator needle */}
      <line x1="12" y1="12" x2="12" y2="5" strokeOpacity="0.9" strokeWidth="2" />
      <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" opacity="0.9" />
    </svg>
  );
}

// ── Luminary — star with radiating light ─────────────────────────────────
export function IconLuminary({ size=20, color='currentColor', strokeWidth=1.5, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth} className={className} style={{ color }}>
      {/* Central star point */}
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" opacity="0.8" />
      {/* Radiating light rays */}
      <line x1="12" y1="2" x2="12" y2="7" strokeOpacity="0.5" />
      <line x1="12" y1="17" x2="12" y2="22" strokeOpacity="0.5" />
      <line x1="2" y1="12" x2="7" y2="12" strokeOpacity="0.5" />
      <line x1="17" y1="12" x2="22" y2="12" strokeOpacity="0.5" />
      {/* Diagonal rays — shorter */}
      <line x1="5.5" y1="5.5" x2="8" y2="8" strokeOpacity="0.3" />
      <line x1="16" y1="16" x2="18.5" y2="18.5" strokeOpacity="0.3" />
      <line x1="18.5" y1="5.5" x2="16" y2="8" strokeOpacity="0.3" />
      <line x1="8" y1="16" x2="5.5" y2="18.5" strokeOpacity="0.3" />
      {/* Outer glow ring */}
      <circle cx="12" cy="12" r="8" strokeOpacity="0.15" strokeDasharray="2 2" />
    </svg>
  );
}
