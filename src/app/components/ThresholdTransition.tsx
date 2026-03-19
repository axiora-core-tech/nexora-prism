import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';

// ─────────────────────────────────────────────────────────────
// THE THRESHOLD — A PERSON CRACKS OPEN
//
// Psychological principle:
//   A name is a person. Not a judgment.
//   Watching a name reveal its dimensions says:
//   this human being contains more than you knew.
//   That is not a product claim. It is a truth.
//
// The name used here is a stand-in for the first
// employee in the logged-in user's team. In production,
// pass the `name` prop from the auth context.
//
// 0.0s  White. Settling.
// 0.6s  Name appears — Playfair serif, enormous, ultra-light.
//        One full second of silence. Just a person's name.
// 1.7s  First crack draws through. Hairline. Glowing red.
//        "Output" appears beside it. Quiet.
// 2.1s  Second crack. Orange. "Risk."
// 2.4s  Third. Amber. "Return."
// 2.7s  Fourth. Green. "Growth."
// 3.0s  Fifth. Cyan. "Presence."
// 3.3s  Sixth. Violet. "Wellbeing."
//        Six dimensions. One person. The name is full of light.
// 3.7s  The pieces begin to drift — weightless, slow.
//        Not breaking. Opening.
// 4.8s  Fragments dissolve. Spectrum lines remain,
//        floating in the air where the name was.
// 5.3s  Lines converge inward. Darkness takes the page.
// 5.8s  The mark assembles on obsidian, slowly.
// 6.8s  "Prism" appears. Hold.
// 7.2s  Fade. App loads.
// ─────────────────────────────────────────────────────────────

type Phase =
  | 'white'
  | 'name'
  | 'cracking'
  | 'drifting'
  | 'dissolve'
  | 'converge'
  | 'mark'
  | 'wordmark'
  | 'out';

interface Props {
  name?: string; // First team member — defaults to "Alex Mercer"
}

const SPECTRUM = [
  { color: '#C8001A', dark: '#ff4433', label: 'Output'    },
  { color: '#D55000', dark: '#ff7733', label: 'Risk'      },
  { color: '#B88000', dark: '#ffcc22', label: 'Return'    },
  { color: '#006835', dark: '#00dd77', label: 'Growth'    },
  { color: '#005878', dark: '#00bbee', label: 'Presence'  },
  { color: '#3C0882', dark: '#9944ff', label: 'Wellbeing' },
];

// Crack paths in SVG viewBox 0 0 100 100 (percentage space)
// Designed to travel through different parts of a two-word name
const CRACK_PATHS = [
  'M 8,12   Q 22,38  18,72  Q 16,85  20,94',
  'M 30,5   Q 38,35  36,65  Q 34,80  38,96',
  'M 50,8   Q 52,42  54,68  Q 55,82  52,96',
  'M 68,6   Q 64,38  66,62  Q 67,80  65,95',
  'M 85,10  Q 80,40  82,65  Q 83,82  80,95',
  'M 12,30  Q 50,48  88,30',  // horizontal — cuts across both words
];

// Label positions beside each crack
const LABEL_POS = [
  { left: '3%',  top: '38%' },
  { left: '23%', top: '8%'  },
  { left: '44%', top: '6%'  },
  { left: '62%', top: '8%'  },
  { left: '79%', top: '38%' },
  { left: '3%',  top: '52%' },
];

// Fragment clip-paths — irregular shards that tile the name
const FRAGMENTS = [
  {
    clip: 'polygon(0% 0%, 32% 0%, 26% 32%, 0% 36%)',
    drift: { x: -90, y: -70, r: -7 },
  },
  {
    clip: 'polygon(32% 0%, 66% 0%, 58% 34%, 26% 32%)',
    drift: { x: -10, y: -90, r: 3 },
  },
  {
    clip: 'polygon(66% 0%, 100% 0%, 100% 30%, 58% 34%)',
    drift: { x: 100, y: -65, r: 8 },
  },
  {
    clip: 'polygon(0% 36%, 26% 32%, 34% 56%, 0% 62%)',
    drift: { x: -110, y: 15, r: -10 },
  },
  {
    clip: 'polygon(26% 32%, 58% 34%, 62% 58%, 34% 56%)',
    drift: { x: 0, y: -20, r: 5 },
  },
  {
    clip: 'polygon(58% 34%, 100% 30%, 100% 60%, 62% 58%)',
    drift: { x: 115, y: 25, r: 9 },
  },
  {
    clip: 'polygon(0% 62%, 34% 56%, 62% 58%, 100% 60%, 100% 100%, 0% 100%)',
    drift: { x: 10, y: 100, r: -4 },
  },
];

