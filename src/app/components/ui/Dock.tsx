import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import {
  IconSpectrum, IconTeam, IconTasks,
  IconKPI, IconReviews, IconAttendance,
  IconLeaderboard, IconSettings,
  IconMeridian, IconCheckpoint, IconSynthesis, IconCalibration,
  IconAvatar, IconSanctum,
} from './DockIcons';
import { useRoleAccess } from '../../auth/useRoleAccess';

// Full registry of all nav items — filtered by role at runtime
const ALL_PRIMARY = [
  { Icon: IconTeam,        path: '/app/team',        label: 'Team' },
  { Icon: IconKPI,         path: '/app/kpis',        label: 'KPIs' },
  { Icon: IconSpectrum,    path: '/app',             label: 'Spectrum', center: true },
  { Icon: IconSanctum,     path: '/app/avatar',      label: 'Sanctum' },
  { Icon: IconTasks,       path: '/app/tasks',       label: 'Tasks' },
];

const ALL_FEATURE: Record<string, { Icon: typeof IconSpectrum; label: string; color: string }> = {
  '/app/review':     { Icon: IconReviews,     label: '360° Reviews', color: '#c084fc' },
  '/app/attendance':  { Icon: IconAttendance,  label: 'Attendance',   color: '#38bdf8' },
  '/app/roadmap':     { Icon: IconMeridian,    label: 'Meridian',     color: '#10b981' },
  '/app/approvals':   { Icon: IconCheckpoint,  label: 'Checkpoint',   color: '#f59e0b' },
  '/app/reports':     { Icon: IconSynthesis,   label: 'Synthesis',    color: '#f43f5e' },
  '/app/leaderboard': { Icon: IconLeaderboard, label: 'The Race',     color: '#f59e0b' },
  '/app/admin':       { Icon: IconCalibration, label: 'Calibration',  color: '#38bdf8' },
  '/app/settings':    { Icon: IconSettings,    label: 'Settings',     color: '#94a3b8' },
};

export function Dock() {
  const [expanded, setExpanded] = useState(false);
  const { primaryNavItems, featureNavItems } = useRoleAccess();

  // Filter primary nav by role-allowed paths
  const primaryNav = useMemo(() =>
    ALL_PRIMARY.filter(item => primaryNavItems.includes(item.path)),
  [primaryNavItems]);

  // Build feature nav from role-allowed paths
  const featureNav = useMemo(() =>
    featureNavItems.map(path => ({ path, ...ALL_FEATURE[path] })).filter(item => item.Icon),
  [featureNavItems]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
      className="dock-root fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
    >
      {/* Feature tray */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-1 px-3 py-2.5 p-dock backdrop-blur-2xl border rounded-full shadow-2xl shadow-black/30 overflow-x-auto max-w-[calc(100vw-2rem)]"
          style={{ scrollbarWidth: 'none' }}>
            {featureNav.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setExpanded(false)}
                className={({ isActive }) =>
                  `relative group flex flex-col items-center gap-1 px-2 py-1.5 rounded-full transition-all ${
                    isActive ? 'text-white' : 'p-text-lo hover:p-text-hi hover:p-bg-card'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.Icon size={18} strokeWidth={isActive ? 2 : 1.5}
                      color={isActive ? item.color : undefined} />
                    <span className="hidden sm:block text-xs uppercase tracking-widest opacity-60 whitespace-nowrap"
                      style={{ color: isActive ? item.color : undefined }}>
                      {item.label.split(' ')[0]}
                    </span>
                    {isActive && (
                      <motion.div layoutId="feature-active"
                        className="absolute inset-0 rounded-full z-[-1]"
                        style={{ background: item.color + '15' }} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main dock */}
      <div className="flex items-center gap-1 px-3 py-2.5 p-dock backdrop-blur-2xl border rounded-full shadow-2xl shadow-black/30 max-w-[calc(100vw-2rem)] overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}>
        {primaryNav.map(item => {
          const isCenter = (item as any).center;
          return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) =>
              `relative group flex flex-col items-center gap-1 rounded-full transition-all ${
                isCenter
                  ? `px-4 py-2 -my-3 ${isActive ? 'text-white' : 'p-text-lo hover:p-text-hi'}`
                  : `px-3 py-1.5 ${isActive ? 'text-white' : 'p-text-lo hover:p-text-hi hover:p-bg-card'}`
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isCenter ? (
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                        : 'bg-white/5 border border-white/10 group-hover:border-white/20 group-hover:bg-white/8'
                    }`}>
                      <item.Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                    </div>
                    {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />}
                  </div>
                ) : (
                  <item.Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                )}
                <span className={`hidden sm:block uppercase tracking-widest opacity-60 whitespace-nowrap ${isCenter ? 'text-[10px]' : 'text-xs'}`}>{item.label}</span>
                {!isCenter && isActive && (
                  <motion.div layoutId="primary-active"
                    className="absolute inset-0 rounded-full bg-white/8 z-[-1]" />
                )}
              </>
            )}
          </NavLink>
          );
        })}

        {/* Divider */}
        <div className="w-px h-8 p-bg-card-2 mx-1" />

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-full transition-all p-text-lo hover:p-text-hi hover:p-bg-card ${expanded ? 'p-text-hi p-bg-card' : ''}`}
          data-cursor="More"
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronUp size={18} />
          </motion.div>
          <span className="hidden sm:block text-xs uppercase tracking-widest opacity-60">{expanded ? 'Less' : 'More'}</span>
        </button>
      </div>
    </motion.div>
  );
}
