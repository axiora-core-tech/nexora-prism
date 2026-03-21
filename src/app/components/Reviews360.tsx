import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Star, MessageSquare, ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import { employees } from '../mockData';
import { NavLink } from 'react-router';

const scoreLabels = ['communication', 'technical', 'leadership', 'collaboration', 'innovation'] as const;
const scoreColors: Record<string, string> = {
  communication: '#38bdf8',
  technical:     '#c084fc',
  leadership:    '#f59e0b',
  collaboration: '#10b981',
  innovation:    '#f43f5e',
};

function RadarWeb({ scores }: { scores: Record<string, number> }) {
  const size = 140; const cx = 70; const cy = 70; const r = 54;
  const keys = scoreLabels; const n = keys.length;
  const pts = keys.map((k, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const val = (scores[k] || 0) / 100;
    return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle), key: k };
  });
  const grid = (f: number) => keys.map((_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return `${cx + r * f * Math.cos(angle)},${cy + r * f * Math.sin(angle)}`;
  }).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25,0.5,0.75,1].map(f => (
        <polygon key={f} points={grid(f)} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      ))}
      {keys.map((_,i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />;
      })}
      <polygon points={pts.map(p => `${p.x},${p.y}`).join(' ')}
        fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.5" strokeLinejoin="round" />
      {pts.map(p => <circle key={p.key} cx={p.x} cy={p.y} r="2.5" fill="#38bdf8" />)}
    </svg>
  );
}

