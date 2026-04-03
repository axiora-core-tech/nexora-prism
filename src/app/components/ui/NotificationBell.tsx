/**
 * NotificationBell — In-app notification center
 * Shows pending approvals, standup reminders, milestone alerts.
 */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { PrismAlert, PrismComplete, PrismRisk, PrismTime, PrismMeridian } from './PrismIcons';
import { useNavigate } from 'react-router';

interface Notification {
  id: string;
  type: 'approval' | 'standup' | 'milestone' | 'info';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  route?: string;
}

const mockNotifications: Notification[] = [
  { id: 'n1', type: 'approval', title: 'Checkpoint signal detected', body: 'API Refactor task for Arjun requires your sign-off', timestamp: '2m ago', read: false, route: '/app/approvals' },
  { id: 'n2', type: 'milestone', title: 'Meridian node at risk', body: 'User Research Phase 2 is 40% complete with 3 weeks remaining', timestamp: '1h ago', read: false, route: '/app/roadmap' },
  { id: 'n3', type: 'standup', title: 'Standup signal missing', body: 'Priya Sharma has not completed today\'s Luminary check-in', timestamp: '3h ago', read: true },
  { id: 'n4', type: 'info', title: 'Synthesis complete', body: 'Q1 Board Summary report has been generated and is ready for review', timestamp: '1d ago', read: true, route: '/app/reports' },
];

const typeConfig = {
  approval: { icon: PrismComplete, color: '#f59e0b' },
  standup: { icon: PrismTime, color: '#38bdf8' },
  milestone: { icon: PrismMeridian, color: '#f43f5e' },
  info: { icon: PrismRisk, color: '#10b981' },
};

export function NotificationBell({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const navigate = useNavigate();
  const unread = notifications.filter(n => !n.read).length;
  const bellRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div ref={bellRef} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all"
        style={{ background: 'var(--p-bg-card)', border: '1px solid var(--p-border)' }}
        data-cursor="Alerts"
      >
        <PrismAlert size={15} style={{ color: open ? '#38bdf8' : 'var(--p-text-dim)' }} />
        {unread > 0 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold"
            style={{ background: '#f43f5e', color: 'white' }}
          >
            {unread}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full mt-2 right-0 w-80 rounded-2xl overflow-hidden"
            style={{ background: 'var(--p-bg-surface)', border: '1px solid var(--p-border)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--p-border)' }}>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--p-text-lo)' }}>Signals</span>
              <button onClick={() => setOpen(false)} className="p-text-ghost hover:p-text-mid transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              {notifications.map(n => {
                const cfg = typeConfig[n.type];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={n.id}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                    className="px-4 py-3 flex items-start gap-3 cursor-pointer transition-all"
                    style={{ opacity: n.read ? 0.5 : 1 }}
                    onClick={() => {
                      markRead(n.id);
                      if (n.route) { navigate(n.route); setOpen(false); }
                    }}
                  >
                    <Icon size={14} className="flex-shrink-0 mt-0.5" style={{ color: cfg.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-light" style={{ color: 'var(--p-text-body)' }}>{n.title}</p>
                      <p className="text-[11px] p-text-dim mt-0.5 leading-relaxed">{n.body}</p>
                    </div>
                    <span className="text-[10px] font-mono flex-shrink-0 p-text-ghost">{n.timestamp}</span>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: cfg.color }} />}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
