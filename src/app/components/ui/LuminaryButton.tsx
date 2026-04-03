/**
 * LuminaryButton — Floating trigger button with pulse dot
 * Positioned bottom-right, above the Dock. Triggers Dawn Sequence.
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PrismSpark } from './PrismIcons';

interface LuminaryButtonProps {
  onOpen: () => void;
  hasPending?: boolean;
}

export function LuminaryButton({ onOpen, hasPending = true }: LuminaryButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-28 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all group"
      style={{
        background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(192,132,252,0.12))',
        border: '1px solid rgba(56,189,248,0.2)',
        backdropFilter: 'blur(20px)',
        cursor: 'pointer',
      }}
      data-cursor="Luminary"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full blur-[20px] pointer-events-none transition-opacity"
        style={{ background: 'rgba(56,189,248,0.15)', opacity: hovered ? 1 : 0.4 }} />

      {/* Icon */}
      <motion.div animate={{ rotate: hovered ? 15 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
        <PrismSpark size={20} style={{ color: '#38bdf8' }} />
      </motion.div>

      {/* Pending pulse dot */}
      {hasPending && (
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full"
          style={{ background: '#f59e0b' }}
        >
          <div className="absolute inset-0 rounded-full blur-[6px] pointer-events-none" style={{ background: 'rgba(245,158,11,0.5)' }} />
        </motion.div>
      )}

      {/* Label on hover */}
      <motion.span
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? -12 : -8 }}
        className="absolute right-full mr-2 text-[10px] font-mono uppercase tracking-[0.15em] whitespace-nowrap"
        style={{ color: '#38bdf8' }}
      >
        Luminary
      </motion.span>
    </motion.button>
  );
}
