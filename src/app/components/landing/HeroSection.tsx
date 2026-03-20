import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { useRef } from "react";

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Spring physics for awe-factor smoothness
  const smoothY = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const videoScale = useTransform(smoothY, [0, 1], [1, 1.25]);
  const videoOpacity = useTransform(smoothY, [0, 1], [0.8, 0]);
  
  // Parallax for content
  const textY = useTransform(smoothY, [0, 1], [0, 150]);
  const textOpacity = useTransform(smoothY, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-screen bg-[#010101] flex flex-col items-center justify-center pt-32 pb-20 [perspective:1000px]"
    >
      {/* Background Living Media */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ scale: videoScale, opacity: videoOpacity }}
          className="w-full h-full relative"
        >
          {/* Lighter overlay to let the image POP */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1649182784901-48f5f2d40ecc?q=80&w=2000&auto=format&fit=crop" 
            alt="Abstract Architecture" 
            className="w-full h-full object-cover object-center opacity-70 brightness-125 saturate-[1.3] contrast-110 mix-blend-lighten"
          />
          
          {/* Dynamic Light Leaks for Vividness - More intense colors */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/40 rounded-full blur-[120px] mix-blend-screen" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-500/30 rounded-full blur-[150px] mix-blend-screen" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
              x: [0, 100, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-purple-500/30 rounded-full blur-[100px] mix-blend-screen" 
          />
        </motion.div>
      </div>

      {/* Designer Registration Marks */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-white/50 z-20 pointer-events-none" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-white/50 z-20 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-white/50 z-20 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-white/50 z-20 pointer-events-none" />

      {/* Hero Content - With scroll Parallax */}
      <motion.div 
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 w-full px-6 md:px-12 lg:px-24 flex flex-col items-start justify-center flex-1"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-3 mb-8 md:mb-12 bg-white/5 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20">
            <div className="w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,1)] animate-pulse" />
          </div>
          <span className="text-xs sm:text-sm font-mono tracking-[0.2em] text-white uppercase font-bold">
            360° Intelligence Active
          </span>
        </motion.div>

        {/* 3D Floating Typography */}
        <motion.h1 
          initial={{ opacity: 0, y: 40, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.1, type: "spring", stiffness: 50 }}
          className="text-[4rem] sm:text-[6.5rem] md:text-[8.5rem] lg:text-[11rem] font-bold tracking-tighter leading-[0.85] text-white mb-10 drop-shadow-2xl"
        >
          Performance, <br />
          <span className="relative inline-block mt-2">
            <span className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-rose-500/30 blur-3xl z-0" />
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-rose-200 pr-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Quantified.
            </span>
          </span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-end mt-4">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="md:col-span-6 lg:col-span-5 text-xl sm:text-2xl md:text-3xl text-zinc-200 font-medium tracking-wide leading-relaxed drop-shadow-md"
          >
            Traditional HR tools look backward. Prism looks forward. Unify evaluations with predictive modeling to forecast revenue per individual.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="md:col-span-6 lg:col-span-7 flex flex-col sm:flex-row items-start md:items-end justify-end gap-6 w-full mt-8 md:mt-0"
          >
            <button className="group relative px-8 py-6 bg-white text-black font-bold text-sm tracking-widest uppercase overflow-hidden transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-[0.98] w-full sm:w-auto">
              <span className="relative z-10 flex items-center justify-center gap-3">
                Forecast Revenue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button className="group px-8 py-6 font-bold text-sm tracking-widest uppercase text-white hover:text-white transition-all duration-300 flex items-center justify-center gap-3 border-2 border-white/30 hover:border-indigo-400 hover:bg-indigo-500/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] bg-black/40 backdrop-blur-md w-full sm:w-auto">
              <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              Watch Tour
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
