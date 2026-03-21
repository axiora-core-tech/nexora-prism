import { useNavigate } from 'react-router';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers, Plus, X, ChevronRight, Calendar, ArrowLeft,
  Clock, Play, Square, Paperclip, Link2, MessageSquare,
  ChevronDown, Check, AlertCircle, Hash, File, Trash2,
  Timer, TrendingUp, GitBranch,
} from 'lucide-react';
import { employees } from '../mockData';

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Priority  = 'critical' | 'high' | 'medium' | 'low';
type Status    = 'backlog'  | 'active' | 'review' | 'resolved';

interface Comment {
  id: string; authorId: string; text: string; ts: string;
}
interface Attachment {
  id: string; kind: 'file' | 'link'; name: string; url?: string; size?: string; ts: string;
}
interface Task {
  id: string; title: string; desc: string;
  status: Status; priority: Priority;
  owner: string; ownerId: string;
  due: string; tags: string[];
  storyPoints: number;
  estimatedHours: number;
  loggedHours: number;
  parentId: string | null;
  comments: Comment[];
  attachments: Attachment[];
}

/* ─── Static config ─────────────────────────────────────────────────────── */
const columns: { id: Status; label: string; sub: string; accent: string; glow: string }[] = [
  { id: 'backlog',  label: 'Dormant',     sub: 'Backlog',    accent: '#52525b', glow: 'rgba(82,82,91,0.15)'    },
  { id: 'active',   label: 'In Flux',     sub: 'Active',     accent: '#38bdf8', glow: 'rgba(56,189,248,0.12)'  },
  { id: 'review',   label: 'Orbit',       sub: 'In Review',  accent: '#c084fc', glow: 'rgba(192,132,252,0.12)' },
  { id: 'resolved', label: 'Transmitted', sub: 'Done',       accent: '#10b981', glow: 'rgba(16,185,129,0.12)'  },
];

const priorityConfig: Record<Priority, { color: string; label: string }> = {
  critical: { color: '#f43f5e', label: 'Critical' },
  high:     { color: '#f59e0b', label: 'High'     },
  medium:   { color: '#38bdf8', label: 'Medium'   },
  low:      { color: '#52525b', label: 'Low'      },
};

const mockComments: Comment[] = [
  { id: 'c1', authorId: 'e1', text: 'Initial architecture scope agreed with the team. Starting with core modules.', ts: 'Nov 14, 09:12' },
  { id: 'c2', authorId: 'e2', text: 'Left review comments on the figma handoff — some spacing inconsistencies in section 3.', ts: 'Nov 14, 14:30' },
];

const mockAttachments: Attachment[] = [
  { id: 'a1', kind: 'file', name: 'architecture-v2.pdf', size: '1.2 MB', ts: 'Nov 13' },
  { id: 'a2', kind: 'link', name: 'Figma Prototype', url: 'https://figma.com', ts: 'Nov 14' },
];

const initialTasks: Task[] = [
  { id: 't1', title: 'Compile Architecture Docs',       desc: 'Full documentation pass for the new distributed systems',    status: 'active',   priority: 'high',     owner: 'Arjun S.',  ownerId: 'e1', due: 'Nov 20', tags: ['Engineering', 'Docs'],     storyPoints: 8,  estimatedHours: 16, loggedHours: 10, parentId: null,   comments: mockComments, attachments: mockAttachments },
  { id: 't2', title: 'Refine UI State Transitions',     desc: 'Audit and improve all motion/spring interactions',            status: 'backlog',  priority: 'medium',   owner: 'Neha G.',   ownerId: 'e2', due: 'Nov 22', tags: ['Design', 'UX'],            storyPoints: 5,  estimatedHours: 8,  loggedHours: 0,  parentId: null,   comments: [], attachments: [] },
  { id: 't3', title: 'Database Indexing Optimization',  desc: 'Reduce query latency across primary data services',           status: 'active',   priority: 'critical', owner: 'Vikram S.', ownerId: 'e3', due: 'Nov 18', tags: ['Infrastructure'],          storyPoints: 13, estimatedHours: 24, loggedHours: 16, parentId: 't1',  comments: [], attachments: [] },
  { id: 't4', title: 'Q4 SEO Campaign Launch',          desc: 'Final review and deployment of organic growth strategy',      status: 'resolved', priority: 'high',     owner: 'Kavya R.',  ownerId: 'e4', due: 'Nov 15', tags: ['Marketing', 'Growth'],     storyPoints: 8,  estimatedHours: 12, loggedHours: 12, parentId: null,   comments: [], attachments: [mockAttachments[1]] },
  { id: 't5', title: 'Security Audit — Zero Trust',     desc: 'Full penetration test and architecture review',               status: 'backlog',  priority: 'critical', owner: 'Vikram S.', ownerId: 'e3', due: 'Dec 01', tags: ['Security'],                storyPoints: 21, estimatedHours: 40, loggedHours: 0,  parentId: null,   comments: [], attachments: [] },
  { id: 't6', title: 'React 19 Migration — Phase II',   desc: 'Concurrent features and Server Components rollout',           status: 'review',   priority: 'high',     owner: 'Arjun S.',  ownerId: 'e1', due: 'Nov 25', tags: ['Engineering'],             storyPoints: 13, estimatedHours: 32, loggedHours: 28, parentId: 't1',  comments: [], attachments: [] },
  { id: 't7', title: 'User Onboarding Flow V2',         desc: 'A/B test new onboarding with activation funnel',              status: 'review',   priority: 'medium',   owner: 'Neha G.',   ownerId: 'e2', due: 'Nov 28', tags: ['Design', 'Product'],       storyPoints: 5,  estimatedHours: 10, loggedHours: 8,  parentId: null,   comments: [], attachments: [] },
  { id: 't8', title: 'Sales & Marketing Sync Cadence',  desc: 'Establish bi-weekly joint campaign planning sessions',        status: 'backlog',  priority: 'low',      owner: 'Kavya R.',  ownerId: 'e4', due: 'Dec 05', tags: ['Marketing'],               storyPoints: 2,  estimatedHours: 4,  loggedHours: 0,  parentId: null,   comments: [], attachments: [] },
];

