import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";

export function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const pathLength    = useTransform(smoothProgress, [0.05, 0.95], [0, 1]);
  const glowOpacity   = useTransform(smoothProgress, [0.05, 0.25], [0, 1]);

  const bgY1 = useTransform(smoothProgress, [0, 1], ["0%",  "40%"]);
  const bgY2 = useTransform(smoothProgress, [0, 1], ["0%", "-40%"]);

  const milestones = [
    {
      top: "9%",
      align: "right" as const,
      color: "from-indigo-500 to-blue-500",
      colorBorder: "border-indigo-500/40",
      colorGlow: "rgba(99,102,241,0.25)",
      title: "Gather every signal",
      desc: "Peer reviews, self-assessments, manager observations, learning progress, and wellbeing data — all in one place, weighted and calibrated.",
    },
    {
      top: "43%",
      align: "left" as const,
      color: "from-blue-500 to-purple-500",
      colorBorder: "border-purple-500/40",
      colorGlow: "rgba(168,85,247,0.25)",
      title: "See the full picture",
      desc: "Prism connects individual trajectories to team outcomes. Spot the people who are quietly growing, and the ones who need support before they disengage.",
    },
    {
      top: "77%",
      align: "right" as const,
      color: "from-purple-500 to-rose-500",
      colorBorder: "border-rose-500/40",
      colorGlow: "rgba(244,63,94,0.25)",
      title: "Act with confidence",
      desc: "Decisions backed by evidence, not gut feel. Promote the right people. Have the right conversations. Before it's too late to matter.",
    },
  ];

  return (
    <section
      id="forecasting"
      ref={containerRef}
      className="relative w-full bg-black border-y border-white/5"
      style={{ minHeight: "220vh" }}
    >
      {/* ambient */}
      <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none" />
      <div
        className="absolute inset-0 z-0 opacity-[0.025] mix-blend-screen pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <motion.div style={{ y: bgY1 }} className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none z-0" />
      <motion.div style={{ y: bgY2 }} className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-rose-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none z-0" />

      {/* heading */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 w-full px-6 md:px-12 lg:px-24 pt-32 pb-24 flex flex-col items-center text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-500/20 bg-indigo-500/10 backdrop-blur-md mb-6 text-[10px] font-mono tracking-widest text-indigo-300 uppercase rounded-full shadow-[0_0_30px_rgba(99,102,241,0.15)] ring-1 ring-white/5">
          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
          How it works
        </div>
        <h2 className="text-4xl sm:text-6xl md:text-[5rem] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-6 leading-[1.1]">
          From signal <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">
            to understanding.
          </span>
        </h2>
      </motion.div>

      {/* path + milestones */}
      <div className="relative w-full z-10" style={{ height: "160vh" }}>

        {/* full-width SVG — curves from center sweeping left/right at each milestone */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {/* dim guide */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none" fill="none">
            <path
              d="M 500 0 C 500 50, 680 90, 720 180 C 760 270, 560 360, 500 450 C 440 540, 260 610, 280 700 C 300 790, 480 840, 500 1000"
              stroke="rgba(255,255,255,0.10)" strokeWidth="2" strokeDasharray="6 6"
            />
          </svg>

          {/* animated glow — desktop */}
          <svg
            className="absolute inset-0 w-full h-full hidden md:block"
            viewBox="0 0 1000 1000" preserveAspectRatio="none" fill="none"
            style={{ filter: "drop-shadow(0 0 14px rgba(168,85,247,0.5))" }}
          >
            <defs>
              <linearGradient id="pg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#818cf8" />
                <stop offset="50%"  stopColor="#c084fc" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 500 0 C 500 50, 680 90, 720 180 C 760 270, 560 360, 500 450 C 440 540, 260 610, 280 700 C 300 790, 480 840, 500 1000"
              stroke="url(#pg)" strokeWidth="3" strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          {/* mobile straight line */}
          <svg className="absolute inset-0 w-full h-full md:hidden" viewBox="0 0 1000 1000" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="pgm" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#818cf8" />
                <stop offset="50%"  stopColor="#c084fc" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
            </defs>
            <motion.line x1="500" y1="0" x2="500" y2="1000" stroke="url(#pgm)" strokeWidth="4" strokeLinecap="round" style={{ pathLength }} />
          </svg>
        </div>

        {/* milestone nodes + cards */}
        {milestones.map((node, i) => {
          const isRight = node.align === "right";
          return (
            <motion.div key={i} className="absolute w-full" style={{ top: node.top, opacity: glowOpacity }}>

              {/* ── Mobile ── */}
              <div className="flex flex-row items-start gap-4 px-6 md:hidden">
                <div className="relative shrink-0 w-8 h-8 flex items-center justify-center mt-1">
                  <div className="absolute inset-0 border border-white/25 rotate-45" />
                  <div className={`relative z-10 w-2 h-2 bg-gradient-to-r ${node.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-white bg-gradient-to-r ${node.color} rounded-sm mb-2`}>Phase.0{i + 1}</span>
                  <h3 className="text-xl font-extrabold tracking-tight text-white mb-2 leading-tight">{node.title}</h3>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">{node.desc}</p>
                </div>
              </div>

              {/* ── Desktop ── */}
              {isRight ? (
                /* node at ~72% of SVG width = 72% of screen; card fills 72%→95% */
                <div
                  className="absolute hidden md:flex flex-row items-stretch gap-0 group"
                  style={{ left: "calc(50% - 24px)", right: "4%" }}
                >
                  {/* dot */}
                  <div className="relative shrink-0 w-12 h-12 self-center flex items-center justify-center z-20">
                    <div className="absolute inset-0 border-[1.5px] border-white/25 rotate-45 group-hover:rotate-180 group-hover:scale-125 transition-all duration-700 bg-black/50" />
                    <div className={`relative z-10 w-3 h-3 bg-gradient-to-r ${node.color} shadow-[0_0_20px_rgba(255,255,255,0.7)] group-hover:scale-150 transition-transform duration-500`} />
                    <div className={`absolute inset-0 bg-gradient-to-r ${node.color} blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-500`} />
                    <div className="absolute top-1/2 left-full w-8 h-px bg-gradient-to-r from-white/40 to-transparent" />
                  </div>
                  {/* card */}
                  <div className={`relative flex-1 ml-10 flex flex-col justify-center p-8 lg:p-12 border ${node.colorBorder} border-t-white/20 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_8px_40px_0_rgba(0,0,0,0.7)] ring-1 ring-white/5 rounded-xl group-hover:from-white/[0.08] group-hover:-translate-y-1 transition-all duration-500`}>
                    <div className="absolute -inset-4 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" style={{ background: `radial-gradient(ellipse at 20% 50%, ${node.colorGlow}, transparent 70%)` }} />
                    <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-white/30 group-hover:border-white/70 transition-colors" />
                    <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-white/30 group-hover:border-white/70 transition-colors" />
                    <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-white/30 group-hover:border-white/70 transition-colors" />
                    <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-white/30 group-hover:border-white/70 transition-colors" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-white font-bold rounded-sm bg-gradient-to-r ${node.color}`}>Phase.0{i + 1}</span>
                        <div className="flex-1 h-px bg-white/10 group-hover:bg-white/30 transition-colors" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">{node.title}</h3>
                      <p className="text-base lg:text-lg text-zinc-300 leading-relaxed font-light group-hover:text-zinc-100 transition-colors max-w-2xl">{node.desc}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* node at ~28% of SVG width; card fills 4%→(center - node) */
                <div
                  className="absolute hidden md:flex flex-row-reverse items-stretch gap-0 group"
                  style={{ right: "calc(50% - 24px)", left: "4%" }}
                >
                  {/* dot */}
                  <div className="relative shrink-0 w-12 h-12 self-center flex items-center justify-center z-20">
                    <div className="absolute inset-0 border-[1.5px] border-white/25 rotate-45 group-hover:rotate-180 group-hover:scale-125 transition-all duration-700 bg-black/50" />
                    <div className={`relative z-10 w-3 h-3 bg-gradient-to-r ${node.color} shadow-[0_0_20px_rgba(255,255,255,0.7)] group-hover:scale-150 transition-transform duration-500`} />
                    <div className={`absolute inset-0 bg-gradient-to-r ${node.color} blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-500`} />
                    <div className="absolute top-1/2 right-full w-8 h-px bg-gradient-to-l from-white/40 to-transparent" />
                  </div>
                  {/* card */}
                  <div className={`relative flex-1 mr-10 flex flex-col justify-center p-8 lg:p-12 text-right border ${node.colorBorder} border-t-white/20 bg-gradient-to-bl from-white/[0.05] to-transparent backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_8px_40px_0_rgba(0,0,0,0.7)] ring-1 ring-white/5 rounded-xl group-hover:from-white/[0.08] group-hover:-translate-y-1 transition-all duration-500`}>
                    <div className="absolute -inset-4 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" style={{ background: `radial-gradient(ellipse at 80% 50%, ${node.colorGlow}, transparent 70%)` }} />
                    <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-white/30 group-hover:border-white/70 transition-colors" />
                    <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-white/30 group-hover:border-white/70 transition-colors" />
                    <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-white/30 group-hover:border-white/70 transition-colors" />
                    <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-white/30 group-hover:border-white/70 transition-colors" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-end gap-3 mb-4">
                        <div className="flex-1 h-px bg-white/10 group-hover:bg-white/30 transition-colors" />
                        <span className={`px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-white font-bold rounded-sm bg-gradient-to-r ${node.color}`}>Phase.0{i + 1}</span>
                      </div>
                      <h3 className="text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">{node.title}</h3>
                      <p className="text-base lg:text-lg text-zinc-300 leading-relaxed font-light group-hover:text-zinc-100 transition-colors">{node.desc}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