function ResonanceCard({ review, expanded, onToggle }: { review: any; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="relative bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden group hover:border-white/10 transition-all duration-500">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000" />

      <button onClick={onToggle} className="w-full flex items-center justify-between p-7 text-left relative z-10" data-cursor="Expand Node">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-medium text-white/70">
            {review.reviewer.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="text-white/90 text-sm font-light">{review.reviewer}</p>
            <p className="text-xs uppercase tracking-widest text-white/30 mt-0.5 font-mono">{review.relation} // {review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Resonance</p>
            <p className="text-2xl font-light text-white">{review.overall}</p>
          </div>
          {expanded ? <ChevronUp size={13} className="text-white/30" /> : <ChevronDown size={13} className="text-white/30" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="px-7 pb-7 border-t border-white/5 relative z-10">
              <div className="flex flex-col md:flex-row gap-8 mt-6">
                <div className="flex-shrink-0 flex flex-col items-center gap-5">
                  <RadarWeb scores={review.scores} />
                  <div className="space-y-2 w-full">
                    {scoreLabels.map(k => (
                      <div key={k} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: scoreColors[k] }} />
                        <span className="text-xs uppercase tracking-widest w-20 capitalize text-white/40">{k}</span>
                        <div className="flex-1 h-px bg-white/5">
                          <div className="h-full" style={{ width: `${review.scores[k]}%`, background: scoreColors[k] }} />
                        </div>
                        <span className="text-xs font-mono text-white/40">{review.scores[k]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Star size={9} className="text-emerald-400" />
                      <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">Signal — Strengths</span>
                    </div>
                    <p className="text-white/60 text-sm font-light font-serif italic leading-relaxed">"{review.strengths}"</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare size={9} className="text-amber-400" />
                      <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">Signal — Growth Vectors</span>
                    </div>
                    <p className="text-white/60 text-sm font-light font-serif italic leading-relaxed">"{review.improvements}"</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Reviews360() {
  const [selectedEmp, setSelectedEmp] = useState(employees[0].id);
  const [expandedReview, setExpandedReview] = useState<number | null>(0);

  const emp = employees.find(e => e.id === selectedEmp)!;
  const reviews = emp.reviews360 || [];
  const avgScores = reviews.length > 0
    ? scoreLabels.reduce((acc, k) => {
        acc[k] = Math.round(reviews.reduce((s, r) => s + (r.scores[k] || 0), 0) / reviews.length);
        return acc;
      }, {} as Record<string, number>)
    : {};
  const overallAvg = reviews.length > 0
    ? Math.round(reviews.reduce((s, r) => s + r.overall, 0) / reviews.length)
    : 0;
  const totalReviews = employees.reduce((s, e) => s + (e.reviews360 || []).length, 0);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-12"
      >
        <div>
          <p className="text-white/40 uppercase tracking-[0.2em] text-sm font-semibold mb-6 flex items-center gap-2">
            <Network size={14} className="text-indigo-400" /> Multi-Source Feedback Intelligence
          </p>
          <h1 className="text-7xl md:text-9xl font-light tracking-tighter text-white leading-[0.9]">
            Network <span className="text-white/30 italic font-serif">Resonance</span>
          </h1>
        </div>
        <div className="flex gap-16 text-right">
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-xs mb-2">Avg Score</p>
            <p className="text-4xl font-light text-cyan-400">{overallAvg > 0 ? overallAvg : '—'}</p>
          </div>
          <div>
            <p className="text-white/40 uppercase tracking-[0.2em] text-xs mb-2">Total Nodes</p>
            <p className="text-4xl font-light text-white">{totalReviews}</p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Node selector */}
        <div className="lg:w-72 flex-shrink-0">
          <p className="text-xs uppercase tracking-widest text-white/20 mb-4 font-mono">Select Node</p>
          <div className="space-y-2">
            {employees.map(e => {
              const revs = e.reviews360 || [];
              const avg = revs.length > 0 ? Math.round(revs.reduce((s, r) => s + r.overall, 0) / revs.length) : 0;
              return (
                <motion.button
                  key={e.id}
                  onClick={() => { setSelectedEmp(e.id); setExpandedReview(null); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-[1.5rem] border transition-all text-left group ${
                    selectedEmp === e.id
                      ? 'bg-white/10 border-white/20'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/5'
                  }`}
                  data-cursor="Select Node"
                >
                  <img src={e.avatar} alt={e.name} className="w-9 h-9 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm font-light truncate">{e.name}</p>
                    <p className="text-xs uppercase tracking-widest text-white/30 mt-0.5 truncate font-mono">{e.department}</p>
                  </div>
                  {avg > 0 && (
                    <span className={`text-sm font-mono flex-shrink-0 ${avg >= 85 ? 'text-emerald-400' : avg >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {avg}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Review detail */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEmp}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Composite summary */}
              {reviews.length > 0 && (
                <div className="relative bg-white/5 border border-white/5 rounded-[2rem] p-8 mb-6 overflow-hidden group">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000" />
                  <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                    <RadarWeb scores={avgScores} />
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <div>
                          <h2 className="text-white text-xl font-light leading-none">{emp.name.split(' ')[0]}</h2>
                          <h2 className="text-white/30 font-serif italic text-sm leading-none mt-0.5">{emp.name.split(' ')[1]}</h2>
                          <NavLink
                            to={`/app/employee/${emp.id}`}
                            className="inline-flex items-center gap-1 mt-3 text-xs uppercase tracking-widest text-white/30 hover:text-cyan-400 transition-colors font-mono"
                          >
                            View full profile <ArrowUpRight size={9} />
                          </NavLink>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Composite Resonance</p>
                          <p className="text-4xl font-light text-white">{overallAvg}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {scoreLabels.map(k => (
                          <div key={k} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: scoreColors[k] }} />
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs uppercase tracking-widest capitalize text-white/30">{k}</span>
                                <span className="text-xs font-mono" style={{ color: scoreColors[k] }}>{avgScores[k]}</span>
                              </div>
                              <div className="h-px bg-white/5">
                                <div className="h-full" style={{ width: `${avgScores[k]}%`, background: scoreColors[k] }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Individual nodes */}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-white/20 mb-4 font-mono">{reviews.length} Reviewer Node{reviews.length !== 1 ? 's' : ''}</p>
                {reviews.map((review, i) => (
                  <ResonanceCard
                    key={i}
                    review={review}
                    expanded={expandedReview === i}
                    onToggle={() => setExpandedReview(expandedReview === i ? null : i)}
                  />
                ))}
                {reviews.length === 0 && (
                  <div className="text-center py-20 text-white/20">
                    <Network size={28} className="mx-auto mb-4 opacity-30" />
                    <p className="text-xs font-mono uppercase tracking-widest">No resonance nodes detected</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
