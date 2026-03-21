import { motion, useScroll, useTransform, MotionValue, useSpring } from "motion/react";
import { Users, TrendingUp, RefreshCw, BarChart } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Users,
    title: "360° Intelligence",
    description: "Eliminate blind spots. Aggregate peer, manager, and self-evaluations into a singular, unbiased multidimensional matrix. See the true shape of your workforce.",
    image: "https://images.unsplash.com/photo-1770031079091-c6356e82ea9b?q=80&w=1080&auto=format&fit=crop",
    color: "indigo"
  },
  {
    icon: TrendingUp,
    title: "Predictive Revenue",
    description: "Link human capital directly to the bottom line. Our predictive engine maps individual performance trajectories to concrete revenue projections and risk assessments.",
    image: "https://images.unsplash.com/photo-1498248529262-f5084e1d0d36?q=80&w=1080&auto=format&fit=crop",
    color: "zinc"
  },
  {
    icon: RefreshCw,
    title: "Continuous Calibration",
    description: "Feedback that waits for December misses everything in between. Prism keeps the conversation open — small, frequent signals that let you act before small issues become exits.",
    image: "https://images.unsplash.com/photo-1764268602042-88b05a211378?q=80&w=1080&auto=format&fit=crop",
    color: "purple"
  },
  {
    icon: BarChart,
    title: "Executive Clarity",
    description: "Every OKR, every review cycle, every risk flag — in one place. Built for the leaders who are accountable for the whole picture, not just their slice of it.",
    image: "https://images.unsplash.com/photo-1649182784901-48f5f2d40ecc?q=80&w=1080&auto=format&fit=crop",
    color: "rose"
  },
];

type CardProps = {
  i: number;
  title: string;
  description: string;
  icon: any;
  image: string;
  color: string;
  progress: MotionValue<number>;
  targetScale: number;
};

const Card = ({ i, title, description, icon: Icon, image, color, progress, targetScale }: CardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Buttery smooth spring for scale and parallax using parent's progress
  const smoothProgress = useSpring(progress, { stiffness: 100, damping: 20 });
  const scale = useTransform(smoothProgress, [i * 0.25, 1], [1, targetScale]);
  
  // Exaggerated Parallax for the image inside the card mapped to global scroll
  const imageParallax = useTransform(smoothProgress, [0, 1], ["-10%", "10%"]);
  
  // Tilt effect for cards (tilts as it scrolls into view based on global progress)
  const cardStart = (i - 0.5) * 0.25;
  const cardCenter = i * 0.25;
  const cardEnd = (i + 0.5) * 0.25;
  const rotateX = useTransform(smoothProgress, [cardStart, cardCenter, cardEnd], [5, 0, -5]);

  const borderGlow = color === 'indigo' ? 'border-indigo-500/50' : color === 'purple' ? 'border-purple-500/50' : color === 'rose' ? 'border-rose-500/50' : 'border-zinc-500/50';
  const textGlow = color === 'indigo' ? 'text-indigo-400' : color === 'purple' ? 'text-purple-400' : color === 'rose' ? 'text-rose-400' : 'text-zinc-400';
  const glowShadow = color === 'indigo' ? 'shadow-[0_0_50px_-10px_rgba(99,102,241,0.3)]' : color === 'purple' ? 'shadow-[0_0_50px_-10px_rgba(168,85,247,0.3)]' : color === 'rose' ? 'shadow-[0_0_50px_-10px_rgba(244,63,94,0.3)]' : 'shadow-[0_0_50px_-10px_rgba(161,161,170,0.3)]';

  return (
    <div ref={containerRef} className="h-screen w-full flex items-center justify-center sticky top-0 z-10 [perspective:1000px] overflow-hidden">
      <motion.div
        style={{ scale, rotateX, top: `calc(-5vh + ${i * 30}px)` }}
        className={`group relative flex flex-col lg:flex-row w-full h-auto min-h-[65vh] lg:h-[600px] bg-[#0A0A0A] overflow-hidden border border-white/20 shadow-2xl ${borderGlow} ${glowShadow} transition-colors duration-500 mx-0`}
      >
        {/* Cinematic noise on card */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

        {/* Content Side */}
        <div className="w-full lg:w-5/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-10 border-b lg:border-b-0 lg:border-r border-white/10 bg-black/90 backdrop-blur-3xl">
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center justify-center w-12 h-12 border ${borderGlow} bg-white/[0.05] group-hover:bg-white/[0.1] transition-colors`}>
              <Icon className={`w-5 h-5 ${textGlow} drop-shadow-[0_0_8px_currentColor]`} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Metric 0{i + 1}</span>
              <span className={`text-xs font-mono uppercase tracking-widest ${textGlow}`}>Active</span>
            </div>
          </div>
          
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
            {title}
          </h3>
          
          <p className="text-sm sm:text-base lg:text-lg text-zinc-300 font-light leading-relaxed">
            {description}
          </p>
        </div>

        {/* Visual / Image Side - VIVID AND BRIGHT */}
        <div className="w-full lg:w-7/12 h-64 lg:h-full relative overflow-hidden bg-black flex items-center justify-center">
          <motion.div 
            style={{ y: imageParallax }}
            className="absolute inset-0 w-full h-[120%]" // 120% height allows for parallax travel
          >
            <motion.img 
              src={image}
              alt={title}
              // Removed mix-blend-screen and low opacity to make images POP
              className="w-full h-full object-cover object-center opacity-90 brightness-125 saturate-[1.2] contrast-125 group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
            />
          </motion.div>
          
          {/* Vibrant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-[#0A0A0A] via-black/40 to-transparent" />
          
          {/* Interactive Colored Glow corresponding to card color */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 bg-gradient-to-tr from-${color}-500/50 to-transparent mix-blend-overlay pointer-events-none`} />
          
          {/* HUD Overlay elements */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Center Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
              <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
              <div className="absolute w-[120%] h-[1px] bg-white/20 group-hover:bg-white/40 transition-colors" />
              <div className="absolute w-[1px] h-[120%] bg-white/20 group-hover:bg-white/40 transition-colors" />
            </div>
            {/* Data stream */}
            <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1 font-mono text-[9px] text-zinc-300 tracking-widest bg-black/50 backdrop-blur-md px-3 py-2 border border-white/10">
              <span>REV.MODEL // {['A4F2C1', 'B9E3D7', 'C1A8F4', 'D6B2E9'][i % 4]}</span>
              <span>CALCULATING ROI...</span>
              <span className={`${textGlow} font-bold animate-pulse`}>100% FORECASTED</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function FeatureSection() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section 
      id="intelligence"
      ref={container} 
      className="relative w-full bg-[#010101] pb-[10vh] overflow-hidden"
    >
      <div className="w-full px-6 md:px-12 lg:px-24 py-32 sm:py-48 z-10 relative pointer-events-none flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 backdrop-blur-sm mb-8">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          <span className="text-[10px] font-mono text-white uppercase tracking-widest">Four ways to see more clearly</span>
        </div>
        <h2 className="text-4xl sm:text-6xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] text-white mb-6">
          The shape of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            your team.
          </span>
        </h2>
        <p className="text-lg text-zinc-300 font-light max-w-2xl mx-auto">
          Four lenses. One coherent picture of the people who make your organisation work.
        </p>
      </div>

      <div className="relative z-20">
        {features.map((feature, i) => {
          const targetScale = 1 - (features.length - i) * 0.05;
          return (
            <Card 
              key={i} 
              i={i} 
              {...feature} 
              progress={scrollYProgress} 
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}