/* ─── Task Detail Modal ──────────────────────────────────────────────────── */
function TaskDetail({
  task, tasks, onClose, onUpdate, onMove,
}: {
  task: Task; tasks: Task[];
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onMove: (id: string, dir: 'left' | 'right') => void;
}) {
  const col  = columns.find(c => c.id === task.status)!;
  const pCfg = priorityConfig[task.priority];
  const emp  = employees.find(e => e.id === task.ownerId);

  /* ── Local editable state ── */
  const [title, setTitle]     = useState(task.title);
  const [desc, setDesc]       = useState(task.desc);
  const [editingTitle, setEditingTitle] = useState(false);

  /* ── Timer ── */
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSecs, setTimerSecs]       = useState(0);
  const [loggedInput, setLoggedInput]   = useState(String(task.loggedHours));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning]);

  const stopAndLog = () => {
    setTimerRunning(false);
    const addHours = parseFloat((timerSecs / 3600).toFixed(2));
    const newLogged = parseFloat(loggedInput || '0') + addHours;
    setLoggedInput(String(parseFloat(newLogged.toFixed(2))));
    onUpdate(task.id, { loggedHours: newLogged });
    setTimerSecs(0);
  };

  const fmtTimer = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  /* ── Comments ── */
  const [commentText, setCommentText] = useState('');
  const addComment = () => {
    if (!commentText.trim()) return;
    const c: Comment = { id: `c${Date.now()}`, authorId: 'e1', text: commentText.trim(), ts: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) };
    onUpdate(task.id, { comments: [...task.comments, c] });
    setCommentText('');
  };

  /* ── Attachments ── */
  const [attachPanel, setAttachPanel] = useState<'none'|'file'|'link'>('none');
  const [attachName, setAttachName]   = useState('');
  const [attachUrl, setAttachUrl]     = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLink = () => {
    if (!attachName.trim()) return;
    const a: Attachment = { id: `a${Date.now()}`, kind: 'link', name: attachName.trim(), url: attachUrl.trim() || '#', ts: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) };
    onUpdate(task.id, { attachments: [...task.attachments, a] });
    setAttachName(''); setAttachUrl(''); setAttachPanel('none');
  };

  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const a: Attachment = { id: `a${Date.now()}`, kind: 'file', name: file.name, size: `${(file.size / 1024).toFixed(0)} KB`, ts: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) };
    onUpdate(task.id, { attachments: [...task.attachments, a] });
    setAttachPanel('none');
  };

  const removeAttachment = (id: string) => onUpdate(task.id, { attachments: task.attachments.filter(a => a.id !== id) });

  /* ── Inline input style ── */
  const inp = 'w-full rounded-xl text-sm font-light outline-none transition-all bg-white/[0.04] border border-white/[0.07] text-white placeholder:text-white/20 focus:border-white/20 px-3 py-2';

  const parentTask = task.parentId ? tasks.find(t => t.id === task.parentId) : null;
  const childTasks = tasks.filter(t => t.parentId === task.id);
  const orderIdx   = columns.findIndex(c => c.id === task.status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
      style={{ scrollbarWidth: 'none' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl my-8 rounded-[2rem] overflow-hidden border p-border-mid relative"
        style={{ backgroundColor: 'var(--p-surface)' }}
      >
        {/* Priority bar */}
        <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: pCfg.color }} />
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-40"
          style={{ background: col.glow }} />

        {/* ── Header ── */}
        <div className="relative z-10 flex items-start justify-between gap-4 px-8 pt-8 pb-5 border-b p-border">
          <div className="flex-1 min-w-0">
            {/* Parent task breadcrumb */}
            {parentTask && (
              <div className="flex items-center gap-1.5 mb-3 text-xs font-mono p-text-dim uppercase tracking-widest">
                <GitBranch size={10} />
                <span>{parentTask.title}</span>
                <ChevronRight size={9} />
                <span className="p-text-mid">This task</span>
              </div>
            )}

            {/* Editable title */}
            {editingTitle ? (
              <input
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={() => { setEditingTitle(false); onUpdate(task.id, { title }); }}
                onKeyDown={e => { if (e.key === 'Enter') { setEditingTitle(false); onUpdate(task.id, { title }); } }}
                className="w-full bg-transparent text-2xl font-light text-white outline-none border-b border-white/20 pb-1 mb-1"
              />
            ) : (
              <h2
                onClick={() => setEditingTitle(true)}
                className="text-2xl font-light text-white leading-snug cursor-text hover:text-white/90 transition-colors mb-1"
                data-cursor="Edit"
              >
                {title}
              </h2>
            )}

            {/* Status trail */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {columns.map((c, i) => {
                const active  = c.id === task.status;
                const passed  = i < orderIdx;
                return (
                  <React.Fragment key={c.id}>
                    <button
                      onClick={() => onUpdate(task.id, { status: c.id })}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest transition-all border ${
                        active  ? 'text-white border-white/20 bg-white/10' :
                        passed  ? 'border-white/10 p-text-dim' :
                                  'border-white/[0.05] p-text-ghost hover:border-white/15'
                      }`}
                      style={active ? { borderColor: c.accent+'60', background: c.accent+'15', color: c.accent } : {}}
                    >
                      {passed && <Check size={8} />}
                      {c.label}
                    </button>
                    {i < columns.length - 1 && <div className="w-3 h-px p-bg-card-2" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Close */}
          <button onClick={onClose}
            className="p-2.5 rounded-full p-bg-card border p-border p-text-dim hover:p-text-hi hover:p-border-mid transition-all flex-shrink-0">
            <X size={14} />
          </button>
        </div>

        {/* ── Body: two columns ── */}
        <div className="relative z-10 flex flex-col lg:flex-row gap-0">

          {/* LEFT: main content */}
          <div className="flex-1 min-w-0 px-8 py-6 space-y-8 border-b lg:border-b-0 lg:border-r p-border">

            {/* Description */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-dim mb-3">Description</p>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                onBlur={() => onUpdate(task.id, { desc })}
                rows={3}
                placeholder="Add a description…"
                className="w-full bg-transparent text-sm font-light p-text-body leading-relaxed outline-none resize-none placeholder:text-white/15 border-b border-transparent focus:border-white/10 transition-colors"
              />
            </div>

            {/* Sub-tasks / child tasks */}
            {childTasks.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-dim mb-3 flex items-center gap-2">
                  <GitBranch size={10} /> Sub-tasks ({childTasks.length})
                </p>
                <div className="space-y-2">
                  {childTasks.map(ct => {
                    const cPct = ct.estimatedHours > 0 ? Math.round((ct.loggedHours / ct.estimatedHours) * 100) : 0;
                    const cCol = columns.find(c => c.id === ct.status)!;
                    return (
                      <div key={ct.id} className="flex items-center gap-3 p-3 p-bg-card border p-border rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cCol.accent }} />
                        <span className="flex-1 text-sm font-light p-text-body truncate">{ct.title}</span>
                        <div className="w-16 h-1 p-bg-card-2 rounded-full overflow-hidden flex-shrink-0">
                          <div className="h-full rounded-full" style={{ width: `${cPct}%`, background: cCol.accent }} />
                        </div>
                        <span className="text-xs font-mono p-text-ghost w-8 text-right">{cPct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Comments */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-dim mb-4 flex items-center gap-2">
                <MessageSquare size={10} /> Comments ({task.comments.length})
              </p>

              <div className="space-y-4 mb-5">
                {task.comments.map(c => {
                  const author = employees.find(e => e.id === c.authorId);
                  return (
                    <div key={c.id} className="flex gap-3">
                      {author && (
                        <img src={author.avatar} alt={author.name}
                          className="w-7 h-7 rounded-full object-cover grayscale flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-mono p-text-mid">{author?.name.split(' ')[0] ?? 'User'}</span>
                          <span className="text-xs p-text-ghost font-mono">{c.ts}</span>
                        </div>
                        <p className="text-sm font-light p-text-body leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  );
                })}
                {task.comments.length === 0 && (
                  <p className="text-xs p-text-ghost font-mono">No comments yet.</p>
                )}
              </div>

              {/* New comment */}
              <div className="flex gap-3">
                <img src={employees[0].avatar} alt=""
                  className="w-7 h-7 rounded-full object-cover grayscale flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addComment(); }}
                    rows={2}
                    placeholder="Add a comment… (⌘↵ to post)"
                    className={`${inp} resize-none`}
                  />
                  <div className="flex justify-end mt-2">
                    <button onClick={addComment} disabled={!commentText.trim()}
                      className="px-4 py-1.5 rounded-xl p-bg-card border p-border-mid text-xs font-mono uppercase tracking-widest p-text-mid hover:p-text-hi hover:bg-white/10 transition-all disabled:opacity-30">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-dim mb-4 flex items-center gap-2">
                <Paperclip size={10} /> Attachments ({task.attachments.length})
              </p>

              <div className="space-y-2 mb-4">
                {task.attachments.map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-3 p-bg-card border p-border rounded-xl group">
                    {a.kind === 'file'
                      ? <File size={14} className="p-text-dim flex-shrink-0" />
                      : <Link2 size={14} className="p-text-dim flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-light p-text-body truncate">{a.name}</p>
                      <p className="text-xs p-text-ghost font-mono">{a.size ?? a.url ?? ''} · {a.ts}</p>
                    </div>
                    <button onClick={() => removeAttachment(a.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg p-text-ghost hover:text-rose-400 transition-all">
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
                {task.attachments.length === 0 && (
                  <p className="text-xs p-text-ghost font-mono">No attachments.</p>
                )}
              </div>

              {/* Add attachment controls */}
              <div className="flex gap-2">
                <button onClick={() => { setAttachPanel(p => p === 'link' ? 'none' : 'link'); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border p-border p-text-dim hover:p-text-hi hover:p-border-mid text-xs font-mono uppercase tracking-widest transition-all">
                  <Link2 size={10} /> Add Link
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border p-border p-text-dim hover:p-text-hi hover:p-border-mid text-xs font-mono uppercase tracking-widest transition-all">
                  <Paperclip size={10} /> Attach File
                </button>
                <input ref={fileInputRef} type="file" className="hidden" onChange={addFile} />
              </div>

              {/* Link form */}
              <AnimatePresence>
                {attachPanel === 'link' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-3">
                    <div className="space-y-2 p-4 p-bg-card border p-border rounded-xl">
                      <input value={attachName} onChange={e => setAttachName(e.target.value)}
                        placeholder="Link name" className={inp} />
                      <input value={attachUrl} onChange={e => setAttachUrl(e.target.value)}
                        placeholder="https://" className={inp} />
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setAttachPanel('none')}
                          className="px-3 py-1.5 rounded-lg border p-border p-text-dim text-xs hover:p-text-hi transition-all">Cancel</button>
                        <button onClick={addLink} disabled={!attachName.trim()}
                          className="px-3 py-1.5 rounded-lg p-bg-card-2 border p-border-mid p-text-mid text-xs hover:p-text-hi transition-all disabled:opacity-30">Add</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: metadata sidebar */}
          <div className="lg:w-72 flex-shrink-0 px-6 py-6 space-y-6">

            {/* Assignee */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-ghost mb-3">Assignee</p>
              <div className="flex items-center gap-2.5">
                {emp && <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover grayscale" />}
                <span className="text-sm font-light p-text-body">{task.owner}</span>
              </div>
            </div>

            {/* Priority */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-ghost mb-3">Priority</p>
              <div className="flex gap-1.5 flex-wrap">
                {(Object.keys(priorityConfig) as Priority[]).map(p => (
                  <button key={p} onClick={() => onUpdate(task.id, { priority: p })}
                    className={`px-2.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest border transition-all ${
                      task.priority === p ? 'text-white' : 'p-text-ghost border-white/5 hover:border-white/15'
                    }`}
                    style={task.priority === p ? { borderColor: priorityConfig[p].color+'50', background: priorityConfig[p].color+'15', color: priorityConfig[p].color } : {}}>
                    {priorityConfig[p].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due date */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-ghost mb-3 flex items-center gap-1.5">
                <Calendar size={9} /> Due Date
              </p>
              <input
                value={task.due}
                onChange={e => onUpdate(task.id, { due: e.target.value })}
                className={inp}
                placeholder="Nov 30"
              />
            </div>

            {/* Tags */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-ghost mb-3 flex items-center gap-1.5">
                <Hash size={9} /> Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full text-xs font-mono p-bg-card border p-border p-text-dim uppercase tracking-widest">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Parent task */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-ghost mb-3 flex items-center gap-1.5">
                <GitBranch size={9} /> Parent Task
              </p>
              <select
                value={task.parentId ?? ''}
                onChange={e => onUpdate(task.id, { parentId: e.target.value || null })}
                className={inp}
                style={{ backgroundColor: 'var(--p-bg-input)' }}
              >
                <option value="">None</option>
                {tasks.filter(t => t.id !== task.id && t.parentId !== task.id).map(t => (
                  <option key={t.id} value={t.id} style={{ backgroundColor: 'var(--p-surface)' }}>
                    {t.title.slice(0, 36)}{t.title.length > 36 ? '…' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Divider */}
            <div className="h-px p-border" />

            {/* ── Effort fields ── */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-ghost mb-4 flex items-center gap-1.5">
                <TrendingUp size={9} /> Effort Tracking
              </p>

              <div className="space-y-3">
                {/* Story points */}
                <div className="flex items-center justify-between">
                  <label className="text-xs p-text-dim font-mono uppercase tracking-widest">Story Points</label>
                  <input
                    type="number" min={0}
                    value={task.storyPoints}
                    onChange={e => onUpdate(task.id, { storyPoints: parseInt(e.target.value) || 0 })}
                    className="w-20 text-right bg-white/[0.04] border border-white/[0.07] rounded-lg px-2 py-1 text-sm font-mono text-white outline-none focus:border-white/20"
                  />
                </div>

                {/* Estimated hours */}
                <div className="flex items-center justify-between">
                  <label className="text-xs p-text-dim font-mono uppercase tracking-widest">Est. Hours</label>
                  <input
                    type="number" min={0} step={0.5}
                    value={task.estimatedHours}
                    onChange={e => onUpdate(task.id, { estimatedHours: parseFloat(e.target.value) || 0 })}
                    className="w-20 text-right bg-white/[0.04] border border-white/[0.07] rounded-lg px-2 py-1 text-sm font-mono text-white outline-none focus:border-white/20"
                  />
                </div>

                {/* Logged hours — manual */}
                <div className="flex items-center justify-between">
                  <label className="text-xs p-text-dim font-mono uppercase tracking-widest">Logged</label>
                  <input
                    type="number" min={0} step={0.25}
                    value={loggedInput}
                    onChange={e => {
                      setLoggedInput(e.target.value);
                      onUpdate(task.id, { loggedHours: parseFloat(e.target.value) || 0 });
                    }}
                    className="w-20 text-right bg-white/[0.04] border border-white/[0.07] rounded-lg px-2 py-1 text-sm font-mono text-white outline-none focus:border-white/20"
                  />
                </div>

                {/* Progress bar */}
                {task.estimatedHours > 0 && (
                  <div>
                    <div className="flex justify-between text-xs font-mono p-text-ghost mb-1.5">
                      <span>Progress</span>
                      <span>{Math.min(Math.round((task.loggedHours / task.estimatedHours) * 100), 100)}%</span>
                    </div>
                    <div className="h-1.5 p-bg-card-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((task.loggedHours / task.estimatedHours) * 100, 100)}%` }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        style={{ background: col.accent }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Live timer ── */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] p-text-ghost mb-3 flex items-center gap-1.5">
                <Timer size={9} /> Live Timer
              </p>
              <div className="p-bg-card border p-border rounded-xl p-4">
                <div className="text-2xl font-mono text-white text-center mb-4 tracking-widest">
                  {fmtTimer(timerSecs)}
                </div>
                <div className="flex gap-2">
                  {!timerRunning ? (
                    <button onClick={() => setTimerRunning(true)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest hover:bg-emerald-500/25 transition-all">
                      <Play size={10} /> Start
                    </button>
                  ) : (
                    <button onClick={stopAndLog}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono uppercase tracking-widest hover:bg-rose-500/25 transition-all">
                      <Square size={10} /> Stop & Log
                    </button>
                  )}
                </div>
                {timerRunning && (
                  <p className="text-xs p-text-ghost text-center mt-2 font-mono">Logging to {task.owner}</p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="relative z-10 flex items-center justify-between px-8 py-4 border-t p-border">
          <div className="flex gap-2">
            <button onClick={() => onMove(task.id, 'left')} disabled={orderIdx === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border p-border p-text-dim text-xs font-mono uppercase tracking-widest hover:p-text-hi hover:p-border-mid transition-all disabled:opacity-20 disabled:cursor-not-allowed">
              <ChevronRight size={10} className="rotate-180" /> Previous
            </button>
            <button onClick={() => onMove(task.id, 'right')} disabled={orderIdx === columns.length - 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border p-border p-text-dim text-xs font-mono uppercase tracking-widest hover:p-text-hi hover:p-border-mid transition-all disabled:opacity-20 disabled:cursor-not-allowed">
              Next stage <ChevronRight size={10} />
            </button>
          </div>
          <p className="text-xs p-text-ghost font-mono">ID: {task.id}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Task Card (board) ──────────────────────────────────────────────────── */
function TaskCard({
  task, onMove, onOpen,
}: {
  task: Task;
  onMove: (id: string, dir: 'left' | 'right') => void;
  onOpen: (id: string) => void;
}) {
  const pCfg  = priorityConfig[task.priority];
  const col   = columns.find(c => c.id === task.status)!;
  const emp   = employees.find(e => e.id === task.ownerId);
  const pct   = task.estimatedHours > 0 ? Math.round((task.loggedHours / task.estimatedHours) * 100) : 0;
  const done  = task.status === 'resolved';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      whileHover={done ? {} : { y: -4 }}
      transition={{ duration: 0.4 }}
      onClick={() => onOpen(task.id)}
      className={`relative group rounded-[2rem] border overflow-hidden transition-colors duration-300 cursor-pointer ${
        done ? 'p-bg-card p-border opacity-50' : 'p-bg-card p-border hover:p-border-mid'
      }`}
      data-cursor="Open"
    >
      {!done && (
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[70px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: col.glow }} />
      )}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[2rem]"
        style={{ background: pCfg.color, opacity: done ? 0.25 : 0.7 }} />

      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1">
            {task.tags.map(tag => (
              <span key={tag} className="px-1.5 py-0.5 rounded-full text-xs font-mono p-bg-card-2 p-text-ghost border p-border uppercase tracking-widest">{tag}</span>
            ))}
          </div>
          <span className="text-xs font-mono uppercase tracking-widest flex-shrink-0" style={{ color: pCfg.color }}>
            {pCfg.label}
          </span>
        </div>

        <h4 className={`text-sm font-light leading-snug mb-1.5 ${done ? 'line-through p-text-dim' : 'text-white/90'}`}>
          {task.title}
        </h4>
        <p className="text-xs p-text-dim leading-relaxed mb-4 line-clamp-2">{task.desc}</p>

        {/* Story points badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono p-text-ghost px-1.5 py-0.5 rounded p-bg-card-2 border p-border">
            {task.storyPoints} pt{task.storyPoints !== 1 ? 's' : ''}
          </span>
          {task.comments.length > 0 && (
            <span className="flex items-center gap-1 text-xs p-text-ghost">
              <MessageSquare size={8} /> {task.comments.length}
            </span>
          )}
          {task.attachments.length > 0 && (
            <span className="flex items-center gap-1 text-xs p-text-ghost">
              <Paperclip size={8} /> {task.attachments.length}
            </span>
          )}
        </div>

        {!done && task.status !== 'backlog' && task.estimatedHours > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs font-mono p-text-ghost mb-1">
              <span>{task.loggedHours}h logged</span>
              <span>{task.estimatedHours}h est.</span>
            </div>
            <div className="h-[2px] p-bg-card-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
                className="h-full rounded-full" style={{ background: col.accent }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t p-border">
          <div className="flex items-center gap-1.5">
            {emp && <img src={emp.avatar} alt={emp.name} className="w-5 h-5 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70" />}
            <span className="text-xs p-text-lo font-light">{task.owner}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-mono p-text-dim">
              <Calendar size={8} /><span>{task.due}</span>
            </div>
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {task.status !== 'backlog' && (
                <button onClick={e => { e.stopPropagation(); onMove(task.id, 'left'); }}
                  className="w-5 h-5 rounded-full border p-border-mid flex items-center justify-center p-text-dim hover:p-text-hi transition-all"
                  data-cursor="Back">
                  <ChevronRight size={8} className="rotate-180" />
                </button>
              )}
              {task.status !== 'resolved' && (
                <button onClick={e => { e.stopPropagation(); onMove(task.id, 'right'); }}
                  className="w-5 h-5 rounded-full border p-border-mid flex items-center justify-center p-text-dim hover:p-text-hi transition-all"
                  data-cursor="Advance">
                  <ChevronRight size={8} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── New Task Modal ─────────────────────────────────────────────────────── */
function NewTaskModal({ tasks, onClose, onAdd }: { tasks: Task[]; onClose: () => void; onAdd: (t: Task) => void }) {
  const [form, setForm] = useState({
    title: '', desc: '', priority: 'medium' as Priority,
    ownerId: 'e1', due: '', tags: '', storyPoints: '', parentId: '',
  });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    const emp = employees.find(e => e.id === form.ownerId);
    onAdd({
      id: `t${Date.now()}`,
      title: form.title, desc: form.desc,
      status: 'backlog', priority: form.priority,
      owner: emp ? `${emp.name.split(' ')[0]} ${emp.name.split(' ')[1][0]}.` : 'Team',
      ownerId: form.ownerId,
      due: form.due || 'TBD',
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      storyPoints: parseInt(form.storyPoints) || 0,
      estimatedHours: 0, loggedHours: 0,
      parentId: form.parentId || null,
      comments: [], attachments: [],
    });
    onClose();
  };

  const inp = 'w-full rounded-2xl text-sm font-light outline-none transition-colors p-bg-card border p-border text-white placeholder:text-white/20 focus:border-white/20 px-4 py-3';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg rounded-[2rem] p-8 relative overflow-hidden border p-border-mid"
        style={{ backgroundColor: 'var(--p-surface)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-white text-xl font-light">New Task</h3>
          <button onClick={onClose} className="p-2.5 rounded-full p-bg-card border p-border p-text-dim hover:p-text-hi transition-all"><X size={14} /></button>
        </div>

        <div className="space-y-3 relative z-10">
          <input autoFocus value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleAdd()} placeholder="Task title…" className={inp} />
          <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
            placeholder="Description…" rows={2} className={`${inp} resize-none`} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest p-text-ghost block mb-2">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
                className={inp} style={{ backgroundColor: 'var(--p-bg-input)' }}>
                {(['critical','high','medium','low'] as Priority[]).map(p => (
                  <option key={p} value={p} style={{ backgroundColor: 'var(--p-surface)' }}>{priorityConfig[p].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest p-text-ghost block mb-2">Assignee</label>
              <select value={form.ownerId} onChange={e => setForm(f => ({ ...f, ownerId: e.target.value }))}
                className={inp} style={{ backgroundColor: 'var(--p-bg-input)' }}>
                {employees.map(e => <option key={e.id} value={e.id} style={{ backgroundColor: 'var(--p-surface)' }}>{e.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest p-text-ghost block mb-2">Story Pts</label>
              <input type="number" min={0} value={form.storyPoints} onChange={e => setForm(f => ({ ...f, storyPoints: e.target.value }))}
                placeholder="0" className={inp} />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest p-text-ghost block mb-2">Due</label>
              <input value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))}
                placeholder="Nov 30" className={inp} />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest p-text-ghost block mb-2">Tags</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="Eng, UX" className={inp} />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-widest p-text-ghost block mb-2">Parent Task (optional)</label>
            <select value={form.parentId} onChange={e => setForm(f => ({ ...f, parentId: e.target.value }))}
              className={inp} style={{ backgroundColor: 'var(--p-bg-input)' }}>
              <option value="">None</option>
              {tasks.map(t => <option key={t.id} value={t.id} style={{ backgroundColor: 'var(--p-surface)' }}>{t.title.slice(0,40)}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6 relative z-10">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border p-border p-text-dim text-sm hover:p-text-hi hover:p-border-mid transition-all">Cancel</button>
          <button onClick={handleAdd} disabled={!form.title.trim()}
            className="flex-1 py-3 rounded-2xl p-bg-card border p-border-mid text-white text-sm hover:bg-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            Create Task
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Tasks Page ────────────────────────────────────────────────────── */
export function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks]             = useState<Task[]>(initialTasks);
  const [showModal, setShowModal]     = useState(false);
  const [openTaskId, setOpenTaskId]   = useState<string | null>(null);
  const [filterOwner, setFilterOwner] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<Priority | null>(null);
  const [view, setView]               = useState<'board' | 'list'>('board');

  const openTask = openTaskId ? tasks.find(t => t.id === openTaskId) ?? null : null;

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  }, []);

  const moveTask = useCallback((id: string, dir: 'left' | 'right') => {
    const order: Status[] = ['backlog', 'active', 'review', 'resolved'];
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const idx    = order.indexOf(t.status);
      const newIdx = dir === 'right' ? Math.min(idx+1, order.length-1) : Math.max(idx-1, 0);
      return { ...t, status: order[newIdx] };
    }));
  }, []);

  const addTask = useCallback((t: Task) => setTasks(prev => [t, ...prev]), []);

  const filtered = tasks.filter(t => {
    if (filterOwner    && t.ownerId   !== filterOwner)    return false;
    if (filterPriority && t.priority  !== filterPriority) return false;
    return true;
  });

  const stats = {
    active:   tasks.filter(t => t.status === 'active').length,
    critical: tasks.filter(t => t.priority === 'critical' && t.status !== 'resolved').length,
    done:     tasks.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="page-wrap">

      {/* Hero */}
      <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
        className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b p-border pb-12">
        <div>
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 p-text-dim hover:p-text-hi text-sm mb-4 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <p className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-2">
            <Layers size={14} className="text-emerald-400" /> Operational Matrix
          </p>
          <h1 className="hero-title font-light text-white">
            Active <span className="p-text-dim italic font-serif">Vectors</span>
          </h1>
        </div>
        <div className="flex items-end gap-12">
          <div className="flex gap-8 text-right">
            {[
              { label: 'In Flux',     val: stats.active,   color: '#38bdf8' },
              { label: 'Critical',    val: stats.critical, color: '#f43f5e' },
              { label: 'Transmitted', val: stats.done,     color: '#10b981' },
            ].map(s => (
              <div key={s.label}>
                <p className="p-text-lo uppercase tracking-[0.2em] text-xs mb-2">{s.label}</p>
                <p className="text-4xl font-light" style={{ color: s.color }}>{s.val}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setShowModal(true)}
            className="w-16 h-16 rounded-full p-bg-card border p-border-mid flex items-center justify-center text-white hover:p-border-hi transition-all duration-500 group" data-cursor="New Task">
            <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2, duration:0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex gap-1 p-1 p-bg-card border p-border rounded-xl">
          {(['board','list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-5 py-2 rounded-lg text-xs uppercase tracking-widest font-medium transition-all ${view === v ? 'bg-white/10 text-white' : 'p-text-dim hover:p-text-hi'}`}>
              {v === 'board' ? 'Board' : 'List'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs uppercase tracking-[0.12em] p-text-dim font-mono mr-1">Filter ·</span>
          {employees.slice(0, 5).map(e => (
            <button key={e.id} onClick={() => setFilterOwner(filterOwner === e.id ? null : e.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs transition-all border ${filterOwner === e.id ? 'bg-white/10 p-border-hi text-white' : 'border-white/5 p-text-lo hover:p-border-mid'}`}>
              <img src={e.avatar} alt={e.name} className="w-4 h-4 rounded-full object-cover grayscale" />
              {e.name.split(' ')[0]}
            </button>
          ))}
          <div className="w-px h-4 p-bg-pill mx-1" />
          {(['critical','high'] as Priority[]).map(p => (
            <button key={p} onClick={() => setFilterPriority(filterPriority === p ? null : p)}
              className={`px-2.5 py-1.5 rounded-full text-xs uppercase tracking-widest transition-all border ${filterPriority === p ? 'text-white' : 'border-white/5 p-text-lo hover:border-white/10'}`}
              style={filterPriority === p ? { borderColor: priorityConfig[p].color+'60', background: priorityConfig[p].color+'12', color: priorityConfig[p].color } : {}}>
              {priorityConfig[p].label}
            </button>
          ))}
          {(filterOwner || filterPriority) && (
            <button onClick={() => { setFilterOwner(null); setFilterPriority(null); }}
              className="px-2.5 py-1.5 rounded-full text-xs border p-border p-text-dim hover:p-text-hi flex items-center gap-1 transition-all">
              <X size={9} /> Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Board */}
      {view === 'board' && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="p-text-ghost text-sm font-light mb-3">No tasks match your filters.</p>
          <button onClick={() => { setFilterOwner(null); setFilterPriority(null); }}
            className="text-xs font-mono uppercase tracking-widest text-cyan-400/60 hover:text-cyan-400 transition-colors">
            Clear filters
          </button>
        </div>
      )}
      {view === 'board' && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((col, colIdx) => {
            const colTasks = filtered.filter(t => t.status === col.id);
            return (
              <motion.div key={col.id}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: colIdx*0.08, duration:0.6, ease:[0.16,1,0.3,1] }}
                className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-4 border-b p-border">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col.accent }} />
                      <h3 className="p-text-lo uppercase tracking-[0.2em] text-sm font-semibold">{col.label}</h3>
                    </div>
                    <p className="text-xs p-text-ghost font-mono ml-4">{col.sub}</p>
                  </div>
                  <span className="text-xs font-mono p-text-dim p-bg-card px-2 py-0.5 rounded-full border p-border">{colTasks.length}</span>
                </div>
                <AnimatePresence>
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onMove={moveTask} onOpen={setOpenTaskId} />
                  ))}
                </AnimatePresence>
                {colTasks.length === 0 && (
                  <div className="border border-dashed border-white/[0.07] rounded-[2rem] p-8 text-center">
                    <p className="text-xs uppercase tracking-widest p-text-ghost font-mono">Empty</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* List */}
      {view === 'list' && (
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}
          className="p-bg-card border p-border rounded-[2rem] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b p-border">
                {['Task','Points','Owner','Priority','Status','Due','Progress'].map(h => (
                  <th key={h} className="text-left text-xs uppercase tracking-[0.12em] p-text-ghost font-mono py-4 px-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((task, i) => {
                const pCfg = priorityConfig[task.priority];
                const col  = columns.find(c => c.id === task.status)!;
                const emp  = employees.find(e => e.id === task.ownerId);
                const pct  = task.estimatedHours > 0 ? Math.round((task.loggedHours / task.estimatedHours) * 100) : 0;
                return (
                  <tr key={task.id} onClick={() => setOpenTaskId(task.id)}
                    className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <td className="py-4 px-5">
                      <p className={`text-sm font-light ${task.status === 'resolved' ? 'line-through p-text-ghost' : 'p-text-body'}`}>{task.title}</p>
                      <p className="text-xs p-text-ghost mt-0.5 font-mono">{task.tags.join(' · ')}</p>
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-xs font-mono p-text-dim px-2 py-0.5 p-bg-card-2 rounded border p-border">{task.storyPoints}pt</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        {emp && <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover grayscale" />}
                        <span className="p-text-mid text-sm font-light">{task.owner}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-xs font-mono uppercase tracking-widest" style={{ color: pCfg.color }}>{pCfg.label}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-mono" style={{ color: col.accent }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: col.accent }} />
                        {col.label}
                      </span>
                    </td>
                    <td className="py-4 px-5 p-text-lo text-xs font-mono">{task.due}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 p-bg-card-2 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width:`${pct}%`, background: col.accent }} />
                        </div>
                        <span className="text-xs font-mono p-text-ghost">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showModal && <NewTaskModal tasks={tasks} onClose={() => setShowModal(false)} onAdd={addTask} />}
      </AnimatePresence>
      <AnimatePresence>
        {openTask && (
          <TaskDetail
            task={openTask} tasks={tasks}
            onClose={() => setOpenTaskId(null)}
            onUpdate={updateTask}
            onMove={(id, dir) => { moveTask(id, dir); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
