import React from 'react';
import { useTheme } from '../auth/ThemeContext';
import { Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Dock } from './ui/Dock';
import { CustomCursor } from './ui/CustomCursor';

export function Layout() {
  const location = useLocation();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className={`prism-shell min-h-screen font-sans overflow-hidden relative cursor-none p-bg ${isLight ? 'prism-light' : 'prism-dark'}`}
      style={{ backgroundColor: 'var(--p-bg)', color: 'var(--p-text-hi)' }}
    >
      <CustomCursor />
      
      {/* Avant-Garde Ambient Background — CSS-only, compositor thread */}
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

      {/* Restore native cursors for interactive form elements.
           cursor-none on the root hides the OS cursor everywhere, which breaks
           the text-insertion caret feel inside inputs. These rules carve out
           the elements that need their native cursor back. */}
      <style dangerouslySetInnerHTML={{ __html: `
        input, textarea, select { cursor: text !important; }
        input[type="range"]     { cursor: ew-resize !important; }
        input[type="checkbox"],
        input[type="radio"]     { cursor: pointer !important; }
        select                  { cursor: pointer !important; }
      `}} />

      {/* Main Content Area */}
      <main
        className="relative z-10 h-screen overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', backgroundColor: 'var(--p-bg)' }}
      >
        <style dangerouslySetInnerHTML={{__html: `main::-webkit-scrollbar { display: none; }`}} />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
            exit={{    opacity: 0, y: -8, filter: 'blur(2px)', transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
