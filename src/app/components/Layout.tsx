import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Dock } from './ui/Dock';
import { CustomCursor } from './ui/CustomCursor';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#030303] text-[#e5e5e5] font-sans selection:bg-purple-500/30 overflow-hidden relative selection:text-white cursor-none">
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
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
        <div
          className="app-blob absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-900/20 blur-[120px]"
          style={{ animation: 'app-blob-a 40s linear infinite', willChange: 'transform' }}
        />
        <div
          className="app-blob absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/10 blur-[120px]"
          style={{ animation: 'app-blob-b 50s linear infinite', willChange: 'transform' }}
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
      <main className="relative z-10 h-screen overflow-y-auto overflow-x-hidden pb-40" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style dangerouslySetInnerHTML={{__html: `main::-webkit-scrollbar { display: none; }`}} />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
