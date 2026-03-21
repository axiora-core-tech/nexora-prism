import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crosshair, Star, MessageSquare, Target, Brain, Heart, Users, Zap, ArrowUpRight, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router';
import { employees } from '../mockData';

const scoreLabels = [
  { key: 'communication', label: 'Communication', icon: MessageSquare, color: '#38bdf8', desc: 'Clarity & dialogue' },
  { key: 'technical',     label: 'Technical',     icon: Brain,          color: '#c084fc', desc: 'Depth & precision' },
  { key: 'leadership',    label: 'Leadership',    icon: Star,           color: '#f59e0b', desc: 'Influence & ownership' },
  { key: 'collaboration', label: 'Collaboration', icon: Users,          color: '#10b981', desc: 'Synergy & support' },
  { key: 'execution',     label: 'Execution',     icon: Target,         color: '#f43f5e', desc: 'Delivery & reliability' },
];

type Phase = 'orbit' | 'calibrate' | 'transmit' | 'confirm';

function ScoreArc({ value, color, size = 80 }: { value: number; color: string; size?: number }) {
  const r = size * 0.4;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * value) / 100;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="none"/>
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"
        strokeDasharray={`${circ} ${circ}`}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export function PerformanceReview() {
  const [phase, setPhase] = useState<Phase>('orbit');
  const [selectedEmp, setSelectedEmp] = useState<string | null>(null);
  const [relation, setRelation] = useState<string>('peer');
  const [scores, setScores] = useState<Record<string, number>>({
    communication: 75, technical: 75, leadership: 70, collaboration: 75, execution: 75,
  });
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [transmitted, setTransmitted] = useState(false);

  const emp = employees.find(e => e.id === selectedEmp);
  const composite = Math.round(Object.values(scores).reduce((s,v)=>s+v,0) / scoreLabels.length);

  // CSS keyframe for pulse rings — same visual, zero JS frames
  const pulseStyle = `
    @keyframes pr-pulse {
      0%,100% { transform: scale(1);   opacity: 0.5; }
      50%      { transform: scale(1.4); opacity: 0;   }
    }
    @media (prefers-reduced-motion: reduce) {
      [style*="pr-pulse"] { animation: none !important; }
    }
  `;

  if (transmitted && emp) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
          className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
          <style dangerouslySetInnerHTML={{ __html: pulseStyle }} />
          {/* Pulsing ring */}
          <div className="relative w-28 h-28 mb-12">
<div
              className="absolute inset-0 rounded-full border border-emerald-500/30"
              style={{ animation: 'pr-pulse 2.5s ease-in-out infinite', willChange: 'transform, opacity' }}
            />
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-6 font-mono">Review Submitted</p>
          <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-white leading-[0.9] mb-4">
            Review <span className="text-white/30 font-serif italic">Recorded</span>
          </h2>
          <p className="text-white/40 text-sm mb-2 font-light">
            Your review for <span className="text-white/80">{emp.name}</span> has been saved.
          </p>
          <p className="text-white/20 text-xs font-mono uppercase tracking-widest mb-16">
            Composite Score: <span style={{ color: composite >= 85 ? '#10b981' : composite >= 70 ? '#f59e0b' : '#f43f5e' }}>{composite}</span>
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => { setTransmitted(false); setPhase('orbit'); setSelectedEmp(null); setStrengths(''); setImprovements(''); }}
              className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 hover:text-white transition-all"
              data-cursor="New Review"
            >
              Submit Another
            </button>
            <NavLink to="/app" className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 hover:text-white transition-all" data-cursor="Home">
              Back to Dashboard
            </NavLink>
          </div>
        </motion.div>
      </div>
    );
  }

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
            <Crosshair size={14} className="text-cyan-400" /> Performance Transmission Protocol
          </p>
          <h1 className="text-7xl md:text-9xl font-light tracking-tighter text-white leading-[0.9]">
            Signal <span className="text-white/30 italic font-serif">Encode</span>
          </h1>
        </div>
        {/* Phase trail */}
        <div className="flex items-center gap-3 text-right">
          {(['orbit','calibrate','transmit','confirm'] as Phase[]).map((p, i) => {
            const labels: Record<Phase, string> = { orbit: 'Select', calibrate: 'Score', transmit: 'Write', confirm: 'Review' };
            const done = (['orbit','calibrate','transmit','confirm'] as Phase[]).indexOf(phase) > i;
            const active = phase === p;
            return (
              <React.Fragment key={p}>
                <div className={`flex flex-col items-center gap-1 ${active ? 'text-white' : done ? 'text-white/40' : 'text-white/15'}`}>
                  <div className={`w-2 h-2 rounded-full transition-all ${active ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : done ? 'bg-white/40' : 'bg-white/10'}`} />
                  <span className="text-xs uppercase tracking-widest font-mono whitespace-nowrap">{labels[p]}</span>
                </div>
                {i < 3 && <div className={`w-8 h-px ${done ? 'bg-white/30' : 'bg-white/5'}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
        >

          {/* PHASE 1: ORBIT — select target node */}
          {phase === 'orbit' && (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-12 font-mono">01 &nbsp;·&nbsp; Select Target Node</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {employees.map((e, i) => (
                  <motion.button
                    key={e.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    onClick={() => setSelectedEmp(e.id)}
                    className={`relative flex items-center gap-6 p-7 rounded-[2rem] border text-left transition-all duration-500 overflow-hidden group ${
                      selectedEmp === e.id
                        ? 'bg-white/10 border-white/25'
                        : 'bg-white/5 border-white/5 hover:border-white/15 hover:bg-white/8'
                    }`}
                    data-cursor="Acquire Target"
                  >
                    {selectedEmp === e.id && (
                      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/8 blur-[70px] rounded-full pointer-events-none" />
                    )}

                    <div className="relative flex-shrink-0">
                      <img src={e.avatar} alt={e.name}
                        className="w-16 h-16 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 relative z-10"/>
                      {selectedEmp === e.id && (
<div
                          className="absolute inset-0 rounded-full border border-cyan-400/50"
                          style={{ animation: 'pr-pulse 2s ease-in-out infinite', willChange: 'transform, opacity' }}
                        />
                      )}
                    </div>

                    <div className="flex-1 relative z-10">
                      <h3 className="text-white text-xl font-light leading-none">{e.name.split(' ')[0]}</h3>
                      <h3 className="text-white/30 font-serif italic text-sm leading-none mt-0.5">{e.name.split(' ')[1]}</h3>
                      <p className="text-xs uppercase tracking-widest text-white/30 mt-2 font-mono">{e.role} // {e.department}</p>
                    </div>

                    <div className="text-right flex-shrink-0 relative z-10">
                      <p className="text-xs uppercase tracking-widest text-white/20 mb-1">Efficiency</p>
                      <p className={`text-3xl font-light ${e.performanceScore >= 90 ? 'text-emerald-400' : e.performanceScore >= 80 ? 'text-cyan-400' : 'text-amber-400'}`}>
                        {e.performanceScore}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Relation selector */}
              <div className="mb-12">
                <p className="text-xs uppercase tracking-widest text-white/20 mb-5 font-mono">Review Context</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { val: 'manager',       label: 'Direct Manager' },
                    { val: 'peer',          label: 'Peer Node' },
                    { val: 'self',          label: 'Self Signal' },
                    { val: 'direct-report', label: 'Subordinate' },
                  ].map(r => (
                    <button
                      key={r.val}
                      onClick={() => setRelation(r.val)}
                      className={`px-5 py-2.5 rounded-full border text-xs uppercase tracking-widest transition-all ${
                        relation === r.val
                          ? 'bg-white/10 border-white/25 text-white'
                          : 'border-white/5 text-white/30 hover:border-white/10'
                      }`}
                      data-cursor={r.label}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setPhase('calibrate')}
                disabled={!selectedEmp}
                className="flex items-center gap-3 px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 hover:text-white hover:border-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                data-cursor="Calibrate"
              >
                Begin Calibration <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* PHASE 2: CALIBRATE — score sliders as abstract arcs */}
          {phase === 'calibrate' && emp && (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-4 font-mono">02 &nbsp;·&nbsp; Calibrate Signal Vectors</p>
              <div className="flex items-center gap-4 mb-16">
                <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"/>
                <div>
                  <span className="text-white font-light">{emp.name.split(' ')[0]} </span>
                  <span className="text-white/30 font-serif italic">{emp.name.split(' ')[1]}</span>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <p className="text-xs uppercase tracking-widest text-white/20 font-mono">Composite</p>
                  <p className={`text-4xl font-light ${composite >= 85 ? 'text-emerald-400' : composite >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {composite}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {scoreLabels.map((cat, i) => (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative bg-white/5 border border-white/5 rounded-[2rem] p-7 overflow-hidden group hover:border-white/10 transition-all duration-500 ${i === 4 ? 'md:col-span-2' : ''}`}
                    data-cursor={`Set ${cat.label}`}
                  >
                    {/* Ambient glow per category */}
                    <div className="absolute top-0 right-0 w-36 h-36 rounded-full blur-[50px] pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-700"
                      style={{ background: cat.color + '20' }} />

                    <div className="flex items-center gap-5 mb-6 relative z-10">
                      <div className="relative flex-shrink-0">
                        <ScoreArc value={scores[cat.key]} color={cat.color} size={72} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-light text-white">{scores[cat.key]}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <cat.icon size={12} style={{ color: cat.color }}/>
                          <span className="text-xs uppercase tracking-widest font-mono" style={{ color: cat.color }}>{cat.label}</span>
                        </div>
                        <p className="text-white/30 text-xs font-light">{cat.desc}</p>
                        <p className="text-xs uppercase tracking-widest text-white/20 mt-2 font-mono">
                          {scores[cat.key] >= 90 ? 'Exceptional' : scores[cat.key] >= 75 ? 'Strong' : scores[cat.key] >= 60 ? 'Nominal' : scores[cat.key] >= 40 ? 'Degraded' : 'Critical'}
                        </p>
                      </div>
                    </div>

                    <input
                      type="range" min={1} max={100} step={1}
                      value={scores[cat.key]}
                      onChange={e => setScores(s => ({ ...s, [cat.key]: parseInt(e.target.value) }))}
                      className="w-full relative z-10"
                      style={{ accentColor: cat.color }}
                    />
                    <div className="flex justify-between text-xs font-mono text-white/15 mt-1 relative z-10">
                      <span>Critical — 1</span><span>Exceptional — 100</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setPhase('orbit')}
                  className="px-8 py-3 rounded-full border border-white/5 text-white/30 text-sm hover:text-white hover:border-white/15 transition-all"
                  data-cursor="Return">
                  <ArrowLeft size={16} />
                </button>
                <button onClick={() => setPhase('transmit')}
                  className="flex items-center gap-3 px-10 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                  data-cursor="Transmit">
                  Transmit Signals <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          )}

          {/* PHASE 3: TRANSMIT — qualitative narrative */}
          {phase === 'transmit' && emp && (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-4 font-mono">03 &nbsp;·&nbsp; Encode Qualitative Signals</p>
              <div className="flex items-center gap-4 mb-16">
                <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"/>
                <span className="text-white/60 font-light">{emp.name}</span>
                <span className="text-white/20 text-xs font-mono ml-auto uppercase tracking-widest">Composite // {composite}</span>
              </div>

              <div className="space-y-8 mb-12">
                {[
                  { key: 'strengths', label: 'Key Strengths', sub: `What does ${emp.name.split(' ')[0]} do better than anyone on the team?`, color: '#10b981', icon: Star },
                  { key: 'improvements', label: 'Growth Nodes', sub: 'Which vectors, if amplified, yield highest system gain?', color: '#f59e0b', icon: Zap },
                ].map(({ key, label, sub, color, icon: Icon }) => (
                  <div key={key} className={`relative bg-white/5 border border-white/5 rounded-[2rem] p-8 overflow-hidden group transition-all duration-500 ${
                    (key === 'strengths' ? strengths : improvements) ? 'border-white/10' : ''
                  }`}>
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[70px] pointer-events-none opacity-20 group-focus-within:opacity-60 transition-opacity duration-700"
                      style={{ background: color + '30' }} />
                    <div className="flex items-center gap-3 mb-5 relative z-10">
                      <Icon size={12} style={{ color }}/>
                      <span className="text-xs uppercase tracking-widest font-mono" style={{ color }}>{label}</span>
                    </div>
                    <p className="text-white/30 text-xs font-light mb-4 relative z-10 font-serif italic">"{sub}"</p>
                    <textarea
                      value={key === 'strengths' ? strengths : improvements}
                      onChange={e => key === 'strengths' ? setStrengths(e.target.value) : setImprovements(e.target.value)}
                      rows={3}
                      className="w-full bg-transparent text-white/70 text-sm font-light font-serif italic outline-none resize-none placeholder:text-white/15 relative z-10 leading-relaxed"
                      placeholder="Encode your observations..."
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setPhase('calibrate')}
                  className="px-8 py-3 rounded-full border border-white/5 text-white/30 text-sm hover:text-white hover:border-white/15 transition-all"
                  data-cursor="Return">
                  <ArrowLeft size={16} />
                </button>
                <button onClick={() => setPhase('confirm')}
                  className="flex items-center gap-3 px-10 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                  data-cursor="Confirm">
                  Review Transmission <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          )}

          {/* PHASE 4: CONFIRM */}
          {phase === 'confirm' && emp && (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/20 mb-4 font-mono">04 &nbsp;·&nbsp; Confirm Transmission</p>
              <div className="relative bg-white/5 border border-white/5 rounded-[2rem] p-8 md:p-12 overflow-hidden mb-8 group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-1000" />

                {/* Subject */}
                <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/5 relative z-10">
                  <img src={emp.avatar} alt={emp.name} className="w-16 h-16 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"/>
                  <div>
                    <h2 className="text-white text-2xl font-light leading-none">{emp.name.split(' ')[0]}</h2>
                    <h2 className="text-white/30 font-serif italic text-xl leading-none mt-0.5">{emp.name.split(' ')[1]}</h2>
                    <p className="text-xs uppercase tracking-widest text-white/20 mt-2 font-mono">{relation} signal // {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="ml-auto text-right relative z-10">
                    <p className="text-xs uppercase tracking-widest text-white/20 mb-2 font-mono">Composite Signal</p>
                    <p className={`text-6xl font-light ${composite >= 85 ? 'text-emerald-400' : composite >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {composite}
                    </p>
                  </div>
                </div>

                {/* Score arcs */}
                <div className="grid grid-cols-5 gap-4 mb-10 relative z-10">
                  {scoreLabels.map(cat => (
                    <div key={cat.key} className="flex flex-col items-center gap-2" data-cursor={`${cat.label}: ${scores[cat.key]}`}>
                      <div className="relative">
                        <ScoreArc value={scores[cat.key]} color={cat.color} size={56}/>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-light text-white">{scores[cat.key]}</span>
                        </div>
                      </div>
                      <span className="text-xs uppercase tracking-widest text-white/30 font-mono text-center">{cat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Narratives */}
                {(strengths || improvements) && (
                  <div className="space-y-5 pt-8 border-t border-white/5 relative z-10">
                    {strengths && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Star size={9} className="text-emerald-400"/>
                          <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">Strength Vectors</span>
                        </div>
                        <p className="text-white/50 text-sm font-light font-serif italic leading-relaxed">"{strengths}"</p>
                      </div>
                    )}
                    {improvements && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Zap size={9} className="text-amber-400"/>
                          <span className="text-xs uppercase tracking-widest text-amber-400 font-mono">Growth Nodes</span>
                        </div>
                        <p className="text-white/50 text-sm font-light font-serif italic leading-relaxed">"{improvements}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setPhase('transmit')}
                  className="px-8 py-4 rounded-full border border-white/5 text-white/30 text-sm hover:text-white hover:border-white/15 transition-all"
                  data-cursor="Edit">
                  Back
                </button>
                <button
                  onClick={() => setTransmitted(true)}
                  className="group relative flex items-center gap-4 px-12 py-4 rounded-full overflow-hidden border border-white/10 text-sm transition-all hover:border-white/25"
                  data-cursor="Transmit"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative z-10 text-white/70 group-hover:text-white transition-colors">Submit Review</span>
                  <ArrowUpRight size={16} className="relative z-10 text-white/30 group-hover:text-cyan-400 transition-colors"/>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
