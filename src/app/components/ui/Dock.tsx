import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Users, Activity, Target, Network, CalendarDays, DollarSign, Settings, ChevronUp, Trophy, FileText, Layers } from 'lucide-react';

const primaryNav = [
  { icon: Home,     path: '/app',          label: 'Overview' },
  { icon: Users,    path: '/app/team',      label: 'Team' },
  { icon: Activity, path: '/app/analytics', label: 'Analytics' },
  { icon: Layers,   path: '/app/tasks',     label: 'Tasks' },
];

const featureNav = [
  { icon: Target,       path: '/app/kpis',        label: 'KPI Goals',    color: '#f59e0b' },
  { icon: Network,      path: '/app/reviews',      label: '360° Reviews', color: '#c084fc' },
  { icon: CalendarDays, path: '/app/attendance',   label: 'Attendance',   color: '#38bdf8' },
  { icon: DollarSign,   path: '/app/roi',          label: 'ROI Intel',    color: '#10b981' },
  { icon: Trophy,       path: '/app/leaderboard',  label: 'Leaderboard',  color: '#f59e0b' },
  { icon: FileText,     path: '/app/review',       label: 'Start Review', color: '#38bdf8' },
];

export function Dock() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
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
            className="flex items-center gap-1 px-3 py-2.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl shadow-black/60"
          >
            {featureNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setExpanded(false)}
                className={({ isActive }) =>
                  `relative group flex flex-col items-center gap-1 px-2 py-1.5 rounded-full transition-all ${
                    isActive ? 'text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={17} strokeWidth={isActive ? 2 : 1.5} />
                    <span className="text-xs uppercase tracking-widest opacity-60 whitespace-nowrap" style={{ color: isActive ? item.color : undefined }}>
                      {item.label.split(' ')[0]}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="feature-active"
                        className="absolute inset-0 rounded-full z-[-1]"
                        style={{ background: item.color + '15' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main dock */}
      <div className="flex items-center gap-1 px-3 py-2.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl shadow-black/50">
        {primaryNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative p-2.5 rounded-full transition-all duration-300 ${
                isActive ? 'text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} className="relative z-10" />
                {isActive && (
                  <>
                    <motion.div layoutId="dock-bg" className="absolute inset-0 bg-white/10 rounded-full z-0" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                    <motion.div layoutId="dock-dot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="w-px h-5 bg-white/10 mx-1" />

        <button
          onClick={() => setExpanded(!expanded)}
          className={`relative p-2.5 rounded-full transition-all duration-300 ${
            expanded ? 'text-amber-400 bg-amber-400/10' : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
          data-cursor={expanded ? 'Close' : 'Features'}
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronUp size={20} strokeWidth={1.5} />
          </motion.div>
          {expanded && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"
            />
          )}
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `relative p-2.5 rounded-full transition-all duration-300 ${
              isActive ? 'text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`
          }
        >
          <Settings size={20} strokeWidth={1.5} />
        </NavLink>
      </div>
    </motion.div>
  );
}
