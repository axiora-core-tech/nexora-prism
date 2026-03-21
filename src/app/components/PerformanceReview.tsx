import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Star, MessageSquare, ChevronDown, ChevronUp, ArrowUpRight,
         Target, Brain, Heart, Users, Zap, CheckCircle2, ChevronRight,
         ArrowLeft, Crosshair, PenLine } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { employees } from '../mockData';

/* ─── Shared types & constants ──────────────────────────────────────────── */
const SCORE_KEYS = ['communication','technical','leadership','collaboration','innovation'] as const;
type ScoreKey = typeof SCORE_KEYS[number];

const scoreConfig: Record<ScoreKey, { label: string; color: string; Icon: React.ElementType; desc: string }> = {
  communication: { label: 'Communication', color: '#38bdf8', Icon: MessageSquare, desc: 'Clarity & dialogue' },
  technical:     { label: 'Technical',     color: '#c084fc', Icon: Brain,         desc: 'Depth & precision' },
  leadership:    { label: 'Leadership',    color: '#f59e0b', Icon: Star,          desc: 'Influence & ownership' },
  collaboration: { label: 'Collaboration', color: '#10b981', Icon: Users,         desc: 'Synergy & support' },
  innovation:    { label: 'Innovation',    color: '#f43f5e', Icon: Zap,           desc: 'Novel thinking' },
};

const SCORE_COLORS = Object.fromEntries(SCORE_KEYS.map(k => [k, scoreConfig[k].color]));

type Phase = 'select' | 'score' | 'write' | 'confirm';
type PanelMode = 'reviews' | 'write';

/* ─── Radar web ─────────────────────────────────────────────────────────── */
function RadarWeb({ scores, size = 140 }: { scores: Record<string,number>; size?: number }) {
  const cx = size/2, cy = size/2, r = size * 0.38;
  const n = SCORE_KEYS.length;
  const pts = SCORE_KEYS.map((k, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const v = (scores[k] || 0) / 100;
    return { x: cx + r * v * Math.cos(a), y: cy + r * v * Math.sin(a), key: k };
  });
  const grid = (f: number) => SCORE_KEYS.map((_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return `${cx + r * f * Math.cos(a)},${cy + r * f * Math.sin(a)}`;
  }).join(' ');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25,0.5,0.75,1].map(f => (
        <polygon key={f} points={grid(f)} fill="none" stroke="var(--p-chart-grid)" strokeWidth="0.5" />
      ))}
      {SCORE_KEYS.map((_,i) => {
        const a = (Math.PI*2*i)/n - Math.PI/2;
        return <line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(a)} y2={cy+r*Math.sin(a)} stroke="var(--p-chart-grid)" strokeWidth="0.5" />;
      })}
      <polygon points={pts.map(p=>`${p.x},${p.y}`).join(' ')}
        fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.5" strokeLinejoin="round" />
      {pts.map(p => <circle key={p.key} cx={p.x} cy={p.y} r="2.5" fill="#38bdf8" />)}
    </svg>
  );
}

/* ─── Score arc ─────────────────────────────────────────────────────────── */
function ScoreArc({ value, color, size=72 }: { value:number; color:string; size?:number }) {
  const r = size*0.4, circ = 2*Math.PI*r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} stroke="var(--p-chart-grid)" strokeWidth="3" fill="none"/>
      <motion.circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="3"
        strokeLinecap="round" fill="none" strokeDasharray={`${circ} ${circ}`}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (circ * value) / 100 }}
        transition={{ duration: 1.2, ease: [0.16,1,0.3,1] }} />
    </svg>
  );
}

