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
      
      {/* Avant-Garde Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
        <motion.div 
          animate={{ 
            rotate: [0, 90, 0],
            scale: [1, 1.2, 1],
            x: [0, 50, -50, 0],
            y: [0, 50, -50, 0]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-900/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            rotate: [0, -90, 0],
            scale: [1, 1.3, 1],
            x: [0, -50, 50, 0],
            y: [0, -50, 50, 0]
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/10 blur-[120px]" 
        />
      </div>

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
