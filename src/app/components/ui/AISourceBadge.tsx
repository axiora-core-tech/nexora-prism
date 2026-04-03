/**
 * AISourceBadge — Fading "Prism suggested" badge for Prism-generated tasks
 * Shows source type, fades after acceptance.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Map, MessageSquare, ClipboardCheck } from 'lucide-react';

type AISource = 'ai_roadmap' | 'ai_standup' | 'ai_review' | 'manual';

const sourceConfig: Record<AISource, { label: string; icon: typeof Sparkles; color: string }> = {
  ai_roadmap: { label: 'Meridian', icon: Map, color: '#10b981' },
  ai_standup: { label: 'Luminary', icon: MessageSquare, color: '#38bdf8' },
  ai_review:  { label: 'Resonance', icon: ClipboardCheck, color: '#c084fc' },
  manual:     { label: 'Manual', icon: Sparkles, color: 'var(--p-text-ghost)' },
};

interface AISourceBadgeProps {
  source: AISource;
  accepted?: boolean;
  fadeDelay?: number;
  className?: string;
}

export function AISourceBadge({ source, accepted = false, fadeDelay = 3000, className = '' }: AISourceBadgeProps) {
  const [visible, setVisible] = useState(true);
  const cfg = sourceConfig[source] || sourceConfig.manual;
  const Icon = cfg.icon;

  useEffect(() => {
    if (accepted && source !== 'manual') {
      const t = setTimeout(() => setVisible(false), fadeDelay);
      return () => clearTimeout(t);
    }
  }, [accepted, fadeDelay, source]);

  if (source === 'manual') return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: accepted ? 0.5 : 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 rounded ${className}`}
          style={{ background: `${cfg.color}12`, color: cfg.color }}
        >
          <Icon size={10} />
          {cfg.label}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