/* ─── Review card (expandable) ──────────────────────────────────────────── */
function ReviewCard({ review, expanded, onToggle }: { review:any; expanded:boolean; onToggle:()=>void }) {
  return (
    <div className="relative p-bg-card border p-border rounded-[2rem] overflow-hidden group hover:p-border-mid transition-all duration-500">
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none" />
      <button onClick={onToggle} className="w-full flex items-center justify-between p-5 text-left relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full p-bg-pill border p-border-mid flex items-center justify-center text-xs font-medium p-text-body">
            {review.reviewer.split(' ').map((n:string)=>n[0]).join('')}
          </div>
          <div>
            <p className="p-text-body text-sm font-light">{review.reviewer}</p>
            <p className="text-xs uppercase tracking-widest p-text-dim mt-0.5 font-mono">{review.relation} · {review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest p-text-dim mb-1">Overall</p>
            <p className="text-xl font-light text-white">{review.overall}</p>
          </div>
          {expanded ? <ChevronUp size={12} className="p-text-dim" /> : <ChevronDown size={12} className="p-text-dim" />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:0.3 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t p-border relative z-10">
              <div className="mt-5 space-y-5">
                {/* Score bars — full width, no radar competing for space */}
                <div className="space-y-2">
                  {SCORE_KEYS.map(k => (
                    <div key={k} className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-widest w-24 flex-shrink-0 capitalize p-text-lo">{k}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--p-bg-card-2)' }}>
                        <div className="h-full rounded-full" style={{ width:`${review.scores[k]}%`, background: SCORE_COLORS[k] }} />
                      </div>
                      <span className="text-xs font-mono p-text-mid w-7 text-right flex-shrink-0">{review.scores[k]}</span>
                    </div>
                  ))}
                </div>
                {/* Qualitative notes */}
                {(review.strengths || review.improvements) && (
                  <div className="space-y-3 pt-3 border-t p-border">
                    {review.strengths && (
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Star size={8} className="text-emerald-400" />
                          <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">Strengths</span>
                        </div>
                        <p className="p-text-mid text-sm font-light font-serif italic leading-relaxed">"{review.strengths}"</p>
                      </div>
                    )}
                    {review.improvements && (
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <MessageSquare size={8} className="text-amber-400" />
                          <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">Growth Areas</span>
                        </div>
                        <p className="p-text-mid text-sm font-light font-serif italic leading-relaxed">"{review.improvements}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Write-review sliding panel ────────────────────────────────────────── */
function WritePanel({ emp, onClose, onDone }: { emp:any; onClose:()=>void; onDone:()=>void }) {
  const [phase, setPhase] = useState<Phase>('score');
  const [relation, setRelation] = useState('peer');
  const [scores, setScores] = useState<Record<string,number>>({
    communication:75, technical:75, leadership:70, collaboration:75, innovation:75,
  });
  const [strengths, setStrengths]       = useState('');
  const [improvements, setImprovements] = useState('');
  const composite = Math.round(Object.values(scores).reduce((s,v)=>s+v,0) / SCORE_KEYS.length);

  const pulseStyle = `@keyframes pr-pulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.4);opacity:0}}`;

  if (phase === 'done') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
        <style dangerouslySetInnerHTML={{ __html: pulseStyle }} />
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border border-emerald-500/30"
            style={{ animation: 'pr-pulse 2.5s ease-in-out infinite', willChange:'transform,opacity' }} />
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 size={28} className="text-emerald-400" />
          </div>
        </div>
        <p className="text-xs uppercase tracking-widest p-text-dim mb-3 font-mono">Review Submitted</p>
        <h3 className="text-2xl font-light text-white mb-2">Review <span className="p-text-dim font-serif italic">Recorded</span></h3>
        <p className="p-text-lo text-sm mb-1">Your review for <span className="p-text-body">{emp.name}</span> has been saved.</p>
        <p className="p-text-ghost text-xs font-mono uppercase tracking-widest mb-8">
          Composite: <span style={{ color: composite >= 85 ? '#10b981' : composite >= 70 ? '#f59e0b' : '#f43f5e' }}>{composite}</span>
        </p>
        <button onClick={onDone} className="px-6 py-2.5 rounded-full p-bg-card border p-border-mid p-text-mid text-sm hover:bg-white/10 hover:p-text-hi transition-all">
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: pulseStyle }} />

      {/* Panel header */}
      <div className="flex items-center justify-between px-6 py-5 border-b p-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover grayscale" />
          <div>
            <p className="text-sm font-light text-white">{emp.name}</p>
            <p className="text-xs p-text-dim font-mono uppercase tracking-widest">{emp.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Phase dots */}
          <div className="flex items-center gap-2">
            {(['score','write','confirm'] as Phase[]).map((p, i) => {
              const order = { score:0, write:1, confirm:2, done:3, select:0 };
              const done = order[phase] > i;
              const active = phase === p;
              return (
                <React.Fragment key={p}>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all ${active ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : done ? 'bg-white/40' : 'bg-white/10'}`} />
                  {i < 2 && <div className={`w-4 h-px ${done ? 'bg-white/30' : 'p-bg-card-2'}`} />}
                </React.Fragment>
              );
            })}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full p-bg-pill p-text-dim hover:p-text-hi transition-colors">
            <ArrowLeft size={14} />
          </button>
        </div>
      </div>

      {/* Panel body */}
      <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth:'none' }}>
        <AnimatePresence mode="wait">
          <motion.div key={phase}
            initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:-16 }} transition={{ duration:0.25 }}>

            {/* Phase: score */}
            {phase === 'score' && (
              <div className="space-y-4">
                {/* Relation */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[{val:'peer',l:'Peer'},{val:'manager',l:'Manager'},{val:'self',l:'Self'},{val:'direct-report',l:'Report'}].map(r => (
                    <button key={r.val} onClick={() => setRelation(r.val)}
                      className={`px-3 py-1.5 rounded-full border text-xs uppercase tracking-widest transition-all ${
                        relation === r.val ? 'bg-white/10 border-white/25 text-white' : 'p-border p-text-dim hover:p-border-mid'
                      }`}>{r.l}</button>
                  ))}
                </div>
                {SCORE_KEYS.map(k => {
                  const cfg = scoreConfig[k];
                  return (
                    <div key={k} className="p-bg-card border p-border rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative flex-shrink-0">
                          <ScoreArc value={scores[k]} color={cfg.color} size={52} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-light text-white">{scores[k]}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <cfg.Icon size={10} style={{ color: cfg.color }} />
                            <span className="text-xs uppercase tracking-widest font-mono" style={{ color: cfg.color }}>{cfg.label}</span>
                          </div>
                          <p className="p-text-dim text-xs">{cfg.desc}</p>
                        </div>
                        <span className="text-xs p-text-ghost font-mono">
                          {scores[k] >= 90 ? 'Exceptional' : scores[k] >= 75 ? 'Strong' : scores[k] >= 60 ? 'Nominal' : 'Needs work'}
                        </span>
                      </div>
                      <input type="range" min={1} max={100} value={scores[k]}
                        onChange={e => setScores(s => ({ ...s, [k]: parseInt(e.target.value) }))}
                        className="w-full" style={{ accentColor: cfg.color }} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Phase: write */}
            {phase === 'write' && (
              <div className="space-y-4">
                {[
                  { key:'strengths', val:strengths, set:setStrengths, label:'Key Strengths', color:'#10b981', Icon:Star, prompt:`What does ${emp.name.split(' ')[0]} do best?` },
                  { key:'improvements', val:improvements, set:setImprovements, label:'Growth Areas', color:'#f59e0b', Icon:Zap, prompt:'Where could they grow most?' },
                ].map(({ key, val, set, label, color, Icon, prompt }) => (
                  <div key={key} className="p-bg-card border p-border rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={10} style={{ color }} />
                      <span className="text-xs uppercase tracking-widest font-mono" style={{ color }}>{label}</span>
                    </div>
                    <p className="p-text-dim text-xs font-serif italic mb-3">"{prompt}"</p>
                    <textarea value={val} onChange={e => set(e.target.value)} rows={4}
                      className="w-full bg-transparent p-text-body text-sm font-light font-serif italic outline-none resize-none placeholder:text-white/15 leading-relaxed"
                      placeholder="Write your observations…" />
                  </div>
                ))}
              </div>
            )}

            {/* Phase: confirm */}
            {phase === 'confirm' && (
              <div>
                <div className="p-bg-card border p-border rounded-2xl p-5 mb-4">
                  {/* Score bars — clear label + number, no arcs competing in narrow panel */}
                  <div className="space-y-2.5 mb-4">
                    {SCORE_KEYS.map(k => {
                      const cfg = scoreConfig[k];
                      return (
                        <div key={k} className="flex items-center gap-3">
                          <span className="text-xs font-mono w-20 flex-shrink-0 uppercase tracking-widest p-text-dim">{cfg.label.slice(0,5)}</span>
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--p-bg-card-2)' }}>
                            <div className="h-full rounded-full" style={{ width:`${scores[k]}%`, background: cfg.color }} />
                          </div>
                          <span className="text-xs font-mono w-7 text-right flex-shrink-0" style={{ color: cfg.color }}>{scores[k]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between border-t p-border pt-3">
                    <span className="text-xs p-text-dim font-mono uppercase tracking-widest">{relation} signal</span>
                    <span className="text-xs font-mono" style={{ color: composite >= 85 ? '#10b981' : composite >= 70 ? '#f59e0b' : '#f43f5e' }}>
                      Composite {composite}
                    </span>
                  </div>
                </div>
                {strengths && (
                  <div className="p-bg-card border p-border rounded-2xl p-4 mb-3">
                    <p className="text-xs text-emerald-400 font-mono uppercase tracking-widest mb-2">Strengths</p>
                    <p className="p-text-mid text-sm font-serif italic leading-relaxed">"{strengths}"</p>
                  </div>
                )}
                {improvements && (
                  <div className="p-bg-card border p-border rounded-2xl p-4 mb-3">
                    <p className="text-xs text-amber-400 font-mono uppercase tracking-widest mb-2">Growth Areas</p>
                    <p className="p-text-mid text-sm font-serif italic leading-relaxed">"{improvements}"</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Panel footer */}
      <div className="flex gap-3 px-6 py-4 border-t p-border flex-shrink-0">
        {phase !== 'score' && (
          <button onClick={() => setPhase(phase === 'write' ? 'score' : 'write')}
            className="px-4 py-2.5 rounded-full border p-border p-text-dim text-sm hover:p-text-hi hover:p-border-mid transition-all">
            <ArrowLeft size={14} />
          </button>
        )}
        <button
          onClick={() => {
            if (phase === 'score')   setPhase('write');
            else if (phase === 'write')   setPhase('confirm');
            else if (phase === 'confirm') { setPhase('done' as Phase); onDone(); }
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full p-bg-card border p-border-mid p-text-mid text-sm hover:bg-white/10 hover:p-text-hi transition-all"
        >
          {phase === 'score' ? 'Add notes' : phase === 'write' ? 'Review' : 'Submit Review'}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export function PerformanceReview() {
  const navigate = useNavigate();
  const [selectedEmp, setSelectedEmp]     = useState(employees[0].id);
  const [expandedReview, setExpandedReview] = useState<number | null>(0);
  const [panelMode, setPanelMode]          = useState<PanelMode>('reviews');
  const [submitted, setSubmitted]          = useState(false);

  const emp     = employees.find(e => e.id === selectedEmp)!;
  const reviews = emp.reviews360 || [];
  const avgScores = reviews.length > 0
    ? SCORE_KEYS.reduce((acc, k) => {
        acc[k] = Math.round(reviews.reduce((s, r) => s + (r.scores[k] || 0), 0) / reviews.length);
        return acc;
      }, {} as Record<string, number>)
    : {};
  const overallAvg = reviews.length > 0
    ? Math.round(reviews.reduce((s, r) => s + r.overall, 0) / reviews.length) : 0;
  const totalReviews = employees.reduce((s, e) => s + (e.reviews360 || []).length, 0);

  const handleSelectEmp = (id: string) => {
    setSelectedEmp(id);
    setExpandedReview(null);
    setPanelMode('reviews');
    setSubmitted(false);
  };

  const handleWriteReview = (id: string) => {
    setSelectedEmp(id);
    setPanelMode('write');
    setSubmitted(false);
  };

  return (
    <div className="page-wrap">

      {/* Hero */}
      <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
        className="mb-16 flex flex-col md:flex-row justify-between items-end gap-12 border-b p-border pb-12">
        <div>
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 p-text-dim hover:p-text-hi text-sm mb-4 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <p className="p-text-lo uppercase tracking-[0.15em] text-sm font-semibold mb-6 flex items-center gap-2">
            <Network size={14} className="text-indigo-400" /> 360° Feedback & Reviews
          </p>
          <h1 className="hero-title font-light text-white whitespace-nowrap">
            Network <span className="p-text-dim italic font-serif">Resonance</span>
          </h1>
        </div>
        <div className="flex gap-16 text-right">
          <div>
            <p className="p-text-lo uppercase tracking-[0.15em] text-xs mb-2">Avg Score</p>
            <p className="text-4xl font-light text-cyan-400">{overallAvg > 0 ? overallAvg : '—'}</p>
          </div>
          <div>
            <p className="p-text-lo uppercase tracking-[0.15em] text-xs mb-2">Total Reviews</p>
            <p className="text-4xl font-light text-white">{totalReviews}</p>
          </div>
        </div>
      </motion.div>

      {/* Three-column layout */}
      <div className="review-layout min-h-[70vh]">

        {/* ── Col 1: Employee list ──────────────────────────────────────── */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest p-text-ghost font-mono mb-2">Team Members</p>
          {employees.map(e => {
            const revs = e.reviews360 || [];
            const avg  = revs.length > 0 ? Math.round(revs.reduce((s,r)=>s+r.overall,0)/revs.length) : 0;
            const isSelected = selectedEmp === e.id;
            return (
              <motion.div key={e.id}
                className={`group relative rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${
                  isSelected ? 'border-white/20 bg-white/8' : 'p-border p-bg-card hover:p-border-mid'
                }`}>
                <button onClick={() => handleSelectEmp(e.id)}
                  className="w-full flex items-center gap-3 p-3 text-left">
                  <img src={e.avatar} alt={e.name}
                    className="w-8 h-8 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="p-text-body text-sm font-light truncate">{e.name.split(' ')[0]}</p>
                    <p className="text-xs p-text-dim truncate font-mono">{e.department.split(' ')[0]}</p>
                  </div>
                  {avg > 0 && (
                    <span className={`text-xs font-mono flex-shrink-0 ${avg >= 85 ? 'text-emerald-400' : avg >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {avg}
                    </span>
                  )}
                </button>

                {/* Write review trigger — only on hover */}
                <motion.button
                  onClick={() => handleWriteReview(e.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 border-t p-border text-xs p-text-dim hover:text-cyan-400 hover:p-border-mid transition-all font-mono uppercase tracking-widest"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: isSelected ? 1 : 0, height: isSelected ? 'auto' : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <PenLine size={10} /> Write Review
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* ── Col 2: Review data OR write panel ────────────────────────── */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">

            {/* Reviews view */}
            {panelMode === 'reviews' && (
              <motion.div key="reviews"
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-20 }} transition={{ duration:0.35 }}>

                {/* Composite summary */}
                {reviews.length > 0 && (
                  <div className="relative p-bg-card border p-border rounded-[2rem] p-6 mb-5 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
                    <div className="relative z-10">
                      {/* Employee header */}
                      <div className="flex items-center gap-4 mb-5">
                        <img src={emp.avatar} alt={emp.name}
                          className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-white text-lg font-light leading-none">{emp.name.split(' ')[0]}</h2>
                            <h2 className="p-text-dim font-serif italic text-lg font-light leading-none">{emp.name.split(' ')[1]}</h2>
                            <NavLink to={`/app/employee/${emp.id}`}
                              className="flex-shrink-0 p-1.5 rounded-full p-bg-pill border p-border p-text-dim hover:text-cyan-400 hover:border-cyan-400/30 transition-all">
                              <ArrowUpRight size={12} />
                            </NavLink>
                          </div>
                        </div>
                        <div className="ml-auto text-right flex-shrink-0">
                          <p className="text-xs uppercase tracking-widest p-text-dim mb-1">Composite</p>
                          <p className="text-3xl font-light text-white">{overallAvg}</p>
                        </div>
                      </div>
                      {/* Score bars — full width, no competing columns */}
                      <div className="space-y-2.5">
                        {SCORE_KEYS.map(k => (
                          <div key={k} className="flex items-center gap-3">
                            <span className="text-xs uppercase tracking-widest w-20 flex-shrink-0 capitalize p-text-dim">{k}</span>
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--p-bg-card-2)' }}>
                              <div className="h-full rounded-full" style={{ width:`${avgScores[k] ?? 0}%`, background: SCORE_COLORS[k] }} />
                            </div>
                            <span className="text-xs font-mono w-7 text-right flex-shrink-0" style={{ color: SCORE_COLORS[k] }}>
                              {avgScores[k] ?? '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Individual reviews */}
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-widest p-text-ghost font-mono mb-3">
                    {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
                  </p>
                  {reviews.map((review, i) => (
                    <ReviewCard key={i} review={review}
                      expanded={expandedReview === i}
                      onToggle={() => setExpandedReview(expandedReview === i ? null : i)} />
                  ))}
                  {reviews.length === 0 && (
                    <div className="text-center py-20 p-text-ghost">
                      <Network size={24} className="mx-auto mb-4 opacity-30" />
                      <p className="text-sm font-mono uppercase tracking-widest">No reviews yet</p>
                      <button onClick={() => setPanelMode('write')}
                        className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full border p-border p-text-dim text-xs hover:p-text-hi hover:p-border-mid transition-all uppercase tracking-widest font-mono">
                        <PenLine size={10} /> Write the first one
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Write panel */}
            {panelMode === 'write' && (
              <motion.div key="write"
                initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:30 }} transition={{ duration:0.35 }}
                className="h-full p-bg-card border p-border rounded-[2rem] overflow-hidden flex flex-col"
                style={{ minHeight: '60vh' }}>
                <WritePanel
                  emp={emp}
                  onClose={() => setPanelMode('reviews')}
                  onDone={() => { setTimeout(() => setPanelMode('reviews'), 2000); }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