// Spectrum lines that emerge and converge to mark
const LINES = [
  { x1: 8,  y1: 15, x2: 50, y2: 90 },
  { x1: 25, y1: 5,  x2: 50, y2: 90 },
  { x1: 44, y1: 2,  x2: 50, y2: 90 },
  { x1: 56, y1: 2,  x2: 50, y2: 90 },
  { x1: 75, y1: 5,  x2: 50, y2: 90 },
  { x1: 92, y1: 15, x2: 50, y2: 90 },
];

export function ThresholdTransition({ name = 'Alex Mercer' }: Props) {
  const navigate = useNavigate();
  const [phase, setPhase]                 = useState<Phase>('white');
  const [cracksVisible, setCracksVisible] = useState<boolean[]>(
    Array(6).fill(false)
  );

  const firstName  = name.split(' ')[0] ?? name;
  const secondName = name.split(' ')[1] ?? '';

  useEffect(() => {
    const phases: [Phase, number][] = [
      ['name',     400  ],
      ['cracking', 1700 ],
      ['drifting', 3800 ],
      ['dissolve', 4900 ],
      ['converge', 5500 ],
      ['mark',     6000 ],
      ['wordmark', 6900 ],
      ['out',      7400 ],
    ];

    const timers = phases.map(([p, t]) =>
      setTimeout(() => setPhase(p), t)
    );

    // Cracks appear one at a time, 350ms apart
    const crackTimers = SPECTRUM.map((_, i) =>
      setTimeout(() => {
        setCracksVisible(prev => {
          const n = [...prev];
          n[i] = true;
          return n;
        });
      }, 1700 + i * 350)
    );

    const nav = setTimeout(() => navigate('/app'), 7900);

    return () => {
      timers.forEach(clearTimeout);
      crackTimers.forEach(clearTimeout);
      clearTimeout(nav);
    };
  }, [navigate]);

  // Background — hard cuts only, one slow transition
  const bg =
    ['white','name','cracking','drifting'].includes(phase) ? '#f4f2ed' : '#030303';

  const showName    = ['name','cracking','drifting'].includes(phase);
  const showCracks  = ['cracking','drifting'].includes(phase);
  const showDrift   = phase === 'drifting';
  const showLines   = ['dissolve','converge'].includes(phase);
  const showMark    = ['mark','wordmark','out'].includes(phase);
  const isOut       = phase === 'out';

  return (
    <div style={{
      position:   'fixed', inset: 0, zIndex: 9999,
      background: bg,
      overflow:   'hidden',
      display:    'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Single deliberate background transition — paper to obsidian
      transition: phase === 'dissolve' ? 'background 0.9s ease' : 'none',
    }}>

      {/* ══════════════════════════════════════════════════════
          THE NAME — Playfair serif, enormous, ultra-light
          A person's name. Not a score.
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', inset: 0,
              display:  'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex:   10,
            }}
          >
            {/* Fragment layers — each clips the name differently, then drifts */}
            {FRAGMENTS.map((frag, i) => (
              <motion.div
                key={i}
                animate={showDrift ? {
                  x:      frag.drift.x,
                  y:      frag.drift.y,
                  rotate: frag.drift.r,
                  opacity: 0,
                } : {
                  x: 0, y: 0, rotate: 0, opacity: 1,
                }}
                transition={showDrift ? {
                  duration: 1.5,
                  delay:    i * 0.07,
                  ease:     [0.16, 1, 0.3, 1],
                  opacity: { duration: 0.8, delay: 0.4 + i * 0.07 },
                } : {}}
                style={{
                  position: 'absolute', inset: 0,
                  clipPath: frag.clip,
                  display:  'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                {/* Two-line name — first name on top, last on bottom */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  lineHeight: 1.0,
                }}>
                  <span style={{
                    fontFamily:    '"Playfair Display", Georgia, serif',
                    fontWeight:    300,
                    fontSize:      'clamp(72px, 13vw, 160px)',
                    color:         'rgba(28,26,22,0.85)',
                    letterSpacing: '-0.02em',
                    display:       'block',
                    userSelect:    'none',
                  }}>
                    {firstName}
                  </span>
                  {secondName && (
                    <span style={{
                      fontFamily:    '"Playfair Display", Georgia, serif',
                      fontStyle:     'italic',
                      fontWeight:    300,
                      fontSize:      'clamp(72px, 13vw, 160px)',
                      color:         'rgba(28,26,22,0.45)',
                      letterSpacing: '-0.02em',
                      display:       'block',
                      userSelect:    'none',
                    }}>
                      {secondName}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}

            {/* ── Crack lines — SVG overlay, drawn one at a time ── */}
            {showCracks && (
              <svg
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  pointerEvents: 'none', zIndex: 20,
                }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  {SPECTRUM.map((s, i) => (
                    <filter key={i} id={`glow${i}`}
                      x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="0.8" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  ))}
                </defs>
                {CRACK_PATHS.map((d, i) => (
                  <motion.path
                    key={i}
                    d={d}
                    fill="none"
                    stroke={SPECTRUM[i].color}
                    strokeWidth="0.3"
                    strokeLinecap="round"
                    filter={`url(#glow${i})`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={cracksVisible[i]
                      ? { pathLength: 1, opacity: 0.95 }
                      : { pathLength: 0, opacity: 0 }}
                    transition={{
                      pathLength: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
                      opacity:    { duration: 0.15 },
                    }}
                  />
                ))}
              </svg>
            )}

            {/* ── Dimension labels — appear beside each crack ── */}
            {showCracks && SPECTRUM.map((s, i) =>
              cracksVisible[i] ? (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  style={{
                    position:      'absolute',
                    ...LABEL_POS[i],
                    fontFamily:    'monospace',
                    fontSize:      'clamp(8px, 0.75vw, 11px)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color:         s.color,
                    pointerEvents: 'none',
                    zIndex:        25,
                    whiteSpace:    'nowrap',
                  }}
                >
                  {s.label}
                </motion.p>
              ) : null
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          SPECTRUM LINES — emerge from where name was, converge
      ══════════════════════════════════════════════════════ */}
      {showLines && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute', inset: 0,
            display:  'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
          }}
        >
          <svg width="240" height="340"
            viewBox="0 0 100 140"
            fill="none"
            style={{ overflow: 'visible' }}
          >
            {LINES.map((line, i) => {
              const isConverging = phase === 'converge';
              return (
                <motion.line key={i}
                  x1={line.x1} y1={line.y1}
                  x2={isConverging ? 50 : line.x1}
                  y2={isConverging ? 90 : line.y1}
                  stroke={SPECTRUM[i].dark}
                  strokeWidth="1.2" strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.65 }}
                  transition={{
                    opacity:    { duration: 0.4, delay: i * 0.06 },
                    x2: { duration: 0.6, delay: i * 0.04, ease: [0.4, 0, 0.2, 1] },
                    y2: { duration: 0.6, delay: i * 0.04, ease: [0.4, 0, 0.2, 1] },
                  }}
                />
              );
            })}
          </svg>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════
          THE MARK — assembles on obsidian, slowly
          Tempo inversion: everything before was fast or drifting.
          This is still. Deliberate. One line at a time.
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showMark && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isOut ? 0 : 1 }}
            transition={{ duration: isOut ? 0.9 : 0.5 }}
            style={{ position: 'relative', zIndex: 20 }}
          >
            <svg width="72" height="100"
              viewBox="0 0 100 140"
              fill="none"
              style={{ overflow: 'visible' }}
            >
              {/* Entry ray */}
              <motion.line
                x1="50" y1="0" x2="50" y2="55"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.5" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
              />

              {/* Node */}
              <motion.circle cx="50" cy="55" r="2.8"
                fill="rgba(255,255,255,0.6)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay:    1.0,
                  duration: 0.5,
                  ease:     [0.16, 1, 0.3, 1],
                }}
                style={{ transformOrigin: '50px 55px' }}
              />

              {/* Spectrum lines — staggered, slow */}
              {[18,30,42,50,62,80].map((x2, i) => (
                <motion.line key={i}
                  x1="50" y1="55"
                  x2={x2} y2="135"
                  stroke={SPECTRUM[i].dark}
                  strokeWidth="1.4" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{
                    pathLength: {
                      duration: 0.65,
                      delay:    1.1 + i * 0.11,
                      ease:     'easeInOut',
                    },
                    opacity: {
                      duration: 0.35,
                      delay:    1.1 + i * 0.11,
                    },
                  }}
                />
              ))}
            </svg>

            {/* Wordmark */}
            {(phase === 'wordmark' || isOut) && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: isOut ? 0 : 0.32 }}
                transition={{ duration: 0.9 }}
                style={{
                  position:      'absolute',
                  top:           'calc(100% + 18px)',
                  left:          '50%',
                  transform:     'translateX(-50%)',
                  fontFamily:    '"DM Sans", system-ui, sans-serif',
                  fontWeight:    200,
                  fontSize:      '10px',
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color:         'rgba(255,255,255,0.32)',
                  whiteSpace:    'nowrap',
                }}
              >
                PRISM
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
