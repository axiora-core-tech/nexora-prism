import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import {
  IconOverview, IconTeam, IconAnalytics, IconTasks,
  IconKPI, IconReviews, IconAttendance, IconROI,
  IconLeaderboard, IconSettings,
} from './DockIcons';

const primaryNav = [
  { Icon: IconOverview,  path: '/app',          label: 'Overview' },
  { Icon: IconTeam,      path: '/app/team',      label: 'Team' },
  { Icon: IconAnalytics, path: '/app/analytics', label: 'Analytics' },
  { Icon: IconTasks,     path: '/app/tasks',     label: 'Tasks' },
];

const featureNav = [
  { Icon: IconKPI,         path: '/app/kpis',       label: 'KPI Goals',    color: '#f59e0b' },
  { Icon: IconReviews,     path: '/app/review',     label: '360° Reviews', color: '#c084fc' },
  { Icon: IconAttendance,  path: '/app/attendance', label: 'Attendance',   color: '#38bdf8' },
  { Icon: IconROI,         path: '/app/roi',        label: 'ROI Intel',    color: '#10b981' },
  { Icon: IconLeaderboard, path: '/app/leaderboard',label: 'Leaderboard',  color: '#f59e0b' },
  { Icon: IconSettings,    path: '/app/settings',   label: 'Settings',     color: '#94a3b8' },
];

export function Dock() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
    >
      {/* Feature tray */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-1 px-3 py-2.5 p-dock backdrop-blur-2xl border rounded-full shadow-2xl shadow-black/30"
          >
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
                    <span className="text-xs uppercase tracking-widest opacity-60 whitespace-nowrap"
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
      <div className="flex items-center gap-1 px-3 py-2.5 p-dock backdrop-blur-2xl border rounded-full shadow-2xl shadow-black/30">
        {primaryNav.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative group flex flex-col items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                isActive ? 'text-white' : 'p-text-lo hover:p-text-hi hover:p-bg-card'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-xs uppercase tracking-widest opacity-60 whitespace-nowrap">{item.label}</span>
                {isActive && (
                  <motion.div layoutId="primary-active"
                    className="absolute inset-0 rounded-full bg-white/8 z-[-1]" />
                )}
              </>
            )}
          </NavLink>
        ))}

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
          <span className="text-xs uppercase tracking-widest opacity-60">{expanded ? 'Less' : 'More'}</span>
        </button>
      </div>
    </motion.div>
  );
}
