import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowRight, Fingerprint } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router";

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const scale = useTransform(smoothProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.6], [0, 1]);
  const y = useTransform(smoothProgress, [0, 1], [150, 0]);

  return (
    <section 
      id="platform"
      ref={containerRef} 
      className="relative min-h-screen bg-[#010101] flex items-center justify-center py-32 overflow-hidden [perspective:2000px]"
    >
      <motion.div 
        style={{ scale, opacity, y, rotateX: useTransform(smoothProgress, [0, 1], [10, 0]) }}
        className="group relative w-full aspect-square md:aspect-[21/9] flex flex-col items-center justify-center p-8 sm:p-24 overflow-hidden border-t border-b border-white/20 bg-gradient-to-b from-[#0A0A0A] to-[#020202] shadow-[0_0_100px_-20px_rgba(99,102,241,0.2)]"
      >
        {/* Radar / Grid effect background with dynamic color shift */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
        
        {/* Central Singularity Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,#010101_80%)] z-0" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 group-hover:scale-150 transition-all duration-[2s] z-0" />

        {/* Scanning Line - More intense */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-[1px] animate-[scan_3s_ease-in-out_infinite] z-0 shadow-[0_0_20px_rgba(99,102,241,0.8)]" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
            className="text-5xl sm:text-7xl md:text-[8rem] font-light tracking-tighter text-white mb-8 leading-[0.85] drop-shadow-2xl"
          >
            See your people <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-300 to-zinc-600">
              clearly.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg sm:text-2xl text-zinc-300 font-light max-w-2xl mx-auto mb-16 leading-relaxed"
          >
            Every person on your team contains more than a score. Prism helps you understand what that means — and act on it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center"
          >
            <button onClick={() => navigate('/demo')} className="group relative w-full sm:w-auto px-12 py-6 bg-white text-black font-bold text-sm tracking-widest uppercase overflow-hidden transition-all duration-300 hover:scale-[1.05] active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]">
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Fingerprint className="w-5 h-5 text-indigo-600 group-hover:text-black transition-colors" />
                Request a Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.div>


        </div>
        
        {/* Tech decorative corners - Animated */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-indigo-500/50 group-hover:border-white transition-colors duration-700" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-indigo-500/50 group-hover:border-white transition-colors duration-700" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-indigo-500/50 group-hover:border-white transition-colors duration-700" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-indigo-500/50 group-hover:border-white transition-colors duration-700" />
      </motion.div>
      
      {/* Global CSS for the scanning line animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}} />
    </section>
  );
}
