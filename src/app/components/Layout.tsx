import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../auth/ThemeContext';
import { Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Dock } from './ui/Dock';
import { CustomCursor } from './ui/CustomCursor';

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSITION CHOREOGRAPHY
   
   Navigation type determines animation:
   • Lateral (same depth)  → slide left or right
   • Deeper  (into detail) → scale up from center, slight blur
   • Back    (out of detail)→ scale down to center, reverse
   • Default               → soft fade
   ═══════════════════════════════════════════════════════════════════════════ */

// Depth map — higher number = deeper into the app
const depthMap: Record<string, number> = {
  '/app': 0,          // Spectrum (landing)
  '/app/spectrum': 0,
  '/app/team': 0,
  '/app/tasks': 0,
  '/app/analytics': 0,
  '/app/kpis': 1,
  '/app/attendance': 1,
  '/app/roi': 1,
  '/app/leaderboard': 1,
  '/app/review': 1,
  '/app/reviews': 1,
  '/app/settings': 1,
};

// Position map for lateral sliding — left-to-right order
const posMap: Record<string, number> = {
  '/app': 0,
  '/app/spectrum': 0,
  '/app/team': 1,
  '/app/tasks': 2,
  '/app/analytics': 0,
  '/app/kpis': 3,
  '/app/attendance': 4,
  '/app/roi': 0,
  '/app/leaderboard': 5,
  '/app/review': 6,
  '/app/reviews': 6,
  '/app/settings': 7,
};

function getDepth(path: string): number {
  // Employee detail is always depth 2
  if (path.startsWith('/app/employee/')) return 2;
  return depthMap[path] ?? 1;
}

function getPos(path: string): number {
  if (path.startsWith('/app/employee/')) return 1.5; // between team and analytics
  return posMap[path] ?? 5;
}

type TransitionType = 'lateral-left' | 'lateral-right' | 'dive' | 'surface' | 'fade';

function getTransitionType(from: string, to: string): TransitionType {
  const fromDepth = getDepth(from);
  const toDepth = getDepth(to);
  
  if (toDepth > fromDepth) return 'dive';
  if (toDepth < fromDepth) return 'surface';
  
  // Same depth → lateral slide
  const fromPos = getPos(from);
  const toPos = getPos(to);
  if (fromPos === toPos) return 'fade';
  return toPos > fromPos ? 'lateral-left' : 'lateral-right';
}

const transitions: Record<TransitionType, {
  initial: Record<string, any>;
  animate: Record<string, any>;
  exit: Record<string, any>;
}> = {
  'lateral-left': {
    initial: { opacity: 0, x: 60, filter: 'blur(2px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit:    { opacity: 0, x: -40, filter: 'blur(2px)' },
  },
  'lateral-right': {
    initial: { opacity: 0, x: -60, filter: 'blur(2px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit:    { opacity: 0, x: 40, filter: 'blur(2px)' },
  },
  'dive': {
    initial: { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit:    { opacity: 0, scale: 1.04, filter: 'blur(4px)' },
  },
  'surface': {
    initial: { opacity: 0, scale: 1.06, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit:    { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
  },
  'fade': {
    initial: { opacity: 0, y: 16, filter: 'blur(3px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit:    { opacity: 0, y: -8, filter: 'blur(2px)' },
  },
};

export function Layout() {
  const location = useLocation();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const prevPath = useRef(location.pathname);
  const [transType, setTransType] = useState<TransitionType>('fade');

  useEffect(() => {
    const type = getTransitionType(prevPath.current, location.pathname);
    setTransType(type);
    prevPath.current = location.pathname;
  }, [location.pathname]);

  const t = transitions[transType];

  return (
    <div
      className={`prism-shell min-h-screen font-sans overflow-hidden relative cursor-none p-bg ${isLight ? 'prism-light' : 'prism-dark'}`}
      style={{ backgroundColor: 'var(--p-bg)', color: 'var(--p-text-hi)' }}
    >
      <CustomCursor />
      
      {/* Ambient background */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes app-blob-a {
          0%,100% { transform: rotate(0deg)   scale(1)   translate(0px,0px); }
          50%      { transform: rotate(45deg)  scale(1.2) translate(50px,50px); }
        }
        @keyframes app-blob-b {
          0%,100% { transform: rotate(0deg)   scale(1)   translate(0px,0px); }
          50%      { transform: rotate(-45deg) scale(1.3) translate(-50px,-50px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .app-blob { animation: none !important; }
        }
      `}} />
      <div className={`fixed inset-0 z-0 pointer-events-none ${isLight ? 'opacity-20' : 'opacity-40 mix-blend-screen'}`}>
        <div
          className="app-blob absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
          style={{ animation: 'app-blob-a 40s linear infinite', willChange: 'transform', backgroundColor: isLight ? 'rgba(99,102,241,0.12)' : 'rgba(88,28,135,0.20)' }}
        />
        <div
          className="app-blob absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
          style={{ animation: 'app-blob-b 50s linear infinite', willChange: 'transform', backgroundColor: isLight ? 'rgba(6,182,212,0.08)' : 'rgba(6,182,212,0.10)' }}
        />
      </div>

      {/* Cursor overrides for form elements */}
      <style dangerouslySetInnerHTML={{ __html: `
        input, textarea, select { cursor: text !important; }
        input[type="range"]     { cursor: ew-resize !important; }
        input[type="checkbox"],
        input[type="radio"]     { cursor: pointer !important; }
        select                  { cursor: pointer !important; }
      `}} />

      {/* Main content */}
      <main
        className="relative z-10 h-screen overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', backgroundColor: 'var(--p-bg)' }}
      >
        <style dangerouslySetInnerHTML={{__html: `main::-webkit-scrollbar { display: none; }`}} />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={t.initial}
            animate={t.animate}
            exit={{ ...t.exit, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Dock />
    </div>
  );
}
